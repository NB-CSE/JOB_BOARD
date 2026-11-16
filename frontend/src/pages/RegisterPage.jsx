import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'candidate';

  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    companyName: '',
    location: 'Bengaluru, Karnataka',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        title: role === 'candidate' ? formData.title : 'Talent Lead',
        companyName: role === 'employer' ? formData.companyName : '',
        location: formData.location,
      };

      const user = await register(payload);
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Please check inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#242424] flex items-center justify-center text-[#C5F36A] font-black text-xl shadow-md">
              E
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-zinc-500">
            Join India's premier professional talent and career ecosystem.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-zinc-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              role === 'candidate'
                ? 'bg-white text-[#242424] shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I'm a Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              role === 'employer'
                ? 'bg-white text-[#242424] shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>I'm an Employer</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-lg space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>
            </div>

            {role === 'employer' ? (
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Company / Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay Technologies"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Professional Title / Headline
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Location (India)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-sm py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create {role === 'employer' ? 'Employer' : 'Candidate'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <p className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#242424] hover:underline underline-offset-4"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
