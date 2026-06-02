# ITSS Studio Fullstack Website

React + Tailwind frontend, Node.js + Express backend, Prisma + SQLite database.

## Run locally

Backend:

```bash
cd Backend
copy .env.example .env
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Frontend:

```bash
cd Frontend
copy .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

Admin login:

- Email: `admin@itss.local`
- Password: `admin123`
