<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="hero">
    <div class="container" style="position: relative; z-index: 1;">
      <h1>Zolve</h1>
      <h2>Support, Solved</h2>
      <p>Ditch the chaotic inbox. Zolve brings all your customer requests into one smart, streamlined helpdesk so you can deliver fast, exceptional support with ease.</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <RouterLink to="/auth/login"><button class="btn btn-primary">Login</button></RouterLink>
        <RouterLink to="/auth/signup"><button class="btn btn-secondary">Get Started</button></RouterLink>
      </div>
    </div>
    <img src="/shared/wave.svg" alt="Wavy background" class="wave" />
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
  </div>
  <footer>© 2025 Zolve. All rights reserved.</footer>
</template>