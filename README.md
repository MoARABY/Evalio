# Evalio

**Evalio** is an online examination management system (REST API) built with Node.js, Express, and MongoDB. It supports role-based access (admin/teacher/student), exam and question management, exam attempts, submissions, and result publishing.

This repository contains backend API code, Docker configuration, and a route-organized controller structure for exams, users, authentication, and results.

Quick summary
- Language & runtime: Node.js
- Web framework: Express
- Database: MongoDB (Mongoose)
- Cache: Redis
- Auth: JWT + cookies

---

Table of contents
- Overview
- Features
- Tech stack
- Requirements
- Installation
- Environment variables
- Running (local / Docker)
- API endpoints (summary)
- Project structure
- Contributing
- License

---

Features
- User management: Sign up, login, logout, profile, admin CRUD on users
- Auth & roles: JWT-based authentication, role/permission checks (admin/teacher/student)
- Exam lifecycle: Create, publish/unpublish exams; attach class level, academic year, terms, subjects
- Exam attempts: Start attempts, submit answers per question, finalize submission
- Results: Persist results in a separate model and publish/unpublish them
- Security: Helmet, rate limiting, input sanitizers, XSS protection

---

Tech stack
- Node.js and Express
- MongoDB with Mongoose ODM
- Redis for caching/visits tracking
- Nodemailer for emails (password reset)

---

Requirements
- Node.js (>=16 recommended)
- npm
- MongoDB (local or via Docker)
- Redis (local or via Docker)

---

Installation (local)
1. Clone and open project
```powershell
git clone https://github.com/MoARABY/Evalio.git
cd "Evalio"
```
2. Install dependencies
```powershell
npm install
```
3. Copy `.env.example` (or create `.env`) and set variables (see "Environment variables" section)
4. Start development server
```powershell
npm run dev
```

Server runs by default on the port from `process.env.PORT` (fallback `3000`) and exposes these test routes:
- `GET /` -> health response
- `GET /api/v1` -> API welcome message

---

Docker
The project includes a `Dockerfile` and `docker-compose.yml` configured to run the app with MongoDB and Redis.

Run with Docker Compose:

```powershell
docker compose up --build
```

The compose file exposes MongoDB (`27017`) and Redis (`6379`) and maps the app port to `PORT` in your `.env` (defaults to `3000`).

---

Scripts
- `npm start` — run `node server.js` (production start)
- `npm run dev` — run `nodemon server.js` (development)

---

API Endpoints (summary)
Base path for APIs: `/api/v1`

- Auth: `/api/v1/auth`
  - `POST /signup` — register new user
  - `POST /login` — login (sets `authorization` cookie)
  - `POST /logout` — clear cookie
  - `GET /profile` — get logged user's profile
  - `PUT /` — update logged user
  - `PUT /changePassword` — change logged user's password
  - `POST /forgotPassword` — send reset code via email
  - `POST /verifyCode` — verify reset code
  - `POST /resetPassword` — set a new password

- Users: `/api/v1/users`
  - `GET /` — list users (cached middleware applied)
  - `POST /` — create user (admin only)
  - `GET /:id` — get user (admin only)
  - `PUT /:id` — update user (admin only)
  - `DELETE /:id` — remove user (admin only)
  - `PUT /:id/password` — admin changes user's password
  - `PUT /:id/suspend` — suspend user
  - `PUT /:id/unsuspend` — unsuspend user

- Content routes included (see `src/Routes`):
  - `/api/v1/academic-years`
  - `/api/v1/academic-terms`
  - `/api/v1/subjects`
  - `/api/v1/class-levels`
  - `/api/v1/programs`
  - `/api/v1/exams`
  - `/api/v1/questions`
  - `/api/v1/exam-attempts`
  - `/api/v1/exam-results`

Refer to the individual route files under `src/Routes` for full method lists and validation middleware.

---

Auth flow (brief)
- User registers via `POST /api/v1/auth/signup`.
- User logs in via `POST /api/v1/auth/login` and receives a JWT in an `authorization` cookie.
- Protected routes use `verifyToken` and `allowedTo` middlewares to check tokens and roles.

---

Example requests

- Signup (curl)
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","email":"student1@example.com","password":"pass1234","phone":"+201234567890"}'
```

- Login (curl)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"student1@example.com","password":"pass1234"}'
```

Use the saved `cookies.txt` when calling protected endpoints with `curl -b cookies.txt`.

---

Project structure (important files)
- `server.js`: app bootstrap, middlewares, route mounting, DB/Redis init
- `DB/DBconfig.js`: MongoDB connection
- `DB/redisConfig.js`: Redis client & connection
- `DB/Models/*`: Mongoose models (User, Exam, Question, Result, ...)
- `src/Controllers/*`: Route handlers and business logic
- `src/Routes/*`: Route definitions and validators
- `src/Middlewares/*`: error handling, auth, rate limiting, caching

---

Troubleshooting & Tips
- If Mongo refuses connection, ensure `DB_STRING` is correct — for Docker, use the compose service name `mongo` in the URI when calling from the `app` container.
- Redis URL should be a proper redis scheme (e.g. `redis://redis:6379` when used in Docker Compose).
- If emails fail, enable debug logs or test with an SMTP testing service (Mailtrap).

---

Contributing
- Fork the repository and create a feature branch.
- Run tests (if/when added) and ensure linting passes.
- Open a pull request describing the change.

---

License
- This project currently uses `ISC` per `package.json` (update as appropriate).

---

If you'd like, I can also generate a minimal `ENV.example` file, add API documentation (Swagger), or produce Postman collection examples next.
