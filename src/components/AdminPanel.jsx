import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, MoreVertical, Building, X, Save } from 'lucide-react';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth, secondaryAuth } from '../firebase'; // Import auth & secondaryAuth

export default function AdminPanel() {
  // Replace with your actual auth context when ready (e.g., const { currentUser } = useAuth();)
  const currentUser = {
    uid: "ZJiYGPoVBoYu3Mpud6Vy40EHGEk2",
    email: "neo@thebattlefieldholdings.com",
    fullname: "Battlefield ICT"
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    role: 'USER',
    department: 'ACADEMIC',
    campus: 'MAIN'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort so Super Admins appear at the top
      usersData.sort((a, b) => (a.role === 'SUPER_ADMIN' ? -1 : 1));
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle User Creation (Auth + Firestore + Email Link)
  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email) return;

    try {
      setIsSubmitting(true);
      
      // 1. Generate a temporary baseline password
      const tempPassword = Math.random().toString(36).slice(-8) + "A1!"; 
      
      // 2. Create the Auth account using secondaryAuth (prevents admin logout)
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        formData.email, 
        tempPassword
      );
      const newUid = userCredential.user.uid;

      // 3. Save to Firestore using the generated UID as Document ID
      await setDoc(doc(db, 'users', newUid), {
        fullname: formData.fullname,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        campus: formData.campus,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        addedBy: currentUser.fullname,
        addedByEmail: currentUser.email,
        addedByUid: currentUser.uid 
      });

      // 4. Send Password Setup Link to the newly registered user
      await sendPasswordResetEmail(auth, formData.email);

      alert(`User created! Password setup link dispatched to ${formData.email}.`);

      // Reset form and refresh user table
      setFormData({
        fullname: '',
        email: '',
        role: 'USER',
        department: 'ACADEMIC',
        campus: 'MAIN'
      });
      setIsModalOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("A user with this email address already exists.");
      } else {
        alert(`Failed to add user: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#141632] mb-2">System Administration</h1>
          <p className="text-gray-500 text-sm">Manage user access, roles, and campus assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#141632] hover:bg-gray-800 text-white px-4 py-2.5 rounded-md font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Invite New User
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#00B5E2] rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Active Users</p>
            <p className="text-2xl font-extrabold text-[#141632]">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Super Admins</p>
            <p className="text-2xl font-extrabold text-[#141632]">
              {users.filter(u => u.role === 'SUPER_ADMIN').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Building size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Campuses Online</p>
            <p className="text-2xl font-extrabold text-[#141632]">
              {new Set(users.map(u => u.campus).filter(Boolean)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-[#141632]">Access Control List (ACL)</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading user registry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">User / Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Campus</th>
                  <th className="py-4 px-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#141632]">{user.fullname || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role ? user.role.replace('_', ' ') : 'USER'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-700 text-xs uppercase">
                      {user.department?.replace('_', ' ') || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-[#00B5E2] bg-blue-50 px-2.5 py-1 rounded uppercase">
                        {user.campus || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-gray-400 hover:text-[#141632] transition-colors p-1" title="User Options">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border-t-4 border-[#141632]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#141632]">Register New User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullname} 
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                  placeholder="e.g. Jane Doe" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#141632]" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. jane@malutitvet.co.za" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#141632]" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">System Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none font-semibold text-[#141632]"
                  >
                    <option value="USER">Standard User</option>
                    <option value="VIEWER">Viewer</option>
                    <option value="STUDENT_REP">Student Representative</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="EXECUTIVE">Executive</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Campus</label>
                  <select 
                    value={formData.campus} 
                    onChange={(e) => setFormData({...formData, campus: e.target.value})} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                  >
                    <option value="ALL">All Campuses</option>
                    <option value="MAIN">Main Campus</option>
                    <option value="CENTRAL">Central Office</option>
                    <option value="BETHLEHEM">Bethlehem Campus</option>
                    <option value="HARRISMITH">Harrismith Campus</option>
                    <option value="KWAQWA">Phuthaditjhaba Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                <select 
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                >
                  <option value="ACADEMIC">Academic</option>
                  <option value="MANAGEMENT">Management</option>
                  <option value="FINANCE">Finance</option>
                  <option value="STUDENT_GOVERNANCE">Student Governance</option>
                  <option value="HUMAN_RESOURCES">Human Resources</option>
                  <option value="IT">IT Support</option>
                  <option value="STUDENT_SUPPORT">Student Support</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#141632] hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-bold rounded-md transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : <><Save size={16} /> Register User</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}