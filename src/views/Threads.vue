<template>
  <div class="thread-list">
    <h2>Threads in {{ categoryName || categorySlug }}</h2>
    <br>

    <div v-if="loading">Loading threads...</div>
    <div v-else-if="threads.length === 0">No threads found.</div>

    <ul>
      <li v-for="thread in threads" :key="thread.id" class="thread-item">
        <router-link :to="`/thread/${thread.id}`" class="thread-link">
          <strong>{{ thread.name }}</strong>
        </router-link><br>
        Posted by: {{ thread.authorName }}<br>
        Posts: {{ thread.postCount }}<br>
        Created at: {{ new Date(thread.createdAt).toLocaleString() }}
      </li>
    </ul>
    <!-- Create New Thread Form -->
    <div class="create-thread-form">
      <h3>Create a New Thread</h3>
      <form @submit.prevent="createThread">

        <div>
          <label for="threadName">Thread Name:</label>
          <input type="text" v-model="newThreadName" id="threadName" required />
        </div>
        <button type="submit" :disabled="loading">Create Thread</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Cookie from 'js-cookie';
import Csrf from "@/apis/Csrf.js";
import {AUTH_TOKEN} from "@/constants/localStorage.js";

const route = useRoute()
const categorySlug = ref(route.params.slug)

const threads = ref([])
const loading = ref(true)

const categoryName = ref(null)
const myCategoryId = ref(null)

const fetchCategoryName = async () => {
  try {
    const response = await axios.get('http://play2gether.local/api/categories')
    const categories = response.data.data
    const matched = categories.find(cat => cat.slug === categorySlug.value)
    categoryName.value = matched ? matched.name : null
    myCategoryId.value = matched ? matched.id : null
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchThreads = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://play2gether.local/api/categories/${categorySlug.value}/threads`)
    const rawThreads = response.data.data

    // Fetch user names
    const enrichedThreads = await Promise.all(
        rawThreads.map(async thread => {
          try {
            const userRes = await axios.get(`http://play2gether.local/api/user/${thread.userId}`)
            thread.authorName = userRes.data.data.name
          } catch {
            thread.authorName = 'Unknown'
          }
          return thread
        })
    )

    threads.value = enrichedThreads
  } catch (error) {
    console.error('Failed to fetch threads:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchThreads)

// Re-fetch if route param changes
watch(() => route.params.slug, (newSlug) => {
  categorySlug.value = newSlug
  fetchThreads()
})

onMounted(() => {
  fetchCategoryName()
  fetchThreads()
})

watch(() => route.params.slug, (newSlug) => {
  categorySlug.value = newSlug
  fetchCategoryName()
  fetchThreads()
})
const newThreadName = ref('')
// Create a new thread

// Function to create a new thread
    const createThread = async () => {
      // Ensure the CSRF cookie is set before proceeding
      //await Csrf.getCookie();
      try {
        // Get the CSRF token from the cookie
        //const csrfToken = Csrf.getCookie();
        // Make the API request to create the thread
        const response = await axios.post('http://play2gether.local/api/threads', {
          categoryId: myCategoryId.value,  // Replace with dynamic category ID if necessary
          name: newThreadName.value
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
          }
        });

        // Handle the successful response
        console.log('Thread created successfully:', response.data);
        console.log(response.data.data.id)

        // Reset the input field after creating the thread
        newThreadName.value = '';
        //await this.router.push({ name: 'Posts', params: { id: response.data.id } })
        window.location.reload();

      } catch (error) {
        console.error('Failed to create the thread:', error);
      }
    };

    // Once the thread is created, add it to the threads list or refetch threads
    //const newThread = response.data.data
    //threads.value.push(newThread)

    // Clear the input field after submitting
    newThreadName.value = '';
</script>

<style scoped>
.thread-list {
  padding: 1.5rem;
  list-style-type: none;
}
.thread-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  width: 75%;
  list-style-type: none;
  background-color: #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
  transition: background-color 0.2s;
}
.create-thread-form {
  margin: 2rem;
  padding: 2rem;
  border: 1px solid #d1d5db;
  background-color: #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 60%
}

.create-thread-form form {
  display: flex;
  flex-direction: column;
}

.create-thread-form label {
  margin-bottom: 0.5rem;
}

.create-thread-form input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.create-thread-form button {
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-thread-form button:disabled {
  background-color: #ccc;
}
</style>
