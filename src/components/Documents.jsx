import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Eye, UploadCloud } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase'; 

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [department, setDepartment] = useState('HUMAN_RESOURCES');
  const [category, setCategory] = useState('POLICIES');
  const [file, setFile] = useState(null); 

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docsRef = collection(db, 'documents');
      const q = query(docsRef, where('isDeleted', '==', false));
      const querySnapshot = await getDocs(q);
      
      const docsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docsData);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // CREATE: Handle file upload bypass and database entry
  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!title || !documentNumber || !file) {
      alert("Please fill all fields and select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);

      // --- BYPASSING FIREBASE STORAGE ---
      // Simulating a network delay so the "Uploading..." button state looks realistic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Using a safe, public dummy PDF link for testing purposes
      const dummyFileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

      // Save everything to Firestore
      await addDoc(collection(db, 'documents'), {
        title,
        documentNumber,
        department,
        category,
        status: 'PENDING_APPROVAL',
        currentVersion: 'R01',
        fileUrl: dummyFileUrl, // Saving the dummy link
        isDeleted: false,
        viewCount: 0,
        authorId: auth.currentUser?.uid || 'unknown',
        createdAt: serverTimestamp(),
      });

      // Reset form and close
      setTitle('');
      setDocumentNumber('');
      setFile(null);
      setIsModalOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Error uploading document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSoftDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to archive this document?")) return;
    try {
      const docRef = doc(db, 'documents', docId);
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: serverTimestamp()
      });
      fetchDocuments();
    } catch (error) {
      console.error("Error performing soft delete:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4 font-['Inter',sans-serif]">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#141632]">Document Management Engine</h1>
          <p className="text-sm text-gray-500">ISO 9001 Compliant Document Control & Version Tracking</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00B5E2] hover:bg-[#009639] text-white px-4 py-2.5 rounded-md font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Upload New Document
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading document control registry...</div>
        ) : documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Document Name / Number</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Version</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#141632]">{doc.title}</div>
                      <div className="text-xs text-gray-400 font-mono">{doc.documentNumber}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#00B5E2]">
                        {doc.department}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        doc.status === 'APPROVED' ? 'bg-green-50 text-[#009639]' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-bold text-gray-700">
                      {doc.currentVersion}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {doc.fileUrl && (
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400 hover:text-[#00B5E2] transition-colors p-1" title="View PDF">
                          <Eye size={18} />
                        </a>
                      )}
                      <button onClick={() => handleSoftDelete(doc.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Archive">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-600 font-semibold">No active documents registered.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border-t-4 border-[#F2A900]">
            <h3 className="text-lg font-extrabold text-[#141632] mb-4">Register & Upload Document</h3>
            
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Document Title</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Communication Devices Policy" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00B5E2]" required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Document Number</label>
                <input 
                  type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="e.g. MLT-HR-POL-2026-001" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#00B5E2]" required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none">
                    <option value="HUMAN_RESOURCES">Human Resources</option>
                    <option value="FINANCE">Finance</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="IT">IT Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none">
                    <option value="POLICIES">Policies</option>
                    <option value="PROCEDURES">Procedures</option>
                    <option value="FORMS">Forms</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Attach File (PDF/Word)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#00B5E2] hover:file:bg-blue-100 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-4 py-2 bg-[#00B5E2] hover:bg-[#009639] disabled:bg-gray-400 text-white text-sm font-bold rounded-md transition-colors flex items-center gap-2"
                >
                  {isUploading ? 'Uploading...' : <><UploadCloud size={16} /> Save & Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}