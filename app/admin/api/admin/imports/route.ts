import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { isR2Url } from "@/lib/r2";
export const runtime = "nodejs";
export const maxDuration = 300;

type ImportType = "institutions" | "courses" | "fees";

const EXPECTED_HEADERS: Record<ImportType, string[]> = {
  institutions: [
    "aishe_code",
    "name",
    "display_name",
    "slug",
    "institution_type",
    "ownership",
    "university_type",
    "affiliated_to",
    "autonomous_status",
    "minority_status",
    "co_education",
    "established_year",
    "state",
    "district",
    "city",
    "address",
    "pin_code",
    "latitude",
    "longitude",
    "google_maps_url",
    "website",
    "website_status",
    "website_note",
    "website_confidence",
    "email",
    "emails_all",
    "phone",
    "phones_all",
    "admission_email",
    "admission_phone",
    "exam_email",
    "exam_phone",
    "placement_email",
    "placement_phone",
    "research_email",
    "international_email",
    "whatsapp",
    "toll_free",
    "logo_url",
    "favicon_url",
    "short_description",
    "about",
    "search_summary",
    "search_summary_source",
    "facebook",
    "instagram",
    "youtube",
    "linkedin",
    "twitter",
    "telegram",
    "admission_url",
    "courses_url",
    "fees_url",
    "contact_url",
    "about_url",
    "placement_url",
    "scholarship_url",
    "hostel_url",
    "gallery_url",
    "result_url",
    "notice_url",
    "faculty_url",
    "departments_url",
    "research_url",
    "library_url",
    "career_url",
    "events_url",
    "course_count",
    "fee_row_count",
    "data_level",
    "completeness_pct",
    "last_updated",
  ],

  courses: [
    "course_id",
    "aishe_code",
    "course_name",
    "degree",
    "specialization",
    "level",
    "stream",
    "mode",
    "duration_months",
    "duration_years",
    "total_seats",
    "eligibility",
    "entrance_exams",
    "fee_amount",
    "fee_period",
    "fee_currency",
    "academic_year",
    "source_url",
    "observed_at",
  ],

  fees: [
    "fee_id",
    "aishe_code",
    "course_id",
    "program_name",
    "fee_type",
    "label",
    "amount",
    "currency",
    "frequency",
    "is_refundable",
    "academic_year",
    "source_url",
    "observed_at",
  ],
};

function emptyToNull(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const valueString = String(value).trim();

  return valueString === "" ? null : valueString;
}

function isValidInteger(value: unknown): boolean {
  const normalized = emptyToNull(value);

  if (normalized === null) {
    return true;
  }

  return /^-?\d+$/.test(normalized);
}

function isValidDecimal(value: unknown): boolean {
  const normalized = emptyToNull(value);

  if (normalized === null) {
    return true;
  }

  return /^-?\d+(\.\d+)?$/.test(normalized);
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase();
}

function getMissingHeaders(
  actualHeaders: string[],
  expectedHeaders: string[],
): string[] {
  const actual = new Set(actualHeaders.map(normalizeHeader));

  return expectedHeaders.filter(
    (header) => !actual.has(normalizeHeader(header)),
  );
}

function getUnexpectedHeaders(
  actualHeaders: string[],
  expectedHeaders: string[],
): string[] {
  const expected = new Set(expectedHeaders.map(normalizeHeader));

  return actualHeaders.filter(
    (header) => !expected.has(normalizeHeader(header)),
  );
}
type SkippedRow = {
  rowNumber: number;
  reason: string;
};

type InstitutionValidationResult = {
  errors: string[];
  skippedRows: SkippedRow[];
};
function isNonAcademicCourse(courseName: string): boolean {
  const value = normalizeLookup(courseName);

  const noisePatterns = [
    "bed room",
    "master bed room",
    "copy of",
    "no objection certificate",
    "fire safety certificate",
    "building safety certificate",
    "registration renewal certificate",
  ];

  return noisePatterns.some((pattern) => value.includes(pattern));
}
function isValidImageUrl(value: string | null) {
  if (!value) return false;

  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp)(\?.*)?$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}
