<script setup lang="ts">
import type { CV } from '~/pages/cv/cv_schema';
import type { FormField } from './formField_schema';

const router = useRouter()
const id = useRoute().params.id as string | undefined
const isEdit = !!id
const { data: cv } = await useFetch<CV>(`/api/cv/${id || ''}`, {
  method: 'GET'
})
  
const form ={
  fields: reactive<FormField[]>([]),
  submitOnce: ref(false),

  reset() {
    form.submitOnce.value = false;
    Object.assign(form.fields, [
      {
        section: 'Informazioni principali',
        section_icon: 'person',
        type: 'text',
        key: 'title',
        label: 'Titolo',
        value: cv.value?.title || '',
        placeholder: 'Es: Ingegnere del software',
        asterisk: true,
        validation: (val: string) => val.length >= 3,
        errorMessage: 'Il titolo deve essere di almeno 3 caratteri'
      },
      {
        type: 'text',
        key: 'subtitle',
        label: 'Sottotitolo',
        value: cv.value?.subtitle || '',
        placeholder: 'Es: Sviluppatore full-stack'
      },
      {
        type: 'textarea',
        key: 'description',
        label: 'Descrizione',
        value: cv.value?.description || '',
        placeholder: 'Es: Sviluppatore con 5 anni di esperienza in Vue.js e Nuxt'
      },
      {
        type: 'text',
        key: 'image',
        label: 'Immagine',
        value: cv.value?.image || '',
        placeholder: 'Es: https://esempio.com/immagine.jpg'
      },
      {
        type: 'date',
        key: 'birth_date',
        label: 'Data di nascita',
        value: cv.value?.birth_date || '',
        placeholder: 'Es: 1990-01-01'
      },
      {
        section: 'Contatti',
        section_icon: 'envelope',
        type: 'email',
        key: 'email',
        label: 'Email',
        value: cv.value?.email || '',
        placeholder: 'Es: mario.rossi@example.com',
        asterisk: true,
        validation: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        errorMessage: 'Inserisci un\'email valida'
      },
      {
        type: 'text',
        key: 'phone',
        label: 'Telefono',
        value: cv.value?.phone || '',
        placeholder: 'Es: +39 333 1234567'
      },
      {
        type: 'text',
        key: 'address',
        label: 'Indirizzo',
        value: cv.value?.address || '',
        placeholder: 'Es: Via Roma 10, Milano, 20121'
      },
      {
        type: '',
        key: 'contacts',
        label: 'Contatti',
        value: cv.value?.contacts || [],
      },
      {
        section: 'Competenze',
        section_icon: 'tools',
        type: '',
        key: 'hard_skills',
        label: 'Hard Skills',
        value: cv.value?.hard_skills || [],
      },
      {
        type: '',
        key: 'soft_skills',
        label: 'Soft Skills',
        value: cv.value?.soft_skills || [],
      },
      {
        type: '',
        key: 'lenguages',
        label: 'Lingue',
        value: cv.value?.lenguages || [],
      },
      {
        type: '',
        key: 'hobby',
        label: 'Hobby',
        value: cv.value?.hobby || [],
      },
      {
        section: 'Esperienze',
        section_icon: 'briefcase',
        type: '',
        key: 'experiences',
        label: 'Esperienze',
        value: cv.value?.experiences || [],
      },
    ] as FormField[])
  },

  validate_field(field: FormField): boolean {
    if (form.submitOnce.value) {
      if (field.validation) {
        return field.validation(field.value as string);
      }
      return true;
    }
    return true;
  },

  handle_change(e:Event) {
    const { type, name, value, checked } = e.target as HTMLInputElement;
    const target = form.fields.find((field) => field.key === name);
    if(!target) throw new Error('Field not found');

    const newValue = type === 'checkbox' ? checked
                   : type === 'number' ? Number(value)
                   : /*default*/ value;
    target.value = newValue;
  },

  async handle_submit(redirect ='') {
    try {
      // 1) validazione
      form.submitOnce.value = true;
      const isValid = form.fields.every(form.validate_field);
      if (!isValid) {
        return;
      }
      
      // esegui richiesta
      const payload = form.fields.reduce((acc, field) => {
        acc[field.key] = field.value
        return acc
      }, {} as Record<string, string | number | boolean>)
  
      if (isEdit && id) {
        // PUT
        await $fetch(`/api/cv/${id}`, {
          method: 'PUT',
          body: payload
        })
      } else {
        // POST
        await $fetch('/api/cv', {
          method: 'POST',
          body: payload
        })
      }
  
      if(redirect) router.push('/cv/list')
    } catch (e) { throw new Error('Errore durante il salvataggio', { cause: e }) }
  },
};

onMounted(()=>{
  document.title = isEdit ? 'Modifica CV' : 'Nuovo CV';
  form.reset();
})
</script>

