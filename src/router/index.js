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
  {
    path: '/wilds/drops',
    name: 'drops',
    component: () => import('../views/DropQueryView.vue'),
    meta: { title: '掉落查询' },
  },
  {
    path: '/sunbreak',
    name: 'sunbreak-hub',
    component: () => import('../views/SunbreakHubView.vue'),
    meta: { title: '怪物猎人：崛起 曙光' },
  },
  {
    path: '/sunbreak/monsters',
    name: 'sunbreak-monsters',
    component: () => import('../views/SunbreakListView.vue'),
    meta: { title: '怪物图鉴' },
  },
  {
    path: '/sunbreak/monsters/:slug',
    name: 'sunbreak-detail',
    component: () => import('../views/SunbreakDetailView.vue'),
    meta: { title: '怪物详情' },
  },
  {
    path: '/sunbreak/drops',
    name: 'sunbreak-drops',
    component: () => import('../views/DropQueryView.vue'),
    props: { game: 'sunbreak' },
    meta: { title: '掉落查询' },
  },
  // ── MH3G ──────────────────────────────────────────
  {
    path: '/mh3g',
    name: 'mh3g-hub',
    component: () => import('../views/Mh3gHubView.vue'),
    meta: { title: '怪物猎人 3G' },
  },
  {
    path: '/mh3g/monsters',
    name: 'mh3g-monsters',
    component: () => import('../views/Mh3gListView.vue'),
    meta: { title: '怪物图鉴' },
  },
  {
    path: '/mh3g/monsters/:slug',
    name: 'mh3g-detail',
    component: () => import('../views/Mh3gDetailView.vue'),
    meta: { title: '怪物详情' },
  },
  {
    path: '/mh3g/weapons',
    name: 'mh3g-weapons',
    component: () => import('../views/Mh3gWeaponsView.vue'),
    meta: { title: '武器' },
  },
  {
    path: '/mh3g/armor',
    name: 'mh3g-armor',
    component: () => import('../views/Mh3gArmorView.vue'),
    meta: { title: '防具' },
  },
  {
    path: '/mh3g/skills',
    name: 'mh3g-skills',
    component: () => import('../views/Mh3gSkillsView.vue'),
    meta: { title: '技能' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // 带 hash 的交给页面自己处理（素材区需要等异步数据）
    if (to.hash) return false
    return { top: 0 }
  },
})

export default router