function validateInstitutions(
  rows: Record<string, unknown>[],
): InstitutionValidationResult {
  const errors: string[] = [];
  const seenAisheCodes = new Set<string>();
  const skippedRows: SkippedRow[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const aisheCode = emptyToNull(row.aishe_code);
    const name = emptyToNull(row.name);
    const state = emptyToNull(row.state);

    if (!aisheCode) {
      errors.push(`Row ${rowNumber}: aishe_code is required.`);
    } else {
      if (seenAisheCodes.has(aisheCode)) {
        errors.push(
          `Row ${rowNumber}: duplicate aishe_code "${aisheCode}".`,
        );
      }

      seenAisheCodes.add(aisheCode);
    }

    if (!name) {
      errors.push(`Row ${rowNumber}: name is required.`);
    }

    // State is required by the College model.
    // These records are skipped rather than treated as invalid.
    if (!state) {
      skippedRows.push({
        rowNumber,
        reason: "Missing state",
      });

      return;
    }

    if (!isValidInteger(row.established_year)) {
      errors.push(
        `Row ${rowNumber}: established_year must be an integer.`,
      );
    }

    if (!isValidDecimal(row.latitude)) {
      errors.push(`Row ${rowNumber}: latitude must be numeric.`);
    }

    if (!isValidDecimal(row.longitude)) {
      errors.push(`Row ${rowNumber}: longitude must be numeric.`);
    }

    if (!isValidInteger(row.course_count)) {
      errors.push(
        `Row ${rowNumber}: course_count must be an integer.`,
      );
    }

    if (!isValidInteger(row.fee_row_count)) {
      errors.push(
        `Row ${rowNumber}: fee_row_count must be an integer.`,
      );
    }

    if (!isValidDecimal(row.completeness_pct)) {
      errors.push(
        `Row ${rowNumber}: completeness_pct must be numeric.`,
      );
    }
  });

  return {
    errors,
    skippedRows,
  };
}

function normalizeCourseLevel(
  value: unknown,
): "UG" | "PG" | "DIPLOMA" | "PHD" | "CERTIFICATE" | "INTEGRATED" | null {
  const level = emptyToNull(value)?.toLowerCase();

  if (!level) {
    return null;
  }

  switch (level) {
    case "ug":
    case "undergraduate":
      return "UG";

    case "pg":
    case "postgraduate":
      return "PG";

    case "diploma":
      return "DIPLOMA";

    case "phd":
    case "doctoral":
    case "doctorate":
      return "PHD";

    case "certificate":
    case "certification":
      return "CERTIFICATE";

    case "integrated":
      return "INTEGRATED";

    default:
      return null;
  }
}

