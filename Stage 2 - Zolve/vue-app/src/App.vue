<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from './utils/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const auth = ref(isAuthenticated())
const menuOpen = ref(false)

const handleLogout = () => {
  logout()
  auth.value = false
  toast.success('Logged out successfully')
  router.push('/')
  menuOpen.value = false
}

onMounted(() => {
  const handleAuthChange = () => {
    auth.value = isAuthenticated()
  }
  window.addEventListener('authChange', handleAuthChange)
  window.addEventListener('storage', handleAuthChange)
})
</script>

<template>
  <header style="background: #1f2937; color: white; padding: 1rem;">
    <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
      <router-link to="/"><h2>Zolve</h2></router-link>
      <div class="hamburger" @click="menuOpen = !menuOpen">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav :class="['nav-menu', { open: menuOpen }]">
        <template v-if="auth">
          <router-link to="/dashboard" class="nav-link" @click="menuOpen = false">Dashboard</router-link>
          <router-link to="/tickets" class="nav-link" @click="menuOpen = false">Tickets</router-link>
          <button @click="handleLogout" class="btn btn-danger">Logout</button>
        </template>
        <template v-else>
          <router-link to="/auth/login" class="nav-link" @click="menuOpen = false">Login</router-link>
          <router-link to="/auth/signup" class="nav-link" @click="menuOpen = false">Signup</router-link>
        </template>
      </nav>
    </div>
  </header>
  <router-view></router-view>
</template>