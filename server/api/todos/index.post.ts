import prisma from '/app/server/lib/prisma'
import { parse } from 'valibot'
import { TodoSchema } from "~/pages/todos/_todos_schema"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validated = parse(TodoSchema, body)

    const newTodo = await prisma.todo.create({
      data: {
        text: validated.text,
        completed: false,
      },
    })

    return newTodo
  } catch (e) {
    if (e instanceof Error) {
      throw createError({ statusCode: 400, message: e.message })
    }
    throw e
  }
})
