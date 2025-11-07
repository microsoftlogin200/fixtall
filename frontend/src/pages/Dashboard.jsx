import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!authToken || !userData) {
      navigate('/');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F3F2F1]">
      {/* Header */}
      <header className="bg-white border-b border-[#E1DFDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex">
                <div className="w-4 h-4 bg-[#F25022]"></div>
                <div className="w-4 h-4 bg-[#7FBA00]"></div>
              </div>
              <div className="flex">
                <div className="w-4 h-4 bg-[#00A4EF]"></div>
                <div className="w-4 h-4 bg-[#FFB900]"></div>
              </div>
              <span className="text-xl font-normal text-[#5E5E5E] ml-2">Microsoft</span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#0067B8] rounded-full flex items-center justify-center text-white text-2xl font-[600]">
              {user.name ? user.name.charAt(0).toUpperCase() : <User />}
            </div>
            <div>
              <h1 className="text-2xl font-[600] text-[#1B1B1B]">Welcome back, {user.name || 'User'}!</h1>
              <p className="text-[#605E5C]">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t border-[#E1DFDD] pt-6 mt-6">
            <h2 className="text-lg font-[600] text-[#1B1B1B] mb-4">Account Information</h2>
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between py-2">
                <span className="text-[#605E5C]">Email:</span>
                <span className="text-[#1B1B1B] font-[500]">{user.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#605E5C]">Name:</span>
                <span className="text-[#1B1B1B] font-[500]">{user.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#605E5C]">Account ID:</span>
                <span className="text-[#1B1B1B] font-[500]">{user.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-[600] text-[#1B1B1B] mb-2">Security</h3>
            <p className="text-[15px] text-[#605E5C]">Manage your security settings and two-factor authentication</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-[600] text-[#1B1B1B] mb-2">Privacy</h3>
            <p className="text-[15px] text-[#605E5C]">Control your privacy settings and data preferences</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-[600] text-[#1B1B1B] mb-2">Devices</h3>
            <p className="text-[15px] text-[#605E5C]">View and manage your connected devices</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;