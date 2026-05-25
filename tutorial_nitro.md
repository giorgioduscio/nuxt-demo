# Tutorial: Persistenza Dati Nativa con Nuxt e Nitro

In questo tutorial vedremo come gestire i dati dei Todo utilizzando esclusivamente le funzionalità **native** di Nuxt 3/4 e del suo motore server, Nitro. Non è necessaria alcuna libreria esterna (come Prisma, Axios o database esterni).

## 1. Il Cuore di Nuxt: Nitro Storage

Nuxt include un sistema di archiviazione chiamato **Nitro Storage**. È una soluzione "chiavi in mano" che permette di salvare e recuperare dati usando diverse strategie (memory, file system, ecc.) senza installare pacchetti aggiuntivi.

### Configurazione Nativa (`nuxt.config.ts`)
Configuriamo un punto di archiviazione (mount) basato sul File System del server:

```typescript
export default defineNuxtConfig({
  nitro: {
    storage: {
      // 'todos' è il nome del nostro storage nativo
      todos: {
        driver: 'fs',
        base: './.data/todos'
      }
    }
  }
})
```

---

## 2. Creare API Server Native

Nuxt trasforma automaticamente i file in `server/api/` in endpoint. Usiamo le funzioni globali `defineEventHandler`, `readBody` e `useStorage` fornite da Nuxt.

### Leggere i Todo (`server/api/todos.get.ts`)
```typescript
export default defineEventHandler(async (event) => {
  // Accediamo allo storage configurato in nuxt.config.ts
  const storage = useStorage('todos');
  const data = await storage.getItem('list.json');
  return data || [];
});
```

### Salvare un Todo (`server/api/todos.post.ts`)
```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Funzione nativa per leggere il body
  const storage = useStorage('todos');
  
  const currentTodos: any[] = await storage.getItem('list.json') || [];
  currentTodos.push({
    id: Date.now(),
    text: body.text,
    completed: false
  });
  
  await storage.setItem('list.json', currentTodos);
  return { status: 'success' };
});
```

---

## 3. Interazione dal Frontend (Composables Native)

Nel file `todos.vue`, usiamo `useFetch` e `$fetch`, che sono integrati in Nuxt.

```vue
<script setup>
// Recupero dati nativo e reattivo
const { data: todos, refresh } = await useFetch('/api/todos')

const newTodo = ref('')

async function saveTodo() {
  if (!newTodo.value) return
  
  // Invio dati nativo
  await $fetch('/api/todos', {
    method: 'POST',
    body: { text: newTodo.value }
  })
  
  newTodo.value = ''
  refresh() // Aggiorna la lista senza ricaricare la pagina
}
</script>
```

---

## Perché questa soluzione è "Pura Nuxt"?
1.  **Zero Dipendenze**: Non abbiamo fatto `npm install`.
2.  **Nitro Storage**: Gestisce la lettura/scrittura dei file in modo asincrono e sicuro.
3.  **HMR**: Il server di sviluppo rileva i cambiamenti nelle API istantaneamente.
4.  **Sicurezza**: La logica di salvataggio avviene sul server, non nel browser dell'utente.
