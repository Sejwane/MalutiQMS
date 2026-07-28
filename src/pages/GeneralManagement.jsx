import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, BookOpen, CheckSquare, ShieldCheck, 
  Users, Landmark, Laptop, Briefcase, FileText, 
  Wrench, Truck, BookMarked, Scale 
} from 'lucide-react';

export default function GeneralManagement() {
  const navigate = useNavigate();

  // CORE PROCESSES (From legacy QMS flowchart)
  const coreProcesses = [
    { name: 'Planning and Scheduling', icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50', path: '/qms/core/planning' },
    { name: 'Course Information / Enquiry', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/qms/core/course-info' },
    { name: 'Registration', icon: CheckSquare, color: 'text-teal-600', bg: 'bg-teal-50', path: '/qms/core/registration' },
    { name: 'Learning Delivery', icon: Laptop, color: 'text-cyan-600', bg: 'bg-cyan-50', path: '/qms/core/learning-delivery' },
    { name: 'Assessments', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', path: '/qms/core/assessments' },
    { name: 'Moderation', icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50', path: '/qms/core/moderation' },
    { name: 'Certification', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50', path: '/qms/core/certification' },
  ];

  // SUPPORT SERVICES (From legacy QMS flowchart)
  const supportServices = [
    { name: 'Governance', icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50', path: '/qms/support/governance' },
    { name: 'Information Technology', icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50', path: '/qms/support/it' },
    { name: 'Finance', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/qms/support/finance' },
    { name: 'Human Resources', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', path: '/qms/support/hr' },
    { name: 'Student Support Services', icon: BookMarked, color: 'text-[#00B5E2]', bg: 'bg-blue-50', path: '/qms/support/student-support' },
    { name: 'Facilities and Maintenance', icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-100', path: '/qms/support/facilities' },
    { name: 'Fleet Management', icon: Truck, color: 'text-gray-600', bg: 'bg-gray-100', path: '/qms/support/fleet' },
    { name: 'Procurement & Supply Chain', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/qms/support/procurement' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      
      {/* Page Header matching AdminPanel */}
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-[#141632] mb-2">General Management System</h1>
        <p className="text-gray-500 text-sm">
          Select a functional area below to access related policies, procedures, and workflows.
        </p>
      </div>

      {/* CORE PROCESSES SECTION */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-[#00B5E2] rounded-full"></div>
          <h2 className="text-xl font-bold text-[#141632] uppercase tracking-wide">Core Processes</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreProcesses.map((process, index) => (
            <div 
              key={index}
              onClick={() => navigate(process.path)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00B5E2] transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-full ${process.bg} ${process.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <process.icon size={22} />
              </div>
              <span className="font-bold text-sm text-gray-700 group-hover:text-[#141632]">
                {process.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORT SERVICES SECTION */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-[#F2A900] rounded-full"></div>
          <h2 className="text-xl font-bold text-[#141632] uppercase tracking-wide">Support Services</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportServices.map((service, index) => (
            <div 
              key={index}
              onClick={() => navigate(service.path)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F2A900] transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-full ${service.bg} ${service.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <service.icon size={22} />
              </div>
              <span className="font-bold text-sm text-gray-700 group-hover:text-[#141632]">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}