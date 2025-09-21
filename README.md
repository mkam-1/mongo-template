# Mongo Template 🚀

A production-ready **Express + MongoDB** starter template with:

- 🔑 Role-based Authentication (JWT, refresh tokens, email verification)
- 🛡 Centralized Error Handling
- 📖 Swagger API Documentation
- 📦 Modular Structure (controllers, services, validation, models, routes)
- 🌱 Seeders (Admin, Users, etc.)
- ⚡ Ready for Public & Private APIs

---

## 📂 Project Structure
```

src
├── config/         # App & DB config
├── controllers/    # Route controllers
├── middlewares/    # Auth, validation, error handling
├── models/         # Mongoose schemas
├── routes/         # Public & private routes
├── services/       # Business logic
├── swagger/        # API docs
├── utils/          # Helpers
├── validation/     # Joi/Yup schemas
└── seeders/        # DB seeders
server.js

````

---

## 🚀 Setup
```bash
git clone https://github.com/<your-username>/mongo-template.git
cd mongo-template
npm install
````

Create `.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/app_db
JWT_SECRET=supersecret
FRONTEND_URL=http://localhost:3000
```

Run:

```bash
npm run dev
```

---

## 📖 API Docs

Visit: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🌱 Seeders

Run seeders:

```bash
npm run seed
```

(Default seeds an admin if not exists)

---

💡 This project is meant as a **clean template** to kickstart new Mongo + Express projects fast.