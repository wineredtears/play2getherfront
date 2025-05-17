import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Threads from '../views/Threads.vue'
import Posts from '../views/Posts.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/category/:slug', name:'Threads', component: Threads },
    {
        path: '/thread/:id',
        name: 'Posts',
        component: Posts,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
