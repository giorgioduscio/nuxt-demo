<script setup>
const { $bootstrap } = useNuxtApp()
const routes = useRouter().getRoutes() .filter(route=>
  route.meta?.title && route.meta?.title!=="Home"
);

const closeOffcanvas =()=> {
  const offcanvasElement = document.getElementById('offcanvasNavbar')
  if (!offcanvasElement) return console.error('offcanvasElement non trovato');

  const offcanvas = $bootstrap.Offcanvas.getInstance(offcanvasElement)
  if (!offcanvas) return console.error('offcanvas non trovato');

  offcanvas.hide()
}
</script>
<template>
  <div style="padding-top: 2.8rem;">
    <nav class="p-0 navbar navbar-expand-sm fixed-top shadow bg-dark z-3" data-bs-theme="dark">
      <div class="container">

        <!-- BURGER BUTTON FOR OFFCANVAS (MOBILE ONLY) -->
        <button class="navbar-toggler d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- LOGO -->
        <NuxtLink class="navbar-brand"
                  to="/"
                  active-class="active"
                  :exact="true">
          <!-- <img alt="Logo dell'applicazione" height="40px" src="assets/angular_logo.png" /> -->
           <i class="bi bi-house"></i>
        </NuxtLink>

        <!-- OFFCANVAS PER MOBILE -->
        <div class="offcanvas offcanvas-start bg-dark text-white z-4"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menù</h5>
            <button type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav flex-grow-1">

              <li v-for="route in routes" :key="route.path" class="nav-item">
                  <NuxtLink class="nav-link text-white"
                            :to="route.path"
                            :class="{ active: route.active }"
                            :aria-current="route.active ? 'page' : null"
                            @click="closeOffcanvas()">
                            {{ route.meta?.title }}
                  </NuxtLink>
                </li>

              </ul>
          </div>
        </div>

        <!-- PROFILE LINK -->
        <NuxtLink to="/profile" class="nav-link text-white">
          <i class="bi bi-person-circle"></i>
          <span class="d-none d-md-inline">Profilo</span>
        </NuxtLink>

      </div>
    </nav>
  </div>
</template>
