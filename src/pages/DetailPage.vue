<script setup lang="ts">
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NAlert, NButton, NCard, NSkeleton, NSpace, NTag } from "naive-ui";

import { useRepoDetail } from "../composables/useRepoDetail";

const route = useRoute();
const router = useRouter();

const { repoData, loading, error, loadRepo } = useRepoDetail();

function load() {
  const owner = route.params.owner;
  const repo = route.params.repo;

  if (typeof owner !== "string" || typeof repo !== "string") {
    return;
  }

  loadRepo(owner, repo);
}

function goBack() {
  router.back();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

watch(() => [route.params.owner, route.params.repo], load, { immediate: true });
</script>

<template>
  <main class="repo-detail">
    <n-button
      quaternary
      class="repo-detail__back"
      @click="goBack"
    >
      ← Back
    </n-button>

    <n-space
      v-if="loading"
      vertical
      size="large"
    >
      <n-skeleton
        height="48px"
        width="60%"
        :sharp="false"
      />
      <n-skeleton
        text
        :repeat="3"
      />
      <n-skeleton
        height="240px"
        :sharp="false"
      />
    </n-space>

    <div
      v-else-if="error"
      class="repo-detail__error"
    >
      <n-alert
        type="error"
        title="Unable to load repository data"
      >
        {{ error }}
      </n-alert>

      <n-button
        class="repo-detail__retry"
        @click="load"
      >
        Try again
      </n-button>
    </div>

    <template v-else-if="repoData">
      <section class="repo-detail__header">
        <div>
          <h1>{{ repoData.full_name }}</h1>
          <p>
            {{ repoData.description ?? "No description available." }}
          </p>
        </div>

        <n-button
          tag="a"
          :href="repoData.html_url"
          target="_blank"
          rel="noopener noreferrer"
          type="primary"
        >
          View on GitHub
        </n-button>
      </section>

      <n-card title="Repository information">
        <div class="repo-detail__stats">
          <div>
            <strong>{{ repoData.stargazers_count.toLocaleString() }}</strong>
            <span>Stars</span>
          </div>

          <div>
            <strong>{{ repoData.forks_count.toLocaleString() }}</strong>
            <span>Forks</span>
          </div>

          <div>
            <strong>{{ repoData.open_issues_count.toLocaleString() }}</strong>
            <span>Open issues</span>
          </div>

          <div>
            <strong>{{ repoData.watchers_count.toLocaleString() }}</strong>
            <span>Watchers</span>
          </div>
        </div>

        <dl class="repo-detail__metadata">
          <div>
            <dt>Language</dt>
            <dd>{{ repoData.language ?? "Not specified" }}</dd>
          </div>

          <div>
            <dt>License</dt>
            <dd>{{ repoData.license?.name ?? "No license" }}</dd>
          </div>

          <div>
            <dt>Created</dt>
            <dd>{{ formatDate(repoData.created_at) }}</dd>
          </div>

          <div>
            <dt>Updated</dt>
            <dd>{{ formatDate(repoData.updated_at) }}</dd>
          </div>
        </dl>

        <div
          v-if="repoData.topics.length"
          class="repo-detail__topics"
        >
          <h2>Topics</h2>

          <div class="repo-detail__topic-list">
            <n-tag
              v-for="topic in repoData.topics"
              :key="topic"
              size="small"
            >
              {{ topic }}
            </n-tag>
          </div>
        </div>
      </n-card>
    </template>
  </main>
</template>

<style scoped lang="scss">
.repo-detail {
  width: min(100% - 32px, 960px);
  margin: 0 auto;
  padding: 48px 0;

  &__back {
    margin-bottom: 24px;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 32px;

    h1 {
      margin: 0 0 12px;
      font-size: 32px;
      overflow-wrap: anywhere;
    }

    p {
      margin: 0;
      color: #71717a;
      line-height: 1.6;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;

    div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    strong {
      font-size: 24px;
    }

    span {
      color: #71717a;
      font-size: 14px;
    }
  }

  &__metadata {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 0;

    div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    dt {
      color: #71717a;
      font-size: 13px;
    }

    dd {
      margin: 0;
      font-weight: 500;
    }
  }

  &__topics {
    margin-top: 32px;

    h2 {
      margin: 0 0 12px;
      font-size: 16px;
    }
  }

  &__topic-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__retry {
    margin-top: 16px;
  }
}

@media (max-width: 768px) {
  .repo-detail {
    padding: 24px 0;

    &__header {
      flex-direction: column;
    }

    &__stats {
      grid-template-columns: repeat(2, 1fr);
    }

    &__metadata {
      grid-template-columns: 1fr;
    }
  }
}
</style>
