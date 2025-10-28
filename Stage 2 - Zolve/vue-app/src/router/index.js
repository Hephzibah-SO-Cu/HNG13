// vue-app/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/Landing.vue'
import Login from '../pages/auth/Login.vue'
import Signup from '../pages/auth/Signup.vue'
import Dashboard from '../pages/Dashboard.vue'
import Tickets from '../pages/Tickets.vue'
import { isAuthenticated } from '../utils/auth'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/auth/signup', name: 'Signup', component: Signup },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/tickets', name: 'Tickets', component: Tickets, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Don't import/use useToast() here — that must run inside a component setup.
// Instead we set a short-lived flag that Login.vue will read and display.
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // set a short-lived notice; Login.vue will consume and remove it.
    localStorage.setItem('auth_notice', JSON.stringify({ message: 'Your session has expired — please log in again.' }));
    next('/auth/login')
  } else {
    next()
  }
})

export default router
