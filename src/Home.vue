<template>
  <header>
    <title2>"Hello world!"</title2>
    <button @click="getTopics">FUCK</button>
  </header>
  <div class="app">
    <Header />
    <main class="content">
      <router-view /> <!-- this shows your page content -->
    </main>
  </div>
  <main>

  </main>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import axios from "axios";
import Header from './Header.vue'

const getTopics = async ()=>{
  console.log((await axios.get('http://play2gether.local/api/categories/', {
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
    }
  })).data)
}
</script>

<style scoped>
header {
  line-height: 1.5;
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