function validateCourses(rows: Record<string, unknown>[]) {
  const errors: string[] = [];
  const skippedRows: SkippedRow[] = [];
  const seenCourseIds = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const courseId = emptyToNull(row.course_id);
    const aisheCode = emptyToNull(row.aishe_code);
    const courseName = emptyToNull(row.course_name);
    const level = emptyToNull(row.level);

    // ------------------------------------------------------------
    // Skip obvious source-data noise
    // ------------------------------------------------------------

    if (courseName && isNonAcademicCourse(courseName)) {
      skippedRows.push({
        rowNumber,
        reason: `Non-academic/source noise: "${courseName}"`,
      });

      return;
    }

    // ------------------------------------------------------------
    // Required fields
    // ------------------------------------------------------------

    if (!courseId) {
      errors.push(`Row ${rowNumber}: course_id is required.`);
    } else if (seenCourseIds.has(courseId)) {
      errors.push(
        `Row ${rowNumber}: duplicate course_id "${courseId}".`
      );
    } else {
      seenCourseIds.add(courseId);
    }

    if (!aisheCode) {
      errors.push(`Row ${rowNumber}: aishe_code is required.`);
    }

    if (!courseName) {
      errors.push(`Row ${rowNumber}: course_name is required.`);
    }

    if (!level) {
      errors.push(`Row ${rowNumber}: level is required.`);
    }

    // ------------------------------------------------------------
    // Numeric validation
    // ------------------------------------------------------------

    if (!isValidInteger(row.duration_months)) {
      errors.push(
        `Row ${rowNumber}: duration_months must be a valid integer.`
      );
    }

    if (!isValidDecimal(row.duration_years)) {
      errors.push(
        `Row ${rowNumber}: duration_years must be a valid decimal.`
      );
    }

    if (!isValidInteger(row.total_seats)) {
      errors.push(
        `Row ${rowNumber}: total_seats must be a valid integer.`
      );
    }

    if (!isValidDecimal(row.fee_amount)) {
      errors.push(
        `Row ${rowNumber}: fee_amount must be a valid decimal.`
      );
    }
  });

  return {
    errors,
    skippedRows,
  };
}
function validateFees(
  rows: Record<string, unknown>[],
): {
  errors: string[];
  skippedRows: SkippedRow[];
} {
  const errors: string[] = [];
  const skippedRows: SkippedRow[] = [];
  const seenFeeIds = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const feeId = emptyToNull(row.fee_id);
    const aisheCode = emptyToNull(row.aishe_code);
    const amount = emptyToNull(row.amount);

    // ------------------------------------------------------------
    // Fee ID
    // ------------------------------------------------------------

    if (!feeId) {
      errors.push(
        `Row ${rowNumber}: fee_id is required.`,
      );
    } else if (seenFeeIds.has(feeId)) {
      errors.push(
        `Row ${rowNumber}: duplicate fee_id "${feeId}".`,
      );
    } else {
      seenFeeIds.add(feeId);
    }

    // ------------------------------------------------------------
    // College relationship
    // ------------------------------------------------------------

    if (!aisheCode) {
      errors.push(
        `Row ${rowNumber}: aishe_code is required.`,
      );
    }

    // ------------------------------------------------------------
    // Amount
    // ------------------------------------------------------------

    if (!amount) {
      errors.push(
        `Row ${rowNumber}: amount is required.`,
      );
    } else if (!isValidDecimal(amount)) {
      errors.push(
        `Row ${rowNumber}: amount must be numeric.`,
      );
    }
  });

  return {
    errors,
    skippedRows,
  };
}
function normalizeLookup(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseOptionalInt(value: unknown): number | null {
  const normalized = emptyToNull(value);

  if (normalized === null) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);

  return Number.isNaN(parsed) ? null : parsed;
}
function parseBoolean(value: unknown): boolean {
  const normalized = emptyToNull(value)?.toLowerCase();

  if (!normalized) {
    return false;
  }

  return ["true", "1", "yes", "y"].includes(normalized);
}
function parseOptionalDate(value: unknown): Date | null {
  const normalized = emptyToNull(value);

  if (normalized === null) {
    return null;
  }

  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getCollegeType(
  institutionTypeValue: unknown,
  ownershipValue: unknown,
): "GOVERNMENT" | "PRIVATE" | "PUBLIC" | "DEEMED" | "AUTONOMOUS" | "OTHER" {
  const institutionType =
    emptyToNull(institutionTypeValue)?.toLowerCase() ?? "";

  const ownership =
    emptyToNull(ownershipValue)?.toLowerCase() ?? "";

  const combined = `${institutionType} ${ownership}`;

  if (combined.includes("deemed")) {
    return "DEEMED";
  }

  if (combined.includes("autonomous")) {
    return "AUTONOMOUS";
  }

  if (ownership.includes("government")) {
    return "GOVERNMENT";
  }

  if (ownership.includes("private")) {
    return "PRIVATE";
  }

  if (ownership.includes("public")) {
    return "PUBLIC";
  }

  return "OTHER";
}
function parseOptionalDecimal(
  value: unknown,
): string | null {
  const normalized = emptyToNull(value);

  if (normalized === null) {
    return null;
  }

  return isValidDecimal(normalized)
    ? normalized
    : null;
}

function getCourseDuration(
  durationYearsValue: unknown,
  durationMonthsValue: unknown,
): string | null {
  const durationYears = parseOptionalDecimal(
    durationYearsValue,
  );

  if (durationYears !== null) {
    return durationYears;
  }

  const durationMonths = parseOptionalInt(
    durationMonthsValue,
  );

  if (durationMonths === null) {
    return null;
  }

  return (durationMonths / 12).toFixed(1);
}

function getCourseCategoryName(
  streamValue: unknown,
  degreeValue: unknown,
): string {
  const stream =
    emptyToNull(streamValue)?.toLowerCase() ?? "";

  const degree =
    emptyToNull(degreeValue)?.toLowerCase() ?? "";

  if (
    stream.includes("engineering") ||
    degree.includes("b.tech") ||
    degree.includes("btech") ||
    degree.includes("b.e") ||
    degree.includes("m.tech") ||
    degree.includes("mtech") ||
    degree.includes("m.e")
  ) {
    return "Engineering";
  }

  if (
    stream.includes("management") ||
    stream.includes("commerce") ||
    degree.includes("mba") ||
    degree.includes("bba")
  ) {
    return "Management";
  }

  if (
    stream.includes("computer") ||
    stream.includes("it &") ||
    stream.includes("information technology") ||
    degree.includes("mca") ||
    degree.includes("bca")
  ) {
    return "Computer Applications";
  }

  if (emptyToNull(streamValue)) {
    return String(streamValue).trim();
  }

  return "Other";
}

function getCourseSlug(
  courseName: string,
  sourceCourseId: string,
): string {
  const baseSlug = slugify(courseName);

  return baseSlug
    ? `${baseSlug}-${slugify(sourceCourseId)}`
    : `course-${slugify(sourceCourseId)}`;
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
   const type = String(
  formData.get("type") || "institutions",
) as ImportType;

const action = String(
  formData.get("action") || "preview",
);

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "CSV file is required.",
        },
        { status: 400 },
      );
    }

    if (!["institutions", "courses", "fees"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid import type.",
        },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only CSV files are supported.",
        },
        { status: 400 },
      );
    }

    const csvText = await file.text();

    if (!csvText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "The CSV file is empty.",
        },
        { status: 400 },
      );
    }

    let rows: Record<string, unknown>[];

    try {
      rows = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        trim: true,
        relax_column_count: false,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? `CSV parsing failed: ${error.message}`
              : "CSV parsing failed.",
        },
        { status: 400 },
      );
    }

    const actualHeaders =
      rows.length > 0 ? Object.keys(rows[0]) : [];

    const expectedHeaders = EXPECTED_HEADERS[type];

    const missingHeaders = getMissingHeaders(
      actualHeaders,
      expectedHeaders,
    );

    const unexpectedHeaders = getUnexpectedHeaders(
      actualHeaders,
      expectedHeaders,
    );

    if (missingHeaders.length > 0) {
      return NextResponse.json({
        success: false,
        type,
        fileName: file.name,
        totalRows: rows.length,
        validRows: 0,
        invalidRows: rows.length,
        errorCount: missingHeaders.length,
        errors: missingHeaders.map(
          (header) => `Missing required CSV header: ${header}`,
        ),
        missingHeaders,
        unexpectedHeaders,
        preview: rows.slice(0, 50),
      });
    }
