import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  Briefcase,
  IndianRupee,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { insightService } from '../services/api';

const ROLES = [
  { id: 'backend-dev', label: 'Backend Engineer (Node/Go/Java)' },
  { id: 'fullstack-dev', label: 'Full Stack Engineer (React/Node)' },
  { id: 'ai-ml-engineer', label: 'AI / Machine Learning & GenAI' },
  { id: 'devops-sre', label: 'DevOps & Site Reliability (SRE)' },
  { id: 'product-designer', label: 'Product & UI/UX Designer' },
  { id: 'product-manager', label: 'Product Manager (Tech & Growth)' },
  { id: 'data-engineer', label: 'Data Engineer (Big Data & Streaming)' },
];

const EXPERIENCE_OPTIONS = [
  'Entry-level (0-2 yrs)',
  'Mid-level (3-5 yrs)',
  'Senior-level (6-9 yrs)',
  'Lead / Principal (10+ yrs)',
];

const LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Delhi NCR (Gurgaon / Noida)',
  'Mumbai',
  'Chennai',
  'Remote (Pan-India)',
];

const SalaryCalculatorWidget = ({ className = '' }) => {
  const [selectedRole, setSelectedRole] = useState('fullstack-dev');
  const [selectedExp, setSelectedExp] = useState('Mid-level (3-5 yrs)');
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru');

  const [projection, setProjection] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCalculation = async (roleId, exp, loc) => {
    setLoading(true);
    try {
      const res = await insightService.calculateProjection({
        roleId,
        experienceLevel: exp,
        location: loc,
      });
      if (res.data.success) {
        setProjection(res.data.projection);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculation(selectedRole, selectedExp, selectedLocation);
  }, [selectedRole, selectedExp, selectedLocation]);

  // Clean location query string for direct job search
  const cleanLocationQuery = selectedLocation.split(' ')[0].replace('(', '');

  return (
    <div className={`bg-white rounded-3xl border border-zinc-200/90 shadow-xl overflow-hidden ${className}`}>
      {/* Widget Header */}
      <div className="bg-[#242424] text-white p-6 sm:p-8 relative">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-[#C5F36A] text-[#242424] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 India Market Compensation Tracker</span>
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            Live Verified Hiring Benchmarks
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
          What is Your Market Worth in India Today?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
          Real-time salary medians, city premium indexes, and the highest-paying skills required to hit the top 10% percentile.
        </p>
      </div>

      {/* Widget Interactive Controls */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
              Select Your Specialization
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#F7F7F2] border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#242424] focus:outline-none focus:border-[#242424] cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experience level */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
              Experience Bracket
            </label>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="w-full bg-[#F7F7F2] border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#242424] focus:outline-none focus:border-[#242424] cursor-pointer"
            >
              {EXPERIENCE_OPTIONS.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          {/* Location hub */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
              City / Work Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#F7F7F2] border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#242424] focus:outline-none focus:border-[#242424] cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Calculation Output Display */}
        {projection && (
          <div className="bg-[#F7F7F2] rounded-2xl p-6 border border-zinc-200/80 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Estimated Current Market Compensation
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#242424]">
                    ₹{projection.salaryRange?.minLPA || projection.projectedRange?.min || 15} - ₹{projection.salaryRange?.maxLPA || projection.projectedRange?.max || 35} LPA
                  </span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                    Median: ₹{projection.salaryRange?.medianLPA || projection.projectedRange?.median || 24} LPA
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Based on current Indian tech startups, unicorns, and Tier-1 product enterprises.
                </p>
              </div>

              {/* City Multiplier Badge */}
              <div className="bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs shrink-0 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
                  <MapPin className="w-4 h-4 text-[#84cc16]" />
                  <span>{projection.location || selectedLocation}</span>
                </div>
                <p className="text-xs font-semibold text-[#242424]">
                  City Index: <span className="font-extrabold text-emerald-600">{projection.cityPremium || '+0%'}</span> vs baseline
                </p>
                <div className="text-[11px] text-zinc-400">Demand: {projection.hiringDemand || projection.marketDemand || 'High'}</div>
              </div>
            </div>

            {/* In-Demand Skills Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core required skills */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    Core In-Demand Skills for this Bracket
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(projection.topSkillsRequired || []).map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-800 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* High-growth trending skills */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    High-Leverage Skills That Boost Salary (+30%)
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(projection.hotSkillsTrending || []).map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#C5F36A] text-[#242424] border border-[#b4e850] shadow-2xs flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-[#242424]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA directly linking to matching jobs */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-zinc-600 font-medium">
                Want to apply to roles matching this exact salary bracket?
              </span>
              <Link
                to={`/jobs?keyword=${encodeURIComponent((projection.roleTitle || '').split(' ')[0])}&location=${encodeURIComponent(cleanLocationQuery)}&minSalary=${projection.salaryRange?.minLPA || 15}`}
                className="inline-flex items-center justify-center gap-2 bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                <span>View Matching Jobs in {projection.location || selectedLocation}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryCalculatorWidget;
