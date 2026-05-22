echo "[1/3] Avvio (http://localhost:3000)"
docker compose up -d

echo "[2/3] Prompt del container"
docker compose exec nuxt-vue-demo sh

echo "[3/3] Stop"
docker compose stop