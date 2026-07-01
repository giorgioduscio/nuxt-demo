<!--
  Componente Form
  
  Componente per generare dinamicamente form basati su schema di campi.
  
  Props:
    - title (String, required): Titolo del form
    - btn_submit_label (String, required): Etichetta del bottone di submit
    - fields (FormField[], required): Array di campi del form
  
  Esempio di utilizzo:
    <Form
      title="Modifica CV"
      btn_submit_label="Salva"
      :fields="formFields"
    />
-->
<script setup lang="ts">
import type { FormField } from './formField_schema'

const props = defineProps({
  title: { type: String, required: true },
  fields: { type: Array as PropType<FormField[]>, required: true },
  btn_submit_label: { type: String, required: true },
  on_submit: { type: Function, required: true },
})

// Pulsante annulla
const router = useRouter()
const handleCancel =()=> router.back();


// Initialize form data with field values
const form_fields = reactive<Record<string, string | number | boolean>>({})
const form_submitOnce = ref(false);

function form_reset() {
  form_submitOnce.value = false;
  props.fields.forEach(field => {
    form_fields[field.key] = field.value
  })
};
form_reset();

// validazione
const errors = reactive<Record<string, string>>({})
function validateField(field: FormField): boolean {
  if (field.validation) { // contiene la funzione di validazione
    const isValid = field.validation(form_fields[field.key])
    if (!isValid) { // non passa la validazione
      errors[field.key] = field.errorMessage || 'Campo non valido' // aggiunge errore 
      return false
    }
  }
  delete errors[field.key] // rimuove l'errore se passa la validazione
  return true
}

function handleFieldChange(field: FormField, value: string | number | boolean) {
  form_fields[field.key] = value // assegnamento del valore al campo
  if (field.validation) {
    validateField(field) // validazione del campo
  }
}

const emit = defineEmits(['submit']);
async function handleSubmit() {
  form_submitOnce.value = true;
  let isValid = true
  props.fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })
  
  if (isValid) {
    emit('submit', form_fields);
    form_reset();
  }
}
</script>

<template>
  <div class="p-0 my-md-3 container">
    <form class="card border-secondary" @submit.prevent="handleSubmit">
      <!-- HEADER -->
      <div class="card-header text-bg-secondary">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">{{ title }}</h2>
          <button type="button" class="btn btn-secondary" @click="handleCancel">Annulla</button>
        </div>
      </div>
      
      <!-- BODY -->
      <div class="card-body text-bg-dark">
        <div class="row">
          <div v-for="field in fields" :key="field.key" class="col-12 col-md-6">
            <div class="mb-3">
              <label :for="field.key" class="form-label">
                {{ field.label }}
                <span v-if="field.asterisk" class="text-danger">*</span>
              </label>
              
              <!-- Checkbox -->
              <div v-if="field.type === 'boolean'" class="form-check">
                <input
                  type="checkbox"
                  :id="field.key"
                  v-model="form_fields[field.key]"
                  class="form-check-input"
                  @change="handleFieldChange(field, ($event.target as HTMLInputElement)?.checked)"
                />
                <label :for="field.key" class="form-check-label">
                  {{ field.message || '' }}
                </label>
              </div>
              
              <!-- Select -->
              <select
                v-else-if="field.type === 'select'"
                :id="field.key"
                :value="String(form_fields[field.key] ?? '')"
                class="form-select"
                @change="handleFieldChange(field, ($event.target as HTMLSelectElement).value)"
              >
                <option v-if="field.placeholder" value="" disabled>{{ field.placeholder }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              
              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.key"
                :name="field.key"
                :value="String(form_fields[field.key] ?? '')"
                @input="handleFieldChange(field, ($event.target as HTMLTextAreaElement).value)"
                class="form-control"
                :placeholder="field.placeholder"
                rows="3"
                @blur="validateField(field)"
              />
              
              <!-- Input -->
              <input
                v-else
                :type="field.type"
                :id="field.key"
                :name="field.key"
                v-model="form_fields[field.key]"
                class="form-control"
                :placeholder="field.placeholder"
                @blur="validateField(field)"
              />
              
              <!-- Error Message -->
              <div v-if="errors[field.key] && form_submitOnce" class="text-danger my-1">
                {{ errors[field.key] || 'Campo non valido' }}
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENUTO PERSONALIZZATO -->
        <slot></slot>
      </div>
        
      <!-- FOOTER -->
      <div class="card-footer text-bg-secondary">
        <div class="d-flex justify-content-between gap-2">
          <button type="submit" class="btn btn-primary">{{ btn_submit_label }}</button>
          <button @click="handleCancel" type="button" class="btn btn-secondary">Annulla</button>
        </div>
      </div>

    </form>
  </div>
</template>
