import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BarChart2, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    // Simulate a brief loading state for UX
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);

    localStorage.setItem('halleyx_auth', 'true');
    localStorage.setItem('halleyx_user', username);
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      {/* ─── Left Panel ─── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #134e4a 100%)' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5 border border-teal-400"
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)' }}
          >
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Halleyx</span>
        </div>

        {/* Tagline */}
        <div className="relative">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Turn data into
            <br />
            <span style={{ color: '#14b8a6' }}>decisions.</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Build beautiful dashboards, track orders, and uncover insights — all in one place.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative flex gap-8">
          {[
            { value: '10K+', label: 'Dashboards created' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '500+', label: 'Teams active' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-col items-center justify-center flex-1 bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)' }}
            >
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-base">Halleyx</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-8">
            © 2025 Halleyx. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
