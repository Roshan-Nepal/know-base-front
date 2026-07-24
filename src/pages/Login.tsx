import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AuthBanner } from '../components/auth/AuthBanner';

export const Login: React.FC = () => {
  const { login, register, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  // Form State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
  }, [isLogin, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isLogin) {
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
    } else {
      if (!email || !username || !password) {
        setError('Please fill in all fields');
        return;
      }
      setLoading(true);
      try {
        await register(username, email, password, ['ROLE_USER']);
        // Auto-login after register or switch back to login panel
        navigate('/login');
        setPassword('');
        setError('Registration successful! Please log in.');
      } catch (err) {
        // Error is set in AuthContext
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1a1a1a] text-slate-200 flex">
      
      <AuthBanner isLogin={isLogin} />

      {/* 
        FORM PANEL 
        100% width on mobile, 50% width on desktop.
        Translates Left (to 0) when !isLogin, Translates Right (to 100%) when isLogin
      */}
      <div className={`
        absolute top-0 bottom-0 left-0 w-full lg:w-1/2 bg-[#222222] shadow-2xl
        transition-transform duration-700 ease-in-out z-10
        flex items-center justify-center p-8 lg:p-12
        ${isLogin ? 'lg:translate-x-full' : 'lg:translate-x-0'}
      `}>
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-[#a1a1aa]">
              {isLogin ? 'Log in to use the application.' : 'Sign up to get started.'}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-md border flex items-start gap-3 ${error.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'}`}>
              <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${error.includes('successful') ? 'text-emerald-400' : 'text-rose-400'}`} />
              <p className="text-sm m-0 leading-relaxed font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-fade-in">
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  required={!isLogin}
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3f3f46] text-white focus:outline-none focus:border-[#52525b] transition-colors placeholder:text-[#52525b]"
                />
              </div>
            )}

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
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 8 chars)"}
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
                isLogin ? "Log in" : "Sign up"
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-[#a1a1aa]">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-white hover:underline focus:outline-none"
                >
                  Register now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-white hover:underline focus:outline-none"
                >
                  Log in instead
                </button>
              </>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
