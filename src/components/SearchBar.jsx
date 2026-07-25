import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDept, setSearchDept] = useState('ALL');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: searchQuery, department: searchDept });
    } else {
      alert(`Search triggered: "${searchQuery}" in ${searchDept}`);
    }
  };

  return (
    <div className="mb-12">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
        
        {/* Keyword Search (Pill shaped) */}
        <div className="flex-1 w-full relative shadow-sm rounded-full">
          <Search className="absolute left-5 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search documents by keyword, ISO number, or title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-300 focus:border-[#00B5E2] focus:ring-1 focus:ring-[#00B5E2] outline-none transition-all bg-white text-gray-700"
          />
        </div>
        
        {/* Department Filter (Pill shaped) */}
        <div className="w-full md:w-64 relative shadow-sm rounded-full">
          <select 
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
            className="w-full pl-5 pr-10 py-3.5 rounded-full border border-gray-300 focus:border-[#00B5E2] focus:ring-1 focus:ring-[#00B5E2] outline-none cursor-pointer appearance-none text-gray-700 font-medium bg-white transition-all"
          >
            <option value="ALL">All Departments</option>
            <option value="EXECUTIVE">Executive Council</option>
            <option value="ACADEMIC">Academic</option>
            <option value="FINANCE">Finance</option>
            <option value="HR">Human Resources</option>
            <option value="IT">IT Support</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-5 top-4 pointer-events-none text-gray-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Search Button (Pill shaped) */}
        <button 
          type="submit" 
          className="w-full md:w-auto bg-[#00B5E2] hover:bg-[#009bc2] text-white px-10 py-3.5 rounded-full font-bold transition-colors shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#00B5E2] text-lg"
        >
          Search
        </button>
      </form>
    </div>
  );
}