let validationErrors: string[] = [];
let skippedRows: SkippedRow[] = [];

switch (type) {
  case "institutions": {
    const result = validateInstitutions(rows);

    validationErrors = result.errors;
    skippedRows = result.skippedRows;

    break;
  }

 case "courses": {
  const result = validateCourses(rows);

  validationErrors = result.errors;
  skippedRows = result.skippedRows;

  break;
}
case "fees": {
  const result = validateFees(rows);

  validationErrors = result.errors;
  skippedRows = result.skippedRows;

  break;
}

  default:
    validationErrors = ["Unsupported import type."];
}

    const invalidRowNumbers = new Set<number>();

    for (const error of validationErrors) {
      const match = error.match(/^Row (\d+):/);

      if (match) {
        invalidRowNumbers.add(Number(match[1]));
      }
    }
    

    const invalidRows = invalidRowNumbers.size;
const validRows =
  rows.length - invalidRows - skippedRows.length;
if (action === "import") {
  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Import blocked because the CSV contains validation errors.",
        errors: validationErrors.slice(0, 200),
      },
      { status: 400 },
    );
  }

  if (type === "institutions") {
    const importResult =
      await importInstitutions(rows);

    return NextResponse.json({
      success: true,
      type,
      fileName: file.name,

      totalRows: rows.length,

      importedRows: importResult.imported,
      createdRows: importResult.created,
      updatedRows: importResult.updated,
      skippedRows: importResult.skipped,

      message: `Import completed. ${importResult.imported.toLocaleString()} institutions were imported.`,
    });
  }

  if (type === "courses") {
  const skippedRowNumbers = new Set(
  skippedRows.map((item) => item.rowNumber)
);

const validCourseRows = rows.filter(
  (_, index) => !skippedRowNumbers.has(index + 2)
);

const importResult = await importCourses(validCourseRows);
    return NextResponse.json({
      success: true,
      type,
      fileName: file.name,

      totalRows: rows.length,

      importedRows: importResult.imported,
      createdRows: importResult.created,
      updatedRows: importResult.updated,
      skippedRows: importResult.skipped,

      skippedDetails:
        importResult.skippedDetails.slice(
          0,
          100,
        ),

      message: `Import completed. ${importResult.imported.toLocaleString()} courses were imported.`,
    });
  }

  if (type === "fees") {
  const skippedRowNumbers = new Set(
    skippedRows.map(
      (item) => item.rowNumber,
    ),
  );

  const validFeeRows = rows.filter(
    (_, index) =>
      !skippedRowNumbers.has(index + 2),
  );

  const importResult =
    await importFees(validFeeRows);

  return NextResponse.json({
    success: true,
    type,
    fileName: file.name,

    totalRows: rows.length,

    importedRows:
      importResult.imported,

    createdRows:
      importResult.created,

    updatedRows:
      importResult.updated,

    skippedRows:
      importResult.skipped,

    skippedDetails:
      [
        ...skippedRows,
        ...importResult.skippedDetails,
      ].slice(0, 100),

    message:
      `Import completed. ${importResult.imported.toLocaleString()} fees were imported.`,
  });
}
}
 return NextResponse.json({
  success: validationErrors.length === 0,
  type,
  fileName: file.name,
  totalRows: rows.length,
  validRows,
  invalidRows,
  errorCount: validationErrors.length,

  skippedRows: skippedRows.length,
  skippedDetails: skippedRows.slice(0, 100),

  errors: validationErrors.slice(0, 200),

  missingHeaders,
  unexpectedHeaders,

  preview: rows.slice(0, 50),

  message:
    validationErrors.length === 0
      ? skippedRows.length > 0
        ? `Validation completed. ${validRows.toLocaleString()} rows are ready for import and ${skippedRows.length.toLocaleString()} rows were skipped because state is missing.`
        : `Validation successful. ${validRows.toLocaleString()} rows are ready for import.`
      : `Validation completed with ${validationErrors.length.toLocaleString()} error(s).`,
});
  } catch (error) {
    console.error("Admin CSV import error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}
type ImportInstitutionResult = {
  imported: number;
  created: number;
  updated: number;
  skipped: number;
};

async function importInstitutions(
  rows: Record<string, unknown>[],
): Promise<ImportInstitutionResult> {
  const validRows = rows.filter(
    (row) => emptyToNull(row.aishe_code) && emptyToNull(row.state),
  );

  /*
   * Load existing states and cities once.
   * This prevents thousands of unnecessary lookup queries.
   */
  const states = await prisma.state.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const stateByName = new Map(
    states.map((state) => [
      normalizeLookup(state.name),
      state,
    ]),
  );

  const stateBySlug = new Map(
    states.map((state) => [state.slug, state]),
  );

  const cities = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      stateId: true,
    },
  });

  const cityByKey = new Map(
    cities.map((city) => [
      `${city.stateId}:${normalizeLookup(city.name)}`,
      city,
    ]),
  );

  /*
   * Load existing colleges.
   *
   * AISHE code is the stable source identifier.
   * Existing slugs are intentionally preserved.
   */
