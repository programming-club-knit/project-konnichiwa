// lib/platforms/leetcode.ts

const LEETCODE_API = "https://leetcode.com/graphql";

type LeetCodeStats = {
  username: string;
  ranking: number | null;
  reputation: number | null;

  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;

  totalQuestions: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
};

export async function getLeetCodeStats(
  username: string
): Promise<LeetCodeStats> {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }

        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }

      allQuestionsCount {
        difficulty
        count
      }
    }
  `;

  const response = await fetch(LEETCODE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com/",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
      },
    }),

    // Don't cache indefinitely
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `LeetCode request failed: ${response.status}`
    );
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      result.errors[0]?.message ?? "LeetCode API error"
    );
  }

  const user = result.data?.matchedUser;

  if (!user) {
    throw new Error("LeetCode user not found");
  }

  const submissions =
    user.submitStats?.acSubmissionNum ?? [];

  const questions =
    result.data?.allQuestionsCount ?? [];

  const getCount = (
    data: { difficulty: string; count: number }[],
    difficulty: string
  ) => {
    return (
      data.find(
        item => item.difficulty === difficulty
      )?.count ?? 0
    );
  };

  return {
    username: user.username,

    ranking: user.profile?.ranking ?? null,

    reputation: user.profile?.reputation ?? null,

    totalSolved: getCount(
      submissions,
      "All"
    ),

    easySolved: getCount(
      submissions,
      "Easy"
    ),

    mediumSolved: getCount(
      submissions,
      "Medium"
    ),

    hardSolved: getCount(
      submissions,
      "Hard"
    ),

    totalQuestions: getCount(
      questions,
      "All"
    ),

    easyTotal: getCount(
      questions,
      "Easy"
    ),

    mediumTotal: getCount(
      questions,
      "Medium"
    ),

    hardTotal: getCount(
      questions,
      "Hard"
    ),
  };
}