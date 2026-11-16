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
  Building2,
  DollarSign,
  Compass,
} from 'lucide-react';
import SalaryCalculatorWidget from '../components/SalaryCalculatorWidget';
import { insightService } from '../services/api';

const SalaryGuidePage = () => {
  const [benchmarks, setBenchmarks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const [benchRes, locRes, skillRes] = await Promise.all([
          insightService.getSalaryBenchmarks(),
          insightService.getLocations(),
          insightService.getSkills(),
        ]);

        if (benchRes.data.success) setBenchmarks(benchRes.data.benchmarks || []);
        if (locRes.data.success) setLocations(locRes.data.locations || []);
        if (skillRes.data.success) setSkills(skillRes.data.skills || []);
      } catch (err) {
        console.error('Failed to load salary insights:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C5F36A] text-[#242424] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2026 India Tech Industry Benchmark Report</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#242424] tracking-tight leading-tight">
            Current Salaries & In-Demand Skills <br className="hidden sm:inline" />
            in the Indian Tech Ecosystem
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            Discover real-time compensation trends across Bengaluru, Hyderabad, Pune, Delhi NCR, and Remote roles. Benchmark your compensation, evaluate skill premiums, and plan your next career leap.
          </p>
        </div>

        {/* 1. INTERACTIVE LIVE SALARY CALCULATOR WIDGET */}
        <section>
          <SalaryCalculatorWidget />
        </section>

        {/* 2. HOTTEST IN-DEMAND SKILLS MATRIX */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Skills Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] mt-1">
                Highest-Paying Tech Skills in India (2026)
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Skills yielding the highest salary bumps during engineering and product hiring.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#242424] hover:underline"
            >
              <span>Explore Roles with these Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {skill.demandLevel}
                    </span>
                    <span className="text-xs font-extrabold text-[#242424] bg-[#C5F36A] px-2 py-0.5 rounded-md">
                      {skill.averageSalaryBoost} Boost
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#242424] mb-2 leading-snug">
                    {skill.name}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                    {skill.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-100 text-xs">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Experience Sweet Spot:</span>
                    <strong className="text-zinc-900">{skill.experienceBestSuited}</strong>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Top Hiring Hubs:</span>
                    <span className="font-semibold text-zinc-800">{skill.topCities.join(', ')}</span>
                  </div>

                  <Link
                    to={`/jobs?keyword=${encodeURIComponent(skill.name.split(' ')[0])}`}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-xl bg-zinc-100 hover:bg-[#242424] hover:text-[#C5F36A] text-[#242424] transition-colors"
                  >
                    <span>View Open Jobs Requiring This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TECH HUBS & LOCATION SALARY MULTIPLIERS */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Geographic Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] mt-1">
              Location Compensation Index (Top Indian Tech Cities)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              How tech salaries compare across Indian metro cities, living expenses, and primary recruiting sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.city}
                className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-[#242424]">{loc.city}</h3>
                    <p className="text-xs text-zinc-400 font-semibold">{loc.title}</p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-xl bg-[#242424] text-[#C5F36A]">
                      {loc.salaryMultiplier >= 1 ? `+${Math.round((loc.salaryMultiplier - 1) * 100)}%` : `${Math.round((loc.salaryMultiplier - 1) * 100)}%`}
                    </span>
                    <span className="block text-[10px] text-zinc-400 mt-0.5">vs National Avg</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {loc.description}
                </p>

                {/* Key Sectors */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                    Dominant Tech Sectors
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {loc.keySectors.map((sec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F7F7F2] text-zinc-700 border border-zinc-200"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Popular Skills */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                    Skills Most In-Demand
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {loc.popularSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Living Cost: <strong className="text-zinc-700">{loc.costIndex}</strong></span>
                  <Link
                    to={`/jobs?location=${encodeURIComponent(loc.city.split(' ')[0])}`}
                    className="font-bold text-[#242424] hover:underline flex items-center gap-1"
                  >
                    <span>Browse {loc.city.split(' ')[0]} Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. COMPREHENSIVE ROLE MATRIX TABLE */}
        <section className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Role Matrix
            </span>
            <h2 className="text-2xl font-extrabold text-[#242424] mt-1">
              Indian Tech Salary Ladders by Experience (in ₹ LPA)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Annual base compensation ranges in Lakhs Per Annum (excluding bonus and equity grants).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-[#F7F7F2]">
                  <th className="py-3 px-4 font-bold text-[#242424] rounded-l-xl">Role Title</th>
                  <th className="py-3 px-4 font-bold text-[#242424]">Entry (0-2y)</th>
                  <th className="py-3 px-4 font-bold text-[#242424]">Mid (3-5y)</th>
                  <th className="py-3 px-4 font-bold text-[#242424]">Senior (6-9y)</th>
                  <th className="py-3 px-4 font-bold text-[#242424]">Lead (10y+)</th>
                  <th className="py-3 px-4 font-bold text-[#242424] rounded-r-xl">Hiring Demand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {benchmarks.map((b) => (
                  <tr key={b.roleId} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#242424]">
                      <div>{b.roleTitle}</div>
                      <span className="text-[11px] text-zinc-400 font-normal">{b.category}</span>
                    </td>
                    <td className="py-4 px-4 text-zinc-700 font-medium">
                      ₹{b.experienceLevels['Entry-level (0-2 yrs)']?.min} - ₹{b.experienceLevels['Entry-level (0-2 yrs)']?.max} LPA
                    </td>
                    <td className="py-4 px-4 text-zinc-700 font-medium">
                      ₹{b.experienceLevels['Mid-level (3-5 yrs)']?.min} - ₹{b.experienceLevels['Mid-level (3-5 yrs)']?.max} LPA
                    </td>
                    <td className="py-4 px-4 font-bold text-[#242424]">
                      ₹{b.experienceLevels['Senior-level (6-9 yrs)']?.min} - ₹{b.experienceLevels['Senior-level (6-9 yrs)']?.max} LPA
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-700">
                      ₹{b.experienceLevels['Lead / Principal (10+ yrs)']?.min} - ₹{b.experienceLevels['Lead / Principal (10+ yrs)']?.max} LPA
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {b.hiringDemand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-[#242424] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-extrabold text-[#C5F36A] uppercase tracking-wider">
              Take the next step
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Ready to find roles matching your target compensation?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              All jobs on Elevate Careers display transparent Indian salary ranges in LPA so you never waste time on mismatched pay.
            </p>
          </div>

          <Link
            to="/jobs"
            className="w-full sm:w-auto bg-[#C5F36A] hover:bg-[#b4e850] text-[#242424] font-extrabold text-sm px-8 py-3.5 rounded-2xl transition-all shadow-md shrink-0 text-center"
          >
            Browse High-Paying Tech Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalaryGuidePage;
