const bcrypt = require('bcryptjs');

// In-Memory Database store for zero-config offline/demo execution
// Pre-seeded with realistic Indian tech ecosystem data

const salt = bcrypt.genSaltSync(10);
const demoPasswordHash = bcrypt.hashSync('Password123!', salt);

const initialUsers = [
  {
    _id: '664500000000000000000001',
    name: 'Rohan Mehta',
    email: 'recruiter@razorpay-demo.com',
    passwordHash: demoPasswordHash,
    role: 'employer',
    profile: {
      title: 'Director of Talent Acquisition',
      companyName: 'Razorpay India',
      companyWebsite: 'https://razorpay.com',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      headquarters: 'Bengaluru, Karnataka',
      industry: 'Fintech & Payments',
      companySize: '1,000-5,000',
      companyDescription: 'Razorpay is India’s leading payments and banking platform for businesses, powering seamless financial transactions for over 10 million merchants.',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '664500000000000000000002',
    name: 'Ananya Deshmukh',
    email: 'hiring@swiggy-demo.com',
    passwordHash: demoPasswordHash,
    role: 'employer',
    profile: {
      title: 'Lead Tech Recruiter',
      companyName: 'Swiggy',
      companyWebsite: 'https://swiggy.com',
      companyLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=128&auto=format&fit=crop&q=80',
      headquarters: 'Bengaluru, Karnataka',
      industry: 'Consumer Tech & Logistics',
      companySize: '5,000+',
      companyDescription: 'Swiggy is India’s leading on-demand convenience platform, delivering food, groceries, and essentials with tech-first logistics.',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '664500000000000000000003',
    name: 'Karthik Nambiar',
    email: 'talent@zerodha-demo.com',
    passwordHash: demoPasswordHash,
    role: 'employer',
    profile: {
      title: 'VP of Engineering',
      companyName: 'Zerodha',
      companyWebsite: 'https://zerodha.com',
      companyLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=80',
      headquarters: 'Bengaluru, Karnataka',
      industry: 'Discount Broking & WealthTech',
      companySize: '1,000-2,000',
      companyDescription: 'Zerodha pioneered discount broking in India and is the largest retail brokerage by volume.',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '664500000000000000000004',
    name: 'Siddharth Iyer',
    email: 'careers@freshworks-demo.com',
    passwordHash: demoPasswordHash,
    role: 'employer',
    profile: {
      title: 'Global Talent Lead',
      companyName: 'Freshworks India',
      companyWebsite: 'https://freshworks.com',
      companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&auto=format&fit=crop&q=80',
      headquarters: 'Chennai, Tamil Nadu',
      industry: 'Enterprise SaaS & CRM',
      companySize: '5,000+',
      companyDescription: 'Freshworks builds delightful software for customer engagement, IT service management, and CRM.',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '664500000000000000000005',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@demo.com',
    passwordHash: demoPasswordHash,
    role: 'candidate',
    profile: {
      title: 'Senior Full Stack Engineer',
      bio: 'Passionate software engineer with 5+ years building scalable web applications with React, Node.js, and distributed databases in high-growth Indian tech startups.',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'Next.js'],
      experienceYears: 5,
      defaultResumePath: 'sample-resume.pdf',
      defaultResumeName: 'Arjun_Sharma_Resume_2026.pdf',
      linkedinUrl: 'https://linkedin.com/in/arjun-sharma-demo',
      githubUrl: 'https://github.com/arjun-sharma-demo',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '664500000000000000000006',
    name: 'Priya Patel',
    email: 'priya.patel@demo.com',
    passwordHash: demoPasswordHash,
    role: 'candidate',
    profile: {
      title: 'Product & UX Designer',
      bio: 'UI/UX Designer who loves crafting high-converting, user-centric SaaS interfaces and scalable design systems.',
      phone: '+91 91234 56789',
      location: 'Pune, Maharashtra',
      skills: ['Figma', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Tailwind CSS'],
      experienceYears: 4,
      defaultResumePath: 'sample-resume.pdf',
      defaultResumeName: 'Priya_Patel_Design_Portfolio.pdf',
      linkedinUrl: 'https://linkedin.com/in/priya-patel-design',
      portfolioUrl: 'https://priyapatel.design',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialJobs = [
  {
    _id: '664510000000000000000001',
    employerId: '664500000000000000000001',
    title: 'Senior Backend Engineer (Payments Core)',
    company: 'Razorpay India',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://razorpay.com',
    category: 'Software Development',
    location: 'Bengaluru, Karnataka',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Senior-level',
    salary: { min: 28, max: 42, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: true,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 1,
    description: `Razorpay is seeking an experienced Senior Backend Engineer to join our Core Payments Infrastructure team in Bengaluru. In this role, you will build and scale high-throughput, low-latency financial systems handling billions in gross transaction volume monthly.

You will design resilient payment pipelines, collaborate with major banking partners across India, and drive architectural choices that power the digital economy.`,
    responsibilities: [
      'Design, build, and optimize mission-critical payment processing microservices in Go and Node.js.',
      'Guarantee sub-100ms response latencies and zero-downtime deployments under massive traffic spikes.',
      'Collaborate with Product Managers, Risk, and Security engineers to implement regulatory compliance and fraud detection mechanisms.',
      'Mentor junior engineers and uphold code craftsmanship, comprehensive automated testing, and CI/CD best practices.',
    ],
    qualifications: [
      '4-8 years of experience building high-scale distributed backend systems.',
      'Strong proficiency in Node.js, Go, or Java with deep understanding of concurrency and asynchronous architectures.',
      'Hands-on expertise with relational and NoSQL databases (PostgreSQL, MongoDB, Redis, Kafka).',
      'Solid understanding of payment gateways, banking APIs, ISO 8583, or fintech ecosystems is a strong plus.',
    ],
    skills: ['Node.js', 'Go', 'Distributed Systems', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'],
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000002',
    employerId: '664500000000000000000002',
    title: 'Lead Frontend Architect (Customer Experience)',
    company: 'Swiggy',
    companyLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://swiggy.com',
    category: 'Software Development',
    location: 'Bengaluru, Karnataka',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Lead / Principal',
    salary: { min: 45, max: 65, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: true,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Join Swiggy as our Lead Frontend Architect to shape the consumer ordering experience relied upon by tens of millions of food lovers across 500+ Indian cities.

You will lead frontend modernization, web performance optimization (Core Web Vitals), and spearhead our unified design system across web and mobile web platforms.`,
    responsibilities: [
      'Own the frontend technical strategy, performance budgets, and component architecture for web applications.',
      'Optimize render performance, bundle sizes, and caching mechanisms to achieve instant loads on 3G/4G networks.',
      'Lead a team of 10+ frontend engineers, conducting code reviews and defining best practices.',
      'Collaborate closely with UX researchers and product owners to rapidly A/B test innovative checkout experiences.',
    ],
    qualifications: [
      '7+ years of frontend engineering experience with 2+ years in technical leadership.',
      'Mastery of Modern React, Next.js, TypeScript, state management, and modern browser rendering lifecycles.',
      'Demonstrated track record of delivering 90+ Lighthouse performance scores on high-traffic consumer web applications.',
      'Strong empathy for user experience and visual design precision.',
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'Performance Optimization', 'Architecture', 'Design Systems'],
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000003',
    employerId: '664500000000000000000003',
    title: 'Staff Site Reliability Engineer (Infrastructure)',
    company: 'Zerodha',
    companyLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://zerodha.com',
    category: 'DevOps & Cloud',
    location: 'Bengaluru, Karnataka',
    workplaceMode: 'On-site',
    jobType: 'Full-time',
    experienceLevel: 'Senior-level',
    salary: { min: 35, max: 50, currency: 'INR', period: 'LPA', negotiable: false },
    isFeatured: true,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Zerodha is looking for an extraordinary SRE to safeguard the reliability, security, and performance of Kite—the trading platform executing over 15% of all Indian stock market transactions every single trading day.`,
    responsibilities: [
      'Manage and scale bare-metal and hybrid cloud Linux clusters handling millions of active concurrent WebSocket connections.',
      'Design automated failover, disaster recovery, and real-time observability telemetry using Prometheus and Grafana.',
      'Audit and harden network infrastructure against DDoS and market volatility shocks.',
      'Work directly with core developers to eliminate system bottlenecks and memory leaks.',
    ],
    qualifications: [
      '5+ years experience in SRE or Systems Engineering with high-availability requirements (99.99%+).',
      'Deep Linux kernel, TCP/IP networking, and storage subsystem troubleshooting skills.',
      'Proficiency with Kubernetes, Terraform, Ansible, and scripting in Python or Go.',
      'Calm mindset under pressure during live trading market hours.',
    ],
    skills: ['Linux', 'Kubernetes', 'Prometheus', 'Grafana', 'Go', 'Networking', 'Terraform'],
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000004',
    employerId: '664500000000000000000004',
    title: 'Lead Product Designer (Enterprise SaaS)',
    company: 'Freshworks India',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://freshworks.com',
    category: 'Design',
    location: 'Chennai, Tamil Nadu',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Senior-level',
    salary: { min: 22, max: 35, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: false,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Freshworks is seeking a Lead Product Designer to champion intuitive enterprise experiences for our flagship CRM and Support suites in Chennai.`,
    responsibilities: [
      'Drive end-to-end design from customer journey mapping and user interviews to high-fidelity Figma components.',
      'Partner with product managers and engineers across global time zones to ensure seamless implementation.',
      'Contribute to and evolve our global design system (Crayons).',
    ],
    qualifications: [
      '5+ years experience designing complex B2B SaaS or enterprise web applications.',
      'Exceptional portfolio showcasing strategic thinking, systems design, and pixel-perfect craft.',
      'Expertise in Figma, interactive prototyping, and design tokens.',
    ],
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'B2B SaaS', 'User Research', 'Prototyping'],
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000005',
    employerId: '664500000000000000000001',
    title: 'Senior Data Scientist (Fraud & Risk AI)',
    company: 'Razorpay India',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://razorpay.com',
    category: 'Data & AI',
    location: 'Hyderabad, Telangana',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Senior-level',
    salary: { min: 30, max: 48, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: true,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Join Razorpay’s Risk Intelligence unit in Hyderabad to architect cutting-edge machine learning models that detect fraud, chargebacks, and AML anomalies in real-time across millions of transactions daily.`,
    responsibilities: [
      'Build, train, and deploy real-time ML classifiers using gradient boosting (XGBoost/LightGBM) and deep graph networks.',
      'Deploy low-latency feature stores and streaming inference pipelines on AWS/GCP.',
      'Collaborate with fraud analysts to uncover new attack vectors.',
    ],
    qualifications: [
      '4+ years practical experience applying Machine Learning to tabular or fraud data in production.',
      'Strong programming abilities in Python, PyTorch/TensorFlow, SQL, and Spark.',
    ],
    skills: ['Python', 'Machine Learning', 'XGBoost', 'PyTorch', 'Feature Store', 'SQL', 'Fraud Detection'],
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000006',
    employerId: '664500000000000000000002',
    title: 'Product Marketing Manager (Instamart Quick Commerce)',
    company: 'Swiggy',
    companyLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://swiggy.com',
    category: 'Marketing',
    location: 'Mumbai, Maharashtra',
    workplaceMode: 'On-site',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    salary: { min: 18, max: 28, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: false,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Lead product marketing and hyper-local growth campaigns for Swiggy Instamart across the West India region. Drive user acquisition, repeat order frequency, and brand affinity.`,
    responsibilities: [
      'Develop go-to-market strategies for quick-commerce category launches and seasonal promotions.',
      'Partner with creative agencies, digital performance marketing, and category managers.',
    ],
    qualifications: [
      '3-6 years product marketing or growth marketing experience in consumer tech / D2C / eCommerce.',
    ],
    skills: ['Product Marketing', 'Growth Marketing', 'GTM Strategy', 'User Acquisition', 'Analytics'],
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000007',
    employerId: '664500000000000000000003',
    title: 'Full Stack Engineer (Trading Tools & APIs)',
    company: 'Zerodha',
    companyLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://zerodha.com',
    category: 'Software Development',
    location: 'Remote',
    workplaceMode: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    salary: { min: 20, max: 32, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: false,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Zerodha is offering a 100% remote role for a versatile Full Stack Developer to build next-generation algorithmic trading interfaces and developer SDKs for the Kite Connect ecosystem.`,
    responsibilities: [
      'Develop fast, responsive trader interfaces in Vue.js/React and Python.',
      'Maintain high-throughput WebSocket feeds delivering tick-by-tick real-time stock quotes.',
    ],
    qualifications: [
      '3+ years full-stack development experience with Python and JavaScript/TypeScript.',
    ],
    skills: ['React', 'Python', 'WebSockets', 'PostgreSQL', 'APIs', 'TypeScript'],
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000008',
    employerId: '664500000000000000000004',
    title: 'Enterprise Business Development Lead',
    company: 'Freshworks India',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://freshworks.com',
    category: 'Business',
    location: 'Delhi NCR',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Senior-level',
    salary: { min: 24, max: 38, currency: 'INR', period: 'LPA', negotiable: true },
    isFeatured: false,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Drive enterprise pipeline growth across North India for Freshworks SaaS solutions. Connect with CIOs, CTOs, and heads of customer experience to solve digital transformation challenges.`,
    responsibilities: [
      'Prospect, qualify, and close high-value annual contracts with Fortune 500 & top Indian enterprises.',
    ],
    qualifications: [
      '5+ years enterprise B2B software sales or consultative business development experience.',
    ],
    skills: ['Enterprise Sales', 'B2B Sales', 'SaaS', 'Negotiation', 'CRM', 'Account Management'],
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '664510000000000000000009',
    employerId: '664500000000000000000002',
    title: 'Junior DevOps Engineer (Cloud Operations)',
    company: 'Swiggy',
    companyLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=128&auto=format&fit=crop&q=80',
    companyWebsite: 'https://swiggy.com',
    category: 'DevOps & Cloud',
    location: 'Pune, Maharashtra',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Entry-level',
    salary: { min: 8, max: 14, currency: 'INR', period: 'LPA', negotiable: false },
    isFeatured: false,
    isVerified: true,
    isDemo: true,
    status: 'active',
    applicantCount: 0,
    description: `Exciting opportunity for an energetic junior cloud engineer to kickstart their career with Swiggy’s world-class cloud infrastructure team in Pune.`,
    responsibilities: [
      'Assist in maintaining automated CI/CD pipelines in GitLab and GitHub Actions.',
      'Monitor AWS infrastructure alarms and participate in triage procedures.',
    ],
    qualifications: [
      '0-2 years experience or strong academic/internship background in cloud technologies.',
    ],
    skills: ['AWS', 'Docker', 'Linux', 'Git', 'CI/CD', 'Bash', 'Python'],
    createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
];

const initialApplications = [
  {
    _id: '664520000000000000000001',
    jobId: '664510000000000000000001',
    candidateId: '664500000000000000000005',
    candidateName: 'Arjun Sharma',
    candidateEmail: 'arjun.sharma@demo.com',
    candidatePhone: '+91 98765 43210',
    resumePath: 'sample-resume.pdf',
    resumeOriginalName: 'Arjun_Sharma_Resume_2026.pdf',
    coverLetter:
      'I have been working with distributed Node.js microservices and high-volume transaction systems for over 4 years. I admire Razorpay’s engineering culture and would love the opportunity to contribute to the core payments infrastructure.',
    portfolioUrl: 'https://github.com/arjun-sharma-demo',
    status: 'Under Review',
    statusHistory: [
      { status: 'Submitted', changedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000), notes: 'Application received' },
      { status: 'Under Review', changedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000), notes: 'Profile shortlisted for technical screening' },
    ],
    employerNotes: 'Impressive fintech background and solid system design experience.',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    updatedAt: new Date(),
  },
];

const initialSavedJobs = [
  {
    _id: '664530000000000000000001',
    candidateId: '664500000000000000000005',
    jobId: '664510000000000000000002',
    createdAt: new Date(),
  },
];

class InMemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.jobs = [...initialJobs];
    this.applications = [...initialApplications];
    this.savedJobs = [...initialSavedJobs];
  }

  // Users
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u._id.toString() === id.toString());
  }

  createUser(userData) {
    const newUser = {
      _id: 'user_' + Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updateData) {
    const index = this.users.findIndex((u) => u._id.toString() === id.toString());
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updateData, updatedAt: new Date() };
      return this.users[index];
    }
    return null;
  }

  // Jobs
  findJobs({ keyword, location, category, workplaceMode, experienceLevel, minSalary, maxSalary, sort, featured, employerId }) {
    let result = this.jobs.filter((j) => (employerId ? j.employerId.toString() === employerId.toString() : j.status === 'active'));

    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(kw))) ||
          j.description.toLowerCase().includes(kw)
      );
    }

    if (location && location !== 'All Locations') {
      result = result.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (category && category !== 'All Categories') {
      result = result.filter((j) => j.category === category);
    }

    if (workplaceMode && workplaceMode !== 'All Modes') {
      result = result.filter((j) => j.workplaceMode === workplaceMode);
    }

    if (experienceLevel && experienceLevel !== 'All Levels') {
      result = result.filter((j) => j.experienceLevel === experienceLevel);
    }

    if (minSalary) {
      result = result.filter((j) => j.salary?.max >= Number(minSalary));
    }
    if (maxSalary) {
      result = result.filter((j) => j.salary?.min <= Number(maxSalary));
    }

    if (featured === 'true' || featured === true) {
      result = result.filter((j) => j.isFeatured);
    }

    // Sort
    if (sort === 'salary-high') {
      result.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
    } else if (sort === 'salary-low') {
      result.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
    } else if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  findJobById(id) {
    const job = this.jobs.find((j) => j._id.toString() === id.toString());
    if (!job) return null;
    const employer = this.findUserById(job.employerId);
    return {
      ...job,
      employerId: employer
        ? {
            _id: employer._id,
            name: employer.name,
            email: employer.email,
            profile: employer.profile,
          }
        : null,
    };
  }

  createJob(jobData) {
    const newJob = {
      _id: 'job_' + Date.now() + Math.floor(Math.random() * 1000),
      status: 'active',
      applicantCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...jobData,
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  updateJob(id, updateData) {
    const index = this.jobs.findIndex((j) => j._id.toString() === id.toString());
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...updateData, updatedAt: new Date() };
      return this.jobs[index];
    }
    return null;
  }

  deleteJob(id) {
    const index = this.jobs.findIndex((j) => j._id.toString() === id.toString());
    if (index !== -1) {
      this.jobs.splice(index, 1);
      // Remove associated applications
      this.applications = this.applications.filter((a) => a.jobId.toString() !== id.toString());
      return true;
    }
    return false;
  }

  // Applications
  findApplicationsByCandidate(candidateId) {
    return this.applications
      .filter((a) => a.candidateId.toString() === candidateId.toString())
      .map((a) => {
        const job = this.jobs.find((j) => j._id.toString() === a.jobId.toString());
        return {
          ...a,
          jobId: job
            ? {
                _id: job._id,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                workplaceMode: job.workplaceMode,
                jobType: job.jobType,
                status: job.status,
                isVerified: job.isVerified,
                isDemo: job.isDemo,
              }
            : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findApplicationsForEmployer(employerId, jobId, status) {
    const employerJobIds = this.jobs
      .filter((j) => j.employerId.toString() === employerId.toString())
      .map((j) => j._id.toString());

    let apps = this.applications.filter((a) => employerJobIds.includes(a.jobId.toString()));

    if (jobId) {
      apps = apps.filter((a) => a.jobId.toString() === jobId.toString());
    }

    if (status && status !== 'All') {
      apps = apps.filter((a) => a.status === status);
    }

    return apps
      .map((a) => {
        const job = this.jobs.find((j) => j._id.toString() === a.jobId.toString());
        const candidate = this.findUserById(a.candidateId);
        return {
          ...a,
          jobId: job ? { _id: job._id, title: job.title, company: job.company, location: job.location, status: job.status } : null,
          candidateId: candidate ? { _id: candidate._id, name: candidate.name, email: candidate.email, profile: candidate.profile } : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findApplicationById(id) {
    const app = this.applications.find((a) => a._id.toString() === id.toString());
    if (!app) return null;
    const job = this.jobs.find((j) => j._id.toString() === app.jobId.toString());
    const candidate = this.findUserById(app.candidateId);
    return {
      ...app,
      jobId: job ? { ...job } : null,
      candidateId: candidate ? { ...candidate } : null,
    };
  }

  createApplication(appData) {
    const newApp = {
      _id: 'app_' + Date.now() + Math.floor(Math.random() * 1000),
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          changedAt: new Date(),
          notes: 'Application received',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...appData,
    };
    this.applications.unshift(newApp);

    // Increment applicant count on job
    const job = this.jobs.find((j) => j._id.toString() === appData.jobId.toString());
    if (job) {
      job.applicantCount = (job.applicantCount || 0) + 1;
    }

    return newApp;
  }

  updateApplicationStatus(id, newStatus, notes) {
    const app = this.applications.find((a) => a._id.toString() === id.toString());
    if (!app) return null;
    app.status = newStatus;
    if (notes) app.employerNotes = notes;
    app.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      notes: notes || `Status changed to ${newStatus}`,
    });
    app.updatedAt = new Date();
    return app;
  }

  // Saved Jobs
  getSavedJobsForCandidate(candidateId) {
    const saved = this.savedJobs.filter((s) => s.candidateId.toString() === candidateId.toString());
    return saved
      .map((s) => this.jobs.find((j) => j._id.toString() === s.jobId.toString()))
      .filter(Boolean);
  }

  saveJob(candidateId, jobId) {
    const exists = this.savedJobs.some(
      (s) => s.candidateId.toString() === candidateId.toString() && s.jobId.toString() === jobId.toString()
    );
    if (exists) return null;
    const item = {
      _id: 'saved_' + Date.now(),
      candidateId,
      jobId,
      createdAt: new Date(),
    };
    this.savedJobs.push(item);
    return item;
  }

  unsaveJob(candidateId, jobId) {
    const index = this.savedJobs.findIndex(
      (s) => s.candidateId.toString() === candidateId.toString() && s.jobId.toString() === jobId.toString()
    );
    if (index !== -1) {
      this.savedJobs.splice(index, 1);
      return true;
    }
    return false;
  }
}

const store = new InMemoryStore();
module.exports = store;
