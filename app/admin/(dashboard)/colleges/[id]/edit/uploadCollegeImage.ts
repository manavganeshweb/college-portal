export type CollegeImageCategory =
  | "college-logos"
  | "college-covers"
  | "college-seo"
  | "college-gallery"
  | "college-infrastructure";

type UploadResult = {
  success: boolean;
  url?: string;
  message?: string;
  error?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export async function uploadCollegeImage(
  file: File,
  collegeId: string,
  category: CollegeImageCategory,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Choose a JPG, PNG, WebP, or AVIF image.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size must be 5 MB or less.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("collegeId", collegeId);
  formData.append("category", category);

  const response = await fetch("/admin/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as UploadResult;

  if (!response.ok || !result.success || !result.url) {
    throw new Error(
      result.error ||
        result.message ||
        "Image upload failed. Please try again.",
    );
  }

  return result.url;
}