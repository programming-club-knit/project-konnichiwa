// Utility to derive academic year (1-4) and branch from roll number.
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

export { BRANCH_MAP };
