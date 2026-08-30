// lib/platforms/geeksforgeeks.ts

const GFG_BASE_URL = "https://www.geeksforgeeks.org";

export interface GFGStats {
  username: string;
  profileUrl: string;

  totalSolved: number;

  easySolved: number;
  mediumSolved: number;
  hardSolved: number;

  codingScore: number | null;

  schoolSolved: number | null;
  basicSolved: number | null;
  easyProblemsSolved: number | null;
  mediumProblemsSolved: number | null;
  hardProblemsSolved: number | null;
}

/**
 * Fetch GeeksforGeeks user statistics.
 */
export async function getGeeksForGeeksStats(
  username: string
): Promise<GFGStats> {
  if (!username?.trim()) {
    throw new Error(
      "GeeksforGeeks username is required"
    );
  }

  const cleanUsername = username.trim();

  const profileUrl =
    `${GFG_BASE_URL}/user/${encodeURIComponent(cleanUsername)}/`;

  const response = await fetch(profileUrl, {
    method: "GET",

    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",

      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

      "Accept-Language":
        "en-US,en;q=0.9",
    },

    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error(
      `GeeksforGeeks user "${cleanUsername}" not found`
    );
  }

  if (!response.ok) {
    throw new Error(
      `GeeksforGeeks request failed with status ${response.status}`
    );
  }

  const html = await response.text();

  if (!html) {
    throw new Error(
      "GeeksforGeeks returned an empty response"
    );
  }

  return parseGFGProfile(
    html,
    cleanUsername,
    profileUrl
  );
}

/**
 * Parse a GFG profile page.
 *
 * NOTE:
 * GFG's HTML structure can change.
 * Keep all parsing logic isolated here so the rest
 * of the application doesn't depend on GFG's markup.
 */
function parseGFGProfile(
  html: string,
  username: string,
  profileUrl: string
): GFGStats {
  const codingScore = findNumber(html, [
    /"codingScore"\s*:\s*(\d+)/i,
    /"coding_score"\s*:\s*(\d+)/i,
    /Coding\s*Score[^0-9]{0,50}(\d+)/i,
  ]);

  const schoolSolved = findNumber(html, [
    /"school"\s*:\s*(\d+)/i,
    /"schoolSolved"\s*:\s*(\d+)/i,
    /School[^0-9]{0,50}(\d+)/i,
  ]);

  const basicSolved = findNumber(html, [
    /"basic"\s*:\s*(\d+)/i,
    /"basicSolved"\s*:\s*(\d+)/i,
    /Basic[^0-9]{0,50}(\d+)/i,
  ]);

  const easySolved = findNumber(html, [
    /"easy"\s*:\s*(\d+)/i,
    /"easySolved"\s*:\s*(\d+)/i,
    /Easy[^0-9]{0,50}(\d+)/i,
  ]);

  const mediumSolved = findNumber(html, [
    /"medium"\s*:\s*(\d+)/i,
    /"mediumSolved"\s*:\s*(\d+)/i,
    /Medium[^0-9]{0,50}(\d+)/i,
  ]);

  const hardSolved = findNumber(html, [
    /"hard"\s*:\s*(\d+)/i,
    /"hardSolved"\s*:\s*(\d+)/i,
    /Hard[^0-9]{0,50}(\d+)/i,
  ]);

  /**
   * If GFG exposes a direct total solved value,
   * prefer that instead of calculating it.
   */
  const directTotalSolved = findNumber(html, [
    /"totalSolved"\s*:\s*(\d+)/i,
    /"total_solved"\s*:\s*(\d+)/i,
    /Total\s*Problems\s*Solved[^0-9]{0,50}(\d+)/i,
  ]);

  const totalSolved =
    directTotalSolved ??
    calculateTotalSolved({
      schoolSolved,
      basicSolved,
      easySolved,
      mediumSolved,
      hardSolved,
    });

  return {
    username,
    profileUrl,

    totalSolved,

    easySolved: easySolved ?? 0,
    mediumSolved: mediumSolved ?? 0,
    hardSolved: hardSolved ?? 0,

    codingScore,

    schoolSolved,
    basicSolved,

    easyProblemsSolved: easySolved,
    mediumProblemsSolved: mediumSolved,
    hardProblemsSolved: hardSolved,
  };
}

/**
 * Find the first valid number from a list of regex patterns.
 */
function findNumber(
  html: string,
  patterns: RegExp[]
): number | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    const value = Number(
      match[1].replace(/,/g, "")
    );

    if (
      Number.isFinite(value) &&
      value >= 0
    ) {
      return value;
    }
  }

  return null;
}

/**
 * Calculate total solved when GFG doesn't expose
 * a direct total value.
 */
function calculateTotalSolved({
  schoolSolved,
  basicSolved,
  easySolved,
  mediumSolved,
  hardSolved,
}: {
  schoolSolved: number | null;
  basicSolved: number | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
}): number {
  return (
    (schoolSolved ?? 0) +
    (basicSolved ?? 0) +
    (easySolved ?? 0) +
    (mediumSolved ?? 0) +
    (hardSolved ?? 0)
  );
}