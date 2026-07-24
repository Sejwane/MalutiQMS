import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Header from "./components/Header";

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

  // Show a loading state while Firebase checks the user's tokens
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-[#00B5E2] font-bold text-xl">Loading QMS Intranet...</p>
      </div>
    );
  }

  // If no user is logged in, force them to the Login screen
  if (!user) {
    return <Login />;
  }

  // Authenticated Layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Temporary Dashboard Placeholder */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-12">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center bg-white shadow-sm">
             <h1 className="text-3xl font-bold text-[#141632] mb-2">Welcome to Maluti QMS</h1>
             <p className="text-gray-500">Your dashboard layout will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}