<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signup, login } from '../../utils/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const form = ref({ email: '', password: '' })
const errors = ref({})

const validateForm = () => {
  const newErrors = {}
  if (!form.value.email.trim()) newErrors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) newErrors.email = 'Invalid email format'
  if (!form.value.password.trim()) newErrors.password = 'Password is required'
  else if (form.value.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    toast.error('Please fix form errors')
    return
  }
  const result = signup(form.value.email, form.value.password)
  if (result.success) {
    login(form.value.email, form.value.password)
    toast.success('Signup successful!')
    router.push('/dashboard')
  } else {
    toast.error(result.error)
    errors.value.general = result.error
  }
}
</script>

<template>
  <div class="container" style="max-width: 400px; margin: 4rem auto;">
    <div class="card">
      <h2>Sign Up for Zolve</h2>
      <form @submit.prevent="handleSubmit">
        <input type="email" placeholder="Email" v-model="form.email" />
        <p v-if="errors.email" style="color: red; font-size: 0.875rem;">{{ errors.email }}</p>
        <input type="password" placeholder="Password" v-model="form.password" />
        <p v-if="errors.password" style="color: red; font-size: 0.875rem;">{{ errors.password }}</p>
        <p v-if="errors.general" style="color: red;">{{ errors.general }}</p>
        <button type="submit" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px;">
          Sign Up
        </button>
      </form>
      <p style="text-align: center; margin-top: 1rem;">
        <RouterLink to="/auth/login">Already have an account? Login</RouterLink>
      </p>
    </div>
  </div>
</template>