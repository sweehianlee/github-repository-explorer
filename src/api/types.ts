export interface RepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface RepoLicense {
  name: string;
  spdx_id: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  owner: RepoOwner;
  license: RepoLicense | null;
}

export interface searchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface SearchRepoParams {
  query: string;
  page?: number;
  perPage?: number;
  sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
  order?: "asc" | "desc";
}

export type RepoSort =
| 'best-match'
| 'stars'
| 'forks'
| 'help-wanted-issues'
| 'updated'