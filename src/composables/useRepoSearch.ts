import { ref } from "vue";

import { searchRepositories } from "../api/github";
import type { GitHubRepo, RepoSort } from "../api/types";
import { getGitHubErrorMessage } from "../utils/githubError";

const DEFAULT_PAGE_SIZE = 20;

export function useRepositorySearch() {
  const repositories = ref<GitHubRepo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalCount = ref(0);

  let requestId = 0;

  async function search(
    query: string,
    page = 1,
    sort: RepoSort = "best-match",
  ) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      repositories.value = [];
      totalCount.value = 0;
      error.value = null;
      loading.value = false;
      return;
    }

    const currentRequest = ++requestId;

    loading.value = true;
    error.value = null;

    try {
      const response = await searchRepositories({
        query: trimmedQuery,
        page,
        perPage: DEFAULT_PAGE_SIZE,
        sort: sort === "best-match" ? undefined : sort,
      });

      if (currentRequest !== requestId) {
        return;
      }

      repositories.value = response.items;
      totalCount.value = response.total_count;
    } catch (err) {
      if (currentRequest !== requestId) {
        return;
      }

      repositories.value = [];
      totalCount.value = 0;
      error.value = getGitHubErrorMessage(err);
    } finally {
      if (currentRequest === requestId) {
        loading.value = false;
      }
    }

    
  }

  function reset() {
    repositories.value = []
    totalCount.value = 0
    error.value = null
  }

  return {
    repositories,
    loading,
    error,
    totalCount,
    search,
    reset,
  };
}

export { DEFAULT_PAGE_SIZE };
