<template>
  <div class="home-container">
    <h2>Games</h2>
    <br>

    <div v-if="loading">Loading categories...</div>
    <div v-else-if="categories.length === 0">No categories found.</div>
    <ul class="category-list">
      <li v-for="category in categories" :key="category.slug">
        <router-link :to="`/category/${category.slug}`" class="category-link">
          {{ category.name }} ({{ category.threadCount }} threads)
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

/**
 * @typedef {Object} Category
 * @property {string} slug
 * @property {string} name
 * @property {number} threadCount
 * @property {number} userId
 * @property {string|null} createdAt
 */

// Tell Vue/IDE what kind of array this is
/** @type {import('vue').Ref<Category[]>} */
const categories = ref([])
const loading = ref(true)

onMounted(async () => {

  try {
    axios.defaults.withCredentials = true
    const response = await axios.get('http://play2gether.local/api/categories')
    categories.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
})
</script>


<style scoped>
.home-container {
  padding: 2rem;
}

.category-list {
  list-style: none;
  padding: 0;
}

.category-link {
  display: block;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 75%;
}

.category-link:hover {
  background-color: #d1d5db;
}
</style>
