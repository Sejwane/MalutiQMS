import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function DocumentControl() {
  // Placeholder data matching your legacy screenshot
  const masterList = [
    { id: 1, title: 'Quality Manual System (QMS) Master Document', approvedBy: 'VE MABENA', role: 'PRINCIPAL', date: '30-06-2017', distribution: 'All Staff (Electronic)' },
    { id: 2, title: 'Occupational Health and Safety Policy', approvedBy: 'VE MABENA', role: 'PRINCIPAL', date: '15-08-2018', distribution: 'All Staff (Electronic)' },
    { id: 3, title: 'Student Disciplinary Procedure', approvedBy: 'EXECUTIVE MGT', role: 'COUNCIL', date: '10-02-2020', distribution: 'Staff & Students' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      <div className="mb-10 pb-6 border-b border-gray-200 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#141632] mb-2">Document Control Sheet</h1>
          <p className="text-gray-500 text-sm">Quality Manual System Master Distribution & Approval List.</p>
        </div>
        <button className="bg-[#00B5E2] hover:bg-[#009639] text-white px-4 py-2.5 rounded-md font-bold flex items-center gap-2 transition-colors shadow-sm text-sm">
          <Download size={16} /> Export Register
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f7fb] border-b border-gray-200 text-xs font-bold text-[#141632] uppercase tracking-wider">
                <th className="py-4 px-6">Document Title</th>
                <th className="py-4 px-6">Approved By</th>
                <th className="py-4 px-6">Role / Position</th>
                <th className="py-4 px-6">Approval Date</th>
                <th className="py-4 px-6">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {masterList.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#00B5E2] flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    {doc.title}
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-700">{doc.approvedBy}</td>
                  <td className="py-4 px-6 text-gray-500">{doc.role}</td>
                  <td className="py-4 px-6 text-gray-500">{doc.date}</td>
                  <td className="py-4 px-6">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold uppercase">
                      {doc.distribution}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}