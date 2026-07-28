import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bell, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { name: 'DASHBOARD', path: '/' },
    { name: 'DOCUMENTS', path: '/documents' },
    { name: 'GOVERNANCE', path: '/governance' },
    { name: 'ADMIN PANEL', path: '/admin' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 border-b border-gray-200 font-['Inter',sans-serif]">
      {/* Top Blue Bar */}
      <div className="bg-[#00B5E2] text-white px-4 py-1.5 flex justify-between items-center text-xs font-bold">
        <span>MALUTI TVET COLLEGE QMS: Internal Support: Ext 4888</span>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">MAIN WEBSITE</a>
          <a href="#" className="hover:underline">HELP DESK</a>
          <a href="#" className="hover:underline">SYSTEM ALERTS</a>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <div className="flex items-center gap-4">
             {/* If you have your actual image tags here from earlier, keep them! Otherwise, this is a clean text fallback */}
            <div className="text-[#141632] font-extrabold text-2xl tracking-tight">
              MALUTI <span className="text-[#00B5E2]">QMS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-extrabold transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#00B5E2] border-b-2 border-[#00B5E2] pb-1'
                    : 'text-gray-600 hover:text-[#141632]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-[#141632] transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[#141632]">
                  {auth.currentUser?.email || 'Super Admin'}
                </div>
                <div className="text-xs text-[#00B5E2] font-semibold">
                  Administrator
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-[#00B5E2] rounded-full flex items-center justify-center border border-blue-100">
                <User size={20} />
              </div>
              <button 
                onClick={handleLogout}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}