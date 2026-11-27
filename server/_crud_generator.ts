import prisma from './lib/prisma'
import { parse } from 'valibot'


interface CrudConfig<TBody extends Record<string, any>, TRecord> {
  /** Nome del delegate Prisma (es. 'user', 'post') */
  table: string
  /** Schema valibot per validare il body in ingresso */
  schema: any
  /** Campi del body da serializzare come JSON string nel database */
  jsonFields?: (keyof TBody)[]
  /** Campo unique da usare per findUnique/update/delete (default: 'id') */
  uniqueField?: keyof TRecord
  /** Mapping campo body -> campo database */
  fieldMapping?: Partial<Record<keyof TBody, keyof TRecord>>
  /** Dati di test per popolare il database in development */
  testData?: TBody[]
  /** Ordinamento custom per readAll (default: { createdAt: 'desc' }) */
  orderBy?: Record<string, 'asc' | 'desc'>
  /** Nomi di campo su cui abilitare la ricerca testuale nel readAll */
  searchFields?: (keyof TRecord)[]
}

/*
ESEMPIO UTILIZZO

const usersCrud = new CrudGenerator({
  table: 'user',
  schema: userSchema,
  uniqueField: 'id',
  fieldMapping: { fullName: 'full_name' },
  jsonFields: ['metadata'],
  testData: [ ... ]
})

export default defineNitroPlugin((nitroApp) => {
  nitroApp.router.add('/api/users',     event => usersCrud.readAll(event))
  nitroApp.router.add('/api/users/:id', event => usersCrud.readOne(event))
  nitroApp.router.add('/api/users',     event => usersCrud.create(event), 'post')
  nitroApp.router.add('/api/users/:id', event => usersCrud.update(event), 'put')
  nitroApp.router.add('/api/users/:id', event => usersCrud.delete(event), 'delete')
})
*/

export class CrudGenerator<TBody extends Record<string, any>, TRecord> {
  private config: CrudConfig<TBody, TRecord>

  constructor(config: CrudConfig<TBody, TRecord>) {
    this.config = config
  }

  // =========================================================================
  // CREATE
  // =========================================================================
  async create(event: any): Promise<TRecord> {
    try {
      const body = await readBody(event)
      const validated = this.validate(body)
      const data = this.mapToDbRecord(validated)

      const newRecord = await (prisma as any)[this.config.table].create({ data })

      return newRecord as TRecord
    } catch (e) {
      throw this.handleError(e, `Errore durante la creazione del record in ${this.config.table}`)
    }
  }

  // =========================================================================
  // READ ALL
  // =========================================================================
  async readAll(event: any): Promise<TBody[]> {
    try {
      const query = getQuery(event)
      const findManyArgs: Record<string, any> = {
        orderBy: this.config.orderBy || { createdAt: 'desc' }
      }

      // Ricerca testuale opzionale (?q=termine)
      const search = query.q as string | undefined
      if (search && this.config.searchFields?.length) {
        findManyArgs.where = {
          OR: this.config.searchFields.map((field) => ({
            [field as string]: { contains: search, mode: 'insensitive' }
          }))
        }
      }

      const records = await (prisma as any)[this.config.table].findMany(findManyArgs)

      return records.map((record: TRecord) => this.mapToBody(record))
    } catch (e) {
      throw this.handleError(e, `Errore durante il recupero dei record da ${this.config.table}`)
    }
  }

  // =========================================================================
  // READ ONE
  // =========================================================================
  async readOne(event: any): Promise<TBody> {
    try {
      const id = this.requireId(event)
      const whereClause = this.buildWhereClause(id)

      const record = await (prisma as any)[this.config.table].findUnique({
        where: whereClause
      })

      if (!record) {
        throw createError({
          statusCode: 404,
          statusMessage: `Record con ID ${id} non trovato`
        })
      }

      return this.mapToBody(record)
    } catch (e) {
      throw this.handleError(e, `Errore durante il recupero del record da ${this.config.table}`)
    }
  }

