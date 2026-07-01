<!--
  Componente Confirm
  
  Componente per mostrare una finestra di conferma con azione personalizzabile.
  
  Props:
    - title (String, required): Titolo della finestra di conferma
    - description (String, required): Descrizione del messaggio di conferma
    - type (String, default: 'danger'): Tipo di bottone di conferma (danger, success, warning, info, primary)
    - btn_confirm_label (String, default: 'Conferma'): Etichetta del bottone di conferma
    - action (Function, required): Funzione da eseguire alla conferma
  
  Esempio di utilizzo:
    <Confirm
      title="Elimina elemento"
      description="Sei sicuro di voler eliminare questo elemento?"
      type="danger"
      btn_confirm_label="Elimina"
      :action="async () => { await deleteItem() }"
    />
-->
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'danger'
  },
  btn_confirm_label: {
    type: String,
    default: 'Invio'
  },
  action: {
    type: Function,
    required: true
  }
})

const router = useRouter()
const handleCancel =()=> router.back()

const handleConfirm = async () => {
  await props.action()
}
</script>

<template>
  <div class="mt-5 container" style="max-width: max-content;">
    <div :class="`card border-${type} overflow-hidden`">
      <!-- HEADER -->
      <div :class="`card-header text-bg-${type}`">
        <h2 class="card-title">{{ title }}</h2>
      </div>

      <!-- BODY -->
      <div class="card-body text-bg-dark">
        <p class="card-text">{{ description }}</p>
      </div>
      
      <!-- FOOTER -->
      <div class="card-footer text-bg-dark">
        <div class="d-flex gap-2 justify-content-between">
          <button 
            class="btn btn-secondary" 
            @click="handleCancel">
            Annulla
          </button>
          <button 
            :class="`btn btn-${type}`" 
            @click="handleConfirm">
            {{ btn_confirm_label }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
