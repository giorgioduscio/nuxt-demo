# Guida ai Comandi Prisma

Questa guida spiega come lavorare con Prisma nel progetto nuxt-vue-demo.

## Setup Iniziale

### 1. Creare un nuovo database

Il database PostgreSQL è già configurato in `docker-compose.yaml`. Per crearne uno nuovo:

1. Modifica `docker-compose.yaml` e cambia:
   ```yaml
   environment:
     POSTGRES_USER: postgres
     POSTGRES_PASSWORD: postgres
     POSTGRES_DB: nuovo_nome_db  # cambia qui
   ```

2. Aggiorna `DATABASE_URL` nel servizio `nuxt-vue-app`:
   ```yaml
   environment:
     - DATABASE_URL=postgresql://postgres:postgres@nuxt-vue-db:5432/nuovo_nome_db
   ```

3. Ricrea i container:
   ```bash
   docker compose down
   docker compose up -d
   ```

4. Applica le migrazioni:
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev
   docker compose exec nuxt-vue-app npx prisma generate
   ```

### 2. Prima configurazione (se parti da zero)

Se non hai ancora eseguito le migrazioni:

```bash
# Genera il client Prisma
docker compose exec nuxt-vue-app npx prisma generate

# Applica le migrazioni esistenti
docker compose exec nuxt-vue-app npx prisma migrate dev
```

## Comandi CRUD

### Creare un nuovo record

```typescript
// Esempio: creare un documento
const newDoc = await prisma.document.create({
  data: {
    docId: "mio-id-unico",
    title: "Titolo documento",
    sections: JSON.stringify([...]) // JSON della struttura
  }
})
```

### Leggere tutti i record

```typescript
const allDocs = await prisma.document.findMany({
  orderBy: { createdAt: 'desc' }
})
```

### Leggere un record specifico

```typescript
// Per ID numerico
const doc = await prisma.document.findUnique({
  where: { id: 1 }
})

// Per campo unico (docId)
const doc = await prisma.document.findUnique({
  where: { docId: "qwer-asdf-zxcv" }
})
```

### Aggiornare un record

```typescript
const updatedDoc = await prisma.document.update({
  where: { docId: "qwer-asdf-zxcv" },
  data: {
    title: "Nuovo titolo",
    sections: JSON.stringify([...])
  }
})
```

### Eliminare un record

```typescript
await prisma.document.delete({
  where: { docId: "qwer-asdf-zxcv" }
})
```

### Eliminare tutti i record

```typescript
await prisma.document.deleteMany()
```

## Gestione Modifiche allo Schema

### Quando modifichi `schema.prisma`

#### Caso 1: Aggiungi una nuova colonna (opzionale)

Se la nuova colonna è opzionale o ha un valore di default:

```prisma
model Document {
  id        Int      @id @default(autoincrement())
  docId     String   @unique
  title     String
  sections  String
  newField  String?  // opzionale
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Comandi:
```bash
docker compose exec nuxt-vue-app npx prisma migrate dev --name add_new_field
```

#### Caso 2: Aggiungi una nuova colonna (obbligatoria)

Se la colonna è obbligatoria e non ha default, e ci sono dati esistenti:

**Opzione A: Svuota la tabella (per demo/sviluppo)**
```bash
docker compose exec nuxt-vue-app npx prisma migrate reset
docker compose exec nuxt-vue-app npx prisma migrate dev --name add_required_field
```

**Opzione B: Aggiungi default temporaneo**
1. Modifica `schema.prisma`:
   ```prisma
   newField String @default("")
   ```
2. Esegui migrazione:
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev --name add_required_field
   ```
3. Rimuovi il default e crea nuova migrazione:
   ```prisma
   newField String
   ```
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev --name remove_default
   ```

#### Caso 3: Rinomina una colonna

Se rinomini una colonna e ci sono dati esistenti:

**Opzione A: Svuota la tabella**
```bash
docker compose exec nuxt-vue-app npx prisma migrate reset
docker compose exec nuxt-vue-app npx prisma migrate dev --name rename_column
```

**Opzione B: Migrazione manuale**
1. Crea migrazione senza applicarla:
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev --create-only --name rename_column
   ```
2. Modifica il file SQL in `prisma/migrations/[timestamp]_rename_column/migration.sql`:
   ```sql
   -- Cambia questo:
   -- ALTER TABLE "Document" ADD COLUMN "newName" TEXT;
   -- a questo:
   ALTER TABLE "Document" RENAME COLUMN "oldName" TO "newName";
   ```
3. Applica la migrazione:
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev
   ```

#### Caso 4: Elimina una colonna

```bash
docker compose exec nuxt-vue-app npx prisma migrate dev --name remove_column
```

**Attenzione:** I dati in quella colonna verranno persi!

#### Caso 5: Cambia tipo di colonna

Se cambi il tipo (es. da String a Int):

**Opzione A: Svuota la tabella**
```bash
docker compose exec nuxt-vue-app npx prisma migrate reset
docker compose exec nuxt-vue-app npx prisma migrate dev --name change_column_type
```

**Opzione B: Migrazione manuale con cast**
1. Crea migrazione manuale:
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev --create-only --name change_column_type
   ```
2. Modifica SQL per gestire il cast:
   ```sql
   ALTER TABLE "Document" ALTER COLUMN "fieldName" TYPE INTEGER USING "fieldName"::INTEGER;
   ```
3. Applica:
   ```bash
   docker compose exec nuxt-vue-app npx prisma migrate dev
   ```

### Dopo ogni modifica allo schema

**Sempre esegui:**
```bash
# Rigenera il client TypeScript
docker compose exec nuxt-vue-app npx prisma generate
```

Questo aggiorna i tipi TypeScript per riflettere le modifiche.

## Comandi Utili

### Visualizzare lo stato del database
```bash
docker compose exec nuxt-vue-app npx prisma studio
```
Apre un'interfaccia web su `http://localhost:5555`

### Reset completo del database
```bash
docker compose exec nuxt-vue-app npx prisma migrate reset
```
**Attenzione:** Elimina TUTTI i dati!

### Verificare migrazioni
```bash
# Vedi lo stato
docker compose exec nuxt-vue-app npx prisma migrate status

# Applica migrazioni in produzione
docker compose exec nuxt-vue-app npx prisma migrate deploy
```

### Generare solo il client (senza migrazione)
```bash
docker compose exec nuxt-vue-app npx prisma generate
```

## Script di Automazione

Nel progetto è presente `migrate.sh` per automatizzare i comandi:

```bash
# Modifica migrate.sh con i tuoi comandi
docker compose exec nuxt-vue-app npx prisma migrate dev --name nome_migrazione
docker compose exec nuxt-vue-app npx prisma generate

# Esegui lo script
./migrate.sh
```

## Troubleshooting

### Errore: "Property does not exist on PrismaClient"
**Causa:** Client non rigenerato dopo modifica schema
**Soluzione:**
```bash
docker compose exec nuxt-vue-app npx prisma generate
```

### Errore: "Cannot add required column without default"
**Causa:** Colonna obbligatoria senza default con dati esistenti
**Soluzione:** Vedi "Caso 2" sopra

### Errore: "Migration failed"
**Causa:** Conflitto tra schema e database
**Soluzione:**
```bash
docker compose exec nuxt-vue-app npx prisma migrate reset
```

## Best Practices

1. **Backup prima di modifiche rischiose**
2. **Testa in sviluppo prima di produzione**
3. **Usa nomi descrittivi per le migrazioni**
4. **Commita sempre le migrazioni nel git**
5. **Non modificare manualmente il database** - usa sempre Prisma
