<script setup lang="ts">
import type { CV } from '~/pages/cv/cv_schema';
import type { FormField } from './formField_schema';
import Field from './Field.vue';

// Recupera l'ID dalla route per determinare se siamo in modalità edit o creazione
const router = useRouter()
const id = useRoute().params.id as string | undefined
const isEdit = !!id

// Fetch del CV esistente se siamo in modalità edit
const { data: cv } = await useFetch<CV>(`/api/cv/${id || ''}`, {
  method: 'GET'
})
  
// Oggetto form che gestisce lo stato e la logica del form
const form = {
  // Array reattivo dei campi del form
  fields: reactive<FormField[]>([
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
  ]),
  fields_obj: computed(()=>{
    let result:{[k:string]:FormField} ={};
    for (const field of form.fields) {
      result[field.key] =field;
    }
    return result
  }),
  // Flag che indica se l'utente ha tentato almeno una volta il submit
  submitOnce: ref(false),
  // flag che indica una modifica del form
  isChanged: ref(false),

  // Computed property: verifica se il form è valido
  isValid: computed((): boolean => {
    if (!form.submitOnce.value) return true;
    return form.fields.every(form.validate_field);
  }),

  // Resetta il form allo stato iniziale
  reset() {
    form.submitOnce.value = false;
    form.isChanged.value = false;

    for (const field of form.fields) {
      const k = field.key as keyof CV;
      const void_value = Array.isArray(cv.value?.[k]) ? []
                       : '';
      field.value = cv.value?.[k] || void_value;
    }
  },

  // Valida un singolo campo usando la funzione di validazione definita nel campo
  validate_field(field: FormField): boolean {
    if (field.validation) {
      return field.validation(field.value as string);
    }
    return true;
  },

  // Gestisce il cambio di valore di un campo del form
  handle_change(e:Event) {
    const inputElement = e.target as HTMLInputElement;
    const { id, type, name, value, checked } = inputElement;
    if(id.includes('>')) return list.update(id, value) // LISTE

    const target = form.fields.find((field) => field.key === name);
    if(!target) return; // Ignora input senza name corrispondente (es. liste)

    // Converte il valore in base al tipo di input
    const newValue = type === 'checkbox' ? checked
                   : type === 'number' ? Number(value)
                   : /*default*/ value;
    target.value = newValue;
    form.isChanged.value =true;
  },

  // Gestisce il submit del form
  loading: reactive({ message: '', color:'', icon:''}),
  set_loading(message:string, color='primary', icon='save') {    
    form.loading.message = message;
    form.loading.color = color;
    form.loading.icon = icon;
  },
  async handle_submit(redirect =false) {
    try {     
      // 1) Imposta il flag submitOnce per mostrare gli errori di validazione
      form.submitOnce.value = true;
      
      // 2) Valida tutti i campi
      const isValid = form.fields.every((field) => form.validate_field(field));
      if(!isValid){
        form.set_loading('Form non valido', 'warning', 'exclamation-triangle-fill');
        setTimeout(()=> form.set_loading(''), 1000);
        return console.error("Form non valido");
      }
      const editedForm = isEdit && form.isChanged.value;
      if (!editedForm) {
        form.set_loading('Form non modificato', 'warning', 'exclamation-triangle-fill');
        setTimeout(()=> form.set_loading(''), 1000);
        return console.error("Form non modificato");
      }
      
      // 3) Costruisce il payload con i valori del form
      const payload = form.fields.reduce((acc, field) => {
        acc[field.key] = field.value
        return acc
      }, {} as Record<string, string | number | boolean>)
  
      // 4) Invia la richiesta API (PUT per edit, POST per creazione)
      form.set_loading('Salvataggio...', 'info', 'hourglass-split');
      if (isEdit && id) {
        // PUT - Aggiorna CV esistente       
        await $fetch(`/api/cv/${id}`, {
          method: 'PUT',
          body: payload
        })
      } else {
        // POST - Crea nuovo CV
        await $fetch('/api/cv', {
          method: 'POST',
          body: payload
        })
      }
  
      // 5) Redirect e feedback
      if(redirect) router.push('/cv/list');
      form.isChanged.value = false;
      setTimeout(()=> form.set_loading(''), 1000);
      
    } catch (e) { throw new Error('Errore durante il salvataggio', { cause: e }) }
  },
};

