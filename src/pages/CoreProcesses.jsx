import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BookOpen, CheckSquare, Laptop, FileText, Scale, ShieldCheck } from 'lucide-react';

export default function CoreProcesses() {
  const navigate = useNavigate();

  const coreFolders = [
    { name: 'Planning and Scheduling', icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50', path: '/qms/core/planning' },
    { name: 'Course Information / Enquiry', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/qms/core/course-info' },
    { name: 'Registration', icon: CheckSquare, color: 'text-teal-600', bg: 'bg-teal-50', path: '/qms/core/registration' },
    { name: 'Learning Delivery', icon: Laptop, color: 'text-cyan-600', bg: 'bg-cyan-50', path: '/qms/core/learning-delivery' },
    { name: 'Assessments', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', path: '/qms/core/assessments' },
    { name: 'Moderation', icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50', path: '/qms/core/moderation' },
    { name: 'Certification', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50', path: '/qms/core/certification' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-[#141632] mb-2">Core Processes</h1>
        <p className="text-gray-500 text-sm">
          Select a core operational folder below to access related policies, procedures, and forms.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {coreFolders.map((folder, index) => (
          <div 
            key={index}
            onClick={() => navigate(folder.path)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00B5E2] transition-all cursor-pointer flex flex-col items-start gap-4 group"
          >
            <div className={`w-14 h-14 rounded-xl ${folder.bg} ${folder.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <folder.icon size={26} />
            </div>
            <span className="font-bold text-[#141632] group-hover:text-[#00B5E2] transition-colors leading-tight">
              {folder.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}