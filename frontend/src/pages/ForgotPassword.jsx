import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import authService from '../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-[#1B1B1B] hover:bg-[#F3F2F1] p-2 -ml-2 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[15px]">Back</span>
        </button>

        {!success ? (
          <>
            {/* Heading */}
            <h1 className="text-[32px] font-[600] text-[#1B1B1B] mb-4">Recover your account</h1>
            <p className="text-[15px] text-[#605E5C] mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full h-12 px-3 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-base"
                  disabled={loading}
                  autoFocus={!initialEmail}
                />
                {error && (
                  <p className="text-[#A80000] text-xs mt-1">{error}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-8 h-12 rounded-sm font-normal text-base"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success message */}
            <h1 className="text-[32px] font-[600] text-[#1B1B1B] mb-4">Check your email</h1>
            <p className="text-[15px] text-[#605E5C] mb-8">
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link in the email to reset your password.
            </p>
            <p className="text-[15px] text-[#605E5C] mb-8">
              If you don't see the email, check your spam folder.
            </p>

            <Button
              onClick={() => navigate('/')}
              className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-8 h-12 rounded-sm font-normal text-base"
            >
              Back to sign in
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;