const list ={
  add(list_key: keyof CV, new_item: {[k:string]:string}) {
    const cv_list = (cv.value as any)?.[list_key];
    if(!cv_list) throw new Error('Invalid list key');
    cv_list.push(new_item);

    cv.value = { ...cv.value } as CV;

    // Sincronizza form.fields con cv.value
    const field = form.fields.find(f=> f.key === list_key);
    if(!field) throw new Error('Field not found');
    field.value = (cv.value as any)[list_key];
  },

  remove(list_key: keyof CV, index: number) {
    const cv_list = (cv.value as any)?.[list_key];
    if(!cv_list) throw new Error('Invalid list key');
    
    cv_list.splice(index, 1);
    cv.value = { ...cv.value } as CV;

    // Sincronizza form.fields con cv.value
    const field = form.fields.find(f=> f.key === list_key);
    if(!field) throw new Error('Field not found');
    field.value = (cv.value as any)[list_key];
  },

  update(id:string, value:string) {
    const [list_name, index, key] = id.split('>');
    if (!list_name || !index || !key) {
      throw new Error('Invalid field id');
    }

    const cv_list = (cv.value as any)?.[list_name];
    if(!cv_list) throw new Error('List not found');

    cv_list[Number(index)][key] = value;
    cv.value = { ...cv.value } as CV;

    // Sincronizza form.fields con cv.value
    const field = form.fields.find(f=> f.key === list_name);
    if(!field) throw new Error('Field not found');

    field.value = (cv.value as any)[list_name];
    form.isChanged.value =true;
  }
}

// Al mount del componente, imposta il titolo della pagina e resetta il form
onMounted(()=>{
  document.title = isEdit ? 'Modifica CV' : 'Nuovo CV';
  form.reset();
})
</script>

