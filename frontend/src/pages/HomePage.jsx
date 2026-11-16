import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Code,
  Brain,
  Palette,
  TrendingUp,
  Cloud,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import JobCard from '../components/JobCard';
import ApplicationModal from '../components/ApplicationModal';
import SalaryCalculatorWidget from '../components/SalaryCalculatorWidget';
import { jobService } from '../services/api';

const CATEGORIES_DATA = [
  {
    name: 'Software Development',
    icon: Code,
    desc: 'Frontend, Backend, Fullstack, Mobile',
  },
  {
    name: 'Data & AI',
    icon: Brain,
    desc: 'Machine Learning, Data Engineering, LLMs',
  },
  {
    name: 'Design',
    icon: Palette,
    desc: 'UI/UX Design, Product Design, Design Systems',
  },
  {
    name: 'DevOps & Cloud',
    icon: Cloud,
    desc: 'AWS, Kubernetes, CI/CD, SRE',
  },
  {
    name: 'Business',
    icon: Briefcase,
    desc: 'B2B Sales, Partnerships, Operations',
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    desc: 'Growth Marketing, Performance, SEO',
  },
];

const POPULAR_SEARCHES = [
  'React',
  'Node.js',
  'Bengaluru',
  'Remote',
  'Python',
  'Data Scientist',
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search input state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Application modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const [featRes, recentRes] = await Promise.all([
          jobService.getFeaturedJobs(),
          jobService.getJobs({ limit: 6, sort: 'newest' }),
        ]);

        if (featRes.data.success) {
          setFeaturedJobs(featRes.data.jobs || []);
        }
        if (recentRes.data.success) {
          setRecentJobs(recentRes.data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to load homepage jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('keyword', searchKeyword.trim());
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#242424_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-zinc-200/80 rounded-full px-4 py-1.5 shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C5F36A] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              India's Modern Career Platform
            </span>
          </div>

          {/* Heading required by PRD Section 4 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#242424] tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Find Work That <br className="hidden sm:inline" />
            <span className="relative inline-block">
              Moves You Forward.
              <span className="absolute left-0 bottom-1.5 w-full h-3 bg-[#C5F36A] -z-10 rounded-sm"></span>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Discover verified tech, product, and leadership roles at India's highest-growth startups and established tech enterprises.
          </p>

          {/* Main Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-zinc-200/80 flex flex-col md:flex-row items-center gap-2"
          >
            {/* Title / Skill / Company input */}
            <div className="flex items-center gap-3 w-full px-3 py-2 border-b md:border-b-0 md:border-r border-zinc-100">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full text-sm sm:text-base text-[#242424] placeholder-zinc-400 focus:outline-none bg-transparent font-medium"
              />
            </div>

            {/* Location input */}
            <div className="flex items-center gap-3 w-full px-3 py-2">
              <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="City (e.g. Bengaluru, Remote)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full text-sm sm:text-base text-[#242424] placeholder-zinc-400 focus:outline-none bg-transparent font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto shrink-0 bg-[#242424] hover:bg-black text-[#C5F36A] font-bold text-sm sm:text-base px-7 py-3 rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-600">Trending:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(term)}`)}
                className="bg-white/80 hover:bg-white text-zinc-700 hover:text-black px-3 py-1 rounded-full border border-zinc-200/80 transition-colors font-medium"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Verification Disclosure note required by PRD */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Real-time job verification enabled. Demo listings are explicitly labeled.
            </span>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE CATEGORIES */}
      <section className="py-14 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">
                Browse Roles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] mt-1">
                Explore by Domain
              </h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#242424] hover:underline underline-offset-4"
            >
              <span>View All 8+ Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="group p-6 rounded-2xl border border-zinc-200/90 bg-[#F7F7F2]/50 hover:bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-200 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-[#C5F36A] border border-zinc-200 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-6 h-6 text-[#242424]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#242424] text-base group-hover:text-black">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.5 SALARY & SKILLS INTELLIGENCE CALCULATOR */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SalaryCalculatorWidget />
      </section>

      {/* 3. FEATURED JOBS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#242424] bg-[#C5F36A] px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3 h-3 text-[#242424]" />
              Handpicked
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424]">
              Featured Career Opportunities
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Top prioritized roles from verified tech employers in India
            </p>
          </div>

          <Link
            to="/jobs?featured=true"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#242424] hover:underline underline-offset-4"
          >
            <span>See All Featured Roles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-zinc-200/60 animate-pulse"
              ></div>
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200">
            <p className="text-zinc-500 text-sm">No featured jobs found right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApplyClick={() => handleOpenApply(job)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. EMPLOYER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="bg-[#242424] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          {/* Lime accent decorative circles */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#C5F36A]/10 pointer-events-none blur-2xl"></div>

          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#C5F36A]">
              For Tech Employers & Hiring Leaders
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Hire the Top 1% Engineering & Product Talent in India
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Reach thousands of pre-vetted senior software engineers, system architects, and design leaders actively looking for their next milestone.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/register?role=employer"
                className="bg-[#C5F36A] hover:bg-[#b4e850] text-[#242424] font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Post a Job Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/companies"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors border border-white/20"
              >
                Explore Employer Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENTLY POSTED JOBS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">
              Fresh Listings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] mt-1">
              Recently Added Roles
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#242424] hover:underline underline-offset-4"
          >
            <span>View All Open Positions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-zinc-200/60 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApplyClick={() => handleOpenApply(job)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            // refresh data if needed
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
