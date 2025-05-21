<template xmlns="http://www.w3.org/1999/html">
  <div class="post-list">
    <h2>Posts in {{ threadName }}</h2>
    <p>By {{ threadAuthor }}</p>
    <button type="button" id="deleteThreadButton" @click="deleteThread" hidden="true"> Delete thread </button>
    <br>
    <br>

    <div v-if="loading">Loading posts...</div>
    <div v-else-if="posts.length === 0">No posts found.</div>

    <ul>
      <li v-for="post in posts" :key="post.id" class="post-item">
        <strong>{{ post.authorName }}</strong> says:<br>
        {{ post.content }}<br>
        <button type="button" id="deletePostButton" @click="deletePost(post.id)" v-if="post.userId === currentUserId" > Delete post </button>
        <br>
        <small>Posted at: {{ new Date(post.createdAt).toLocaleString() }}</small>
      </li>
    </ul>
    <div class="create-post-form">
      <h3>Reply to thread</h3>
      <form @submit.prevent="createPost">

        <div>
          <textarea type="textarea" v-model="newPostContent" id="newPostContent" required/>
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
import {AUTH_TOKEN, CURRENT_USER_ID} from "@/constants/localStorage.js";
import router from "@/router/index.js";

const route = useRoute()
const threadId = ref(Number(route.params.id))

const posts = ref([])
const loading = ref(true)
const threadName = ref(null)
const threadAuthor = ref(null)
const myThreadId = threadId.value;
const currentUserId = parseInt(localStorage.getItem(CURRENT_USER_ID));


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
const newPostContent = ref('');

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


const checkThreadOwnership = async () =>
{
  const currentUser = await axios.get('http://play2gether.local/api/user', {
    withCredentials: true, // Important for Laravel Sanctum
    headers: {Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`}
  });
  const threadsResponse = await axios.get('http://play2gether.local/api/threads')
  const threads = threadsResponse.data.data


  // Find the thread matching the threadId from the route
  const thread = threads.find(t => t.id === threadId.value)

  console.log(currentUser.data.id, " ", thread.userId);

  if (thread.userId === currentUser.data.id) {
    document.getElementById("deleteThreadButton").hidden = false;
  }
  else document.getElementById("deleteThreadButton").hidden = true;
}
const deleteThread = async () => {
  const response = await axios.delete(`http://play2gether.local/api/threads/${threadId.value}`, {
    withCredentials: true, // Important for Laravel Sanctum
    headers: {Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`}
  });
  router.go(-1);
}
const deletePost = async (id) => {
  console.log("Post id to delete: ", id)
  const response = await axios.delete(`http://play2gether.local/api/posts/${id}`, {
    withCredentials: true, // Important for Laravel Sanctum
    headers: {Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`}
  });
  window.location.reload();
}
onMounted(() => {
  fetchThreadAndAuthor();
  fetchPosts();
  checkThreadOwnership();
})

// If route param changes (e.g. user navigates to another thread)
watch(() => route.params.id, (newId) => {
  threadId.value = Number(newId)
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
  list-style-type: none;
  background-color: #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
  transition: background-color 0.2s;
}
.create-post-form {
  margin: 2rem;
  padding: 1.5rem;
  border: 1px solid #d1d5db;
  width: 74%;
  background-color: #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
  transition: background-color 0.2s;
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
