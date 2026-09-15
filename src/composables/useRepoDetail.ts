import { ref } from "vue";

import { getRepo } from "../api/github";
import type { GitHubRepo } from "../api/types";
import { getGitHubErrorMessage } from "../utils/githubError";

export function useRepoDetail() {
  const repoData = ref<GitHubRepo | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadRepo(owner: string, repo: string) {
    loading.value = true;
    error.value = null;
    repoData.value = null;

    try {
      repoData.value = await getRepo(owner, repo);
    } catch (err) {
      error.value = getGitHubErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    repoData,
    loading,
    error,
    loadRepo,
  };
}
