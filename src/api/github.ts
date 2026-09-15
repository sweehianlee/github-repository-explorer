import type {
  GitHubRepo,
  searchResponse,
  SearchRepoParams,
} from "./types";

const API_URL = "https://api.github.com";

export class GitHubApiError extends Error {
  status: number;
  rateLimitReset?: number;

  constructor(message: string, status: number, rateLimitReset?: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.rateLimitReset = rateLimitReset;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  if (res.status === 404) {
    throw new GitHubApiError("Repository not found.", 404);
  }

  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const resetHeader = res.headers.get("x-ratelimit-reset");

    if (remaining === "0") {
      const reset = resetHeader ? Number(resetHeader) : undefined;

      throw new GitHubApiError(
        "GitHub API rate limit reached.",
        res.status,
        Number.isFinite(reset) ? reset : undefined,
      );
    }
  }

  throw new GitHubApiError("GitHub API request failed.", res.status);
}

export async function searchRepositories(
  params: SearchRepoParams,
): Promise<searchResponse> {
  const {
    query,
    page = 1,
    perPage = 20,
    sort,
    order = "desc",
  } = params;

  const searchParams = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (sort) {
    searchParams.set("sort", sort);
    searchParams.set("order", order);
  }

  const res = await fetch(
    `${API_URL}/search/repositories?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  return handleResponse<searchResponse>(res);
}

export async function getRepo(
  owner: string,
  repo: string,
): Promise<GitHubRepo> {
  const res = await fetch(
    `${API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  return handleResponse<GitHubRepo>(res);
}