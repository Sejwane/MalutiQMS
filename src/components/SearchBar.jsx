import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    if (searchQuery.trim() !== '') {
      // Send the user to the documents page and pass the search word in the background
      navigate('/documents', { state: { keyword: searchQuery.trim() } });
      setSearchQuery(''); // Clear the bar after searching
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto shadow-sm hover:shadow-md transition-shadow rounded-xl">
      <div className="relative flex items-center w-full h-14 rounded-xl bg-white border-2 border-transparent focus-within:border-[#00B5E2] overflow-hidden transition-colors">
        <div className="grid place-items-center h-full w-14 text-gray-400 bg-gray-50">
          <Search size={20} />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 px-4 font-medium"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by keyword, title, or ISO number..."
        />
        <button 
          type="submit" 
          className="bg-[#141632] hover:bg-gray-800 text-white px-8 h-full font-bold text-sm transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}