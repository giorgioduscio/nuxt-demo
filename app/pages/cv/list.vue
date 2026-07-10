<script setup lang="ts">
import type { CV } from './cv_schema'


definePageMeta({
  title: 'CV List',
  description: 'Lista dei CV',
  icon: 'file-text'
})

const router = useRouter()
const { data: cvs } = await useFetch<CV[]>('/api/cv', {
  default: () => []
})

// FILTRAGGIO
const searchQuery = ref('')
const filteredCvs = computed(() => {
  if (!searchQuery.value) return cvs.value
  return cvs.value.filter(cv => 
    cv.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// SELEZIONE MULTIPLA
const selectedCvs = ref<Set<number>>(new Set())

function toggleSelection(cvId: number) {
  if (selectedCvs.value.has(cvId)) {
    selectedCvs.value.delete(cvId)
  } else {
    selectedCvs.value.add(cvId)
  }
}

function isSelected(cvId: number) {
  return selectedCvs.value.has(cvId)
}

function clearSelection() {
  selectedCvs.value.clear()
}

const hasSelection = computed(() => selectedCvs.value.size > 0)

function goToMultiDelete() {
  const ids = Array.from(selectedCvs.value)
  router.push({
    path: '/cv/confirm_delete_multiple',
    query: { ids: ids.join(',') }
  })
}

async function addCv() {
  const new_cv_type ='minimale';
  
  try {
    // crea cv vuoto
    const new_cv: CV = {
      type: new_cv_type,
      title: 'document_' + Date.now(),
      subtitle: '',
      description: '',
      image: '',
      birth_date: '',
      email: Date.now() + '@example.com',
      phone: '',
      address: '',
      contacts: [],
      soft_skills: [],
      hobby: [],
      hard_skills: [],
      lenguages: [],
      experiences: []
    }
    // salva cv su db
    const result = await $fetch<CV>('/api/cv', {
      method: 'POST',
      body: new_cv
    })
    // aggiorna lista cv
    await refreshNuxtData()
    // naviga al cv appena creato
    router.push(`/cv/${new_cv_type}/${result.id}`)
    
  } catch (error) {
    console.error('Errore durante la creazione del CV:', error)
  }
}

onMounted(()=>{
  document.title = 'CV List';
})
</script>

<template>
  <!-- HEADER -->
  <div class="mb-3 text-bg-dark">
    <div class="py-2 container">
      <div class="d-flex justify-content-between align-items-center">
        <h1>CV List</h1>
        <button class="btn btn-primary" @click="()=>addCv()">
          <i class="bi bi-plus-lg"></i>
          <span class="ms-2 d-none d-md-inline">Aggiungi CV</span>
        </button>
      </div>
    </div>
  </div>
  
  <section class="container">
    <div class="row g-3">
      <!-- SEARCH -->
      <form @submit.prevent class="col-12 col-md-6">
        <label for="filter-search">Filtra per titolo</label>
  
        <div class="input-group">
          <input id="filter-search"
                 v-model.lazy.trim="searchQuery" 
                 type="text" 
                 class="form-control" 
                 placeholder="Es: Mario Rossi">
          <button class="btn btn-primary bi bi-search" type="submit"></button>
        </div>
      </form>

      <!-- TOOLBAR -->
      <div v-if="selectedCvs.size" class="col-12 col-md-6">
        <strong class="d-none d-md-inline">CV selezionati</strong>
        <div class="d-flex justify-content-between align-items-center">
          <span>{{ selectedCvs.size }} selezionati</span>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary btn-sm" @click="clearSelection" title="Deseleziona tutti">
              <i class="bi bi-x-lg"></i>
            </button>
            <button class="btn btn-danger btn-sm" @click="goToMultiDelete">
              <i class="bi bi-trash"></i> 
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CV CARDS -->
    <div class="pb-5 row g-3 justify-content-center">
      <div class="col-12">
        <div v-if="filteredCvs?.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle"></i>  Nessun CV trovato
        </div>
      </div>

      <div v-for="cv in filteredCvs" :key="cv.id" class="col-6 col-md-4 col-lg-3">
        <div class="text-bg-dark shadow rounded overflow-hidden position-relative">
          <!-- CHECKBOX -->
          <div class="position-absolute top-0 start-0 p-2 z-index-1">
            <input type="checkbox" 
                   :checked="cv.id !== undefined && isSelected(cv.id)"
                   @change="cv.id !== undefined && toggleSelection(cv.id)"
                   class="form-check-input"
                   style="transform: scale(1.3);">
          </div>

          <NuxtLink :to="`/cv/${cv.type}/${cv.id}?preview`">
            <img :src="`/cv_${cv.type}.webp`" alt="Tipo di cv" class="w-100">
          </NuxtLink>

          <div class="pt-5 w-100 position-absolute bottom-0 bg-gradient">
            <div class="p-2 d-flex justify-content-between">

              <h5 class="m-0 text-truncate">{{ cv.title }}</h5>
              <div class="dropdown">
                <button class="btn btn-sm btn-secondary" type="button" data-bs-toggle="dropdown">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="p-0 dropdown-menu overflow-hidden">
                  <li>
                    <NuxtLink class="dropdown-item text-bg-primary" 
                              :to="`/cv/${cv.type}/${cv.id}`">
                      <i class="bi bi-pencil"></i> Modifica
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink class="dropdown-item text-bg-danger" 
                              :to="`/cv/confirm_delete/${cv.id}`">
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


  </section>
</template>

<style scoped>
.bg-gradient {
  background: linear-gradient(to top, #000000cc, transparent) !important;
}
</style>
