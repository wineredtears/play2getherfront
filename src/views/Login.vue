<template>
  <div class="home col-5 mx-auto py-5 mt-5">
    <h1 class="text-center">Login</h1>
    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <label for="name">Name:</label>
          <input
              type="text"
              v-model="form.name"
              class="form-control"
              id="name"
          />
          <span class="text-danger" v-if="errors.name">
            {{ errors.name[0] }}
          </span>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
              type="password"
              v-model="form.password"
              class="form-control"
              id="password"
          />
          <span class="text-danger" v-if="errors.password">
            {{ errors.password[0] }}
          </span>
        </div>
        <button @click.prevent="login" class="btn btn-primary btn-block">
          Login
        </button>
      </div>
    </div>
    <div class="register-link">
      <p>Don't have an account?</p>
      <router-link to="/register" class="register-button">Register</router-link>
    </div>
  </div>
</template>
<script>
import User from "../apis/User";
import {AUTH_TOKEN, IS_AUTHENTICATED} from "@/constants/localStorage.js";
export default {
  data() {
    return {
      form: {
        name: "",  // Change email to name
        password: ""
      },
      errors: []
    };
  },
  methods: {
    login() {
      // Sending name and password in the login request
      User.login(this.form)
          .then((response) => {
            this.$root.$emit("login", true);
            localStorage.setItem(IS_AUTHENTICATED, "true");
            localStorage.setItem(AUTH_TOKEN, response.data.token)

            window.postMessage('auth-action')
            this.$router.push({ name: "Home" });
          })
          .catch(error => {
            if (error.response.status === 422) {
              this.errors = error.response.data.errors;
            }
          });
    }
  }
};
</script>

