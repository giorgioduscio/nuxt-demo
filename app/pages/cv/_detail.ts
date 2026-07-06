
import type { FormField } from '~/components/formField_schema';
import type { CV } from '~/pages/cv/cv_schema';

export function useCvDetail() {

  // Recupera l'ID dalla route
  const router = useRouter()
  const route = useRoute()
  const id = route.params.id as string
  
  // Gestione modalità preview tramite query parameter
  const isPreview = computed(() => 'preview' in route.query)
  
  const GDPR_TEXT = 'Autorizzo il trattamento dei miei dati personali presenti nel CV ai sensi del Decreto Legislativo 30 giugno 2003, n. 196 "Codice in materia di protezione dei dati personali" e dell\'art. 13 del GDPR (Regolamento UE 2016/679).'

  // Fetch del CV esistente se siamo in modalità edit
  let cv = reactive<CV>({
    id: 0,
    type: '',
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
    fields: reactive<FormField[]>([
      {
        type: 'select',
        key: 'type',
        label: 'Tipo CV',
        value: cv.type || '',
        options: [
          { label: 'Minimalista', value: 'minimalista' },
          { label: 'Classico',    value: 'classico' },
          { label: 'Moderno',     value: 'moderno' },
          { label: 'Creativo',    value: 'creativo' },
          { label: 'Accademico',  value: 'accademico' },
        ]
      },
      {
        section: 'Informazioni principali',
        section_icon: 'person',
        type: 'text',
        key: 'title',
        label: 'Titolo',
        value: cv.title || '',
        placeholder: 'Es: Ingegnere del software',
        asterisk: true,
        validation: (val: string) => val.length >= 3,
        errorMessage: 'Il titolo deve essere di almeno 3 caratteri'
      },
      {
        type: 'text',
        key: 'subtitle',
        label: 'Sottotitolo',
        value: cv.subtitle || '',
        placeholder: 'Es: Sviluppatore full-stack'
      },
      {
        type: 'textarea',
        key: 'description',
        label: 'Descrizione',
        value: cv.description || '',
        placeholder: 'Es: Sviluppatore con 5 anni di esperienza in Vue.js e Nuxt'
      },
      {
        type: 'text',
        key: 'image',
        label: 'Immagine',
        value: cv.image || '',
        placeholder: 'Es: https://esempio.com/immagine.jpg'
      },
      {
        type: 'date',
        key: 'birth_date',
        label: 'Data di nascita',
        value: cv.birth_date || '',
        placeholder: 'Es: 1990-01-01'
      },
      {
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
      {
        type: 'text',
        key: 'phone',
        label: 'Telefono',
        value: cv.phone || '',
        placeholder: 'Es: +39 333 1234567'
      },
      {
        type: 'text',
        key: 'address',
        label: 'Indirizzo',
        value: cv.address || '',
        placeholder: 'Es: Via Roma 10, Milano, 20121'
      },
      {
        type: '',
        key: 'contacts',
        label: 'Contatti',
        value: cv.contacts || [],
      },
      {
        section: 'Competenze',
        section_icon: 'tools',
        type: '',
        key: 'hard_skills',
        label: 'Hard Skills',
        value: cv.hard_skills || [],
      },
      {
        type: '',
        key: 'soft_skills',
        label: 'Soft Skills',
        value: cv.soft_skills || [],
      },
      {
        type: '',
        key: 'lenguages',
        label: 'Lingue',
        value: cv.lenguages || [],
      },
      {
        type: '',
        key: 'hobby',
        label: 'Hobby',
        value: cv.hobby || [],
      },
      {
        section: 'Esperienze',
        section_icon: 'briefcase',
        type: '',
        key: 'experiences',
        label: 'Esperienze',
        value: cv.experiences || [],
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
        const void_value = Array.isArray(cv[k]) ? []
                        : '';
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
        const editedForm = form.isChanged.value;
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
        // PUT - Aggiorna CV esistente       
        await $fetch(`/api/cv/${id}`, {
          method: 'PUT',
          body: payload
        })
    
        // 5) Redirect e feedback
        if(redirect) router.push('/cv/list');
        form.isChanged.value = false;
        setTimeout(()=> form.set_loading(''), 1000);
        
      } catch (e) { throw new Error('Errore durante il salvataggio', { cause: e }) }
    },
  };

  const list ={
    add(list_key: keyof CV, new_item: {[k:string]:string}) {   
      // aggiorna il cv
      const cv_list = (cv as any)?.[list_key];
      if(!cv_list) throw new Error('Invalid list key');
      cv_list.push(new_item);

      cv = { ...cv } as CV;

      // Sincronizza form.fields con cv
      const field = form.fields.find(f=> f.key === list_key);
      if(!field) throw new Error('Field not found');
      field.value = (cv as any)[list_key];

      form.isChanged.value = true;
    },

    remove(list_key: keyof CV, index: number) {
      // aggiorna il cv
      const cv_list = (cv as any)?.[list_key];
      if(!cv_list) throw new Error('Invalid list key');
      
      cv_list.splice(index, 1);
      cv = { ...cv } as CV;

      // Sincronizza form.fields con cv
      const field = form.fields.find(f=> f.key === list_key);
      if(!field) throw new Error('Field not found');
      field.value = (cv as any)[list_key];
      
      form.isChanged.value = true;
    },

    update(id:string, value:string) {
      const [list_name, index, key] = id.split('>');
      if (!list_name || !index || !key) {
        throw new Error('Invalid field id');
      }

      const cv_list = (cv as any)?.[list_name];
      if(!cv_list) throw new Error('List not found');

      cv_list[Number(index)][key] = value;
      cv = { ...cv } as CV;

      // Sincronizza form.fields con cv
      const field = form.fields.find(f=> f.key === list_name);
      if(!field) throw new Error('Field not found');

      field.value = (cv as any)[list_name];
      form.isChanged.value = true;
    }
  }

  // Al mount del componente, carica il CV e resetta il form
  onMounted(async ()=>{
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
