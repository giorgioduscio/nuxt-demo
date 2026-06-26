import type { CV } from '../../../app/pages/cv/cv_schema'

export default defineEventHandler(async(event)=>{
  try{
    const body = await readBody(event);
    const storage = useStorage('cv');
    const customId = `${Date.now()}${Math.floor(Math.random() *1000)}`;
    const newCV: CV = {
      id: Number(customId),
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      image: body.image,
      birth_date: body.birth_date,
      email: body.email,
      phone: body.phone,
      address: body.address,
      contacts: body.contacts,
      hard_skills: body.hard_skills,
      soft_skills: body.soft_skills,
      lenguages: body.lenguages,
      experiences: body.experiences,
      hobby: body.hobby,
    };
    
    await storage.setItem(`${customId}.json`, newCV);
    return newCV;

  } catch(e){ throw e }
})