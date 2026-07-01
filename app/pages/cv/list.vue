<script setup>
definePageMeta({
  title: 'CV List',
  description: 'Lista dei CV',
  icon: 'file-text'
})

const { data: cvs } = await useFetch('/api/cv')
const searchQuery = ref('')

const filteredCvs = computed(() => {
  if (!searchQuery.value) return cvs.value
  return cvs.value?.filter(cv => 
    cv.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  ) || []
})

onMounted(()=>{
  document.title = 'CV List';
})
</script>

<template>
  <div class="container mt-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>CV List</h1>
      <NuxtLink class="btn btn-success" to="/cv/create">Aggiungi CV</NuxtLink>
    </div>

    <!-- SEARCH -->
    <form @submit.prevent class="mb-3 mx-auto" style="max-width: 400px;">
      <label for="filter-search">Filtra per titolo</label>

      <div class="input-group">
        <input 
          id="filter-search"
          v-model.lazy.trim="searchQuery" 
          type="text" 
          class="form-control" 
          placeholder="Filtra per titolo..."
        >
        <button class="btn btn-primary" type="submit">Cerca</button>
      </div>
    </form>

    <!-- CV CARDS -->
    <div class="pb-5 row g-3">
      <div class="col-12">
        <div v-if="filteredCvs?.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle"></i>  Nessun CV trovato
        </div>
      </div>

      <div v-for="cv in filteredCvs" :key="cv.id" class="col-md-4 col-lg-3">
        <div class="text-bg-dark shadow rounded overflow-hidden position-relative">
          <img class="w-100" src="@/assets/modello_1.png" alt="Tipo di cv">

          <div class="pt-5 w-100 position-absolute bottom-0 bg-gradient">
            <div class="p-2 d-flex justify-content-between">

              <h5 class="m-0 text-truncate">{{ cv.title }}</h5>
              <div class="dropdown">
                <button class="btn btn-sm btn-secondary" type="button" data-bs-toggle="dropdown">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="p-0 dropdown-menu overflow-hidden">
                  <li>
                    <NuxtLink class="dropdown-item text-bg-primary" :to="`/cv/edit/${cv.id}`">
                      <i class="bi bi-pencil"></i> Modifica
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink class="dropdown-item text-bg-danger" :to="`/cv/confirm_delete/${cv.id}`">
                      <i class="bi bi-trash"></i> Cancella
                    </NuxtLink>
                  </li>
                </ul>
              </div>

            </div>
            
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
.bg-gradient {
  background: linear-gradient(to top, #000000cc, transparent) !important;
}
</style>