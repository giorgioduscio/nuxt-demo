import { firebase_cv } from './_firebase_cv';
import type { CV } from '~/pages/cv/_cv_schema';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);   
    const new_cv_type = typeof body === 'string' ? body : body?.type || 'minimale';
    
    // Crea oggetto CV senza validazione valibot - usa any per evitare controlli di tipo
    const new_cv: CV = {
      type: new_cv_type,
      title: 'document_' + Date.now(),
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
    };

    // Aggiunge al DB
    if (firebase_cv.to_use(event)) {
      return await firebase_cv.create(new_cv);
    }
    
    const storage = useStorage('cv');
    const customId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newCV = {
      ...new_cv,
      id: Number(customId),
    };
    
    await storage.setItem(`${customId}.json`, newCV);
    return newCV;

  } catch (e) {
    console.error('Errore in generate.post.ts:', e);
    throw e;
  }
});