<template>
  <section class="p-0 py-sm-3 container">
    <div class="card border-secondary">
  
      <!-- HEADER -->
      <div class="card-header text-bg-secondary">
        <div class="d-flex justify-content-between align-items-center">
          <h1>{{ isEdit ? 'Modifica CV' : 'Nuovo CV' }}</h1>
          <button @click="router.back()" 
                  class="btn btn-sm btn-secondary" 
                  type="button">
            Annulla
          </button>
        </div>
      </div>
    
      <!-- MAIN -->
      <div class="card-body text-bg-dark">
        <div class="row">
          <template v-for="field in form.fields" :key="field.key">
            <div v-if="field.section" class="pt-4 pb-2 col-12 border-bottom border-secondary">
              <h4 class="m-0 d-grid gap-2" style="grid-template-columns: auto 1fr;">
                <i :class="`bi bi-${field.section_icon}`"></i>
                {{ field.section }}
              </h4>
            </div>

            <div class="pt-2 col-12 col-sm-6 col-lg-4">
              <label :for="field.key">
                {{ field.label }}
                <span v-if="field.asterisk" class="text-danger">*</span>
              </label>
      
              <!-- select -->
              <select 
                v-if="field.type === 'select'"
                :id="field.key" 
                :name="field.key"
                :value="field.value"
                @change="form.handle_change"
                class="form-control"
                :class="{ 'is-invalid': !form.validate_field(field) }"
              >
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
      
              <!-- json -->
              <textarea 
                v-if="field.type === 'json'"
                :id="field.key" 
                :name="field.key"
                :value="JSON.stringify(field.value)"
                :placeholder="field.placeholder"
                @change="form.handle_change"
                class="form-control"
                :class="{ 'is-invalid': !form.validate_field(field) }"
              ></textarea>

              <!-- Nel template del tuo form -->
              <ListManager
                v-else-if="field.key === 'hard_skills'"
                v-model="field.value"
                :schema="[
                  { key: 'title', label: 'Titolo', type: 'text', placeholder: 'Es: Vue.js' },
                  { key: 'level', label: 'Livello', type: 'text', placeholder: 'Es: Avanzato' },
                  { key: 'description', label: 'Descrizione', type: 'text', placeholder: 'Es: 5 anni di esperienza' }
                ]"
                add-button-text="Aggiungi Skill"
              />
              <ListManager
                v-else-if="field.key === 'experiences'"
                v-model="field.value"
                :schema="[
                  { key: 'period', label: 'Periodo', type: 'text', placeholder: 'Es: 2020-2023' },
                  { key: 'company', label: 'Azienda', type: 'text', placeholder: 'Es: Tech Solutions' },
                  { key: 'role', label: 'Ruolo', type: 'text', placeholder: 'Es: Senior Developer' },
                  { key: 'start_date', label: 'Data Inizio', type: 'date', placeholder: 'Es: 2020-01-01' },
                  { key: 'description', label: 'Descrizione', type: 'textarea', placeholder: 'Es: Sviluppo di applicazioni web' }
                ]"
                add-button-text="Aggiungi Esperienza"
              />
              <ListManager
                v-else-if="field.key === 'contacts'"
                v-model="field.value"
                :schema="[
                  { key: 'title', label: 'Titolo', type: 'text', placeholder: 'Es: LinkedIn' },
                  { key: 'description', label: 'Link', type: 'text', placeholder: 'Es: https://linkedin.com/in/mario-rossi' }
                ]"
                add-button-text="Aggiungi Contatto"
              />
              <ListManager
                v-else-if="field.key === 'soft_skills'"
                v-model="field.value"
                :schema="[
                  { key: 'title', label: 'Titolo', type: 'text', placeholder: 'Es: Lavoro di squadra' },
                  { key: 'description', label: 'Descrizione', type: 'text', placeholder: 'Es: Collaborazione in team agile' }
                ]"
                add-button-text="Aggiungi Soft Skill"
              />
              <ListManager
                v-else-if="field.key === 'lenguages'"
                v-model="field.value"
                :schema="[
                  { key: 'title', label: 'Lingua', type: 'text', placeholder: 'Es: Italiano' },
                  { key: 'level', label: 'Livello', type: 'text', placeholder: 'Es: Madrelingua' },
                  { key: 'description', label: 'Descrizione', type: 'text', placeholder: 'Es: Lingua nativa' }
                ]"
                add-button-text="Aggiungi Lingua"
              />
              <ListManager
                v-else-if="field.key === 'hobby'"
                v-model="field.value"
                :schema="[
                  { key: 'title', label: 'Titolo', type: 'text', placeholder: 'Es: Musica' },
                  { key: 'description', label: 'Descrizione', type: 'text', placeholder: 'Es: Chitarra e composizione' }
                ]"
                add-button-text="Aggiungi Hobby"
              />              
              <!-- textarea -->
              <textarea 
                v-else-if="field.type === 'textarea'"
                :id="field.key" 
                :name="field.key"
                :value="String(field.value)"
                :placeholder="field.placeholder"
                @change="form.handle_change"
                class="form-control"
                :class="{ 'is-invalid': !form.validate_field(field) }"
              ></textarea>
              
              <!-- default -->
              <input 
                v-else
                :id="field.key" 
                :name="field.key"
                :type="field.type" 
                :value="field.value" 
                :placeholder="field.placeholder"
                @change="form.handle_change"
                class="form-control"
                :class="{ 'is-invalid': !form.validate_field(field) }"
              />
      
              <span v-if="!form.validate_field(field)" class="text-danger">{{ field.errorMessage }}</span>
              <span v-else-if="field.message" class="text-white">{{ field.message }}</span>
            </div>
          </template>
        </div>   
      </div>
      
      <!-- FOOTER -->
      <div class="card-footer text-bg-secondary">
        <div class="d-flex gap-2">
          <button @click="form.handle_submit('redirect')" class="btn btn-primary d-none d-md-block">
            <i :class="isEdit ? 'bi bi-arrow-repeat' : 'bi bi-save'"></i>
            {{isEdit ? 'Aggiorna ed esci' : 'Salva ed esci'}}
          </button>

          <button @click="() => form.handle_submit()" class="btn btn-warning">
            <i :class="isEdit ? 'bi bi-arrow-repeat' : 'bi bi-save'"></i>
            {{isEdit ? 'Aggiorna' : 'Salva'}}
          </button>

          <button @click="router.back()" class="ms-auto btn btn-secondary btn-sm">
            <i class="me-2 bi bi-x-lg"></i>
            <span class="d-none d-md-inline">Annulla</span>
          </button>
        </div>
      </div>
  
    </div>
  </section>
</template>


