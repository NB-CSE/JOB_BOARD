import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Users, Briefcase, ExternalLink, ArrowRight } from 'lucide-react';
import { userService } from '../services/api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await userService.getCompanies();
        if (res.data.success) {
          setCompanies(res.data.companies || []);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#242424] bg-[#C5F36A] px-3 py-1 rounded-full">
            <span>Verified Hiring Employers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242424] tracking-tight">
            Companies Hiring on Elevate
          </h1>
          <p className="text-sm text-zinc-600">
            Explore industry-leading tech startups, unicorn enterprises, and visionary software builders actively expanding their engineering and product teams across India.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-white border border-zinc-200 p-6 animate-pulse"
              ></div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-600 font-semibold text-sm">No companies registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => {
              const compName = comp.name || comp.companyName || 'Company';
              const compLogo = comp.logo || comp.companyLogo || '';
              const compDesc = comp.description || comp.companyDescription || '';
              const compLoc = comp.location || comp.headquarters || 'India';
              const compSize = comp.size || comp.companySize || '500+ employees';
              const compWeb = comp.website || comp.companyWebsite || '';
              const rolesCount = comp.openRolesCount ?? comp.openJobsCount ?? 1;

              return (
                <div
                  key={comp.id || compName}
                  className="bg-white rounded-3xl border border-zinc-200/90 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-extrabold text-xl text-zinc-800 shrink-0">
                        {compLogo ? (
                          <img
                            src={compLogo}
                            alt={compName}
                            className="w-full h-full object-cover rounded-2xl"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        ) : (
                          compName.charAt(0)
                        )}
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {rolesCount} Open {rolesCount === 1 ? 'Role' : 'Roles'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-[#242424] mb-1">{compName}</h3>

                    <p className="text-xs text-zinc-500 mb-3">{comp.industry || 'Technology'}</p>

                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-4">
                      {compDesc}
                    </p>

                    <div className="space-y-1.5 text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{compLoc}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{compSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-zinc-100 flex items-center justify-between">
                    {compWeb && (
                      <a
                        href={compWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-zinc-500 hover:text-black flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <Link
                      to={`/jobs?keyword=${encodeURIComponent(compName)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#242424] hover:text-black bg-[#C5F36A] hover:bg-[#b4e850] px-3.5 py-1.5 rounded-xl transition-all shadow-xs ml-auto"
                    >
                      <span>View Jobs</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
