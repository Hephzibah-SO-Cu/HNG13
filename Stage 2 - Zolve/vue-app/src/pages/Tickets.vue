<script setup>
import { ref, onMounted } from 'vue'
import { getTickets, saveTickets, validateTicket } from '../utils/tickets'
import { useToast } from 'vue-toastification'

const toast = useToast()
const tickets = ref([])
const form = ref({ title: '', description: '', status: 'open', priority: 'medium' })
const editingId = ref(null)
const errors = ref({})

onMounted(() => {
  try {
    tickets.value = getTickets()
  } catch (e) {
    toast.error('Failed to load tickets. Please retry.')
  }
})

const handleSubmit = () => {
  const { isValid, errors: validationErrors } = validateTicket(form.value)
  if (!isValid) {
    errors.value = validationErrors
    toast.error('Please fix form errors')
    return
  }
  if (form.value.description.length > 500) {
    errors.value = { description: 'Description too long (max 500 chars)' }
    toast.error('Please fix form errors')
    return
  }

  let updated
  if (editingId.value) {
    updated = tickets.value.map(t => t.id === editingId.value ? { ...t, ...form.value } : t)
    toast.success('Ticket updated!')
  } else {
    updated = [...tickets.value, { ...form.value, id: Date.now() }]
    toast.success('Ticket created!')
  }
  tickets.value = updated
  saveTickets(updated)
  resetForm()
}

const resetForm = () => {
  form.value = { title: '', description: '', status: 'open', priority: 'medium' }
  editingId.value = null
  errors.value = {}
}

const handleEdit = (ticket) => {
  form.value = { ...ticket }
  editingId.value = ticket.id
}

const handleDelete = (id) => {
  if (confirm('Delete this ticket?')) {
    const updated = tickets.value.filter(t => t.id !== id)
    tickets.value = updated
    saveTickets(updated)
    toast.success('Ticket deleted')
  }
}

const capitalize = (str) => str.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
</script>

<template>
  <div class="container" style="padding: 3rem 0; position: relative;">
    <h1 style="margin-bottom: 3rem;">Ticket Management</h1>

    <div class="card" style="margin: 3rem 0;">
      <h2>{{ editingId ? 'Edit' : 'Create' }} Ticket</h2>
      <form @submit.prevent="handleSubmit">
        <input placeholder="Title" v-model="form.title" />
        <p v-if="errors.title" style="color: red; font-size: 0.875rem;">{{ errors.title }}</p>
        <textarea placeholder="Description (optional)" v-model="form.description"></textarea>
        <p v-if="errors.description" style="color: red; font-size: 0.875rem;">{{ errors.description }}</p>
        <select v-model="form.status">
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <p v-if="errors.status" style="color: red; font-size: 0.875rem;">{{ errors.status }}</p>
        <select v-model="form.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'Create' }}</button>
          <button v-if="editingId" type="button" @click="resetForm" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div v-for="ticket in tickets" :key="ticket.id" class="card ticket-card">
        <div>
          <h3>{{ ticket.title }}</h3>
          <p>{{ ticket.description }}</p>
          <span :class="`status status-${ticket.status}`">{{ capitalize(ticket.status) }}</span>
          <span :class="`priority priority-${ticket.priority}`" style="margin-left: 1rem;">{{ capitalize(ticket.priority) }}</span>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button @click="handleEdit(ticket)" class="btn btn-secondary">Edit</button>
          <button @click="handleDelete(ticket.id)" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
    <div class="circle circle-1" style="top: auto; bottom: -100px; left: -50px; width: 200px; height: 200px;"></div>
    <div class="circle circle-2" style="top: 50%; right: -50px; width: 150px; height: 150px;"></div>
  </div>
  <footer>© 2025 Zolve. All rights reserved.</footer>
</template>