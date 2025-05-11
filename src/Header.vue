<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/">Home</router-link>
    </nav>
    <p class="user-status">
      {{ isLoggedIn ? `Logged in as ${username}` : 'Not logged in' }}
    </p>
    <router-link to="/login">
      <button class="login-button">Login/logout</button>
    </router-link>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')
const isLoggedIn = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('auth-user')
  if (stored) {
    username.value = stored
    isLoggedIn.value = true
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b; /* dark background */
  color: white;
  padding: 1rem 2rem;
  width: 80%;
}

.nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: white;
}

.login-button {
  background-color: #3b82f6;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
