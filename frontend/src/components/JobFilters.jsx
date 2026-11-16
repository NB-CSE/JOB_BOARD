import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
  IndianRupee,
  Layers,
  ChevronDown,
} from 'lucide-react';

const INDIAN_LOCATIONS = [
  'All Locations',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi NCR',
  'Chennai',
  'Remote',
];

const CATEGORIES = [
  'All Categories',
  'Software Development',
  'Data & AI',
  'Design',
  'DevOps & Cloud',
  'Marketing',
  'Business',
  'Product & Management',
];

const WORKPLACE_MODES = ['All Modes', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = ['All Levels', 'Entry-level', 'Mid-level', 'Senior-level', 'Lead / Principal'];
const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship'];

const JobFilters = ({ filters, onFilterChange, onReset }) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, val]) => {
    if (!val) return false;
    if (key === 'page' || key === 'limit' || key === 'sort') return false;
    if (val.startsWith && val.startsWith('All ')) return false;
    return true;
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#242424]" />
          <h3 className="font-bold text-[#242424] text-base">Filter Jobs</h3>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-[#C5F36A] text-[#242424] font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-zinc-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all
          </button>
        )}
      </div>

      <div className="space-y-5 pt-4">
        {/* Keyword Search */}
        <div>
          <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">
            Search Keyword
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Title, skill, or keyword..."
              value={filters.keyword || ''}
              onChange={(e) => handleChange('keyword', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Location Dropdown */}
        <div>
          <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">
            Location (India)
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.location || 'All Locations'}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              {INDIAN_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Job Category */}
        <div>
          <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="relative">
            <Layers className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.category || 'All Categories'}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Workplace Mode (Remote / Hybrid / On-site) */}
        <div>
          <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
            Workplace Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {WORKPLACE_MODES.map((mode) => {
              const selected = (filters.workplaceMode || 'All Modes') === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleChange('workplaceMode', mode)}
                  className={`text-xs py-1.5 px-2.5 rounded-lg border font-medium transition-all ${
                    selected
                      ? 'bg-[#242424] text-white border-[#242424]'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">
            Experience Level
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.experienceLevel || 'All Levels'}
              onChange={(e) => handleChange('experienceLevel', e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              {EXPERIENCE_LEVELS.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Minimum Salary Slider in LPA */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
              Min Salary
            </label>
            <span className="text-xs font-bold text-[#242424] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
              ₹{filters.minSalary || 0} LPA+
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="2"
            value={filters.minSalary || 0}
            onChange={(e) => handleChange('minSalary', e.target.value)}
            className="w-full accent-[#242424] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
            <span>₹0</span>
            <span>₹20L</span>
            <span>₹40L</span>
            <span>₹60L+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