const existingColleges = await prisma.college.findMany({
  where: {
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
});

  const collegeByAishe = new Map(
    existingColleges
      .filter((college) => college.aisheCode)
      .map((college) => [
        college.aisheCode as string,
        college,
      ]),
  );

  const usedSlugs = new Set(
    existingColleges.map((college) => college.slug),
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  /*
   * Resolve states and cities first.
   */
  const preparedRows: Array<{
    row: Record<string, unknown>;
    aisheCode: string;
    stateId: string;
    cityId: string | null;
    slug: string;
    collegeType:
      | "GOVERNMENT"
      | "PRIVATE"
      | "PUBLIC"
      | "DEEMED"
      | "AUTONOMOUS"
      | "OTHER";
  }> = [];

  for (const row of rows) {
    const aisheCode = emptyToNull(row.aishe_code);
    const stateName = emptyToNull(row.state);

    if (!aisheCode || !stateName) {
      skipped += 1;
      continue;
    }

    const stateKey = normalizeLookup(stateName);
    let state = stateByName.get(stateKey);

    if (!state) {
      const stateSlug = slugify(stateName);

      state =
        stateBySlug.get(stateSlug) ??
        (await prisma.state.upsert({
          where: {
            slug: stateSlug,
          },
          update: {},
          create: {
            name: stateName,
            slug: stateSlug,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        }));

      stateByName.set(stateKey, state);
      stateBySlug.set(state.slug, state);
    }

    const cityName = emptyToNull(row.city);
    let cityId: string | null = null;

    if (cityName) {
      const cityKey = `${state.id}:${normalizeLookup(cityName)}`;

      let city = cityByKey.get(cityKey);

      if (!city) {
        const citySlug = slugify(cityName);

        city = await prisma.city.upsert({
          where: {
            stateId_slug: {
              stateId: state.id,
              slug: citySlug,
            },
          },
          update: {},
          create: {
            name: cityName,
            slug: citySlug,
            stateId: state.id,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            stateId: true,
          },
        });

        cityByKey.set(cityKey, city);
      }

      cityId = city.id;
    }
const existingCollege = collegeByAishe.get(aisheCode);

let slug: string;

if (existingCollege) {
  // Existing AISHE code → always preserve the existing slug.
  slug = existingCollege.slug;
} else {
  // New college → generate a unique slug.
  const collegeName = String(row.name ?? "institution");
  const baseSlug = slugify(collegeName);

  slug = baseSlug || `institution-${slugify(aisheCode)}`;

  if (usedSlugs.has(slug)) {
    slug = `${slug}-${slugify(aisheCode)}`;
  }

  usedSlugs.add(slug);
}
    preparedRows.push({
      row,
      aisheCode,
      stateId: state.id,
      cityId,
      slug,
      collegeType: getCollegeType(
        row.institution_type,
        row.ownership,
      ),
    });
  }

  /*
   * Import in chunks so a 70k-row dataset does not create one
   * enormous database operation.
   */
  const CHUNK_SIZE = 500;

  for (let start = 0; start < preparedRows.length; start += CHUNK_SIZE) {
    const chunk = preparedRows.slice(
      start,
      start + CHUNK_SIZE,
    );

    for (const item of chunk) {
      const row = item.row;

      const name = emptyToNull(row.name);

      if (!name) {
        skipped += 1;
        continue;
      }

      const description =
        emptyToNull(row.short_description) ??
        emptyToNull(row.search_summary) ??
        emptyToNull(row.about);


const existing = collegeByAishe.get(item.aisheCode);

const rawCsvLogo = emptyToNull(row.logo_url);
const csvLogo = isValidImageUrl(rawCsvLogo) ? rawCsvLogo : null;
const logo = existing
  ? isR2Url(existing.logo)
    ? existing.logo
    : csvLogo ?? existing.logo
  : csvLogo;

const data = {
  name,
  slug: item.slug,
  collegeType: item.collegeType,
  aisheCode: item.aisheCode,

  logo,

  website: emptyToNull(row.website),
  email: emptyToNull(row.email),
  phone: emptyToNull(row.phone),
  address: emptyToNull(row.address),

  establishedYear: parseOptionalInt(
    row.established_year,
  ),

  description:
    emptyToNull(row.short_description) ??
    emptyToNull(row.search_summary) ??
    emptyToNull(row.about),

  stateId: item.stateId,
  cityId: item.cityId,

  lastUpdated:
    parseOptionalDate(row.last_updated) ??
    new Date(),
};

      if (existing) {
       await prisma.college.update({
  where: { id: existing.id },
  data: {
    name: data.name,
    slug: data.slug,
    logo: data.logo,
    collegeType: data.collegeType,
    aisheCode: data.aisheCode,
    website: data.website,
    email: data.email,
    phone: data.phone,
    address: data.address,
    establishedYear: data.establishedYear,
    description: data.description,
    stateId: data.stateId,
    cityId: data.cityId,
    lastUpdated: data.lastUpdated,
  },
});

        updated += 1;
      } else {
       const createdCollege = await prisma.college.create({
  data: {
    name: data.name,
    slug: data.slug,
    logo: data.logo,
    collegeType: data.collegeType,
    aisheCode: data.aisheCode,
    website: data.website,
    email: data.email,
    phone: data.phone,
    address: data.address,
    establishedYear: data.establishedYear,
    description: data.description,
    stateId: data.stateId,
    cityId: data.cityId,
    verified: false,
    status: "ACTIVE",
    lastUpdated: data.lastUpdated,
  },
});

        collegeByAishe.set(item.aisheCode, createdCollege);

        created += 1;
      }
    }
  }

  return {
    imported: created + updated,
    created,
    updated,
    skipped,
  };
}

type ImportCourseResult = {
  imported: number;
  created: number;
  updated: number;
  skipped: number;
  skippedDetails: SkippedRow[];
};

async function importCourses(
  rows: Record<string, unknown>[],
): Promise<ImportCourseResult> {
  const skippedDetails: SkippedRow[] = [];

  let created = 0;
  let updated = 0;
  let skipped = 0;

  /*
   * Load all colleges that have an AISHE code.
   *
   * AISHE code is the stable relationship between
   * the institutions.csv and courses.csv datasets.
   */
  const colleges = await prisma.college.findMany({
    where: {
      aisheCode: {
        not: null,
      },
    },
    select: {
      id: true,
      aisheCode: true,
    },
  });

  const collegeByAishe = new Map(
    colleges
      .filter((college) => college.aisheCode)
      .map((college) => [
        college.aisheCode as string,
        college,
      ]),
  );

  /*
   * Load existing courses by sourceCourseId.
   *
   * This makes the importer re-runnable:
   *
   * existing sourceCourseId → UPDATE
   * new sourceCourseId      → CREATE
   */
  const existingCourses = await prisma.course.findMany({
    where: {
      sourceCourseId: {
        not: null,
      },
    },
    select: {
      id: true,
      sourceCourseId: true,
      slug: true,
    },
  });

  const courseBySourceId = new Map(
    existingCourses
      .filter((course) => course.sourceCourseId)
      .map((course) => [
        course.sourceCourseId as string,
        course,
      ]),
  );

  /*
   * Load existing categories.
   */
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const categoryByName = new Map(
    categories.map((category) => [
      normalizeLookup(category.name),
      category,
    ]),
  );

  const usedCourseSlugs = new Set(
    existingCourses.map((course) => course.slug),
  );

  /*
   * Process rows in chunks.
   */
  const CHUNK_SIZE = 500;

  for (
    let start = 0;
    start < rows.length;
    start += CHUNK_SIZE
  ) {
    const chunk = rows.slice(
      start,
      start + CHUNK_SIZE,
    );

    for (const row of chunk) {
      const rowNumber =
        rows.indexOf(row) + 2;

      const sourceCourseId =
        emptyToNull(row.course_id);

      const aisheCode =
        emptyToNull(row.aishe_code);

      const courseName =
        emptyToNull(row.course_name);

      const level =
        normalizeCourseLevel(row.level);

      if (
        !sourceCourseId ||
        !aisheCode ||
        !courseName ||
        !level
      ) {
        skipped += 1;

        skippedDetails.push({
          rowNumber,
          reason:
            "Missing required course data after validation.",
        });

        continue;
      }

      /*
       * Resolve the College using AISHE code.
       */
      const college =
        collegeByAishe.get(aisheCode);

      if (!college) {
        skipped += 1;

        skippedDetails.push({
          rowNumber,
          reason: `College with AISHE code "${aisheCode}" was not found.`,
        });

        continue;
      }

      /*
       * Resolve/create the Category.
       */
      const categoryName =
        getCourseCategoryName(
          row.stream,
          row.degree,
        );

      const categoryKey =
        normalizeLookup(categoryName);

      let category =
        categoryByName.get(categoryKey);

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: slugify(categoryName),
            description: `Courses related to ${categoryName}.`,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        });

        categoryByName.set(
          categoryKey,
          category,
        );
      }

      /*
       * Preserve an existing course slug.
       *
       * For new courses use:
       *
       * course-name-source-course-id
       */
      const existingCourse =
        courseBySourceId.get(sourceCourseId);

      let courseSlug =
        existingCourse?.slug ??
        getCourseSlug(
          courseName,
          sourceCourseId,
        );

      if (
        !existingCourse &&
        usedCourseSlugs.has(courseSlug)
      ) {
        courseSlug = `${courseSlug}-${Date.now()}`;
      }

      usedCourseSlugs.add(courseSlug);

      const duration =
        getCourseDuration(
          row.duration_years,
          row.duration_months,
        );

      const averageFees =
        parseOptionalDecimal(
          row.fee_amount,
        );

      const courseData = {
        name: courseName,
        slug: courseSlug,
        degree:
          emptyToNull(row.degree),
        level,
        description:
          emptyToNull(row.specialization) ??
          emptyToNull(row.stream),
        durationYears: duration,
        eligibility:
          emptyToNull(row.eligibility),
        averageFees,
        sourceCourseId,
        categoryId: category.id,
        status: "ACTIVE" as const,
      };

      let courseId: string;

      if (existingCourse) {
        /*
         * Existing course → UPDATE.
         *
         * sourceCourseId and slug remain stable.
         */
        const updatedCourse =
          await prisma.course.update({
            where: {
              id: existingCourse.id,
            },
            data: {
              name: courseData.name,
              degree: courseData.degree,
              level: courseData.level,
              description:
                courseData.description,
              durationYears:
                courseData.durationYears,
              eligibility:
                courseData.eligibility,
              averageFees:
                courseData.averageFees,
              categoryId:
                courseData.categoryId,
              status: courseData.status,
            },
            select: {
              id: true,
            },
          });

        courseId = updatedCourse.id;

        updated += 1;
      } else {
        /*
         * New course → CREATE.
         */
        const createdCourse =
          await prisma.course.create({
            data: courseData,
            select: {
              id: true,
              sourceCourseId: true,
              slug: true,
            },
          });

        courseId = createdCourse.id;

        courseBySourceId.set(
          sourceCourseId,
          createdCourse,
        );

        created += 1;
      }

      /*
       * IMPORTANT:
       *
       * This is the College ↔ Course relationship.
       *
       * Course itself does NOT store collegeId.
       */
      const seats =
        parseOptionalInt(
          row.total_seats,
        );

      await prisma.collegeCourse.upsert({
        where: {
          collegeId_courseId: {
            collegeId: college.id,
            courseId,
          },
        },
        update: {
          seats,
          duration,
        },
        create: {
          collegeId: college.id,
          courseId,
          seats,
          duration,
        },
      });
    }
  }

  return {
    imported: created + updated,
    created,
    updated,
    skipped,
    skippedDetails,
  };
}

