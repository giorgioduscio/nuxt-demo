import { object, number, string, boolean, minLength, pipe, maxLength, optional } from 'valibot'
import type { InferOutput } from 'valibot'

export const TodoSchema = object({
  id: optional(number()),
  text: pipe(string(), minLength(3), maxLength(30)),
  completed: optional(boolean())
})

export type Todo = InferOutput<typeof TodoSchema>
