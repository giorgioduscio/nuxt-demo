import { CV, cvSchema } from '~/pages/cv/cv_schema';
import { parse } from 'valibot';

export default defineEventHandler(async (event) => {
  // @ts-ignore
  if (!process.dev as any) {
    throw createError({
      statusCode: 403,
      statusMessage: "Questa operazione è consentita solo in modalità di sviluppo"
    });
  } 

  try {
    const storage = useStorage('cv');
    const keys = await storage.getKeys();
    
    // Rimuove ciascun elemento associato alle chiavi trovate
    await Promise.all(keys.map(key => storage.removeItem(key)));

    // Aggiunge 2 CV mock
    const cv1 :CV = parse(cvSchema, {
      id: 1,
      type: 'minimale',
      title: 'Mario Rossi',
      subtitle: 'Senior Software Engineer',
      description: 'Sviluppatore software con oltre 10 anni di esperienza in JavaScript, Vue e Node.js.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      birth_date: '1988-05-15',
      email: 'mario.rossi@example.com',
      phone: '+39 333 1234567',
      address: 'Via Roma 10, Milano',
      contacts: [
        { title: 'LinkedIn', description: 'https://linkedin.com/in/mario-rossi' },
        { title: 'GitHub', description: 'https://github.com/mario-rossi' }
      ],
      soft_skills: [
        { title: 'Teamwork', description: 'Collaborazione efficace con team multidisciplinari' },
        { title: 'Problem Solving', description: 'Capacità di risolvere problemi complessi' }
      ],
      hobby: [
        { title: 'Basket', description: 'Gioco a basket ogni weekend' }
      ],
      hard_skills: [
        { title: 'Vue.js', level: 'Esperto', description: 'Sviluppo di SPA complesse' },
        { title: 'Node.js', level: 'Esperto', description: 'API RESTful e microservizi' }
      ],
      lenguages: [
        { title: 'Italiano', level: 'Madrelingua', description: 'Madrelingua' },
        { title: 'Inglese', level: 'C1', description: 'Fluido' }
      ],
      experiences: [
        { period: '2020 - Presente', company: 'Tech Solutions S.r.l.', role: 'Lead Developer', start_date: '2020-01-01', description: 'Coordinamento del team di sviluppo frontend.' }
      ]
    });

    const cv2 :CV = parse(cvSchema, {
      id: 2,
      type: 'professionale',
      title: 'Luigi Bianchi',
      subtitle: 'UX/UI Designer',
      description: 'Designer appassionato specializzato in interfacce web e mobile user-friendly e accessibili.',
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      birth_date: '1992-09-20',
      email: 'luigi.bianchi@example.com',
      phone: '+39 344 7654321',
      address: 'Via Torino 45, Torino',
      contacts: [
        { title: 'LinkedIn', description: 'https://linkedin.com/in/luigi-bianchi' },
        { title: 'GitHub', description: 'https://github.com/luigi-bianchi' }
      ],
      soft_skills: [
        { title: 'Creatività', description: 'Capacità di pensare fuori dagli schemi' },
        { title: 'Empatia', description: 'Capacità di comprendere le esigenze degli utenti' }
      ],
      hobby: [
        { title: 'Disegno', description: 'Disegno a matita e acquarelli' }
      ],
      hard_skills: [
        { title: 'Figma', level: 'Esperto', description: 'Prototipazione e UI design' },
        { title: 'HTML/CSS', level: 'Intermedio', description: 'Integrazione markup' }
      ],
      lenguages: [
        { title: 'Italiano', level: 'Madrelingua', description: 'Lingua madre' },
        { title: 'Inglese', level: 'B2', description: 'Fluido' }
      ],
      experiences: [
        { period: '2018 - 2022', company: 'Creative Agency', role: 'UI/UX Designer', start_date: '2018-06-01', description: 'Progettazione di mockup e flussi utente.' }
      ]
    });

    await storage.setItem('1.json', cv1);
    await storage.setItem('2.json', cv2);
    
    return {
      success: true,
      message: "Tutti i CV sono stati eliminati e 2 CV mock sono stati aggiunti con successo"
    };
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante il reset dei CV",
      cause: e
    });
  }
});
