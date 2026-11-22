# 💼 Elevate Careers — Modern Tech Recruitment Platform

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?logo=github-actions&logoColor=white)](https://github.com/NB-CSE/JOB_BOARD/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> A modern, high-performance tech hiring platform engineered to eliminate job search clutter and total salary opacity for product startups and developers in India.

🔗 **Live Web Application:** [https://nb-cse.github.io/JOB_BOARD/](https://nb-cse.github.io/JOB_BOARD/)  
📂 **GitHub Repository:** [https://github.com/NB-CSE/JOB_BOARD](https://github.com/NB-CSE/JOB_BOARD)

---

## 🎯 The Problem & Our Solution

Traditional recruitment portals in India often suffer from three major friction points:
1. **Ghost Postings & Clutter:** Unverified spam and expired job listings.
2. **Slow, Reload-Heavy Filters:** Cumbersome multi-second page reloads for every single filter change.
3. **Total Salary Opacity:** Listings lack realistic compensation benchmarks, leaving candidates in the dark.

### ⚡ How Elevate Careers Solves This:
- **Sub-100ms Client-Side Filtering:** Zero page reloads using React 19 memoized state algorithms across role, tech stack, remote tier, and startup size.
- **Salary Intelligence Benchmark Engine:** An interactive compensation calculator providing realistic, data-modeled LPA medians across Bangalore, Mumbai, Gurgaon, and Hyderabad.
- **Dual Candidate & Employer Portals:** A streamlined 2-step applicant modal with resume file validation, alongside a dedicated employer listing dashboard.
- **Automated DevOps:** Dual-job GitHub Actions CI/CD with automated testing, linting, and continuous zero-error deployment to GitHub Pages.

---

## 🚀 Key Features

### 1. 🔍 Sub-100ms Real-Time Search & Multi-Tag Filter
- Instant filtering across:
  - **Role:** Software Engineering, Data & AI, Product & Design, DevOps & Cloud, Business.
  - **Location:** Bengaluru, Hyderabad, Pune, Delhi NCR, and Remote (Pan-India).
  - **Workplace Mode:** On-site, Hybrid, Remote.
  - **Experience Tier:** Entry-level (0–2 yrs), Mid (3–5 yrs), Senior (5+ yrs).
- Clickable tech stack badges to isolate React, Node.js, Python, or Go positions immediately.

### 2. 💰 Salary Intelligence Benchmark Engine
- Dynamic compensation calculator estimating live market LPA medians based on:
  - Role complexity.
  - Candidate seniority and years of experience.
  - Location tier (Tier-1 Indian tech hubs vs Tier-2).
- Empowers candidates with negotiation transparency before applying.

### 3. 📋 2-Step Application Modal
- Frictionless modal with instant client-side validation.
- PDF resume file validation, LinkedIn/GitHub portfolio links, and error boundaries.

### 4. 🏢 Employer Hub & Verified Startup Directory
- Detailed employer profiles showcasing verified engineering cultures, tech stacks, and team sizes.

---

## 🛠️ Architecture & Tech Stack

```
elevate-careers/
├── frontend/                     # React 19 + Vite SPA Client
│   ├── src/
│   │   ├── components/           # Navbar, Footer, FilterBar, JobCard, SalaryCalculatorWidget
│   │   ├── pages/                # HomePage, JobsPage, CompaniesPage, SalaryGuidePage
│   │   ├── context/              # AuthContext & FilterContext
│   │   └── services/             # API services & mockData fallback
│   ├── index.html
│   └── vite.config.js
└── backend/                      # Node.js + Express REST API
    ├── src/
    │   ├── models/               # Job, User, Company schemas (Mongoose)
    │   ├── routes/               # /api/jobs, /api/auth, /api/companies
    │   ├── middleware/           # JWT auth, rate limiter, error handler
    │   └── server.js
    └── package.json
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/NB-CSE/JOB_BOARD.git
cd JOB_BOARD
```

### 2. Install dependencies & run frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. (Optional) Run backend API
```bash
cd ../backend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173/` with hot module replacement (HMR).

---

## 👤 Author

**Naresh Behra**
- **GitHub:** [@NB-CSE](https://github.com/NB-CSE)
- **LinkedIn:** [https://www.linkedin.com/in/naresh-b25269381](https://www.linkedin.com/in/naresh-b25269381)
- **Portfolio:** [https://nb-cse.github.io/PORTFOLIO/](https://nb-cse.github.io/PORTFOLIO/)
- **Email:** nareshbehra911@gmail.com

---

## 📄 License

This project is licensed under the ISC License.
