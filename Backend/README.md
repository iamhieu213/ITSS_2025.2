# StudyMates Backend

Node.js + Express API for the StudyMates classroom/team-matching app.

The current runnable backend uses a local JSON data file at `data/studymates.json`, so it does not require login, migrations, or a separate database server while the frontend is still being shaped. The Prisma schema is kept in `prisma/schema.prisma` for the later SQLite/PostgreSQL migration path.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Main endpoints

- `GET /api/health`
- `GET /api/classroom`
- `GET /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `GET /api/teams`
- `POST /api/teams`
- `POST /api/teams/:id/join-requests`
- `GET /api/profile/me`
