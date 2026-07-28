import React, { useState, useEffect } from 'react';
import { FileText, Eye, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [popularDocs, setPopularDocs] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const docsRef = collection(db, 'documents');
        
        // 1. Get total active documents
        const allActiveQuery = query(docsRef, where('isDeleted', '==', false));
        const allActiveSnapshot = await getDocs(allActiveQuery);
        setTotalDocs(allActiveSnapshot.size); // Just count how many exist!

        // 2. Get the top 4 MOST VIEWED documents
        const popularQuery = query(
          docsRef, 
          where('isDeleted', '==', false),
          orderBy('viewCount', 'desc'),
          limit(4)
        );
        const popularSnapshot = await getDocs(popularQuery);
        
        const popularData = popularSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPopularDocs(popularData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#141632] mb-2">Welcome to the QMS Dashboard</h1>
        <p className="text-gray-500">Overview of your quality management system and pending tasks.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#00B5E2] rounded-full flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Total Documents</p>
            <p className="text-2xl font-extrabold text-[#141632]">{totalDocs}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Action Required</p>
            <p className="text-2xl font-extrabold text-[#141632]">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Due for Review</p>
            <p className="text-2xl font-extrabold text-[#141632]">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-[#009639] rounded-full flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Recently Approved</p>
            <p className="text-2xl font-extrabold text-[#141632]">0</p>
          </div>
        </div>
      </div>

      {/* Most Popular Documents Section */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-extrabold text-[#141632]">Most Popular Documents</h2>
          <p className="text-sm text-gray-500">Frequently accessed policies and procedures.</p>
        </div>
        <button 
          onClick={() => navigate('/documents')}
          className="text-sm font-bold text-[#00B5E2] hover:text-[#009639] transition-colors"
        >
          View All Directory
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading popular documents...</div>
      ) : popularDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDocs.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-[#00B5E2] rounded-lg flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    <Eye size={12} /> {doc.viewCount || 0}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#141632] mb-1 line-clamp-2">{doc.title}</h3>
                <p className="text-xs text-gray-400 font-mono mb-4">{doc.documentNumber}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#00B5E2] bg-blue-50 px-2 py-1 rounded uppercase">
                  {doc.department.replace('_', ' ')}
                </span>
                {doc.fileUrl && (
                  <button 
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    className="text-xs font-bold text-gray-500 hover:text-[#00B5E2] transition-colors"
                  >
                    Open PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-gray-100 text-center text-gray-500">
          No documents have been uploaded yet. Head over to the Documents tab to add some!
        </div>
      )}

    </div>
  );
}