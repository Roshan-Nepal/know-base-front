import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, Upload, Quote, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-200">
      
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-[#1a1a1a]">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-20">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
              <Database className="h-5 w-5 text-black" />
            </div>
            <span className="font-bold text-white text-xl tracking-wide">Know-Base</span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Your documents,<br />answered.
          </h1>
          <p className="text-[#a1a1aa] text-lg max-w-md leading-relaxed mb-16">
            Upload your notes, code, and PDFs. Ask questions in plain language and get answers grounded in your own knowledge base, with sources cited.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#2563eb]/20 rounded-md">
                <Upload className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Upload anything</h3>
                <p className="text-sm text-[#71717a]">PDF, markdown, code, or plain text</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#16a34a]/20 rounded-md">
                <Quote className="h-5 w-5 text-[#22c55e]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Cited answers</h3>
                <p className="text-sm text-[#71717a]">Every response points back to its source</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#d97706]/20 rounded-md">
                <Lock className="h-5 w-5 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Private by default</h3>
                <p className="text-sm text-[#71717a]">Only you can query your documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-[#222222]">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-[#a1a1aa]">Log in to use the application.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-300 m-0 leading-relaxed font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3f3f46] text-white focus:outline-none focus:border-[#52525b] transition-colors placeholder:text-[#52525b]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#2a2a2a] border border-[#3f3f46] text-white focus:outline-none focus:border-[#52525b] transition-colors placeholder:text-[#52525b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#71717a] hover:text-[#a1a1aa] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold shadow hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-[#a1a1aa]">
            Don't have an account? Request your administration for your account.
          </div>

        </div>
      </div>

    </div>
  );
};
