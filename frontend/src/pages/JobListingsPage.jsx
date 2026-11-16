import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import Pagination from '../components/Pagination';
import ApplicationModal from '../components/ApplicationModal';
import { jobService } from '../services/api';

const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL query params
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || 'All Locations',
    category: searchParams.get('category') || 'All Categories',
    workplaceMode: searchParams.get('workplaceMode') || 'All Modes',
    experienceLevel: searchParams.get('experienceLevel') || 'All Levels',
    minSalary: searchParams.get('minSalary') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
    featured: searchParams.get('featured') || '',
  });

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Mobile filters drawer toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch jobs whenever filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = { ...filters };
        // Clean up "All" defaults
        if (queryParams.location === 'All Locations') delete queryParams.location;
        if (queryParams.category === 'All Categories') delete queryParams.category;
        if (queryParams.workplaceMode === 'All Modes') delete queryParams.workplaceMode;
        if (queryParams.experienceLevel === 'All Levels') delete queryParams.experienceLevel;
        if (!queryParams.keyword) delete queryParams.keyword;
        if (!queryParams.minSalary || Number(queryParams.minSalary) === 0) delete queryParams.minSalary;
        if (!queryParams.featured) delete queryParams.featured;

        const res = await jobService.getJobs(queryParams);
        if (res.data.success) {
          setJobs(res.data.jobs || []);
          setTotalJobs(res.data.total || 0);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch job listings. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Sync state with URL params
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val && !val.toString().startsWith('All ') && val !== '1' && val !== 'newest') {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams, { replace: true });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: 'All Locations',
      category: 'All Categories',
      workplaceMode: 'All Modes',
      experienceLevel: 'All Levels',
      minSalary: '',
      sort: 'newest',
      page: 1,
      featured: '',
    });
  };

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#242424] tracking-tight">
                Explore Tech Jobs in India
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Showing{' '}
                <span className="font-bold text-[#242424]">{totalJobs}</span> verified open
                positions
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl text-sm font-semibold text-[#242424] shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }))
                  }
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-2 pr-9 text-xs sm:text-sm font-semibold text-[#242424] appearance-none focus:outline-none focus:border-[#242424] shadow-xs cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="salary-high">Sort: Highest Salary</option>
                  <option value="salary-low">Sort: Lowest Salary</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <JobFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Main Listings */}
          <div className="lg:col-span-3">
            {/* Active search chip preview */}
            {(filters.keyword || filters.location !== 'All Locations' || filters.category !== 'All Categories') && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-zinc-200 text-xs">
                <span className="font-bold text-zinc-500">Active Criteria:</span>
                {filters.keyword && (
                  <span className="bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Keyword: "{filters.keyword}"
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, keyword: '', page: 1 }))}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.location !== 'All Locations' && (
                  <span className="bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    {filters.location}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, location: 'All Locations', page: 1 }))}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.category !== 'All Categories' && (
                  <span className="bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    {filters.category}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, category: 'All Categories', page: 1 }))}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 my-6">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Failed to load listings</p>
                  <p className="text-xs mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Loading state skeleton */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-white border border-zinc-200/80 p-6 animate-pulse space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-200"></div>
                      <div className="space-y-2">
                        <div className="w-48 h-4 bg-zinc-200 rounded"></div>
                        <div className="w-32 h-3 bg-zinc-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-lg mx-auto my-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#242424]">
                  No matching jobs found
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  We couldn't find any job listings matching your current filter criteria. Try broadening your search or resetting filters.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-xs hover:bg-black transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Job cards list */
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onApplyClick={() => handleOpenApply(job)}
                  />
                ))}

                {/* Pagination */}
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="font-bold text-[#242424]">Filter Positions</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <JobFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleResetFilters}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#242424] text-[#C5F36A] font-bold py-2.5 rounded-xl text-sm"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default JobListingsPage;
