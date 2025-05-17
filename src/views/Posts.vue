<template>
  <div class="post-list">
    <h2>Posts in {{ threadName }}</h2>
    <p>By {{ threadAuthor }}</p>
    <br>

    <div v-if="loading">Loading posts...</div>
    <div v-else-if="posts.length === 0">No posts found.</div>

    <ul>
      <li v-for="post in posts" :key="post.id" class="post-item">
        <strong>{{ post.authorName }}</strong> says:<br>
        {{ post.content }}<br>
        <small>Posted at: {{ new Date(post.createdAt).toLocaleString() }}</small>
      </li>
    </ul>
    <div class="create-post-form">
      <h3>Reply to thread</h3>
      <form @submit.prevent="createPost">

        <div>
          <textarea type="textarea" v-model="newPostContent" id="postContent" required />
        </div>
        <button type="submit" :disabled="loading">Create Post</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import {AUTH_TOKEN} from "@/constants/localStorage.js";

const route = useRoute()
const threadId = ref(Number(route.params.id))

const posts = ref([])
const loading = ref(true)
const threadName = ref(null)
const threadAuthor = ref(null)
const myThreadId = threadId.value;

const fetchThreadAndAuthor = async () => {
  try {
    // Fetch all threads
    const threadsResponse = await axios.get('http://play2gether.local/api/threads')
    const threads = threadsResponse.data.data

    // Find the thread matching the threadId from the route
    const thread = threads.find(t => t.id === threadId.value)

    if (thread) {
      threadName.value = thread.name

      // Fetch the user (author) details using the userId from the thread
      const userId = thread.userId
      const userResponse = await axios.get(`http://play2gether.local/api/user/${userId}`)
      threadAuthor.value = userResponse.data.data.name
    }

  } catch (error) {
    console.error('Failed to fetch thread or author:', error)
  } finally {
    loading.value = false
  }
}


const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://play2gether.local/api/threads/${threadId.value}/posts`)
    const rawPosts = response.data.data

    // Fetch user names
    const enrichedPosts = await Promise.all(
        rawPosts.map(async post => {
          try {
            const userRes = await axios.get(`http://play2gether.local/api/user/${post.userId}`)
            post.authorName = userRes.data.data.name
          } catch {
            post.authorName = 'Unknown'
          }
          return post
        })
    )

    posts.value = enrichedPosts
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
}
const newPostContent = ref('')
// Create a new thread

// Function to create a new thread
const createPost = async () => {
  // Ensure the CSRF cookie is set before proceeding
  //await Csrf.getCookie();
  try {
    // Get the CSRF token from the cookie
    //const csrfToken = Csrf.getCookie();
    // Make the API request to create the thread
    const response = await axios.post('http://play2gether.local/api/posts', {
      threadId: myThreadId, // Replace with dynamic category ID if necessary
      content: newPostContent.value
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
      }
    });

    // Handle the successful response
    console.log('Post created successfully:', response.data);

    // Reset the input field after creating the thread
    newPostContent.value = '';
    window.location.reload();
  } catch (error) {
    console.error('Failed to create the post:', error);
  }
};

newPostContent.value = '';

onMounted(() => {
  fetchThreadAndAuthor()
  fetchPosts()
})

// If route param changes (e.g. user navigates to another thread)
watch(() => route.params.id, (newId) => {
  threadId.value = Number(newId)
  fetchThreadName()
  fetchPosts()
})
</script>

<style scoped>
.post-list {
  padding: 1.5rem;
  list-style-type: none;
}
.post-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  width: 75%;
  border-radius: 8px;
  list-style-type: none;
}
.create-post-form {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 60%
}

.create-post-form form {
  display: flex;
  flex-direction: column;
}

.create-post-form label {
  margin-bottom: 0.5rem;
}

.create-post-form textarea {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width:100%
}

.create-post-form button {
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-post-form button:disabled {
  background-color: #ccc;
}
</style>
