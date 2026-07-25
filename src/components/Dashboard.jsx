import React, { useState, useEffect } from 'react';
import { FileText, AlertTriangle, Clock, CheckCircle, User, Eye } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
// Import your newly created component:
// import SearchBar from './SearchBar'; 

export default function Dashboard() {
  const [popularDocs, setPopularDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularDocs = async () => {
      try {
        const docsRef = collection(db, 'documents');
        const q = query(docsRef, orderBy('viewCount', 'desc'), limit(4));
        const querySnapshot = await getDocs(q);
        
        const docsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPopularDocs(docsData);
      } catch (error) {
        console.error("Error fetching popular documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDocs();
  }, []);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* 
        1. SEARCH BAR COMPONENT 
        You can drop the component here, or move it to a layout file 
        if it belongs in the global header.
      */}
      {/* <SearchBar onSearch={(data) => console.log(data)} /> */}

      {/* 2. HERO BANNER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5 h-auto md:h-[420px] mb-14">
        {/* Large Left Tile */}
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl col-span-1 md:col-span-2 md:row-span-2 bg-[#141632] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-[#141632] via-[#141632]/50 to-transparent transition-colors z-10 duration-500" />
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop" 
            alt="View all Documents" 
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          />
          <div className="absolute bottom-8 left-8 right-8 z-20">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">View all Documents</h2>
            <p className="text-gray-100 text-sm md:text-base hidden md:block max-w-md drop-shadow-sm">Access the complete registry of approved QMS policies and procedures.</p>
          </div>
        </div>

        {/* Top Middle Tile */}
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl col-span-1 md:col-span-1 md:row-span-1 bg-[#00B5E2] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 duration-300" />
          <img 
            src="https://images.unsplash.com/photo-1510511459019-5efa7ae17e17?q=80&w=600&auto=format&fit=crop" 
            alt="ISO 27001" 
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-5 left-6 z-20">
            <h3 className="text-xl font-bold text-white drop-shadow-md">ISO 27001</h3>
          </div>
        </div>

        {/* Top Right Tile */}
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl col-span-1 md:col-span-1 md:row-span-1 bg-[#F2A900] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 duration-300" />
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop" 
            alt="ISO 9001" 
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
          />
          <div className="absolute bottom-5 left-6 z-20">
            <h3 className="text-xl font-bold text-white drop-shadow-md">ISO 9001</h3>
          </div>
        </div>

        {/* Bottom Middle Tile */}
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl col-span-1 md:col-span-1 md:row-span-1 bg-[#009639] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 duration-300" />
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop" 
            alt="Document Tracker" 
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-5 left-6 z-20">
            <h3 className="text-xl font-bold text-white drop-shadow-md">Document Tracker</h3>
          </div>
        </div>

        {/* Bottom Right Tile */}
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl col-span-1 md:col-span-1 md:row-span-1 bg-slate-900 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-black/40 to-transparent z-10 duration-300" />
          <img 
            src="https://images.unsplash.com/photo-1611270626045-a080287df71a?q=80&w=600&auto=format&fit=crop" 
            alt="Expired Documents" 
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
          />
          <div className="absolute bottom-5 left-6 z-20">
            <h3 className="text-xl font-bold text-white drop-shadow-md">Expired Documents</h3>
          </div>
        </div>
      </div>

      {/* 3. ADMIN LINKS SECTION */}
      <div className="bg-[#f4f7fb] p-8 rounded-3xl mb-14">
        <h3 className="text-[#0a192f] font-black text-2xl mb-8 flex items-center gap-3">
          <User className="text-[#00B5E2]" size={28} />
          My Admin Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <AlertTriangle size={28} strokeWidth={2.5} className="text-red-500" />
            </div>
            <span className="text-sm font-bold text-[#0a192f]">Documents Awaiting Action</span>
          </div>

          <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-5">
              <Clock size={28} strokeWidth={2.5} className="text-amber-500" />
            </div>
            <span className="text-sm font-bold text-[#0a192f]">Documents Due for Review</span>
          </div>

          <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <FileText size={28} strokeWidth={2.5} className="text-[#00B5E2]" />
            </div>
            <span className="text-sm font-bold text-[#0a192f]">Documents Pending Review</span>
          </div>

          <div className="bg-white px-6 py-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
              <CheckCircle size={28} strokeWidth={2.5} className="text-[#009639]" />
            </div>
            <span className="text-sm font-bold text-[#0a192f]">Documents Pending Approval</span>
          </div>
        </div>
      </div>

      {/* 4. MOST POPULAR DOCUMENTS */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-[#0a192f] font-black text-3xl tracking-tight">Most Popular Documents</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">Frequently accessed policies and procedures</p>
          </div>
          <button className="text-sm font-bold bg-white border border-[#00B5E2] px-6 py-2 rounded-full text-[#00B5E2] hover:bg-[#00B5E2] hover:text-white transition-colors">
            View Directory
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-gray-200 border-t-[#00B5E2] rounded-full animate-spin mb-4"></div>
              <span className="text-gray-500 font-medium">Loading registry...</span>
            </div>
          </div>
        ) : popularDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-bold text-white bg-[#00B5E2] px-3 py-1 rounded-full uppercase tracking-wider">
                      {doc.department || 'GENERAL'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">
                      <Eye size={14} className="text-gray-400" />
                      <span>{doc.viewCount || 0}</span>
                    </div>
                  </div>
                  <h4 className="text-[#0a192f] font-bold text-lg mb-3 group-hover:text-[#00B5E2] transition-colors line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono bg-gray-50 inline-block px-2.5 py-1 rounded font-medium border border-gray-100">
                    Rev: {doc.currentVersion || 'R01'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-5 mt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                       <User size={14} className="text-[#00B5E2]" />
                    </div>
                    <span className="text-xs text-gray-600 font-bold truncate max-w-[100px]">
                      {doc.authorld || 'System Admin'}
                    </span>
                  </div>
                  <button className="text-gray-300 group-hover:text-[#00B5E2] transition-colors">
                    <FileText size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h3 className="text-[#0a192f] font-bold text-xl mb-1">No documents found.</h3>
            <p className="text-gray-500 text-sm">System registry is currently empty.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}