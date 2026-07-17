import { object, number, string, boolean, minLength, pipe, maxLength } from 'valibot'
import type { InferOutput } from 'valibot'

export const TodoSchema = object({
  id: number(),
  text: pipe(string(), minLength(3), maxLength(30)),
  completed: boolean()
})

export type Todo = InferOutput<typeof TodoSchema>
