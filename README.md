# Nuxt Todo App

A professional CRUD application built with Nuxt 4, Vue 3, Bootstrap 5, and SASS.

## 🛠️ Development Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Locally preview production build.
- `npx nuxt prepare`: Generate internal Nuxt files (auto-imports, types).

## 🚀 Getting Started with Docker

The easiest way to run this project is using Docker Compose. This ensures a consistent environment for all developers.

### Prerequisites
- Docker
- Docker Compose

### Run the Application
1. Clone the repository.
2. Navigate to the project root.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Open your browser and go to [http://localhost:3000](http://localhost:3000).

*Note: If you add new dependencies, remember to restart the environment using `docker-compose down -v && docker-compose up --build` to refresh the volumes.*

---

## 📂 Project Structure

This project follows a professional Nuxt 4 directory structure, optimized for scalability and maintainability.

```text
nuxt-vue-demo/
├── app/                    # Main application directory (Nuxt 4 standard)
│   ├── assets/             # Global styles (SASS), images, and fonts
│   ├── components/         # Reusable Vue components
│   ├── middleware/         # Navigation guards and custom middleware
│   ├── pages/              # Application views (File-based routing)
│   │   ├── index.vue       # Home page
│   └── app.vue             # Main entry point and layout wrapper
├── public/                 # Static assets served at the root (robots.txt, favicon)
├── docker-compose.yaml     # Orchestration for containerized development
├── Dockerfile              # Container configuration
├── nuxt.config.ts          # Nuxt framework configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

### Key Decisions
- **Bootstrap 5**: Used for rapid and responsive UI development.
- **SASS (Indented Syntax)**: Integrated via `sass-embedded` for professional-grade styling.
- **LocalStorage Persistence**: The Todo list state is persisted in the browser's local storage for a better user experience without a dedicated backend.
- **Nuxt 4 Ready**: Leveraging the `app/` directory structure for forward compatibility.

---


