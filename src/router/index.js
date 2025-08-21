import { createRouter, createWebHistory } from 'vue-router'
import loginView from '../views/LoginView.vue'
import searchView from '../views/SearchView.vue'
import usersView from '../views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginView,
    },
    {
      path: '/search',
      name: 'search',
      component: searchView,
    },
    {
      path: '/users',
      name: 'users',
      component: usersView,
    },
  ],
})

export default router
