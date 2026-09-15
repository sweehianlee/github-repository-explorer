import { createRouter, createWebHistory } from 'vue-router'

import DetailPage from '../pages/DetailPage.vue'
import SearchPage from '../pages/SearchPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'search',
      component: SearchPage,
    },
    {
      path: '/repositories/:owner/:repo',
      name: 'repo-detail',
      component: DetailPage,
    },
  ],
})

export default router