<template>
  <section class="py-sm-3 container text-bg-dark" 
            style="max-width: 20cm;"
            @input="form.handle_change">

    <!-- TOOLS -->
    <div class="py-4 position-relative">
      <div class="position-fixed" style="top: 4rem;">
        <button :class="`btn btn-sm btn-${form.loading.color || 'primary'}`" 
                @click="form.handle_submit()">
          <span v-if="form.loading.message">
            <i :class="`bi bi-${form.loading.icon}`"></i>
            {{ form.loading.message }}
          </span>
          <span v-else> 
            <i class="bi bi-save"></i> Salva
          </span>
        </button>
      </div>
    </div>

    <!-- HEADER -->
    <div class="row">
      <div class="col-12 col-md-auto">
        <img v-if="cv?.image" :src="cv?.image" 
              alt="Imagine profilo"
              class="mx-2 border rounded"
              style="width: 5cm; height: 5cm; object-fit: cover;">
        <div v-else class="border rounded" style="width: 5cm; height: 5cm;"></div>

        <Field :field="form.fields_obj.value.image as FormField"/>
        
      </div>
      <div class="col-12 col-md">
        <Field :field="form.fields_obj.value.title as FormField"/>
        <Field :field="form.fields_obj.value.subtitle as FormField"/>
        <Field :field="form.fields_obj.value.description as FormField"/>
      </div>
    </div>
    
    <!-- BODY -->
    <div class="row">
      <div class="col-12 col-md-6">

        <!-- CONTATTI -->
        <div class="py-3">
          <h4> <i class="bi bi-person"></i> Contatti</h4>
          <Field :field="form.fields_obj.value.birth_date as FormField"/>
          <Field :field="form.fields_obj.value.email as FormField"/>
          <Field :field="form.fields_obj.value.address as FormField"/>
          <Field :field="form.fields_obj.value.phone as FormField"/>
        </div>

        <button class="btn btn-sm btn-outline-info text-truncate" 
                @click="list.add('contacts', {title: '', description: ''})"> 
          <i class="bi bi-plus-lg"></i> Aggiungi contatto
        </button>
        <div v-for="(contact, index) in cv?.contacts" class="py-2 d-grid gap-2 align-items-start" 
            style="grid-template-columns: auto 1fr 2fr;">
          <button @click="list.remove('contacts', index)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
          <div>
            <label :for="`contacts>${index}>title`" class="visually-hidden">Titolo contatto {{ index + 1 }}</label>
            <input :id="`contacts>${index}>title`" :name="`contacts[${index}].title`" :value="contact.title" title="Titolo" class="form-control form-control-sm" type="text">
          </div>
          <div>
            <label :for="`contacts>${index}>description`" class="visually-hidden">Descrizione contatto {{ index + 1 }}</label>
            <textarea :id="`contacts>${index}>description`" :name="`contacts[${index}].description`" :value="contact.description" title="Descrizione" class="form-control form-control-sm" type="text"></textarea>
          </div>
        </div>
        

        <!-- HARD SKILLS -->
        <h4 class="mt-4 d-flex justify-content-between align-items-center"> 
          <div class="text-truncate">
            <i class="bi bi-code"></i> 
            Hard skills
          </div>
          <button @click="list.add('hard_skills', {title: '', level: '', description: ''})" 
                  class="btn btn-sm btn-outline-info text-truncate"> 
            <i class="bi bi-plus-lg"></i> Aggiungi
          </button>
        </h4>
        <div v-for="(hs, index) in cv?.hard_skills" class="d-grid gap-2 align-items-start" 
              style="grid-template-columns: auto 1fr 1fr 2fr;">
          <button @click="list.remove('hard_skills', index)" 
                  class="btn btn-sm btn-danger">
            <i class="bi bi-trash"></i>
          </button>
          <div>
            <label :for="`hard_skills>${index}>title`" class="visually-hidden">Titolo hard skill {{ index + 1 }}</label>
            <input :id="`hard_skills>${index}>title`" :name="`hard_skills[${index}].title`" :value="hs.title" title="Titolo" class="form-control form-control-sm" type="text">
          </div>
          <div>
            <label :for="`hard_skills>${index}>level`" class="visually-hidden">Livello hard skill {{ index + 1 }}</label>
            <input :id="`hard_skills>${index}>level`" :name="`hard_skills[${index}].level`" :value="hs.level" title="Livello" class="form-control form-control-sm" type="text">
          </div>
          <div>
            <label :for="`hard_skills>${index}>description`" class="visually-hidden">Descrizione hard skill {{ index + 1 }}</label>
            <textarea :id="`hard_skills>${index}>description`" :name="`hard_skills[${index}].description`" :value="hs.description" title="Descrizione" class="form-control form-control-sm" type="text"></textarea>
          </div>
        </div>
      

        <!-- SOFT SKILLS -->
        <h4 class="mt-4 d-flex justify-content-between align-items-center"> 
          <div class="text-truncate">
            <i class="bi bi-heart"></i> 
            Soft skills
          </div>
          <button @click="list.add('soft_skills', {title: '', description: ''})" 
                  class="btn btn-sm btn-outline-info text-truncate"> 
            <i class="bi bi-plus-lg"></i> Aggiungi
          </button>
        </h4>
        <div v-for="(ss, index) in cv?.soft_skills" class="d-grid gap-2 align-items-start" 
              style="grid-template-columns: auto 1fr 2fr;">
          <button @click="list.remove('soft_skills', index)" 
                  class="btn btn-sm btn-danger">
            <i class="bi bi-trash"></i>
          </button>
          <div>
            <label :for="`soft_skills>${index}>title`" class="visually-hidden">Titolo soft skill {{ index + 1 }}</label>
            <input :id="`soft_skills>${index}>title`" :name="`soft_skills[${index}].title`" :value="ss.title" title="Titolo" class="form-control form-control-sm" type="text">
          </div>
          <div>
            <label :for="`soft_skills>${index}>description`" class="visually-hidden">Descrizione soft skill {{ index + 1 }}</label>
            <textarea :id="`soft_skills>${index}>description`" :name="`soft_skills[${index}].description`" :value="ss.description" title="Descrizione" class="form-control form-control-sm" type="text"></textarea>
          </div>
        </div>
        

        <!-- LINGUAGGI -->
        <h4 class="mt-4 d-flex justify-content-between align-items-center"> 
          <div class="text-truncate">
            <i class="bi bi-translate"></i> 
            Linguaggi
          </div>
          <button @click="list.add('lenguages', {title: '', level: '', description: ''})" 
                  class="btn btn-sm btn-outline-info text-truncate"> 
            <i class="bi bi-plus-lg"></i> Aggiungi
          </button>
        </h4>
        <div v-for="(lenguage, index) in cv?.lenguages" class="d-grid gap-2 align-items-start" 
              style="grid-template-columns: auto 1fr 1fr 2fr;">
          <button @click="list.remove('lenguages', index)" 
                  class="btn btn-sm btn-danger">
            <i class="bi bi-trash"></i>
          </button>
          <div>
            <label :for="`lenguages>${index}>title`" class="visually-hidden">Titolo lingua {{ index + 1 }}</label>
            <input :id="`lenguages>${index}>title`" :name="`lenguages[${index}].title`" :value="lenguage.title" title="Titolo" class="form-control form-control-sm" type="text">
          </div>
          <div>
            <label :for="`lenguages>${index}>level`" class="visually-hidden">Livello lingua {{ index + 1 }}</label>
            <input :id="`lenguages>${index}>level`" :name="`lenguages[${index}].level`" :value="lenguage.level" title="Livello" class="form-control form-control-sm" type="text">
          </div>
          <div>
            <label :for="`lenguages>${index}>description`" class="visually-hidden">Descrizione lingua {{ index + 1 }}</label>
            <textarea :id="`lenguages>${index}>description`" :name="`lenguages[${index}].description`" :value="lenguage.description" title="Descrizione" class="form-control form-control-sm" type="text"></textarea>
          </div>
        </div>
      </div>
      

      <!-- ESPERIENZE -->
      <div class="col-12 col-md-6">
        <h4 class="mt-4 d-flex justify-content-between align-items-center">
          <div class="text-truncate">
            <i class="bi bi-briefcase"></i> 
            Esperienze
          </div>
          <button @click="list.add('experiences', {start_date: '', role: '', period: '', company: '', description: ''})" 
                  class="btn btn-sm btn-outline-info text-truncate"> 
            <i class="bi bi-plus-lg"></i> Aggiungi
          </button>
        </h4>
        
        <div>
          <div v-for="(exp, index) in cv?.experiences" class="py-2 d-flex gap-2 align-items-start">
            <button @click="list.remove('experiences', index)" 
                    class="btn btn-sm btn-danger">
              <i class="bi bi-trash"></i>
            </button>

            <div>
              <div class="pb-2 d-grid gap-2" style="grid-template-columns: 1fr 1fr;">
                <div>
                  <label :for="`experiences>${index}>start_date`" class="visually-hidden">Data inizio esperienza {{ index + 1 }}</label>
                  <input :id="`experiences>${index}>start_date`" :name="`experiences[${index}].start_date`" :value="exp.start_date" title="Data inizio" class="form-control form-control-sm" type="text">
                </div>
                <div>
                  <label :for="`experiences>${index}>role`" class="visually-hidden">Ruolo esperienza {{ index + 1 }}</label>
                  <input :id="`experiences>${index}>role`" :name="`experiences[${index}].role`" :value="exp.role" title="Ruolo" class="form-control form-control-sm" type="text">
                </div>
                <div>
                  <label :for="`experiences>${index}>period`" class="visually-hidden">Periodo esperienza {{ index + 1 }}</label>
                  <input :id="`experiences>${index}>period`" :name="`experiences[${index}].period`" :value="exp.period" title="Periodo" class="form-control form-control-sm" type="text">
                </div>
                <div>
                  <label :for="`experiences>${index}>company`" class="visually-hidden">Azienda esperienza {{ index + 1 }}</label>
                  <input :id="`experiences>${index}>company`" :name="`experiences[${index}].company`" :value="exp.company" title="Azienda" class="form-control form-control-sm" type="text">
                </div>
              </div>
              <div>
                <label :for="`experiences>${index}>description`" class="visually-hidden">Descrizione esperienza {{ index + 1 }}</label>
                <textarea :id="`experiences>${index}>description`" :name="`experiences[${index}].description`" :value="exp.description" title="Descrizione" class="form-control form-control-sm" type="text"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
