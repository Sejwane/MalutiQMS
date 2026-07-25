import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Components
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Documents from "./components/Documents"; 
import SearchBar from "./components/SearchBar"; // <-- 1. Imported your SearchBar

/**
 * PROTECTED LAYOUT WRAPPER
 * This component acts as a shell for all authenticated pages.
 * It renders the Header, the Global Search, and uses <Outlet /> to inject the page content.
 */
const ProtectedLayout = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleGlobalSearch = (searchData) => {
    // You can later update this to navigate to a search results page
    console.log("Global Search Initiated:", searchData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-12">
        
        {/* GLOBAL SEARCH BAR - Appears on every protected page automatically */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <SearchBar onSearch={handleGlobalSearch} />
        </div>

        {/* PAGE CONTENT - <Outlet /> swaps in Dashboard, Documents, etc. */}
        <Outlet />
        
      </main>
    </div>
  );
};


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#00B5E2] font-bold">
        Loading QMS...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTE */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* PROTECTED ROUTES (Wrapped in the layout) */}
        <Route element={<ProtectedLayout user={user} />}>
          
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          
          {/* Add future protected routes here (e.g., <Route path="/admin" element={<AdminPanel />} />) */}
        
        </Route>

      </Routes>
    </Router>
  );
}