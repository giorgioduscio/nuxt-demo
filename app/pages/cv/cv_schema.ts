import { object, string, number, array, optional, type InferOutput } from 'valibot';

// Schema completo del CV
export const cvSchema = object({
  id: optional(number()),
  type: optional(string()),
  
  title: optional(string()),
  subtitle: optional(string()),
  description: optional(string()),
  image: optional(string()),
  
  birth_date: optional(string()),
  email: optional(string()),
  phone: optional(string()),
  address: optional(string()),
  
  contacts: optional(array(object({
    title: string(),
    description: string()
  }))),
  soft_skills: optional(array(object({
    title: string(),
    description: string()
  }))),
  hobby: optional(array(object({
    title: string(),
    description: string()
  }))),
  
  hard_skills: optional(array(object({
    title: string(),
    level: string(),
    description: string()
  }))),
  lenguages: optional(array(object({
    title: string(),
    level: string(),
    description: string()
  }))),
  
  experiences: optional(array(object({
    period: string(),
    company: string(),
    role: string(),
    start_date: string(),
    description: string()
  })))
});

// Tipo TypeScript derivato dallo schema
export type CV = InferOutput<typeof cvSchema>;
