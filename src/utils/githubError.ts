import { GitHubApiError } from "../api/github";

export function getGitHubErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "Unable to connect to GitHub. Please check your internet connection and try again.";
  }

  if (!(error instanceof GitHubApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (error.status === 404) {
    return "Repository not found.";
  }

  if (error.status === 403 || error.status === 429) {
    if (error.rateLimitReset) {
      const resetTime = new Date(
        error.rateLimitReset * 1000,
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return `GitHub API rate limit reached. Please try again after ${resetTime}.`;
    }

    return "GitHub API rate limit reached. Please try again later.";
  }

  return "GitHub request failed. Please try again.";
}
