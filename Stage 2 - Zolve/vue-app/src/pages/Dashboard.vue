<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { logout } from '../utils/auth'
import { getTickets } from '../utils/tickets'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const stats = ref({ total: 0, open: 0, in_progress: 0, closed: 0 })

onMounted(() => {
  try {
    const tickets = getTickets()
    stats.value = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length
    }
  } catch (e) {
    toast.error('Failed to load tickets. Please retry.')
  }
})

const handleLogout = () => {
  logout()
  toast.success('Logged out successfully')
  router.push('/')
}
</script>

<template>
  <div class="container" style="padding: 3rem 0; position: relative;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="btn btn-danger">Logout</button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
      <div class="card"><h3>Total Tickets</h3><p style="font-size: 2rem; font-weight: bold;">{{ stats.total }}</p></div>
      <div class="card"><h3>Open</h3><p style="font-size: 2rem; color: var(--green);">{{ stats.open }}</p></div>
      <div class="card"><h3>In Progress</h3><p style="font-size: 2rem; color: var(--amber);">{{ stats.in_progress }}</p></div>
      <div class="card"><h3>Closed</h3><p style="font-size: 2rem; color: var(--gray);">{{ stats.closed }}</p></div>
    </div>

    <RouterLink to="/tickets" style="display: inline-block;">
      <button class="btn btn-primary">Manage Tickets →</button>
    </RouterLink>
    <div class="circle circle-1" style="top: -50px; left: -50px; width: 200px; height: 200px;"></div>
    <div class="circle circle-2" style="bottom: -50px; right: -50px; width: 150px; height: 150px;"></div>
  </div>
  <footer>© 2025 Zolve. All rights reserved.</footer>
</template>