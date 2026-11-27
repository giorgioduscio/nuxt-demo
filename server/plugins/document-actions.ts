import { CrudGenerator } from '~~/server/_crud_generator'
import { Doc, docSchema, testDocs } from '../lib/_document_schema'

const documentsCrud = new CrudGenerator<Doc, any>({
  table: 'document',
  schema: docSchema,
  uniqueField: 'docId',          // il tuo campo univoco su DB
  jsonFields: ['sections'],      // serializzato/deserializzato automaticamente
  fieldMapping: {
    id: 'docId'                  // body.id → DB docId
  },
  testData: testDocs    // usa testDocs esistenti
})



export default defineNitroPlugin(async (nitroApp) => {
  // CREATE
  nitroApp.router.add('/api/documents',      (event:any) => documentsCrud.create(event),   'post')
  nitroApp.router.add('/api/documents/test', (event:any) => documentsCrud.createTests(),   'post')
  // READ
  nitroApp.router.add('/api/documents',      (event:any) => documentsCrud.readAll(event),  'get')
  nitroApp.router.add('/api/documents/:id',  (event:any) => documentsCrud.readOne(event),  'get')
  // UPDATE
  nitroApp.router.add('/api/documents/:id',  (event:any) => documentsCrud.update(event),   'put')
  // DELETE
  nitroApp.router.add('/api/documents/:id',  (event:any) => documentsCrud.delete(event),   'delete')
})