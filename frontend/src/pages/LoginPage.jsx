import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract redirect url from query
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // If redirecting to a dashboard, navigate based on role if default
      if (redirect === '/') {
        if (user.role === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#242424] flex items-center justify-center text-[#C5F36A] font-black text-xl shadow-md">
              E
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500">
            Sign in to access your jobs, applications, or recruit talent.
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#84cc16]" />
            <span>Instant Demo Login (1-Click Test)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('arjun.sharma@demo.com', 'Password123!')}
              className="text-left p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-xs"
            >
              <div className="font-bold text-[#242424]">Demo Candidate</div>
              <div className="text-[11px] text-zinc-500">Arjun Sharma (Dev)</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('recruiter@razorpay-demo.com', 'Password123!')}
              className="text-left p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-xs"
            >
              <div className="font-bold text-[#242424]">Demo Employer</div>
              <div className="text-[11px] text-zinc-500">Razorpay India</div>
            </button>
          </div>
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-sm py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <p className="text-xs text-zinc-500">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-[#242424] hover:underline underline-offset-4"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
