import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import authService from '../services/authService';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: password & name

  const handleEmailNext = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Enter a valid email address.');
      return;
    }

    setStep(2);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.password.trim()) {
      setError('Please enter a password.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register(formData.email, formData.password, formData.name);
      
      // Store auth data in localStorage
      authService.storeAuthData(result.token, result.user);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Account creation failed. Please try again.');
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
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 mb-6 text-[#1B1B1B] hover:bg-[#F3F2F1] p-2 -ml-2 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[15px]">Back</span>
          </button>
        )}

        {/* Create account heading */}
        <h1 className="text-[28px] font-[600] text-[#1B1B1B] mb-3 leading-tight">Create account</h1>
        <p className="text-[15px] text-[#323130] mb-6">
          {step === 1 
            ? "Make the most of your experience."
            : "Create a password"}
        </p>

        {/* Form */}
        {step === 1 ? (
          <form onSubmit={handleEmailNext} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full h-12 px-3 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-base"
                autoFocus
              />
              {error && (
                <p className="text-[#A80000] text-xs mt-1">{error}</p>
              )}
            </div>

            <p className="text-[13px] text-[#1B1B1B] pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-[#0067B8] hover:underline font-[600]"
              >
                Sign in
              </button>
            </p>

            <div className="pt-6 flex justify-end">
              <Button
                type="submit"
                className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-10 h-8 rounded-sm font-[600] text-[15px] transition-colors"
              >
                Next
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  className="w-full h-12 px-3 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-base"
                  autoFocus
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create password"
                  className="w-full h-12 px-3 border-b-2 border-t-0 border-x-0 border-[#8A8886] rounded-none bg-[#F3F2F1] hover:border-[#323130] focus:border-[#0078D4] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#605E5C] text-base"
                  disabled={loading}
                />
                <p className="text-xs text-[#605E5C]">Use at least 8 characters</p>
              </div>
              {error && (
                <p className="text-[#A80000] text-xs mt-1">{error}</p>
              )}
            </div>

            <div className="pt-6 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0067B8] hover:bg-[#005A9E] text-white px-10 h-8 rounded-sm font-[600] text-[15px] transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create account'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateAccount;