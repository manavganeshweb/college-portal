import "dotenv/config";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import {
  getR2Client,
  getR2Config,
  getR2PublicUrl,
  isR2Url,
} from "@/lib/r2";

const CONCURRENCY = 5;
const REQUEST_TIMEOUT = 20_000;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_RETRIES = 3;

type College = {
  id: string;
  aisheCode: string | null;
  slug: string;
  logo: string | null;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string,
  timeout = REQUEST_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "College-Aadhar-Logo-Migration/1.0",
        Accept: "image/*",
      },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function downloadImage(url: string): Promise<{
  buffer: Buffer;
  contentType: string;
}> {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(
      `Image request failed: ${response.status} ${response.statusText}`,
    );
  }

  const contentType =
    response.headers.get("content-type")?.split(";")[0].trim() ||
    "application/octet-stream";

  if (!contentType.startsWith("image/")) {
    throw new Error(`URL did not return an image: ${contentType}`);
  }

  const contentLength = response.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image is too large: ${(
        Number(contentLength) /
        1024 /
        1024
      ).toFixed(2)} MB`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image is too large: ${(
        buffer.length /
        1024 /
        1024
      ).toFixed(2)} MB`,
    );
  }

  if (buffer.length === 0) {
    throw new Error("Downloaded image is empty");
  }

  return {
    buffer,
    contentType,
  };
}

function getExtension(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    case "image/avif":
      return "avif";
    case "image/bmp":
      return "bmp";
    default:
      return "bin";
  }
}

async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
) {
  const client = getR2Client();
  const config = getR2Config();

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

async function migrateCollege(college: College) {
  if (!college.logo) {
    return {
      status: "skipped" as const,
      reason: "no-logo",
    };
  }

  if (isR2Url(college.logo)) {
    return {
      status: "skipped" as const,
      reason: "already-r2",
    };
  }

  if (!college.aisheCode) {
    return {
      status: "skipped" as const,
      reason: "no-aishe-code",
    };
  }

  const imageUrl = college.logo.trim();

  if (
    !imageUrl.startsWith("http://") &&
    !imageUrl.startsWith("https://")
  ) {
    return {
      status: "skipped" as const,
      reason: "invalid-url",
    };
  }

  const { buffer, contentType } = await downloadImage(imageUrl);

  const extension = getExtension(contentType);

  const key = `colleges/${college.aisheCode}/logo.${extension}`;

  await uploadToR2(key, buffer, contentType);

  const publicUrl = getR2PublicUrl(key);

  await prisma.college.update({
    where: {
      id: college.id,
    },
    data: {
      logo: publicUrl,
    },
  });

  return {
    status: "migrated" as const,
    key,
    publicUrl,
  };
}

async function migrateWithRetry(college: College) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await migrateCollege(college);
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES) {
        console.log(
          `  Retry ${attempt}/${MAX_RETRIES - 1}: ${college.aisheCode}`,
        );

        await sleep(attempt * 1000);
      }
    }
  }

  throw lastError;
}

async function main() {
  console.log("Starting college logo migration...");
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(
    `Max image size: ${MAX_IMAGE_SIZE / 1024 / 1024} MB`,
  );
  console.log("");

  const colleges = await prisma.college.findMany({
    where: {
      logo: {
        not: null,
      },
      aisheCode: {
        not: null,
      },
    },
    select: {
      id: true,
      aisheCode: true,
      slug: true,
      logo: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log(`Found ${colleges.length} colleges with logos.`);
  console.log("");

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (let start = 0; start < colleges.length; start += CONCURRENCY) {
    const batch = colleges.slice(start, start + CONCURRENCY);

    const results = await Promise.allSettled(
      batch.map(async (college) => {
        return {
          college,
          result: await migrateWithRetry(college),
        };
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { college, result: migration } = result.value;

        if (migration.status === "migrated") {
          migrated += 1;

          console.log(
            `✓ ${college.aisheCode} → ${migration.key}`,
          );
        } else {
          skipped += 1;

          console.log(
            `- ${college.aisheCode} skipped (${migration.reason})`,
          );
        }
      } else {
        failed += 1;

        console.error(
          `✗ Migration failed:`,
          result.reason,
        );
      }
    }

    const processed = Math.min(
      start + CONCURRENCY,
      colleges.length,
    );

    console.log(
      `Progress: ${processed}/${colleges.length} | ` +
        `Migrated: ${migrated} | ` +
        `Skipped: ${skipped} | ` +
        `Failed: ${failed}`,
    );

    console.log("");
  }

  console.log("=================================");
  console.log("Logo migration completed");
  console.log("=================================");
  console.log(`Total:    ${colleges.length}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);
}

main()
  .catch((error) => {
    console.error("Fatal migration error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });