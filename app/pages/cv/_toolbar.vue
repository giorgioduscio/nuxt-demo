<script setup lang="ts">
interface Props {
  isPreview: boolean
  form: any
  cvId: string
}

const props = defineProps<Props>()

const printCV = () => {
  window.print()
}
</script>

<template>
  <div data-toolbar class="sticky-top py-2 text-bg-light shadow-sm" style="top: 3.5rem">
    <div class="px-2 d-flex gap-1 align-items-center">
        
      <NuxtLink :to="'/cv/list'" class="p-1 btn btn-sm btn-outline-dark">
        <i class="bi bi-chevron-left me-1"></i> 
        <span class="d-none d-sm-inline">Indietro</span>
      </NuxtLink>

      <template v-if="isPreview">
        <button @click="printCV()" 
                class="p-1 btn btn-sm btn-outline-secondary me-2">
          <i class="bi bi-printer me-1"></i>
          <span class="d-none d-sm-inline">Stampa/PDF</span>
        </button>
        <NuxtLink :to="`/cv/${cvId}`" 
                  class="ms-auto p-1 btn btn-sm btn-primary">
          <i class="bi bi-pencil me-1"></i>
          <span class="d-none d-sm-inline">Modifica</span>
        </NuxtLink>
      </template>

      <template v-else>
        <!-- Indicatore salvataggio automatico -->
        <span class="ms-auto d-flex align-items-center gap-1 text-nowrap">
          <template v-if="form.loading.message === 'Salvataggio...'">
            <i class="bi bi-hourglass-split text-info autosave-pulse"></i>
            <span class="d-none d-sm-inline text-info small">Salvataggio...</span>
          </template>
          <template v-else-if="form.loading.color === 'success'">
            <i class="bi bi-check-circle-fill text-success"></i>
            <span class="d-none d-sm-inline text-success small">Salvato</span>
          </template>
          <template v-else-if="form.loading.color === 'warning'">
            <i class="bi bi-exclamation-triangle-fill text-warning"></i>
            <span class="d-none d-sm-inline text-warning small">{{ form.loading.message }}</span>
          </template>
        </span>
                      
        <NuxtLink :to="`/cv/${cvId}?preview`" 
                  class="p-1 btn btn-sm btn-success text-nowrap">
          <i class="bi bi-eye me-1"></i>
          <span class="d-none d-sm-inline">Preview</span>
        </NuxtLink>
      </template>
      
    </div>
  </div>
</template>

<style scoped lang="sass">
.autosave-pulse
  animation: pulse-opacity 1s ease-in-out infinite

@keyframes pulse-opacity
  0%, 100%
    opacity: 1
  50%
    opacity: 0.2
</style>