  // =========================================================================
  // UPDATE
  // =========================================================================
  async update(event: any): Promise<TRecord> {
    try {
      const id = this.requireId(event)
      const body = await readBody(event)

      const validated = this.validate(body)
      const data = this.mapToDbRecord(validated)
      const whereClause = this.buildWhereClause(id)

      const updatedRecord = await (prisma as any)[this.config.table].update({
        where: whereClause,
        data
      })

      return updatedRecord as TRecord
    } catch (e) {
      throw this.handleError(e, `Errore durante l'aggiornamento del record in ${this.config.table}`)
    }
  }

  // =========================================================================
  // DELETE
  // =========================================================================
  async delete(event: any): Promise<{ success: boolean; message: string }> {
    try {
      const id = this.requireId(event)
      const whereClause = this.buildWhereClause(id)

      await (prisma as any)[this.config.table].delete({ where: whereClause })

      return { success: true, message: `Record con ID ${id} eliminato` }
    } catch (e) {
      throw this.handleError(e, `Errore durante l'eliminazione del record da ${this.config.table}`)
    }
  }

  // =========================================================================
  // TEST DATA
  // =========================================================================

  /**
   * Popola il database con i dati di test, solo in development.
   * Cancella tutti i record esistenti prima di inserire i testData.
   */
  async createTests(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    if (!this.config.testData || this.config.testData.length === 0) {
      return
    }

    await (prisma as any)[this.config.table].deleteMany()

    for (const item of this.config.testData) {
      const data = this.mapToDbRecord(item)
      await (prisma as any)[this.config.table].create({ data })
    }
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  /**
   * Valida il body con lo schema valibot configurato.
   * @param body - Body grezzo della richiesta
   * @returns Body validato e tipizzato TBody
   */
  private validate(body: unknown): TBody {
    return parse(this.config.schema, body) as TBody
  }

  /**
   * Estrae l'ID dalla URL, lanciando un errore 400 se mancante.
   * @param event - Evento H3
   * @returns ID come stringa
   */
  private requireId(event: any): string {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID mancante nell'URL"
      })
    }
    return id
  }

  /**
   * Gestione errori centralizzata e uniforme per tutti i metodi.
   * - Se è già un errore H3 (createError), lo rilascia così com'è.
   * - Se è un errore noto di Prisma (P2025 record non trovato, P2002 violazione unique), lo converte.
   * - Se è un errore di validazione valibot, lo converte in 400.
   * - Altrimenti lo incapsula in un errore 500 con il messaggio di contesto.
   * @param e - Errore catturato
   * @param contextMessage - Messaggio per l'errore 500 generico
   * @returns Errore H3 pronto da rilanciare
   */
  private handleError(e: unknown, contextMessage: string): any {
    // Errori H3 già formattati (createError): rilanciali invariati
    if (e && typeof e === 'object' && 'statusCode' in e) {
      return e
    }

    // Errori noti di Prisma
    if (e && typeof e === 'object' && 'code' in e) {
      const prismaCode = (e as any).code

      // Record non trovato (update/delete su ID inesistente)
      if (prismaCode === 'P2025') {
        return createError({
          statusCode: 404,
          statusMessage: `Record non trovato in ${this.config.table}`
        })
      }

      // Violazione di vincolo unique
      if (prismaCode === 'P2002') {
        return createError({
          statusCode: 409,
          statusMessage: `Un record con questo valore esiste già in ${this.config.table}`
        })
      }

      // Violazione foreign key
      if (prismaCode === 'P2003') {
        return createError({
          statusCode: 400,
          statusMessage: `Operazione non permessa: vincolo di relazione violato in ${this.config.table}`
        })
      }
    }

    // Errori di validazione valibot: rilascia con statusCode 400
    if (e && typeof e === 'object' && (e as any).name === 'ValiError') {
      return createError({
        statusCode: 400,
        statusMessage: (e as any).message
      })
    }

    // Fallback: errore generico 500
    return createError({
      statusCode: 500,
      statusMessage: contextMessage,
      cause: e
    })
  }

  /**
   * Mappa un oggetto body (TBody) in un record per il database (TRecord).
   * Applica fieldMapping se configurato e serializza i campi JSON.
   * @param body - Oggetto validato dallo schema
   * @returns Record pronto per Prisma create/update
   */
  private mapToDbRecord(body: TBody): Partial<TRecord> {
    const record: any = {}

    for (const [bodyKey, value] of Object.entries(body)) {
      // Applica fieldMapping se esiste, altrimenti usa il nome originale
      const dbKey = this.config.fieldMapping?.[bodyKey as keyof TBody] || bodyKey
      const finalKey = dbKey as keyof TRecord

      // Serializza come JSON se il campo è nella lista jsonFields
      if (this.config.jsonFields?.includes(bodyKey as keyof TBody)) {
        record[finalKey] = JSON.stringify(value)
      } else {
        record[finalKey] = value
      }
    }

    return record as Partial<TRecord>
  }

  /**
   * Mappa un record dal database (TRecord) in un oggetto body (TBody).
   * Applica reverse fieldMapping e deserializza i campi JSON.
   * Salta i campi interni del database (id, createdAt, updatedAt).
   * @param record - Record dal database Prisma
   * @returns Oggetto body pronto per la risposta API
   */
  private mapToBody(record: TRecord): TBody {
    const body: any = {}
    const recordObj = record as any

    for (const [key, value] of Object.entries(recordObj)) {
      // Salta campi interni del database
      if (['id', 'createdAt', 'updatedAt'].includes(key)) {
        continue
      }

      // Trova il campo body corrispondente (reverse mapping)
      const bodyKey = this.findBodyKey(key as keyof TRecord) || key

      // Verifica se questo campo db corrisponde a un campo JSON nel body
      const isJsonField = this.isJsonField(key as keyof TRecord)

      // Deserializza JSON se necessario
      if (isJsonField && typeof value === 'string') {
        try {
          body[bodyKey] = JSON.parse(value)
        } catch {
          body[bodyKey] = value
        }
      } else {
        body[bodyKey] = value
      }
    }

    return body as TBody
  }

  /**
   * Trova il campo body (TBody) corrispondente a un campo database (TRecord).
   * Usa fieldMapping inverso. Se non trova mapping, ritorna undefined.
   * @param dbKey - Chiave del campo nel database
   * @returns Chiave del campo nel body o undefined
   */
  private findBodyKey(dbKey: keyof TRecord): keyof TBody | undefined {
    if (!this.config.fieldMapping) return undefined

    for (const [bodyKey, mappedDbKey] of Object.entries(this.config.fieldMapping)) {
      if (mappedDbKey === dbKey) {
        return bodyKey as keyof TBody
      }
    }

    return undefined
  }

  /**
   * Verifica se un campo database corrisponde a un campo JSON nel body.
   * Controlla fieldMapping inverso e jsonFields.
   * @param dbKey - Chiave del campo nel database
   * @returns true se il campo deve essere deserializzato da JSON
   */
  private isJsonField(dbKey: keyof TRecord): boolean {
    if (!this.config.fieldMapping || !this.config.jsonFields) return false

    for (const [bodyKey, mappedDbKey] of Object.entries(this.config.fieldMapping)) {
      if (mappedDbKey === dbKey && this.config.jsonFields.includes(bodyKey as keyof TBody)) {
        return true
      }
    }

    return false
  }

  /**
   * Costruisce la clausola WHERE per Prisma findUnique/update/delete.
   * Usa uniqueField se configurato, altrimenti 'id'.
   * Converte a Number se possibile, altrimenti mantiene come string.
   * @param id - ID dalla URL (string)
   * @returns Oggetto WHERE per Prisma
   */
  private buildWhereClause(id: string): Record<string, any> {
    const uniqueField = (this.config.uniqueField as string) || 'id'
    return { [uniqueField]: isNaN(Number(id)) ? id : Number(id) }
  }
}