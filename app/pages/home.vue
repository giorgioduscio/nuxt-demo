<script setup lang="ts">
// Interfaccia unificata per funzionalità e strumenti
interface Tool {
  title: string;
  description: string;
  icon: string;
}

// Array delle funzionalità
const features: Tool[] = [
  {
    title: "Creazione CV Personalizzati",
    description: "Crea CV unici con template predefiniti (professionale, creativo, minimale) e personalizza ogni dettaglio.",
    icon: "bi-file-earmark-person"
  },
  {
    title: "Filtraggio e Ricerca Avanzata",
    description: "Trova rapidamente i tuoi CV salvati grazie alla ricerca testuale con pattern debounce per ottimizzare le prestazioni.",
    icon: "bi-search"
  },
  {
    title: "Anteprima in Tempo Reale",
    description: "Visualizza in anteprima il tuo CV mentre lo modifichi, con stili adatti sia per il digitale che per la stampa.",
    icon: "bi-eye"
  },
  {
    title: "Esportazione in PDF",
    description: "Scarica il tuo CV in formato PDF per la stampa o la condivisione, con un clic.",
    icon: "bi-file-earmark-pdf"
  },
  {
    title: "Salvataggio Locale",
    description: "I tuoi CV vengono salvati automaticamente nel localStorage per una persistenza tra sessioni.",
    icon: "bi-save"
  },
  {
    title: "UI Responsiva",
    description: "Design adattivo che funziona perfettamente su desktop, tablet e mobile.",
    icon: "bi-phone"
  }
];

// Array degli strumenti utilizzati
const tools: Tool[] = [
  {
    title: "Nuxt 4",
    description: "Framework principale per SSR, routing e ottimizzazione delle prestazioni.",
    icon: "bi-lightning-charge"
  },
  {
    title: "Vue 3",
    description: "Libreria reattiva per la creazione di interfacce utente dinamiche e interattive.",
    icon: "bi-vue"
  },
  {
    title: "Bootstrap 5",
    description: "Framework CSS per stili e componenti UI responsivi e moderni.",
    icon: "bi-bootstrap"
  },
  {
    title: "SASS",
    description: "Preprocessore CSS per stili avanzati e variabili globalmente gestite.",
    icon: "bi-palette"
  },
  {
    title: "TypeScript",
    description: "Tipizzazione statica per codice robusto, manutenibile e privo di errori.",
    icon: "bi-code-slash"
  },
  {
    title: "html2pdf.js",
    description: "Libreria per generare PDF lato client direttamente dal DOM.",
    icon: "bi-file-pdf"
  },
  {
    title: "Valibot",
    description: "Sistema di validazione dei form con schemi tipizzati per dati sicuri e coerenti.",
    icon: "bi-check-square"
  },
  {
    title: "Docker",
    description: "Containerizzazione per ambienti di sviluppo e produzione isolati e riproducibili.",
    icon: "bi-docker"
  }
];

definePageMeta({
  title: 'Home',
  description: 'Genera, visualizza e scarica CV digitali e stampabili con Nuxt 4 e Vue 3.',
  icon: 'home'
});
</script>

<template>
  <div class="container py-5">
    <!-- Hero Section -->
    <div class="row justify-content-center mb-5">
      <div class="col-md-10 text-center">
        <h1 class="display-4 fw-bold mb-4">Nuxt CV Generator</h1>
        <p class="lead mb-4">
          Un'applicazione professionale per <strong>generare, visualizzare e scaricare CV</strong> in formato digitale e PDF.
          Sviluppata con <strong>Nuxt 4, Vue 3, Bootstrap 5</strong> e <strong>SASS</strong>.
        </p>
        <NuxtLink to="/cv/list" class="btn btn-primary btn-lg px-5 me-3">
          <i class="bi bi-file-earmark-person-fill me-2"></i>Crea il tuo CV
        </NuxtLink>
        <!-- <NuxtLink to="/about" class="btn btn-outline-secondary btn-lg px-5">
          <i class="bi bi-info-circle me-2"></i>Scopri di più
        </NuxtLink> -->
      </div>
    </div>

    <!-- Features Section -->
    <div class="row justify-content-center mb-5">
      <div class="col-md-10">
        <h2 class="text-center mb-4">Funzionalità Principali</h2>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="(feature, index) in features" :key="index">
            <div class="card h-100 shadow-sm text-bg-dark">
              <div class="card-body text-center">
                <i :class="'bi ' + feature.icon" class="fs-1 text-primary mb-3"></i>
                <h3 class="card-title h5 text-primary">{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tools Section -->
    <div>
      <div>
        <h2 class="text-center mb-4">Strumenti Utilizzati</h2>
        <div class="table-responsive border rounded">
          <table class="m-0 table table-hover table-dark">
            <thead class="table-secondary">
              <tr>
                <th scope="col">Strumento</th>
                <th scope="col">Descrizione</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tool, index) in tools" :key="index">
                <td class="text-nowrap">
                  <i :class="tool.icon" class="fs-4 me-2"></i>
                  <strong>{{ tool.title }}</strong>
                </td>
                <td>{{ tool.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>