import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Key, Shield } from 'lucide-react';

const SignInOptions = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Use your phone',
      description: 'Sign in with a code sent to your mobile device'
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Security key',
      description: 'Use a FIDO2 security key or built-in biometric sensor'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Windows Hello or security key',
      description: 'Use face, fingerprint, or PIN to sign in'
    }
  ];

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

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-[#1B1B1B] hover:bg-[#F3F2F1] p-2 -ml-2 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[15px]">Back</span>
        </button>

        {/* Heading */}
        <h1 className="text-[32px] font-[600] text-[#1B1B1B] mb-4">Sign-in options</h1>
        <p className="text-[15px] text-[#605E5C] mb-8">
          Choose how you'd like to sign in to your Microsoft account.
        </p>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                // In a real app, these would navigate to respective flows
                alert(`${option.title} - This feature is available in the full version`);
              }}
              className="w-full flex items-start gap-4 p-4 border border-[#8A8886] hover:bg-[#F3F2F1] rounded transition-colors text-left"
            >
              <div className="text-[#605E5C] mt-1">{option.icon}</div>
              <div className="flex-1">
                <h3 className="text-[15px] font-[600] text-[#1B1B1B] mb-1">{option.title}</h3>
                <p className="text-[13px] text-[#605E5C]">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Standard sign-in */}
        <div className="mt-8 pt-6 border-t border-[#8A8886]">
          <button
            onClick={() => navigate('/')}
            className="text-[#0067B8] hover:underline text-sm font-normal"
          >
            Use password instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInOptions;