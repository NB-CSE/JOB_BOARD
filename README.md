# Elevate Careers — Professional Job Board Platform

A modern, full-stack job board platform built for discovering, applying to, and managing tech and product opportunities in India. Built with React (Vite), Tailwind CSS, Node.js/Express, MongoDB (Mongoose), JWT authentication, Multer resume uploads, and Nodemailer email notifications.

---

## 🎨 UI/UX Design System

Adheres strictly to the creative design requirements:
- **Primary Background:** Off-white (`#F7F7F2`)
- **Primary Text:** Charcoal gray (`#242424`)
- **Accent Color:** Lime green (`#C5F36A`)
- **Secondary Background:** Clean white (`#FFFFFF`)
- **Typography & Components:** Generous spacing, subtle borders, rounded cards (`rounded-2xl` / `rounded-3xl`), smooth transitions, responsive across mobile, tablet, and desktop.
- **Honest Disclosures:** Demo data is explicitly labeled with `Demo Data` badges and never claimed to be live vacancies.

---

## 🚀 Key Features

### For Candidates
- **Homepage & Search:** Hero search by title, skills, company, or Indian tech hub (Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, Chennai, Remote).
- **Salary & Skills Market Intelligence Hub (2026):**
  - **Live Interactive Compensation Calculator:** Pick Specialization (AI/ML, Backend, Fullstack, DevOps, Design, Product) + Experience (0-2y, 3-5y, 6-9y, 10y+) + City (Bengaluru, Hyderabad, Pune, Delhi NCR, Mumbai, Chennai, Remote) -> get real-time compensation brackets (Min, Median, Max LPA) and location premium index.
  - **In-Demand Skills Matrix:** Real-time analysis of highest-paying skills (Generative AI & LLMs, Go Microservices, Kubernetes Platform Engineering, React 19 / Next.js 15, B2B SaaS Design) with salary boost percentages (+25% to +50%).
  - **Tech Hubs Index:** Multiplier vs national baseline, living costs, and dominant tech sectors per city.
  - **Role Compensation Ladders:** Full comparison table across tech titles and seniority brackets.
- **Domain Categories:** Software Development, Data & AI, Design, DevOps & Cloud, Marketing, Business, Product & Management.
- **Job Listings & Filters:** Keyword search, multi-filter by city, category, workplace mode (Remote, Hybrid, On-site), experience level, and interactive minimum salary slider in LPA (₹).
- **Job Details:** Comprehensive description, key responsibilities, required qualifications, skill badges, and similar role recommendations.
- **Dedicated Application Modal:** Apply with candidate info, upload new resume (PDF, DOC, DOCX up to 5MB) or use profile-saved default resume, add optional cover letter and portfolio links.
- **Candidate Dashboard:**
  - Track applications with live status badges (`Submitted`, `Under Review`, `Interviewing`, `Offered`, `Rejected`, `Withdrawn`) and status timeline.
  - Ability to withdraw applications.
  - Saved / bookmarked jobs directory.
  - Profile management (headline, skills, bio, phone, location, links, default resume upload & preview).

### For Employers
- **Employer Dashboard:**
  - **My Postings:** Manage active/closed listings, track applicant counts per job, quick links to public job pages.
  - **Job Publishing / Editing:** Create or edit roles with Indian salary ranges in LPA (₹), categories, workplace mode, qualifications, and skills.
  - **Applicant Review:** View candidate details, review cover letters, download/view uploaded resumes securely, and update application status (`Under Review`, `Interviewing`, `Offered`, `Rejected`).
  - **Company Profile:** Customize company name, website, headquarters, company size, and company description.
  - **Strict Multi-tenant Security:** Employers are strictly isolated—they can only access, edit, or delete their own jobs and view applications for their own positions.

### Notifications & Security
- **Email Notifications (Nodemailer):**
  - Instant application confirmation email to candidate.
  - New candidate alert email to employer.
  - Status update notification email to candidate when status changes.
  - Resilient design: email failures are safely handled without losing saved application data.
- **Security:**
  - Password hashing with bcrypt (10 rounds).
  - JWT token authentication with role-based route guards (`candidate` vs `employer`).
  - Strict file validation: Multer validates file extensions and MIME types (PDF, DOC, DOCX) with a 5MB size limit.
  - Rate limiting on API routes and stricter limits on authentication endpoints.

### Market Intelligence Endpoints
- `GET /api/insights/salary-benchmarks`: Real-time salary ladders across tech roles.
- `GET /api/insights/locations`: Tech hub multipliers, cost indexes, and dominant sectors.
- `GET /api/insights/skills`: High-leverage skills directory with salary boost percentages.
- `POST /api/insights/calculate`: Dynamic calculator taking `roleId`, `experienceLevel`, and `location` to project compensation in ₹ LPA.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, React Router DOM v7, Axios |
| **Backend** | Node.js, Express.js, Mongoose, CORS, Express Rate Limit |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **File Storage** | Multer with disk storage and secure route authorization |
| **Email Delivery** | Nodemailer with SMTP (with fallback console previews) |

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Test Available)

For instant testing, pre-configured accounts are available on the Login page:

| Role | Email | Password | Details |
|---|---|---|---|
| **Demo Candidate** | `arjun.sharma@demo.com` | `Password123!` | Senior Full Stack Engineer (Bengaluru) |
| **Demo Employer** | `recruiter@razorpay-demo.com` | `Password123!` | Razorpay India (Hiring Manager) |
| **Alternative Employer** | `hiring@swiggy-demo.com` | `Password123!` | Swiggy (Tech Recruiter) |

---

## 📦 Project Structure

```
JOB-BOARD/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & Nodemailer configuration
│   │   ├── controllers/     # Auth, Job, Application, and User business logic
│   │   ├── middleware/      # JWT protect/authorize, Multer upload, errorHandler
│   │   ├── models/          # User, Job, Application, SavedJob Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Email templates & seedData.js
│   │   └── server.js        # Main Express server entry point
│   ├── uploads/resumes/     # Secure folder for uploaded candidate resumes
│   ├── .env.example         # Example environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, JobCard, JobFilters, ApplicationModal, etc.
│   │   ├── context/         # AuthContext (login, register, logout, profile update)
│   │   ├── pages/           # HomePage, JobListingsPage, JobDetailPage, Dashboards, etc.
│   │   ├── services/        # Axios API service with auth interceptor
│   │   ├── App.jsx          # Routes & layout definition
│   │   ├── index.css        # Tailwind CSS v4 & theme variables
│   │   └── main.jsx
│   ├── vite.config.js       # Vite configuration with API proxy
│   └── package.json
├── package.json             # Root helper scripts
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB: MongoDB Atlas connection string (or a local MongoDB instance)

### 2. Configure Backend Environment
Navigate to `backend/` and configure your `.env` file (copied from `.env.example`):
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Set your MongoDB Atlas URI or local connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobboard?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=elevate_careers_jwt_secret_token_2026_super_secure_key
JWT_EXPIRE=30d

# Optional SMTP Settings for Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL="Elevate Careers" <notifications@elevatecareers.io>
```

> **Note on Email:** If `SMTP_HOST` is left blank, notifications will log cleanly to the backend terminal for preview without blocking the application flow.

### 3. Seed Demo Data (Indian Jobs & Accounts)
Populate the database with realistic Indian jobs (salaries in ₹ LPA, hubs in Bengaluru, Pune, Hyderabad, etc.):
```bash
cd backend
npm run seed
```

### 4. Run the Project
Open two terminals or run from root:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5001`*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Push the code to GitHub.
2. In Vercel, import the repository and set the **Root Directory** to `frontend`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://elevate-backend.onrender.com/api`).

### Backend Deployment (Render)
1. In Render, create a new **Web Service** pointing to the repository.
2. Set the **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `node src/server.js`
5. Configure Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random secret
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://elevate-careers.vercel.app`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional)
