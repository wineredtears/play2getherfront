<template>
  <div class="login-container">
    <div class="login-page">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Username:</label>
          <input v-model="username" type="text" id="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <div class="register-link">
        <p>Don't have an account?</p>
        <router-link to="/register" class="register-button">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from "axios"

const username = ref('')
const password = ref('')

async function handleLogin() {
  try {
    const response = await axios.post('http://play2gether.local/api/auth/login', {
      name: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    })

    console.log('Login response:', response)

    if (response.status === 204) {
      localStorage.setItem('auth-user', username.value)
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
    alert('Login failed. Please check your credentials.')
  }
}
</script>

<style scoped>
/* Full-screen flexbox container */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  width: 80%;
  background-color: #e2e8f0; /* Optional background */
}

.login-page {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;

}
.register-link {
  margin-top: 1rem;
  text-align: center;
}

.register-button {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>