type ImportFeeResult = {
  imported: number;
  created: number;
  updated: number;
  skipped: number;
  skippedDetails: SkippedRow[];
};
async function importFees(
  rows: Record<string, unknown>[],
): Promise<ImportFeeResult> {
  const skippedDetails: SkippedRow[] = [];

  let created = 0;
  let updated = 0;
  let skipped = 0;

  const colleges = await prisma.college.findMany({
    select: {
      id: true,
      aisheCode: true,
    },
  });

  const collegeByAishe = new Map<string, { id: string; aisheCode: string }>();

  for (const college of colleges) {
    if (college.aisheCode) {
      collegeByAishe.set(college.aisheCode, {
        id: college.id,
        aisheCode: college.aisheCode,
      });
    }
  }

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      sourceCourseId: true,
    },
  });

  const courseBySourceId = new Map<
    string,
    {
      id: string;
      sourceCourseId: string;
    }
  >();

  for (const course of courses) {
    if (course.sourceCourseId) {
      courseBySourceId.set(course.sourceCourseId, {
        id: course.id,
        sourceCourseId: course.sourceCourseId,
      });
    }
  }

  // sourceFeeId is non-nullable in Prisma schema,
  // so there is no need for `where: { sourceFeeId: { not: null } }`.
  const existingFees = await prisma.fee.findMany({
    select: {
      id: true,
      sourceFeeId: true,
    },
  });

  const feeBySourceId = new Map<
    string,
    {
      id: string;
      sourceFeeId: string;
    }
  >();

  for (const fee of existingFees) {
    feeBySourceId.set(fee.sourceFeeId, {
      id: fee.id,
      sourceFeeId: fee.sourceFeeId,
    });
  }

  const CHUNK_SIZE = 500;

  for (
    let start = 0;
    start < rows.length;
    start += CHUNK_SIZE
  ) {
    const chunk = rows.slice(
      start,
      start + CHUNK_SIZE,
    );

    for (let index = 0; index < chunk.length; index++) {
      const row = chunk[index];

      const rowNumber = start + index + 2;

      const sourceFeeId = emptyToNull(row.fee_id);
      const aisheCode = emptyToNull(row.aishe_code);
      const sourceCourseId = emptyToNull(row.course_id);

      const amount = parseOptionalDecimal(row.amount);

      if (
        !sourceFeeId ||
        !aisheCode ||
        amount === null
      ) {
        skipped += 1;

        skippedDetails.push({
          rowNumber,
          reason:
            "Missing required fee data after validation.",
        });

        continue;
      }

      const college = collegeByAishe.get(aisheCode);

      if (!college) {
        skipped += 1;

        skippedDetails.push({
          rowNumber,
          reason: `College with AISHE code "${aisheCode}" was not found.`,
        });

        continue;
      }

      let courseId: string | null = null;

      if (sourceCourseId) {
        const course =
          courseBySourceId.get(sourceCourseId);

        if (!course) {
          skipped += 1;

          skippedDetails.push({
            rowNumber,
            reason: `Course with source course ID "${sourceCourseId}" was not found.`,
          });

          continue;
        }

        courseId = course.id;
      }

      const feeData = {
        sourceFeeId,
        collegeId: college.id,
        courseId,
        programName: emptyToNull(row.program_name),
        feeType:
          emptyToNull(row.fee_type) ?? "OTHER",
        label: emptyToNull(row.label),
        amount,
        currency:
          emptyToNull(row.currency) ?? "INR",
        frequency: emptyToNull(row.frequency),
        isRefundable:
          parseBoolean(row.is_refundable),
        academicYear:
          emptyToNull(row.academic_year),
        sourceUrl:
          emptyToNull(row.source_url),
        observedAt:
          parseOptionalDate(row.observed_at),
      };

      const existingFee =
        feeBySourceId.get(sourceFeeId);

      if (existingFee) {
        await prisma.fee.update({
          where: {
            id: existingFee.id,
          },
          data: {
            collegeId: feeData.collegeId,
            courseId: feeData.courseId,
            programName: feeData.programName,
            feeType: feeData.feeType,
            label: feeData.label,
            amount: feeData.amount,
            currency: feeData.currency,
            frequency: feeData.frequency,
            isRefundable: feeData.isRefundable,
            academicYear: feeData.academicYear,
            sourceUrl: feeData.sourceUrl,
            observedAt: feeData.observedAt,
          },
        });

        updated += 1;
      } else {
        const createdFee =
          await prisma.fee.create({
            data: feeData,
            select: {
              id: true,
              sourceFeeId: true,
            },
          });

        feeBySourceId.set(
          sourceFeeId,
          createdFee,
        );

        created += 1;
      }
    }
  }

  return {
    imported: created + updated,
    created,
    updated,
    skipped,
    skippedDetails,
  };
}