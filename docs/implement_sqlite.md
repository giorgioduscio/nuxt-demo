# Implementazione SQLite per Nuxt + Prisma

**Perché SQLite?**
- Non richiede Docker
- Database locale (file)
- Perfetto per sviluppo
- Nessuna configurazione complessa
- Funziona subito

---

## Passo 1: Installa dipendenze SQLite

```bash
npm install @prisma/adapter-better-sqlite3 better-sqlite3
```

**NOTA:** Se ricevi errori di build, esegui:
```bash
npm install --build-from-source better-sqlite3
```

---

## Passo 2: Modifica prisma/schema.prisma

Cambia il datasource da PostgreSQL a SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**IMPORTANTE:** Rimuovi completamente la riga `url` se era presente con PostgreSQL.

---

## Passo 3: Rimuovi prisma.config.ts

SQLite non richiede `prisma.config.ts`. Rimuovilo o rinominalo:

```bash
mv prisma.config.ts prisma.config.ts.bak
```

---

## Passo 4: Modifica server/lib/prisma.ts

Cambia l'adapter da PostgreSQL a SQLite:

```typescript
import { PrismaClient } from '~/generated/prisma/client'
import { PrismaSQLite } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaSQLite({
  datasourceUrl: 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

export default prisma
```

---

## Passo 5: Rimuovi DATABASE_URL da docker-compose.yaml

SQLite non usa variabili d'ambiente per la connessione. Rimuovi questa riga:

```yaml
# Rimuovi questa riga da nuxt-vue-app environment:
# - DATABASE_URL=postgresql://postgres:postgres@nuxt-vue-db:5432/nuxt_db
```

---

## Passo 6: Rigenera client Prisma

```bash
npx prisma generate
```

---

## Passo 7: Crea migrazione iniziale

```bash
npx prisma migrate dev --name init
```

Questo creerà:
- File `dev.db` nella cartella `prisma/`
- Migrazione in `prisma/migrations/`

---

## Passo 8: Aggiorna .gitignore

Aggiungi il database locale al gitignore:

```gitignore
# Database SQLite
prisma/dev.db
prisma/dev.db-journal
```

---

## Passo 9: Verifica funzionamento

Avvia l'applicazione:

```bash
npm run dev
```

Oppure con Docker (ma puoi anche evitare Docker per lo sviluppo):

```bash
docker compose up
```

---

## Troubleshooting

### Errore: "Cannot find module 'better-sqlite3'"
```bash
npm install better-sqlite3 --build-from-source
```

### Errore: "Library not loaded"
Su Windows/Mac, assicurati di avere i build tools:
- Windows: Visual Studio Build Tools
- Mac: Xcode Command Line Tools

### Errore: "Database is locked"
SQLite supporta un solo writer alla volta. Se hai più processi che scrivono, considera di usare PostgreSQL in produzione.

---

## Passo da SQLite a PostgreSQL (produzione)

Quando sei pronto per la produzione:

1. Cambia `datasource db` in `prisma/schema.prisma` a PostgreSQL
2. Installa `@prisma/adapter-pg pg`
3. Modifica `server/lib/prisma.ts` per usare `PrismaPg`
4. Esegui `npx prisma migrate deploy` sul database di produzione

---

## Riepilogo comandi

```bash
# 1. Installa dipendenze
npm install @prisma/adapter-better-sqlite3 better-sqlite3

# 2. Modifica schema.prisma (cambia provider a sqlite)

# 3. Rimuovi prisma.config.ts
mv prisma.config.ts prisma.config.ts.bak

# 4. Modifica server/lib/prisma.ts (usa PrismaSQLite)

# 5. Rimuovi DATABASE_URL da docker-compose.yaml

# 6. Genera client
npx prisma generate

# 7. Crea migrazione
npx prisma migrate dev --name init

# 8. Aggiorna .gitignore
# Aggiungi: prisma/dev.db e prisma/dev.db-journal

# 9. Avvia app
npm run dev
```

---

## Vantaggi di questa configurazione

✅ **Nessun Docker richiesto** per il database  
✅ **Database locale** - facile backup e debug  
✅ **Nessuna configurazione complessa**  
✅ **Funziona subito** dopo l'installazione  
✅ **Perfetto per sviluppo** e testing  
✅ **Migrazione semplice** a PostgreSQL per produzione
