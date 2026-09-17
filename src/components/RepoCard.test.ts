import { mount, RouterLinkStub } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import type { GitHubRepo } from "../api/types.ts";
import RepoCard from "./RepoCard.vue";

const repo: GitHubRepo = {
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
  topics: ["vue", "javascript"],
  created_at: "2018-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  owner: {
    login: "vuejs",
    avatar_url: "https://test.com/avatar.png",
    html_url: "https://github.com/vuejs",
  },
  license: {
    name: "MIT License",
    spdx_id: "MIT",
  },
};

function mountRepoCard(overrides: Partial<GitHubRepo> = {}) {
  return mount(RepoCard, {
    props: {
      repo: {
        ...repo,
        ...overrides,
      },
    },
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  });
}

describe("RepoCard", () => {
  it("renders repos information", () => {
    const wrapper = mountRepoCard();

    expect(wrapper.text()).toContain("vuejs/core");
    expect(wrapper.text()).toContain("Vue.js core repo");
    expect(wrapper.text()).toContain("TypeScript");
    expect(wrapper.text()).toContain("50,000");
    expect(wrapper.text()).toContain("8,000");
  });

  it("shows fallback text when description is missing", () => {
    const wrapper = mountRepoCard({
      description: null,
    });

    expect(wrapper.text()).toContain("No description available.");
  });

  it("does not show language when language is missing", () => {
    const wrapper = mountRepoCard({
      language: null,
    });

    expect(wrapper.text()).not.toContain("TypeScript");
  });

  it("links to the repository detail page", () => {
    const wrapper = mountRepoCard();

    const link = wrapper.getComponent(RouterLinkStub);

    expect(link.props('to')).toBe(
      '/repositories/vuejs/core',
    )
  });
});
