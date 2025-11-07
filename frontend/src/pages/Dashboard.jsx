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
    <div className="min-h-screen bg-white flex items-center justify-center relative">
      {/* Logout button in top right */}
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="absolute top-4 right-4 flex items-center gap-2 text-[#605E5C] hover:text-[#1B1B1B]"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>

      {/* Centered Microsoft Logo */}
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3">
          <div className="w-40 h-40 bg-[#F25022] rounded-sm"></div>
          <div className="w-40 h-40 bg-[#7FBA00] rounded-sm"></div>
          <div className="w-40 h-40 bg-[#00A4EF] rounded-sm"></div>
          <div className="w-40 h-40 bg-[#FFB900] rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;