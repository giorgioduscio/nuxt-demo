# Usa l'immagine Node LTS (Alpine per leggerezza)
FROM node:22-alpine

# Installa le dipendenze di sistema necessarie
RUN apk add --no-cache libc6-compat

# Crea la directory di lavoro
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa tutte le dipendenze (incluse quelle di sviluppo necessarie per la build)
RUN npm install

# Copia il resto dei file del progetto
COPY . .

# Genera la cartella .nuxt per evitare problemi di permessi o moduli mancanti
RUN npx nuxt prepare

# Esponi la porta 3000
EXPOSE 3000

# Variabili d'ambiente per il networking di Nuxt
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development

# Avvia l'app in modalità sviluppo
CMD ["npm", "run", "dev"]
