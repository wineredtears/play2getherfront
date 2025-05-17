<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/">Home</router-link>
    </nav>
    <p class="user-status">
      {{ isLoggedIn ? `Logged in as ${username}` : 'Not logged in' }}
    </p>
    <div>
      <router-link v-if="!isLoggedIn" to="/login">
        <button class="login-button">Login</button>
      </router-link>
      <button v-else @click="logout" class="login-button">Logout</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Csrf from "@/apis/Csrf.js";
import axios from "axios";
import {AUTH_TOKEN, IS_AUTHENTICATED} from "@/constants/localStorage.js";
import Router from "@/router/index.js";

const username = ref('')
const isLoggedIn = ref(false)
const router = useRouter()

const checkLogin = async () => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  if (!authToken) {
    fail();
  }

  try {
    // Ensure CSRF cookie is set (only needed if not already)
    await Csrf.getCookie();

    const response = await axios.get('http://play2gether.local/api/user', {
      withCredentials: true, // Important for Laravel Sanctum
      headers: {Authorization: `Bearer ${authToken}`}
    });

    username.value = response.data.name || response.data.username || 'User';
    isLoggedIn.value = true;

  } catch (error) {
    console.error('Not authenticated:', error.response?.data || error.message);
    fail();
  }
};

const fail = () => {
  isLoggedIn.value = false;
  username.value = '';
}

const logout = async () => {
  axios.post('http://play2gether.local/api/auth/logout', null,{
    withCredentials: true, // Important for Laravel Sanctum
    headers: {Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`}
  }).then(()=>{
    isLoggedIn.value = false;
    username.value = '';
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(IS_AUTHENTICATED);

    router.push('/login');
  })
}

window.addEventListener(
    "message",
    (event) => {
      if (event.data !== 'auth-action') return;

      console.log(event);
      checkLogin()
    },
    false,
);

onMounted(() => {
  checkLogin()
})

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
