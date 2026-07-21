
import type { FormField } from '~/components/formField_schema';
import type { CV } from '~/pages/cv/_cv_schema';
import { CV_TYPE, cvSchema } from '~/pages/cv/_cv_schema';
import { parse, safeParse } from 'valibot';
import { debounce } from '~~/tools/feedbacksUI';

export function useCvMain() {

  // Recupera l'ID dalla route
  const router = useRouter()
  const route = useRoute()
  const id = route.params.id as string
  
  // Gestione modalità preview tramite query parameter
  const isPreview = computed(() => 'preview' in route.query)
  
  const GDPR_TEXT = 'Autorizzo il trattamento dei miei dati personali presenti nel CV ai sensi del Decreto Legislativo 30 giugno 2003, n. 196 "Codice in materia di protezione dei dati personali" e dell\'art. 13 del GDPR (Regolamento UE 2016/679).'

  // Fetch del CV esistente se siamo in modalità edit
  const cv = reactive<CV>({
    id: 0,
    type: 'minimale',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    birth_date: '',
    email: '',
    phone: '',
    address: '',
    contacts: [],
    soft_skills: [],
    hobby: [],
    hard_skills: [],
    lenguages: [],
    experiences: []
  });
    
  // Oggetto form che gestisce lo stato e la logica del form
  const form = {
    // Array reattivo dei campi del form
    fields_obj: reactive<{[k:string]:FormField}>({
      type: {
        type: 'select',
        key: 'type',
        label: 'Tipo CV',
        value: cv.type || '',
        options: CV_TYPE.map(type => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type })),
      },
      title: {
        type: 'text',
        key: 'title',
        label: 'Titolo',
        value: cv.title || '',
        placeholder: 'Es: Ingegnere del software',
        asterisk: true,
        validation: (val: string) => val.length >= 3,
        errorMessage: 'Il titolo deve essere di almeno 3 caratteri'
      },
      subtitle: {
        type: 'text',
        key: 'subtitle',
        label: 'Sottotitolo',
        value: cv.subtitle || '',
        placeholder: 'Es: Sviluppatore full-stack',
        validation: (val: string) => val.length >= 3,
        errorMessage: 'Il sottotitolo deve essere di almeno 3 caratteri'
      },
      description: {
        type: 'textarea',
        key: 'description',
        label: 'Descrizione',
        value: cv.description || '',
        placeholder: 'Es: Sviluppatore con 5 anni di esperienza in Vue.js e Nuxt',
        validation: (val: string) => val.length >= 3,
        errorMessage: 'La descrizione deve essere di almeno 3 caratteri'
      },
      image: {
        type: 'text',
        key: 'image',
        label: 'Immagine',
        value: cv.image || '',
        placeholder: 'Es: https://esempio.com/immagine.jpg'
      },
      birth_date: {
        type: 'date',
        key: 'birth_date',
        label: 'Data di nascita',
        value: cv.birth_date || '',
        placeholder: 'Es: 1990-01-01'
      },
      email: {
        section: 'Contatti',
        section_icon: 'envelope',
        type: 'email',
        key: 'email',
        label: 'Email',
        value: cv.email || '',
        placeholder: 'Es: mario.rossi@example.com',
        asterisk: true,
        validation: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        errorMessage: 'Inserisci un\'email valida'
      },
      phone: {
        type: 'tel',
        key: 'phone',
        label: 'Telefono',
        value: cv.phone || '',
        placeholder: 'Es: +39 333 1234567',
        validation: (val: string) => /^\+?[0-9]{10,15}$/.test(val),
        errorMessage: 'Il telefono deve essere di almeno 10 caratteri'
      },
      address: {
        type: 'text',
        key: 'address',
        label: 'Indirizzo',
        value: cv.address || '',
        placeholder: 'Es: Via Roma 10, Milano, 20121',
        validation: (val: string) => val.length >= 3,
        errorMessage: 'L\'indirizzo deve essere di almeno 3 caratteri'
      },
      contacts: {
        type: '',
        key: 'contacts',
        label: 'Contatti',
        value: cv.contacts || [],
      },
      hard_skills: {
        section: 'Competenze',
        section_icon: 'tools',
        type: '',
        key: 'hard_skills',
        label: 'Hard Skills',
        value: cv.hard_skills || [],
      },
      soft_skills: {
        type: '',
        key: 'soft_skills',
        label: 'Soft Skills',
        value: cv.soft_skills || [],
      },
      lenguages: {
        type: '',
        key: 'lenguages',
        label: 'Lingue',
        value: cv.lenguages || [],
      },
      hobby: {
        type: '',
        key: 'hobby',
        label: 'Hobby',
        value: cv.hobby || [],
      },
      experiences: {
        section: 'Esperienze',
        section_icon: 'briefcase',
        type: '',
        key: 'experiences',
        label: 'Esperienze',
        value: cv.experiences || [],
      },
    }),
    fields: computed(()=>{
      let result :FormField[] =[];
      for (const field of Object.values(form.fields_obj)) {
        result.push(field);
      }
      return result
    }),
    // Computed property: verifica se il form è valido
    isValid: computed((): boolean => {
      return form.fields.value.every(form.validate_field);
    }),

    // Resetta il form allo stato iniziale
    reset() {
      for (const field of form.fields.value) {
        const k = field.key as keyof CV;
        const void_value = Array.isArray(cv[k]) ? [] : '';
        field.value = cv[k] || void_value;
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
    handle_change(e: Event) {
      const inputElement = e.target as HTMLInputElement;
      const { id, type, name, value, checked } = inputElement;
      if (id.includes('>')) {
        list.update(id, value)
        autosave()
        return
      }

      const target = form.fields.value.find((field) => field.key === name);
      if (!target) return; // Ignora input senza name corrispondente

      // Converte il valore in base al tipo di input
      const newValue = type === 'checkbox' ? checked
                    : type === 'number'    ? Number(value)
                    :                        value;
      target.value = newValue;
      autosave()
    },

    // Gestisce il submit del form
    loading: reactive({ message: '', color: '', icon: '' }),
    set_loading(message: string, color = 'primary', icon = 'save') {
      form.loading.message = message;
      form.loading.color = color;
      form.loading.icon = icon;
    },
    async handle_submit(redirect = false) {
      try {
        // 1) Valida tutti i campi
        const isValid = form.fields.value.every((field) => form.validate_field(field));
        if (!isValid) {
          form.set_loading('Form non valido', 'warning', 'exclamation-triangle-fill');
          setTimeout(() => form.set_loading(''), 1000);
          return console.error("Form non valido");
        }

        // 3) Costruisce il payload con i valori del form
        const payload = form.fields.value.reduce((acc, field) => {
          acc[field.key] = field.value
          return acc
        }, {} as Record<string, string | number | boolean>)

        // 4) Valida i dati con valibot
        const result = safeParse(cvSchema, payload);
        if (!result.success) {
          form.set_loading('Dati non validi', 'warning', 'exclamation-triangle-fill');
          setTimeout(() => form.set_loading(''), 2000);
          return console.error("Validazione valibot fallita:", result.issues);
        }

        // 5) Invia la richiesta API
        form.set_loading('Salvataggio...', 'info', 'hourglass-split');
        await $fetch(`/api/cv/${id}`, {
          method: 'PUT',
          body: result.output
        })

        // 6) Redirect e feedback
        if (redirect) router.push('/cv/list');
        form.set_loading('Salvato', 'success', 'check-circle-fill');
        setTimeout(() => form.set_loading(''), 2000);

      } catch (e) { throw new Error('Errore durante il salvataggio', { cause: e }) }
    },
  };

  const list = {
    add(list_key: keyof CV, new_item: {[k: string]: string}) {
      const cv_list = (cv as any)?.[list_key];
      if (!cv_list) throw new Error('Invalid list key');
      cv_list.push(new_item);

      const field = form.fields.value.find(f => f.key === list_key);
      if (!field) throw new Error('Field not found');
      field.value = (cv as any)[list_key];

      autosave()
    },

    remove(list_key: keyof CV, index: number) {
      const cv_list = (cv as any)?.[list_key];
      if (!cv_list) throw new Error('Invalid list key');
      cv_list.splice(index, 1);

      const field = form.fields.value.find(f => f.key === list_key);
      if (!field) throw new Error('Field not found');
      field.value = (cv as any)[list_key];

      autosave()
    },

    update(id: string, value: string) {
      const [list_name, index, key] = id.split('>');
      if (!list_name || !index || !key) throw new Error('Invalid field id');

      const cv_list = (cv as any)?.[list_name];
      if (!cv_list) throw new Error('List not found');
      cv_list[Number(index)][key] = value;

      const field = form.fields.value.find(f => f.key === list_name);
      if (!field) throw new Error('Field not found');
      field.value = (cv as any)[list_name];
    }
  }

  // Salvataggio automatico: scatta 1s dopo l'ultima modifica
  const autosave = debounce(async () => {
    await form.handle_submit()
  }, 1000)

  // Al mount del componente, carica il CV e resetta il form
  onMounted(async () => {
    document.title = 'Modifica CV';
    try {      
      const data = await $fetch<CV>(`/api/cv/${id}`, { method: 'GET' });
      if (data) {
        Object.assign(cv, data);
        form.reset();
      }

    } catch (err) {
      console.error('Errore caricamento CV:', err);
    }
  })

  return { cv, form, list, router, isPreview, GDPR_TEXT }
}
