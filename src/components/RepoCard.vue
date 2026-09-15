<script setup lang="ts">
import { computed } from "vue";
import { NCard, NTag } from "naive-ui";
import { RouterLink } from "vue-router";
import type { GitHubRepo } from "../api/types";

const props = defineProps<{
  repo: GitHubRepo;
}>();

const detailPath = computed(
  () => `/repositories/${props.repo.owner.login}/${props.repo.name}`,
);
</script>

<template>
  <router-link
    class="repo-card-link"
    :to="detailPath"
  >
    <n-card
      class="repo-card"
      hoverable
    >
      <div class="header">
        <h2>{{ repo.full_name }}</h2>

        <n-tag
          v-if="repo.language"
          size="small"
        >
          {{ repo.language }}
        </n-tag>
      </div>

      <p class="description">
        {{ repo.description || "No description available." }}
      </p>

      <div class="stats">
        <span>⭐ {{ repo.stargazers_count.toLocaleString() }}</span>
        <span>Forks: {{ repo.forks_count.toLocaleString() }}</span>
      </div>
    </n-card>
  </router-link>
</template>

<style scoped lang="scss">
.repo-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.repo-card {
  cursor: pointer;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
  }

  .description {
    margin: 12px 0;
    color: #71717a;
    line-height: 1.5;
  }

  .stats {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #52525b;
  }
}
</style>
