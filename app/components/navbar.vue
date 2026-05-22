<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <NuxtLink class="navbar-brand fw-bold" to="/">Nuxt Todo</NuxtLink>
      <div class="navbar-nav ms-auto">
        <NuxtLink class="nav-link" to="/" active-class="active">Home</NuxtLink>
        <NuxtLink class="nav-link" to="/todos" active-class="active">Todos</NuxtLink>
      </div>
    </div>
  </nav>
</template>
