const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobboard';
    await mongoose.connect(mongoURI);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await SavedJob.deleteMany();
    console.log('🗑️ Existing collections cleared.');

    // Password hash for demo users
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('Password123!', salt);

    // Create a demo resume file if not present
    const resumesDir = path.join(__dirname, '../../uploads/resumes');
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir, { recursive: true });
    }
    const demoResumePath = path.join(resumesDir, 'sample-resume.pdf');
    if (!fs.existsSync(demoResumePath)) {
      fs.writeFileSync(
        demoResumePath,
        '%PDF-1.4\n1 0 obj\n<< /Title (Demo Resume - Arjun Sharma) /Author (Elevate Careers) >>\nendobj\n%%EOF'
      );
    }

    // 1. Create Demo Employers
    const employers = await User.create([
      {
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
      },
      {
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
      },
      {
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
          companyDescription: 'Zerodha pioneered discount broking in India and is the largest retail brokerage by volume, running lean, frugal, high-scale systems.',
        },
      },
      {
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
          companyDescription: 'Freshworks builds delightful software for customer engagement, IT service management, and CRM, serving thousands of enterprises worldwide.',
        },
      },
    ]);

    // 2. Create Demo Candidates
    const candidates = await User.create([
      {
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
          education: [
            {
              degree: 'B.Tech in Computer Science & Engineering',
              institution: 'National Institute of Technology Karnataka (NITK)',
              year: '2021',
            },
          ],
          experience: [
            {
              title: 'Senior Software Engineer',
              company: 'FinStack Tech Labs',
              duration: '2023 - Present',
              description: 'Architected microservices processing over 2M daily webhook transactions with 99.98% uptime.',
            },
            {
              title: 'Software Engineer',
              company: 'CloudMatrix Solutions',
              duration: '2021 - 2023',
              description: 'Developed responsive frontend dashboard using React and Tailwind CSS.',
            },
          ],
        },
      },
      {
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
      },
    ]);

    console.log('✅ Demo users seeded successfully.');

    // 3. Realistic India-Focused Jobs
    const jobsData = [
      {
        employerId: employers[0]._id, // Razorpay
        title: 'Senior Backend Engineer (Payments Core)',
        company: 'Razorpay India',
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
      },
      {
        employerId: employers[1]._id, // Swiggy
        title: 'Lead Frontend Architect (Customer Experience)',
        company: 'Swiggy',
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
      },
      {
        employerId: employers[2]._id, // Zerodha
        title: 'Staff Site Reliability Engineer (Infrastructure)',
        company: 'Zerodha',
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
        description: `Zerodha is looking for an extraordinary SRE to safeguard the reliability, security, and performance of Kite—the trading platform executing over 15% of all Indian stock market transactions every single trading day.

We believe in extreme simplicity, open-source tooling, and disciplined engineering without unnecessary bloat.`,
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
      },
      {
        employerId: employers[3]._id, // Freshworks
        title: 'Lead Product Designer (Enterprise SaaS)',
        company: 'Freshworks India',
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
        description: `Freshworks is seeking a Lead Product Designer to champion intuitive enterprise experiences for our flagship CRM and Support suites in Chennai.

You will transform complex business workflows into simple, elegant, and joyful user interfaces that empower support agents worldwide.`,
        responsibilities: [
          'Drive end-to-end design from customer journey mapping and user interviews to high-fidelity Figma components.',
          'Partner with product managers and engineers across global time zones to ensure seamless implementation.',
          'Contribute to and evolve our global design system (Crayons).',
          'Conduct qualitative usability testing and synthesize quantitative analytics.',
        ],
        qualifications: [
          '5+ years experience designing complex B2B SaaS or enterprise web applications.',
          'Exceptional portfolio showcasing strategic thinking, systems design, and pixel-perfect craft.',
          'Expertise in Figma, interactive prototyping, and design tokens.',
        ],
        skills: ['Figma', 'UI/UX Design', 'Design Systems', 'B2B SaaS', 'User Research', 'Prototyping'],
      },
      {
        employerId: employers[0]._id, // Razorpay
        title: 'Senior Data Scientist (Fraud & Risk AI)',
        company: 'Razorpay India',
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
        description: `Join Razorpay’s Risk Intelligence unit in Hyderabad to architect cutting-edge machine learning models that detect fraud, chargebacks, and AML anomalies in real-time across millions of transactions daily.`,
        responsibilities: [
          'Build, train, and deploy real-time ML classifiers using gradient boosting (XGBoost/LightGBM) and deep graph networks.',
          'Deploy low-latency feature stores and streaming inference pipelines on AWS/GCP.',
          'Collaborate with fraud analysts to uncover new attack vectors and adversarial behavior.',
        ],
        qualifications: [
          '4+ years practical experience applying Machine Learning to tabular or fraud data in production.',
          'Strong programming abilities in Python, PyTorch/TensorFlow, SQL, and Spark.',
          'Experience deploying models with MLflow, Docker, and REST/gRPC endpoints.',
        ],
        skills: ['Python', 'Machine Learning', 'XGBoost', 'PyTorch', 'Feature Store', 'SQL', 'Fraud Detection'],
      },
      {
        employerId: employers[1]._id, // Swiggy
        title: 'Product Marketing Manager (Instamart Quick Commerce)',
        company: 'Swiggy',
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
        description: `Lead product marketing and hyper-local growth campaigns for Swiggy Instamart across the West India region. Drive user acquisition, repeat order frequency, and brand affinity.`,
        responsibilities: [
          'Develop go-to-market strategies for quick-commerce category launches and seasonal promotions.',
          'Partner with creative agencies, digital performance marketing, and category managers.',
          'Analyze user retention funnels and design compelling in-app marketing triggers.',
        ],
        qualifications: [
          '3-6 years product marketing or growth marketing experience in consumer tech / D2C / eCommerce.',
          'Data-driven mindset with deep grasp of CAC, LTV, retention cohorts, and attribution modeling.',
        ],
        skills: ['Product Marketing', 'Growth Marketing', 'GTM Strategy', 'User Acquisition', 'Analytics'],
      },
      {
        employerId: employers[2]._id, // Zerodha
        title: 'Full Stack Engineer (Trading Tools & APIs)',
        company: 'Zerodha',
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
        description: `Zerodha is offering a 100% remote role for a versatile Full Stack Developer to build next-generation algorithmic trading interfaces and developer SDKs for the Kite Connect ecosystem.`,
        responsibilities: [
          'Develop fast, responsive trader interfaces in Vue.js/React and Python.',
          'Maintain high-throughput WebSocket feeds delivering tick-by-tick real-time stock quotes.',
          'Document developer APIs and assist fintech startups integrating with Zerodha.',
        ],
        qualifications: [
          '3+ years full-stack development experience.',
          'Proficiency with Python, JavaScript/TypeScript, and relational databases.',
          'Self-motivated, disciplined remote worker with strong written communication.',
        ],
        skills: ['React', 'Python', 'WebSockets', 'PostgreSQL', 'APIs', 'TypeScript'],
      },
      {
        employerId: employers[3]._id, // Freshworks
        title: 'Enterprise Business Development Lead',
        company: 'Freshworks India',
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
        description: `Drive enterprise pipeline growth across North India for Freshworks SaaS solutions. Connect with CIOs, CTOs, and heads of customer experience to solve digital transformation challenges.`,
        responsibilities: [
          'Prospect, qualify, and close high-value annual contracts with Fortune 500 & top Indian enterprises.',
          'Work closely with Solutions Engineers to conduct tailored technical demonstrations.',
          'Meet and exceed quarterly revenue quotas.',
        ],
        qualifications: [
          '5+ years enterprise B2B software sales or consultative business development experience.',
          'Proven record of consistently surpassing quotas in enterprise software or cloud solutions.',
        ],
        skills: ['Enterprise Sales', 'B2B Sales', 'SaaS', 'Negotiation', 'CRM', 'Account Management'],
      },
      {
        employerId: employers[1]._id, // Swiggy
        title: 'Junior DevOps Engineer (Cloud Operations)',
        company: 'Swiggy',
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
        description: `Exciting opportunity for an energetic junior cloud engineer to kickstart their career with Swiggy’s world-class cloud infrastructure team in Pune.`,
        responsibilities: [
          'Assist in maintaining automated CI/CD pipelines in GitLab and GitHub Actions.',
          'Monitor AWS infrastructure alarms and participate in triage procedures.',
          'Write automation scripts in Bash and Python for infrastructure tasks.',
        ],
        qualifications: [
          '0-2 years experience or strong academic/internship background in cloud technologies.',
          'Familiarity with Docker, Linux shell, AWS fundamentals, and Git.',
        ],
        skills: ['AWS', 'Docker', 'Linux', 'Git', 'CI/CD', 'Bash', 'Python'],
      },
    ];

    const createdJobs = await Job.create(jobsData);
    console.log(`✅ ${createdJobs.length} realistic Indian jobs created.`);

    // 4. Create a demo application so dashboards immediately have rich data
    const demoApp = await Application.create({
      jobId: createdJobs[0]._id, // Razorpay Backend
      candidateId: candidates[0]._id, // Arjun Sharma
      candidateName: candidates[0].name,
      candidateEmail: candidates[0].email,
      candidatePhone: candidates[0].profile.phone,
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
    });

    // Update applicant count
    await Job.findByIdAndUpdate(createdJobs[0]._id, { applicantCount: 1 });

    // 5. Create a saved job for Arjun
    await SavedJob.create({
      candidateId: candidates[0]._id,
      jobId: createdJobs[1]._id, // Swiggy Frontend
    });

    console.log('✅ Demo applications and saved jobs seeded.');
    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Employer Login: recruiter@razorpay-demo.com / Password123!');
    console.log('Candidate Login: arjun.sharma@demo.com / Password123!');
    console.log('-------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
