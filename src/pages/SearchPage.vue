<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NAlert,
  NButton,
  NEmpty,
  NInput,
  NPagination,
  NSkeleton,
  NSpace,
  NSelect,
} from "naive-ui";

import type { RepoSort } from "../api/types";
import RepoCard from "../components/RepoCard.vue";
import {
  DEFAULT_PAGE_SIZE,
  useRepositorySearch,
} from "../composables/useRepoSearch.ts";

const route = useRoute();
const router = useRouter();

const query = ref("");

const { repositories, loading, error, totalCount, search, reset } =
  useRepositorySearch();

const sortOptions = [
  {
    label: "Best match",
    value: "best-match",
  },
  {
    label: "Most stars",
    value: "stars",
  },
  {
    label: "Most forks",
    value: "forks",
  },
  {
    label: "Most help wanted issues",
    value: "help-wanted-issues",
  },
  {
    label: "Recently updated",
    value: "updated",
  },
];

const currentSort = computed<RepoSort>(() => {
  const sort = route.query.sort;

  if (
    sort === "stars" ||
    sort === "forks" ||
    sort === "help-wanted-issues" ||
    sort === "updated"
  ) {
    return sort;
  }

  return "best-match";
});

const currentPage = computed(() => {
  const page = Number(route.query.page);

  return Number.isInteger(page) && page > 0 ? page : 1;
});

const totalPages = computed(() => {
  const accessibleResults = Math.min(totalCount.value, 1000);

  return Math.max(1, Math.ceil(accessibleResults / DEFAULT_PAGE_SIZE));
});

async function performSearch() {
  const routeQuery =
    typeof route.query.q === "string" ? route.query.q.trim() : "";

  if (!routeQuery) {
    return;
  }

  query.value = routeQuery;

  await search(routeQuery, currentPage.value, currentSort.value);
}

async function handleSearch() {
  const trimmedQuery = query.value.trim();

  if (!trimmedQuery) {
    return;
  }

  await router.push({
    path: "/",
    query: {
      q: trimmedQuery,
      page: 1,
      sort: currentSort.value,
    },
  });
}

async function handlePageChange(page: number) {
  await router.push({
    path: "/",
    query: {
      q: query.value.trim(),
      page,
      sort: currentSort.value,
    },
  });
}

async function handleSortChange(value: string) {
  const sort: RepoSort =
    value === "stars" ||
    value === "forks" ||
    value === "help-wanted-issues" ||
    value === "updated"
      ? value
      : "best-match";

  if (!route.query.q) {
    return;
  }

  await router.push({
    path: "/",
    query: {
      q: route.query.q,
      page: 1,
      sort,
    },
  });
}

async function handleClear() {
  query.value = "";
  reset();

  await router.replace({
    path: "/",
  });
}

watch(
  () => route.query,
  () => {
    performSearch();
  },
);

onMounted(() => {
  performSearch();
});
</script>

<template>
  <main class="search-page">
    <section class="search-page__header">
      <h1>GitHub Repository Explorer</h1>

      <p>Search GitHub repositories and explore their details.</p>

      <div class="search-page__search">
        <n-input
          v-model:value="query"
          placeholder="Search repositories..."
          clearable
          @keyup.enter="handleSearch"
        />

        <n-button
          type="primary"
          :loading="loading"
          :disabled="!query.trim()"
          @click="handleSearch"
        >
          Search
        </n-button>

        <n-button
          :disabled="!query && repositories.length === 0"
          @click="handleClear"
        >
          Clear
        </n-button>
      </div>

      <div
        v-if="route.query.q"
        class="search-page__toolbar"
      >
        <span>Sort by</span>

        <n-select
          :value="currentSort"
          :options="sortOptions"
          class="search-page__sort"
          @update:value="handleSortChange"
        />
      </div>
    </section>

    <section class="search-page__content">
      <div v-if="error">
        <n-alert
          type="error"
          title="Unable to search repositories"
        >
          {{ error }}
        </n-alert>

        <n-button
          class="search-page__retry"
          @click="performSearch"
        >
          Try again
        </n-button>
      </div>

      <n-space
        v-else-if="loading"
        vertical
        size="large"
      >
        <n-skeleton
          v-for="index in 5"
          :key="index"
          height="140px"
          :sharp="false"
        />
      </n-space>

      <n-empty
        v-else-if="route.query.q && repositories.length === 0"
        description="No repositories found."
      />

      <div
        v-else-if="repositories.length > 0"
        class="search-page__results"
      >
        <repo-card
          v-for="repo in repositories"
          :key="repo.id"
          :repo="repo"
        />
      </div>
    </section>

    <div
      v-if="repositories.length > 0 && !error"
      class="search-page__pagination"
    >
      <n-pagination
        :page="currentPage"
        :page-count="totalPages"
        :disabled="loading"
        @update:page="handlePageChange"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.search-page {
  width: min(100% - 32px, 960px);
  height: 100vh;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  &__header {
    flex-shrink: 0;
    margin-bottom: 24px;

    h1 {
      margin: 0 0 8px;
      font-size: 32px;
    }

    p {
      margin: 0 0 24px;
      color: #71717a;
    }
  }

  &__search {
    display: flex;
    gap: 12px;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

    span {
      color: #71717a;
      font-size: 14px;
    }
  }

  &__sort {
    width: 210px;
  }

  &__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
  }

  &__results {
    display: grid;
    gap: 16px;
  }

  &__pagination {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    padding-top: 16px;
  }

  &__retry {
    margin-top: 16px;
  }
}

@media (max-width: 768px) {
  .search-page {
    padding: 20px 0;

    &__header {
      margin-bottom: 16px;

      h1 {
        font-size: 26px;
      }

      p {
        margin-bottom: 16px;
      }
    }

    &__search {
      flex-direction: column;
    }

    &__toolbar {
      justify-content: space-between;
      margin-top: 16px;
    }

    &__sort {
      width: 160px;
    }

    &__content {
      padding-right: 0;
    }

    &__pagination {
      padding: 12px 0 4px;
    }
  }
}
</style>
