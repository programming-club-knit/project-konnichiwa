const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export interface LeetCodeStats {
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
}

interface LeetCodeResponse {
  data?: {
    matchedUser: {
      username: string;
      profile: {
        ranking: number | null;
        reputation: number | null;
      };
      submitStats: {
        acSubmissionNum: {
          difficulty: string;
          count: number;
        }[];
      };
    } | null;

    allQuestionsCount: {
      difficulty: string;
      count: number;
    }[];
  };

  errors?: {
    message: string;
  }[];
}

function getCount(
  data: {
    difficulty: string;
    count: number;
  }[],
  difficulty: string
): number {
  return (
    data.find(
      (item) => item.difficulty === difficulty
    )?.count ?? 0
  );
}

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

  const response = await fetch(
    LEETCODE_GRAPHQL_URL,
    {
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

      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `LeetCode API error: ${response.status}`
    );
  }

  const result =
    (await response.json()) as LeetCodeResponse;

  if (result.errors?.length) {
    throw new Error(
      result.errors[0].message
    );
  }

  const user = result.data?.matchedUser;

  if (!user) {
    throw new Error(
      `LeetCode user "${username}" not found`
    );
  }

  const submissions =
    user.submitStats.acSubmissionNum;

  const questions =
    result.data?.allQuestionsCount ?? [];

  return {
    username: user.username,

    ranking:
      user.profile?.ranking ?? null,

    reputation:
      user.profile?.reputation ?? null,

    totalSolved:
      getCount(submissions, "All"),

    easySolved:
      getCount(submissions, "Easy"),

    mediumSolved:
      getCount(submissions, "Medium"),

    hardSolved:
      getCount(submissions, "Hard"),

    totalQuestions:
      getCount(questions, "All"),

    easyTotal:
      getCount(questions, "Easy"),

    mediumTotal:
      getCount(questions, "Medium"),

    hardTotal:
      getCount(questions, "Hard"),
  };
}