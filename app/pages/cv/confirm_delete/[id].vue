<script setup>
const route = useRoute()
const router = useRouter()
const id = route.params.id
const cv_title = ref('')

onMounted(async () => {
  try {
    const response = await $fetch(`/api/cv/${id}`)
    cv_title.value = response.title
  } catch (error) {
    console.error('Errore durante il recupero del CV:', error)
  }
})
const description = computed(() => `Sei sicuro di voler eliminare '${cv_title.value || id}'?`)

async function deleteCV() {
  try {
    await $fetch(`/api/cv/${id}`, {
      method: 'DELETE'
    })
    router.push('/cv/list')
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error)
  }
}
</script>

<template>
  <Confirm
    title="Elimina CV"
    :description=description
    type="danger"
    btn_confirm_label="Elimina"
    :action="deleteCV"
  />
</template>
