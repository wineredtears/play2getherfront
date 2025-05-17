import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import router from './router'
import axios from "axios";

createApp(App)
    .use(router)
    .mount('#app')

axios.defaults.baseURL = 'http://play2gether.local'
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

