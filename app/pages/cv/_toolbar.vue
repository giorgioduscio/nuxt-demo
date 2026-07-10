<script setup lang="ts">
const props = defineProps<{
  isPreview: boolean,
  form: any,
  cvId: string,
  cvType: string
}>()

const router = useRouter()
const printCV =()=> window.print()

const cvTypes = [
  { label: 'Minimale', value: 'minimale' },
  { label: 'Classico', value: 'classico' },
  { label: 'Moderno', value: 'moderno' },
  { label: 'Creativo', value: 'creativo' },
  { label: 'Accademico', value: 'accademico' },
]

async function changeCvType(newType: string) {
  // Aggiorna il campo type nel form
  const typeField = props.form.fields.find((f: any) => f.key === 'type')
  if (typeField) {
    typeField.value = newType
    // Salva le modifiche
    await props.form.handle_submit()
  }
  // Reindirizza alla nuova route
  router.push(`/cv/${newType}/${props.cvId}`)
}
</script>

<template>
  <div data-toolbar class="sticky-top py-2 text-bg-light shadow-sm" style="top: 3.5rem"
          :class="{'border-success border-bottom border-3': !isPreview}">
    <div class="px-2 d-flex gap-1 align-items-center">
        
      <NuxtLink :to="'/cv/list'" class="p-1 btn btn-sm btn-outline-dark">
        <i class="bi bi-chevron-left me-1"></i> 
        <span class="d-none d-sm-inline">Indietro</span>
      </NuxtLink>

      <template v-if="isPreview">
        <!-- STAMPA -->
        <button @click="printCV()" 
                class="p-1 btn btn-sm btn-outline-secondary me-2">
          <i class="bi bi-printer me-1"></i>
          <span class="d-none d-sm-inline">Stampa/PDF</span>
        </button>
        <!-- MODIFICA -->
        <NuxtLink :to="`/cv/${cvType}/${cvId}`" 
                  class="ms-auto p-1 btn btn-sm btn-primary">
          <i class="bi bi-pencil me-1"></i>
          <span class="d-none d-sm-inline">Modifica</span>
        </NuxtLink>
      </template>

      <template v-else>
        <!-- DROPDOWN TIPO CV -->
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-palette me-1"></i>
            <span class="d-none d-sm-inline">Tipo: {{ cvTypes.find(t => t.value === cvType)?.label || cvType }}</span>
          </button>
          <ul class="dropdown-menu">
            <li v-for="type in cvTypes" :key="type.value">
              <a class="dropdown-item" 
                 href="#" 
                 @click.prevent="changeCvType(type.value)"
                 :class="{ active: type.value === cvType }">
                {{ type.label }}
              </a>
            </li>
          </ul>
        </div>

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

        <!-- PREVIEW -->
        <NuxtLink :to="`/cv/${cvType}/${cvId}?preview`"
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
