import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Briefcase, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#18181B] text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C5F36A] flex items-center justify-center text-[#242424] font-black text-lg">
                E
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                ELEVATE<span className="text-[#C5F36A]">.</span> CAREERS
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Find work that moves you forward. India’s premier career platform connecting high-growth startups and visionary tech leaders with top engineering, design, and product talent.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 max-w-md">
              <ShieldCheck className="w-4 h-4 text-[#C5F36A] shrink-0" />
              <span>
                Demo data is strictly labeled and never claimed to be live vacancies.
              </span>
            </div>
          </div>

          {/* Top Job Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?category=Software Development" className="hover:text-[#C5F36A] transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Data & AI" className="hover:text-[#C5F36A] transition-colors">
                  Data & AI
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Design" className="hover:text-[#C5F36A] transition-colors">
                  Product & Design
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=DevOps & Cloud" className="hover:text-[#C5F36A] transition-colors">
                  DevOps & Cloud
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Business" className="hover:text-[#C5F36A] transition-colors">
                  Business & Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Indian Tech Hubs */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Top Locations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?location=Bengaluru" className="hover:text-[#C5F36A] transition-colors">
                  Bengaluru, Karnataka
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Hyderabad" className="hover:text-[#C5F36A] transition-colors">
                  Hyderabad, Telangana
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Pune" className="hover:text-[#C5F36A] transition-colors">
                  Pune, Maharashtra
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Delhi NCR" className="hover:text-[#C5F36A] transition-colors">
                  Delhi NCR & Gurgaon
                </Link>
              </li>
              <li>
                <Link to="/jobs?workplaceMode=Remote" className="hover:text-[#C5F36A] transition-colors">
                  Remote (Pan-India)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Quick Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-[#C5F36A] transition-colors">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-[#C5F36A] transition-colors">
                  Top Employers
                </Link>
              </li>
              <li>
                <Link to="/salary-guide" className="hover:text-[#C5F36A] transition-colors font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5F36A]"></span>
                  <span>Salary & Skills Index (2026)</span>
                </Link>
              </li>
              <li>
                <Link to="/register?role=employer" className="hover:text-[#C5F36A] transition-colors font-medium text-white">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/candidate/dashboard" className="hover:text-[#C5F36A] transition-colors">
                  Candidate Portal
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="hover:text-[#C5F36A] transition-colors">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Elevate Careers Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Verified Employer Standards</span>
            <span>Security & Data Privacy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
