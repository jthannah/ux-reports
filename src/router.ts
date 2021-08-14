import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

export default router
