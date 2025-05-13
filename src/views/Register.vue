<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Name:</label>
        <input v-model="form.name" type="text" required />
        <span v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div>
        <label>Email:</label>
        <input v-model="form.email" type="email" required />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>

      <div>
        <label>Confirm Email:</label>
        <input v-model="form.confirmEmail" type="email" required />
        <span v-if="errors.confirmEmail">{{ errors.confirmEmail }}</span>
      </div>

      <div>
        <label>Password:</label>
        <input v-model="form.password" type="password" required />
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>

      <div>
        <label>Confirm Password:</label>
        <input v-model="form.confirmPassword" type="password" required />
        <span v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
      </div>

      <button type="submit">Register</button>
    </form>

    <p v-if="success" style="color: green;">Registration successful!</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

const form = reactive({
  name: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({})
const success = ref(false)

const register = async () => {
  errors.name = ''
  errors.email = ''
  errors.confirmEmail = ''
  errors.password = ''
  errors.confirmPassword = ''
  success.value = false

  try {
    await axios.post('http://play2gether.local/api/auth/register', form)
    success.value = true
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const responseErrors = error.response.data.errors
      for (const key in responseErrors) {
        errors[key] = responseErrors[key][0]
      }
    } else {
      alert('An error occurred. Please try again.')
    }
  }
}
</script>

<style scoped>
.register-container {
  margin-left: 20%;
  padding: 1rem;
  width: 40%;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 5px;
}

span {
  color: red;
  font-size: 0.9em;
}
</style>
