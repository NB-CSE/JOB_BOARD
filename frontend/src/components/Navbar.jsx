import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isEmployer, isCandidate } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#242424] flex items-center justify-center text-[#C5F36A] font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#242424]">
                  ELEVATE<span className="text-[#84cc16]">.</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-zinc-500 -mt-1">
                  Careers India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/jobs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/jobs')
                    ? 'bg-zinc-100 text-[#242424] font-semibold'
                    : 'text-zinc-600 hover:text-[#242424] hover:bg-zinc-50'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/companies')
                    ? 'bg-zinc-100 text-[#242424] font-semibold'
                    : 'text-zinc-600 hover:text-[#242424] hover:bg-zinc-50'
                }`}
              >
                Companies
              </Link>
              <Link
                to="/salary-guide"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/salary-guide')
                    ? 'bg-zinc-100 text-[#242424] font-semibold'
                    : 'text-zinc-600 hover:text-[#242424] hover:bg-zinc-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></span>
                <span>Salary & Skills Index</span>
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post a Job CTA */}
            <Link
              to={isAuthenticated && isEmployer ? '/employer/dashboard?tab=post' : '/register?role=employer'}
              className="inline-flex items-center gap-1.5 bg-[#C5F36A] hover:bg-[#b5e754] text-[#242424] text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-sm font-medium text-[#242424] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-[#C5F36A] flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-left">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-sm font-bold text-[#242424] truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {user?.role}
                      </span>
                    </div>

                    {isCandidate && (
                      <>
                        <Link
                          to="/candidate/dashboard?tab=applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#242424]"
                        >
                          <FileText className="w-4 h-4 text-zinc-500" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          to="/candidate/dashboard?tab=saved"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#242424]"
                        >
                          <Bookmark className="w-4 h-4 text-zinc-500" />
                          <span>Saved Jobs</span>
                        </Link>
                        <Link
                          to="/candidate/dashboard?tab=profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#242424]"
                        >
                          <User className="w-4 h-4 text-zinc-500" />
                          <span>Candidate Profile</span>
                        </Link>
                      </>
                    )}

                    {isEmployer && (
                      <>
                        <Link
                          to="/employer/dashboard?tab=jobs"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#242424]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                          <span>Employer Dashboard</span>
                        </Link>
                        <Link
                          to="/employer/dashboard?tab=post"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#242424]"
                        >
                          <PlusCircle className="w-4 h-4 text-zinc-500" />
                          <span>Post New Job</span>
                        </Link>
                        <Link
                          to="/employer/dashboard?tab=applicants"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#242424]"
                        >
                          <Briefcase className="w-4 h-4 text-zinc-500" />
                          <span>Applicant Review</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-zinc-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:text-[#242424] hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-[#242424] hover:bg-black text-white rounded-xl transition-colors shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 hover:bg-zinc-100"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 hover:bg-zinc-100"
          >
            Companies
          </Link>
          <Link
            to="/salary-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 hover:bg-zinc-100 flex items-center justify-between"
          >
            <span>Salary & Skills Index</span>
            <span className="text-[10px] bg-[#C5F36A] text-[#242424] font-bold px-2 py-0.5 rounded-full">New</span>
          </Link>

          <Link
            to={isAuthenticated && isEmployer ? '/employer/dashboard?tab=post' : '/register?role=employer'}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#C5F36A] text-[#242424] font-bold py-2.5 rounded-xl"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post a Job</span>
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-zinc-100 space-y-2">
              <div className="px-3 py-1">
                <p className="font-bold text-sm text-[#242424]">{user?.name}</p>
                <p className="text-xs text-zinc-500">{user?.role?.toUpperCase()}</p>
              </div>

              {isCandidate && (
                <Link
                  to="/candidate/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg"
                >
                  Candidate Dashboard
                </Link>
              )}

              {isEmployer && (
                <Link
                  to="/employer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg"
                >
                  Employer Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 rounded-lg"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-semibold text-zinc-800 bg-zinc-100 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-bold bg-[#242424] text-white rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
