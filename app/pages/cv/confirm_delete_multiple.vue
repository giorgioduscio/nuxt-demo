<script setup>
const route = useRoute()
const router = useRouter()
const idsParam = route.query.ids
const cvTitles = ref([])
const loading = ref(true)

onMounted(async () => {
  if (!idsParam) {
    router.push('/cv/list')
    return
  }

  try {
    const ids = idsParam.toString().split(',').map(id => parseInt(id))
    
    // Fetch titles for all selected CVs
    const titles = await Promise.all(
      ids.map(async (id) => {
        try {
          const response = await $fetch(`/api/cv/${id}`)
          return response.title
        } catch (error) {
          console.error(`Errore durante il recupero del CV ${id}:`, error)
          return `CV ID: ${id}`
        }
      })
    )
    
    cvTitles.value = titles
  } catch (error) {
    console.error('Errore durante il recupero dei CV:', error)
  } finally {
    loading.value = false
  }
})

const description = computed(() => {
  if (loading.value) return 'Caricamento...'
  return `Sei sicuro di voler eliminare ${cvTitles.value.length} CV selezionati?`
})

async function deleteMultipleCVs() {
  try {
    const ids = idsParam.toString().split(',').map(id => parseInt(id))
    
    await $fetch('/api/cv/batch-delete', {
      method: 'POST',
      body: { ids }
    })
    
    router.push('/cv/list')
  } catch (error) {
    console.error('Errore durante l\'eliminazione multipla:', error)
  }
}
</script>

<template>
  <!-- LOADING -->
  <div v-if="loading" class="mt-5 container">
    <div class="card">
      <div class="card-body text-bg-dark">
        <p>Caricamento...</p>
      </div>
    </div>
  </div>

  <!-- CONFIRM -->
  <Confirm v-else
          title="Elimina CV Multipli"
          :description="description"
          type="danger"
          btn_confirm_label="Elimina"
          :action="deleteMultipleCVs">
          
    <template #extra-content>
      <div class="mt-3">
        <h6>CV da eliminare:</h6>
        <ul class="list-unstyled">
          <li v-for="(title, index) in cvTitles" :key="index" class="mb-1">
            <i class="bi bi-file-text"></i> {{ title }}
          </li>
        </ul>
      </div>
    </template>

  </Confirm>
</template>
