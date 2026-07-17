<script setup lang="ts">
import customstyle from './assets/styles'

onMounted(()=>{
  document.title = 'CV Manager'
  customstyle()
})
</script>
<style lang="sass">
.layout
    min-height: 100vh
    background: linear-gradient(135deg, #333, #764ba2)
    display: flex
    flex-direction: column

main
    flex: 1

</style>
<template>
  <div class="layout text-white">
    <Navbar />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>