import { beforeEach, describe, expect, it, vi } from "vitest";

import { GitHubApiError, searchRepositories } from "../api/github";
import { useRepositorySearch } from "./useRepoSearch";

vi.mock('../api/github', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../api/github')
    >()

  return {
    ...actual,
    searchRepositories: vi.fn(),
  }
})

const mockedSearchRepositories = vi.mocked(searchRepositories);

describe("useRepositorySearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the API for an empty query", async () => {
    const { search, repositories, totalCount, error } = useRepositorySearch();

    await search("   ");

    expect(mockedSearchRepositories).not.toHaveBeenCalled();
    expect(repositories.value).toEqual([]);
    expect(totalCount.value).toBe(0);
    expect(error.value).toBeNull();
  });

  it("stores repositories after a successful search", async () => {
    mockedSearchRepositories.mockResolvedValue({
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: "core",
          full_name: "vuejs/core",
          description: "Vue.js core repository",
          html_url: "https://github.com/vuejs/core",
          stargazers_count: 50000,
          forks_count: 8000,
          watchers_count: 5000,
          open_issues_count: 500,
          language: "TypeScript",
          topics: [],
          created_at: "2018-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
          owner: {
            login: "vuejs",
            avatar_url: "",
            html_url: "https://github.com/vuejs",
          },
          license: null,
        },
      ],
    });

    const { search, repositories, totalCount, error } = useRepositorySearch();

    await search("vue");

    expect(mockedSearchRepositories).toHaveBeenCalledWith({
      query: "vue",
      page: 1,
      perPage: 20,
      sort: undefined,
    });

    expect(repositories.value).toHaveLength(1);
    expect(repositories.value[0]?.full_name).toBe("vuejs/core");
    expect(totalCount.value).toBe(1);
    expect(error.value).toBeNull();
  });

  it("passes sorting to the API", async () => {
    mockedSearchRepositories.mockResolvedValue({
      total_count: 0,
      incomplete_results: false,
      items: [],
    });

    const { search } = useRepositorySearch();

    await search("vue", 2, "stars");

    expect(mockedSearchRepositories).toHaveBeenCalledWith({
      query: "vue",
      page: 2,
      perPage: 20,
      sort: "stars",
    });
  });

  it("sets an error when the API request fails", async () => {
    mockedSearchRepositories.mockRejectedValue(
      new TypeError("Failed to fetch"),
    );

    const { search, repositories, totalCount, error } = useRepositorySearch();

    await search("vue");

    expect(repositories.value).toEqual([]);
    expect(totalCount.value).toBe(0);
    expect(error.value).toBe(
      "Unable to connect to GitHub. Please check your internet connection and try again.",
    );
  });

  it("shows a rate limit error", async () => {
    mockedSearchRepositories.mockRejectedValue(
      new GitHubApiError(
        "GitHub API rate limit reached.",
        403,
        1760000000,
      ),
    );
  
    const { search, error } = useRepositorySearch();
  
    await search("vue");
  
    expect(error.value).toContain("rate limit");
  });
});
