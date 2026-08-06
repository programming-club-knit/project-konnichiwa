// Utility to derive academic year (1-4), branch, and batch from roll number or KNIT email.
// Rules:
// - 5-digit roll: first two digits YY admission year (20YY). Branch digit is 3rd.
// - 6-digit roll: branch digit is 4th.
// Year progression boundaries are July 1 each year.
// Example: admission 2023 => First year until 2024-07-01, second year until 2025-07-01, etc.

const BRANCH_MAP: Record<string, string> = {
  "1": "Civil Engineering",
  "2": "Computer Science",
  "3": "Electrical Engineering",
  "4": "Electronics Engineering",
  "5": "Mechanical Engineering",
  "6": "Information Technology",
  "7": "MCA",
};

type AcademicResult =
  | { valid: true; year: number; branch: string; admissionYear: number }
  | { valid: false; reason: string };

export function computeAcademicFromRoll(
  roll: string | undefined | null,
  now = new Date()
): AcademicResult {
  if (!roll || typeof roll !== "string") {
    return { valid: false, reason: "Roll number missing" };
  }
  const trimmed = roll.trim();
  if (!/^\d{5,6}$/.test(trimmed)) {
    return { valid: false, reason: "Roll number must be 5 or 6 digits" };
  }
  const length = trimmed.length;
  const yy = trimmed.slice(0, 2);
  const admissionYear = 2000 + parseInt(yy, 10);
  if (admissionYear < 2000 || admissionYear > 2099) {
    return { valid: false, reason: "Invalid admission year in roll number" };
  }
  // Branch digit position
  const branchDigit = length === 5 ? trimmed.charAt(2) : trimmed.charAt(3);
  const branch = BRANCH_MAP[branchDigit];
  if (!branch) {
    return { valid: false, reason: "Unknown branch code" };
  }
  // Academic year calculation
  let yearNumber = 1;
  for (let i = 1; i <= 3; i++) {
    const boundary = new Date(admissionYear + i, 6, 1); // July (month index 6)
    if (now >= boundary) yearNumber++;
  }
  if (length === 6) {
    // lateral entry
    yearNumber = Math.min(yearNumber + 1, 4);
  }
  if (yearNumber < 1 || yearNumber > 4) {
    return { valid: false, reason: "Derived year out of range" };
  }
  return { valid: true, year: yearNumber, branch, admissionYear };
}

export type ParsedAcademicEmail =
  | {
      valid: true;
      rollNumber: string;
      admissionYear: number;
      batchYear: number;
      branch: string;
      year: number;
    }
  | { valid: false; reason: string };

/**
 * Parses academic details (branch, batch year, academic year, roll number) from a KNIT email address.
 * Example: "abhay.24305@knit.ac.in" -> rollNumber: "24305", branch: "Electrical Engineering", batchYear: 2028
 */
export function parseAcademicFromEmail(
  email: string | undefined | null,
  now = new Date()
): ParsedAcademicEmail {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email missing" };
  }

  const clean = email.trim().toLowerCase();
  const localPart = clean.split("@")[0] || "";

  // Extract 5 or 6 digit roll number from email local part
  const match = localPart.match(/(\d{5,6})/);
  if (!match) {
    return { valid: false, reason: "No 5-6 digit roll number found in email" };
  }

  const rollNumber = match[1];
  const academic = computeAcademicFromRoll(rollNumber, now);

  if (!academic.valid) {
    return academic;
  }

  // Graduating batch year = admissionYear + 4 (or admissionYear + 3 for 6-digit lateral entry)
  const batchYear = rollNumber.length === 6 ? academic.admissionYear + 3 : academic.admissionYear + 4;

  return {
    valid: true,
    rollNumber,
    admissionYear: academic.admissionYear,
    batchYear,
    branch: academic.branch,
    year: academic.year,
  };
}

export { BRANCH_MAP };
