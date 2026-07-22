Ecco i **passaggi minimi** per aggiungere **PostgreSQL + Prisma** al tuo progetto Nuxt esistente usando **Docker** e **Git Bash**:

---

### **1. Installa Prisma nel progetto**
Apri **Git Bash** nella root del progetto e esegui:
```bash
npm install prisma @prisma/client
npx prisma init
```
- Questo creerà:
  - Cartella `prisma/` con `schema.prisma`.
  - File `.env` (se non esiste).

---

### **2. Configura `prisma/schema.prisma`**
Modifica il file per usare **PostgreSQL**:
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Usa la variabile d'ambiente
}
```

---
### **3. Configura `.env`**
Aggiungi la stringa di connessione **temporanea** (sarà sovrascritta da Docker):
```env
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nuxt_db?schema=public"
```
> *Nota*: `postgres:postgres` è user:password di default. `nuxt_db` è il nome del database.

---

### **4. Crea il file `docker-compose.yml`**
Crea un file nella root del progetto:
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    container_name: nuxt_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nuxt_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```
> *Nota*: Usa `postgres:15` (versione stabile). Il volume `postgres_data` persiste i dati anche dopo lo stop del container.

---

### **5. Avvia PostgreSQL con Docker**
Esegui in **Git Bash**:
```bash
docker-compose up -d
```
- Verifica che il container sia attivo:
  ```bash
  docker ps
  ```
  (Dovresti vedere `nuxt_postgres` in esecuzione).

---
### **6. Esegui le migrazioni di Prisma**
```bash
npx prisma migrate dev --name init
```
- Questo:
  1. Si connette al DB PostgreSQL in Docker.
  2. Crea le tabelle basate sullo `schema.prisma`.
  3. Genera il client Prisma in `node_modules/.prisma/client`.

---
### **7. (Opzionale) Aggiungi un modello di esempio**
Modifica `prisma/schema.prisma` per testare:
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```
Poi esegui di nuovo:
```bash
npx prisma migrate dev --name add_user
```

---
### **8. Verifica la connessione**
Crea un endpoint API di test in `server/api/test.get.ts`:
```ts
// server/api/test.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()
  return { users, message: "DB connesso!" }
})
```
- Avvia Nuxt:
  ```bash
  npm run dev
  ```
- Visita `http://localhost:3000/api/test`. Dovresti vedere:
  ```json
  { "users": [], "message": "DB connesso!" }
  ```

---
---
### **9. Comandi utili per Docker**
| Comando | Descrizione |
|---------|-------------|
| `docker-compose down` | Ferma il container (i dati rimangono nel volume). |
| `docker-compose down -v` | **Cancella anche il volume** (perdita dati!). |
| `docker exec -it nuxt_postgres psql -U postgres` | Accedi al DB via CLI. |
| `docker logs nuxt_postgres` | Visualizza i log del DB. |

---
---
### **10. Note importanti**
1. **Variabili d'ambiente in produzione**:
   - In produzione, **non usare** `localhost` in `DATABASE_URL`. Usa invece:
     - Il nome del servizio Docker (es. `db` se il servizio si chiama così in `docker-compose.yml`).
     - Esempio per `DATABASE_URL` in Docker:
       ```env
       DATABASE_URL="postgresql://postgres:postgres@db:5432/nuxt_db?schema=public"
       ```
     > *Nota*: `db` è il nome del servizio in `docker-compose.yml`, non `localhost`.

2. **Se usi Docker anche per Nuxt**:
   - Assicurati che il servizio Nuxt dipenda da `db` in `docker-compose.yml`:
     ```yaml
     services:
       app:
         build: .
         ports:
           - "3000:3000"
         depends_on:
           db:
             condition: service_healthy
     ```

3. **Prisma in sviluppo vs produzione**:
   - In **sviluppo**: Usa `npx prisma migrate dev`.
   - In **produzione**: Usa `npx prisma migrate deploy`.

---
---
### **Riepilogo comandi**
```bash
# 1. Installa Prisma
npm install prisma @prisma/client
npx prisma init

# 2. Avvia PostgreSQL
docker-compose up -d

# 3. Esegui migrazioni
npx prisma migrate dev --name init

# 4. Avvia Nuxt
npm run dev
```

---
Se hai già un `docker-compose.yml` esistente, **integra semplicemente il servizio `db`** come mostrato sopra.