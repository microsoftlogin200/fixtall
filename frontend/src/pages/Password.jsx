import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { mockAuthenticate } from '../mock';

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
      const result = await mockAuthenticate(email, password);
      
      // Store auth data in localStorage
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Navigate to dashboard or home
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Microsoft Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex">
              <div className="w-4 h-4 bg-[#F25022]"></div>
              <div className="w-4 h-4 bg-[#7FBA00]"></div>
            </div>
            <div className="flex">
              <div className="w-4 h-4 bg-[#00A4EF]"></div>
              <div className="w-4 h-4 bg-[#FFB900]"></div>
            </div>
            <span className="text-2xl font-normal text-[#5E5E5E] ml-2">Microsoft</span>
          </div>
        </div>

        {/* Back button with email */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-[#1B1B1B] hover:bg-[#F3F2F1] p-2 -ml-2 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[15px] border-b border-[#1B1B1B]">{email}</span>
        </button>

        {/* Enter password heading */}
        <h1 className="text-[32px] font-[600] text-[#1B1B1B] mb-8">Enter password</h1>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-12 px-3 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-base"
                disabled={loading}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[#A80000] text-xs mt-1">{error}</p>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('/forgot-password', { state: { email } })}
              className="text-[#0067B8] hover:underline text-sm font-normal block"
            >
              Forgot password?
            </button>
            <button
              type="button"
              onClick={() => navigate('/forgot-password', { state: { email } })}
              className="text-[#0067B8] hover:underline text-sm font-normal block"
            >
              Email code to {email}
            </button>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-8 h-12 rounded-sm font-normal text-base"
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