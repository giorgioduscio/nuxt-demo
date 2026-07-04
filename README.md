# Nuxt CV Generator - Generatore di CV Digitali e Stampabili

Un'applicazione professionale per **generare, visualizzare e scaricare CV in formato digitale e PDF**, sviluppata con **Nuxt 4**, **Vue 3**, **Bootstrap 5** e **SASS**. Questo progetto è allegato al mio CV come esempio pratico di sviluppo frontend avanzato, con focus su **generazione dinamica di documenti**, **gestione dello stato reattivo** e **esportazione in PDF**.

---

## 📋 Descrizione del Progetto

Questa applicazione consente di:

- **Creare CV personalizzati** con template predefiniti (es. professionale, creativo, minimale).
- **Filtrare e cercare** tra i CV salvati (per titolo, competenze, esperienza).
- **Anteprima e gestione** del CV con stili adatti alla stampa o al digitale.
- **Esportare in PDF** per il download o la stampa.

**Funzionalità chiave dimostrate**:

- **Reattività avanzata** con Vue 3 (`reactive`, `computed`, `watch`).
- **Pattern debounce** per ottimizzare la ricerca.
- **Generazione PDF** lato client (es. con `html2pdf.js` o `jsPDF`).
- **UI responsiva** per desktop e mobile.
- **Tipizzazione** codice robusto e manutenibile con Typescript e Valibot.

---

## 🛠️ Requisiti di Sistema

- **Git** (per clonare il repository)
- **Docker** (versione 20.10 o superiore)
- **Docker Compose** (versione 2.0 o superiore)
- **Node.js** (versione 18 o superiore)
- **npm** (versione 9 o superiore)

---

## 🚀 Installazione e Avvio

### 📌 Opzione 1: Node.js (Sviluppo Locale)

#### 1. Clonare il Repository

Aprire un terminale ed eseguire:

```bash
git clone https://github.com/tuo-username/nuxt-cv-generator.git
cd nuxt-vue-demo
```

#### 2. Installare le Dipendenze

Eseguire il seguente comando per installare tutte le dipendenze del progetto:

```bash
npm install # Utilizzo locale
docker compose up --build # Utilizzo con docker
```

#### 3. Avviare il Server di Sviluppo

Eseguire il seguente comando per avviare l'applicazione in modalità sviluppo:

```bash
npm run dev # Utilizzo locale
./prompt.sh # Docker: avvia applicazione e accede al terminale
```

L'applicazione sarà accessibile all'indirizzo:  
👉 [http://localhost:3000](http://localhost:3000)

---

#### 4. (Opzionale) Build per Produzione

Per generare una versione ottimizzata per la produzione:

```bash
npm run build
```

Per visualizzare localmente la versione di produzione:

```bash
npm run preview
```

---

## 📂 Struttura del Progetto

```text
nuxt-cv-generator/
├── app/
│   ├── assets/             # Stili globali (SASS), immagini, font e template CV
│   ├── components/         # Componenti Vue riutilizzabili (es. CVPreview, CVForm)
│   ├── composables/        # Logica riutilizzabile (es. useCV, usePDF)
│   ├── pages/              # Pagine dell'applicazione (routing basato su file)
│   │   ├── index.vue       # Pagina principale con lista CV
│   │   ├── create.vue      # Form per creare un nuovo CV
│   │   └── preview.vue     # Anteprima e download CV
│   └── app.vue             # Punto di ingresso principale e layout
├── public/                 # Asset statici (favicon, robots.txt)
├── server/                 # (Opzionale) API per salvare CV su database
├── docker-compose.yaml     # Configurazione Docker Compose
├── Dockerfile              # Configurazione del container Docker
├── prompt.sh               # Script per accedere al prompt del container
├── nuxt.config.ts          # Configurazione di Nuxt
├── package.json            # Dipendenze e script del progetto
├── tsconfig.json           # Configurazione TypeScript
└── README.md               # Questo file
```

---

## 🎯 Funzionalità Chiave


| Funzionalità                 | Descrizione                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| **Creazione CV**             | Form per inserire dati personali, esperienze, competenze e formazioni.       |
| **Template Multipli**        | Scelta tra diversi template (es. professionale, creativo, minimale).         |
| **Anteprima in Tempo Reale** | Visualizzazione live del CV mentre si modificano i dati.                     |
| **Filtraggio e Ricerca**     | Ricerca tra i CV salvati per titolo, competenze o esperienza (con debounce). |
| **Esportazione PDF**         | Generazione e download del CV in formato PDF per la stampa.                  |
| **Salvataggio Locale**       | I CV vengono salvati in `localStorage` per persistenza tra sessioni.         |
| **UI Responsiva**            | Design adattivo per desktop, tablet e mobile.                                |

---

## 🔧 Tecnologie Utilizzate


| Tecnologia      | Versione | Utilizzo                                |
| --------------- | -------- | --------------------------------------- |
| **Nuxt 4**      | Latest   | Framework principale per SSR e routing  |
| **Vue 3**       | Latest   | Libreria reattiva per la UI             |
| **Bootstrap 5** | Latest   | Stili e componenti UI responsivi        |
| **SASS**        | Latest   | Preprocessore CSS per stili avanzati    |
| **TypeScript**  | Latest   | Tipizzazione statica per codice robusto |
| **html2pdf.js** | Latest   | Generazione PDF lato client             |
| **Docker**      | 20.10+   | Containerizzazione per ambienti isolati |
| **TypeScript**  | Latest   | Tipizzazione statica per codice robusto e manutenibile.|
| **Valibot**     | Latest   | Sistema di validazione dei form con schemi tipizzati.|


---

## 📄 Note per i Recruiter

Questo progetto è stato sviluppato per **dimostrare le mie competenze** in:

- **Sviluppo frontend moderno** con Vue 3 e Nuxt 4.
- **Generazione dinamica di documenti** (CV in PDF).
- **Gestione dello stato reattivo** con `reactive`, `computed` e `watch`.
- **Pattern avanzati** come debounce per ottimizzare le ricerche.
- **UI/UX professionale** con template personalizzabili.
- **Containerizzazione** con Docker per ambienti isolati e riproducibili.

> ⚠️ **Attenzione**: Questo è un progetto **demo** con dati salvati in `localStorage`. Per un utilizzo reale, è possibile estendere il backend con un database (es. PostgreSQL, MongoDB).

---

## 🤝 Contatti

Per domande o collaborazioni, contattami su:

- **Email**: [giorgio.duscio@gmail.com](mailto:giorgio.duscio@gmail.com)
- **LinkedIn**: [linkedin.com/in/giorgio](https://linkedin.com/in/giorgio)
- **Github**: [https://github.com/giorgioduscio](https://github.com/giorgioduscio)

---

*© 2025 - Giorgio. Tutti i diritti riservati.*