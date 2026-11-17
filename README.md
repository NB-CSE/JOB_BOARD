# 🚀 Elevate Careers — Modern Full-Stack Job Board Platform

<p align="center">
  <a href="https://nb-cse.github.io/JOB_BOARD/">
    <img src="https://img.shields.io/badge/🌐_LIVE_WEBSITE-Visit_Elevate_Careers-C5F36A?style=for-the-badge&labelColor=242424&logoColor=C5F36A" alt="Live Demo" height="38" />
  </a>
</p>

<p align="center">
  <b>🔗 Live Public URL:</b> <a href="https://nb-cse.github.io/JOB_BOARD/">https://nb-cse.github.io/JOB_BOARD/</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Pages-Deployed-222222?logo=github&logoColor=white" />
</p>

---

## 🌟 Key Highlights & Features

### 1. 🎯 Job Discovery & Smart Filters
- **Real-Time Search:** Search across tech jobs by title, company, required skill, or location.
- **Dynamic Filtering:** Filter by Indian tech cities (**Bengaluru**, **Hyderabad**, **Pune**, **Delhi NCR**, **Mumbai**, **Chennai**, **Remote**), workplace mode (Remote, Hybrid, On-site), category, and experience level.
- **Salary in INR (LPA):** Realistic Indian salary ranges displayed clearly.

### 2. 💡 2026 Industry Salary & Skills Intelligence Calculator
- Interactive widget to calculate projected compensation based on **Role**, **Experience Level**, **Indian Tech Hub**, and **Skill Stack**.
- Instant market demand levels (e.g. *🔥 Peak Demand*, *+45% YoY growth*).
- Hot trending skills breakdown (*RAG Architecture, Go Microservices, Next.js App Router, Platform Engineering*).

### 3. 👥 Dual Dashboard System
- **Employer Dashboard:** Post new job openings, manage active listings, review candidate applications, and inspect uploaded resumes.
- **Candidate Dashboard:** Manage developer profile, track applied roles, view application statuses (*Applied, Under Review, Shortlisted*), and bookmark jobs.

### 4. 📄 Resume Upload & Security
- Secure PDF/Word resume uploads with file type & size validation.
- JWT-based role-based access control (Candidate vs Employer).
- Bcrypt password hashing.

### 5. ⚡ Dual-Mode Resilient Database
- **Connected Mode:** Seamless MongoDB Atlas connection via Mongoose.
- **Client Offline Mode:** Smart fallback adapter on GitHub Pages allowing zero-downtime, fully interactive demo functionality without requiring a local database!

---

## 🔑 Demo Login Credentials

Try the live platform directly with pre-configured demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Employer / Recruiter** | `employer@demo.com` | `Password123` |
| **Candidate / Job Seeker** | `candidate@demo.com` | `Password123` |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React Icons, Axios, React Router v7
- **Backend:** Node.js, Express.js, MongoDB Atlas / Mongoose, JWT, Multer, Nodemailer
- **CI/CD:** Automated GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- **Hosting:** GitHub Pages (Frontend), Render / Vercel ready (`render.yaml`, `vercel.json`)

---

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/NB-CSE/JOB_BOARD.git
cd JOB_BOARD
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5001
```

### 3. Start Frontend Client
```bash
cd ../frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

<p align="center">
  Designed & Built with ❤️ for India's Tech Community
</p>
