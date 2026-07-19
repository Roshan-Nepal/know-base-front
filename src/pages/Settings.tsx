import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  
  // Change Password form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdLoading(true);

    try {
      // @ts-ignore - Assuming api.auth.changePassword exists from previous implementation
      if (api.auth.changePassword) {
        // @ts-ignore
        const response = await api.auth.changePassword({ oldPassword, newPassword, confirmPassword });
        if (response.success) {
          setPwdSuccess(response.message || 'Password changed successfully!');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setPwdError(response.message || 'Failed to change password.');
        }
      } else {
        setPwdError('Change password API not available.');
      }
    } catch (err: any) {
      setPwdError(err.message || 'An error occurred while changing password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const isLengthValid = newPassword.length >= 8;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = oldPassword.length > 0 && isLengthValid && isMatchValid;

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Manage your account settings and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Theme Settings */}
        <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Appearance
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Customize how the application looks on your device.
          </p>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-[#333] hover:border-brand-500 dark:hover:border-brand-500 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-[#1a1a1a] rounded-lg">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{theme} mode enabled</p>
              </div>
            </div>
            <div className="text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
              Toggle
            </div>
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333] rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Key className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Change Password
          </h3>
          
          {pwdSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800 dark:text-emerald-300 m-0 font-medium">{pwdSuccess}</p>
            </div>
          )}

          {pwdError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-800 dark:text-rose-300 m-0 font-medium">{pwdError}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-[#333] text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-[#333] text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-[#333] text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
            </div>

            <div className="space-y-2 mt-4 p-4 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333]">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password Requirements</h4>
              <ul className="space-y-1.5">
                <li className={`flex items-center gap-2 text-sm transition-colors ${isLengthValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {isLengthValid ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border border-current opacity-50" />}
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 text-sm transition-colors ${isMatchValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {isMatchValid ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border border-current opacity-50" />}
                  Passwords match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={pwdLoading || !isFormValid}
              className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {pwdLoading ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
