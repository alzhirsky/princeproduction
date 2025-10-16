# Telegram Marketplace Frontend

This project replicates the Telegram Marketplace web app interface from the provided Figma design. It is implemented as a Vite + React + TypeScript single-page application that matches the original UI, animations, and flows.

## Getting started

1. Clone the repository and move into the project folder:

   ```bash
   git clone <your-repo-url>
   cd princeproduction
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   npm start
   ```

   If you encounter `Missing script: "dev"`, confirm you are inside the cloned `princeproduction` directory. Running `npm run` will list the scripts detected in your current folder.

Open http://localhost:5173 in your browser to view the application. The UI is optimized for a 430px wide viewport to mirror the original mobile layout.

## Available scripts

- `npm run dev` – start the development server
- `npm run build` – produce a production build in `dist`
- `npm run preview` – preview the production build
- `npm run lint` – run TypeScript for type-checking

## Technology stack

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS with the shadcn/ui component primitives
- Motion for animations
- Radix UI primitives for accessible components
- Sonner for toasts and notifications
