import { object, string, number, array, optional, type InferOutput, union, literal } from 'valibot';

// Schema completo del CV
export const cvSchema = object({
  id: optional(number()),
  type: union([
    literal('accademico'),
    literal('classico'),
    literal('creativo'),
    literal('minimale'),
    literal('moderno')
  ]),
  
  title: string(),
  subtitle: string(),
  description: string(),
  image: optional(string()),
  
  birth_date: string(),
  email: string(),
  phone: string(),
  address: string(),
  
  contacts: array(object({
    title: string(),
    description: string()
  })),
  soft_skills: array(object({
    title: string(),
    description: string()
  })),
  hobby: array(object({
    title: string(),
    description: string()
  })),
  
  hard_skills: array(object({
    title: string(),
    level: string(),
    description: string()
  })),
  lenguages: array(object({
    title: string(),
    level: string(),
    description: string()
  })),
  
  experiences: array(object({
    period: string(),
    company: string(),
    role: string(),
    start_date: string(),
    description: string()
  }))
});

// Tipo TypeScript derivato dallo schema
export type CV = InferOutput<typeof cvSchema>;
