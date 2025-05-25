import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WelcomeView,
    },

    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
    },
  ],
})

export default router
