<template>
  <div class="flex flex-col items-center">
    <h1 class="text-6xl font-bold text-blue-700">404</h1>
    <p class="my-2 text-xl">Sorry, this page does not exist.</p>
    <p class="my-2 text-xl">How'd you get here, anyway?</p>
    <router-link :to="{ name: 'home' }" class="hover:bg-blue-500 bg-blue-400"> Take me home </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFound',
})
</script>

<route>
name: not-found
</route>
