<script setup lang="ts">
import type { CV } from './cv_schema'
import { agree, toast } from '../../../tools/feedbacksUI'


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
const multiSelection = {
  selectedCvs: ref<Set<number>>(new Set()),
  
  toggle(cvId: number) {
    if (this.selectedCvs.value.has(cvId)) {
      this.selectedCvs.value.delete(cvId)
    } else {
      this.selectedCvs.value.add(cvId)
    }
  },
  
  isSelected(cvId: number) {
    return this.selectedCvs.value.has(cvId)
  },
  
  clear() {
    this.selectedCvs.value.clear()
  },
  
  async delete() {
    try {
      const ids = Array.from(this.selectedCvs.value)
      
      // Fetch titles for all selected CVs
      const titles = await Promise.all(
        ids.map(async (id) => {
          try {
            const response = await $fetch<CV>(`/api/cv/${id}`)
            return response?.title || `CV ID: ${id}`
          } catch (error) {
            console.error(`Errore durante il recupero del CV ${id}:`, error)
            return `CV ID: ${id}`
          }
        })
      )
      
      const titlesList = titles.map(t => `'${t}'`).join(', ')
      const confirmed = await agree.danger(`Sei sicuro di voler eliminare ${titlesList}?`, 'Elimina')
      if (!confirmed) return;
      
      await $fetch('/api/cv/batch-delete', {
        method: 'POST',
        body: { ids }
      })
      
      this.clear()
      await refreshNuxtData()
      toast.success('CV eliminati')
    
    } catch (error) {
      console.error('Errore durante l\'eliminazione multipla:', error)
    }
  }
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
    toast.success('CV creato')
    // naviga al cv appena creato
    router.push(`/cv/${new_cv_type}/${result.id}`)
    
  } catch (error) {
    console.error('Errore durante la creazione del CV:', error)
  }
}

async function deleteSingleCV(cvId: number) {
  try {
    const response = await $fetch<CV>(`/api/cv/${cvId}`)
    if (!response) return console.error('CV non trovato')
    
    const title = response.title || `CV ${cvId}`
    
    const confirmed = await agree.danger(`Sei sicuro di voler eliminare '${title}'?`, 'Elimina')
    if (!confirmed) return console.error('Eliminazione annullata');
    
    await $fetch(`/api/cv/${cvId}`, {
      method: 'DELETE'
    })
    await refreshNuxtData()
    toast.success('CV eliminato')
    
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error)
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
      <div v-if="multiSelection.selectedCvs.value.size" class="col-12 col-md-6">
        <strong class="d-none d-md-inline">CV selezionati</strong>
        <div class="d-flex justify-content-between align-items-center">
          <span>{{ multiSelection.selectedCvs.value.size }} selezionati</span>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary btn-sm" @click="multiSelection.clear" title="Deseleziona tutti">
              <i class="bi bi-x-lg"></i>
            </button>
            <button class="btn btn-danger btn-sm" @click="multiSelection.delete">
              <i class="bi bi-trash"></i> 
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CV CARDS -->
    <div class="py-3 row g-3 justify-content-center">
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
                   :checked="cv.id !== undefined && multiSelection.isSelected(cv.id)"
                   @change="cv.id !== undefined && multiSelection.toggle(cv.id)"
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
                    <button class="dropdown-item text-bg-danger" 
                            @click="cv.id !== undefined && deleteSingleCV(cv.id)">
                      <i class="bi bi-trash"></i> Cancella
                    </button>
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

