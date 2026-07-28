import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Laptop, Users, BookMarked, Wrench, Truck, Briefcase } from 'lucide-react';

export default function SupportServices() {
  const navigate = useNavigate();

  const supportFolders = [
    { name: 'Governance', icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50', path: '/qms/support/governance' },
    { name: 'Information Technology', icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50', path: '/qms/support/it' },
    { name: 'Finance', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/qms/support/finance' },
    { name: 'Human Resources', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', path: '/qms/support/hr' },
    { name: 'Student Support Services', icon: BookMarked, color: 'text-[#00B5E2]', bg: 'bg-blue-50', path: '/qms/support/student-support' },
    { name: 'Facilities & Maintenance', icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-100', path: '/qms/support/facilities' },
    { name: 'Fleet Management', icon: Truck, color: 'text-gray-600', bg: 'bg-gray-100', path: '/qms/support/fleet' },
    { name: 'Procurement & Supply Chain', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/qms/support/procurement' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-[#141632] mb-2">Support Services</h1>
        <p className="text-gray-500 text-sm">
          Select a support service folder below to access related policies, procedures, and forms.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {supportFolders.map((folder, index) => (
          <div 
            key={index}
            onClick={() => navigate(folder.path)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F2A900] transition-all cursor-pointer flex flex-col items-start gap-4 group"
          >
            <div className={`w-14 h-14 rounded-xl ${folder.bg} ${folder.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <folder.icon size={26} />
            </div>
            <span className="font-bold text-[#141632] group-hover:text-[#F2A900] transition-colors leading-tight">
              {folder.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}