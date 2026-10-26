import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'games', component: () => import('../views/GamesView.vue'), meta: { title: '怪物猎人 Wiki' } },
  { path: '/wilds', name: 'hub', component: () => import('../views/HubView.vue'), meta: { title: '怪物猎人：荒野' } },
  {
    path: '/wilds/monsters',
    name: 'monsters',
    component: () => import('../views/MonsterListView.vue'),
    meta: { title: '怪物图鉴' },
  },
  {
    path: '/wilds/monsters/:slug',
    name: 'monster-detail',
    component: () => import('../views/MonsterDetailView.vue'),
    meta: { title: '怪物详情' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
