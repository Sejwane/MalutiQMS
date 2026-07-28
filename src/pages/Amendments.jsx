import React from 'react';
import { History } from 'lucide-react';

export default function Amendments() {
  // Placeholder data matching your legacy screenshot
  const amendments = [
    { rev: 'R08', pages: 'All', date: '2024-08-01', description: 'Change to Web Interface.' },
    { rev: 'R06', pages: 'All', date: '2017-11-06', description: 'Revision' },
    { rev: 'R05', pages: 'All', date: '2017-10-17', description: 'Revision' },
    { rev: 'R04', pages: 'All', date: '2017-06-12', description: 'Revision' },
    { rev: 'R03', pages: 'All', date: '2016-11-17', description: 'Revision' },
    { rev: 'R02', pages: 'All', date: '2016-06-07', description: 'Revision' },
    { rev: 'R01', pages: 'All', date: '2015-01-01', description: 'Revision' },
    { rev: 'R00', pages: 'All', date: '2014-09-20', description: 'Implementation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter',sans-serif]">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-[#141632] mb-2 flex items-center gap-3">
          <History className="text-[#F2A900]" size={32} />
          Table of Amendments
        </h1>
        <p className="text-gray-500 text-sm">Historical tracking of all system-wide QMS revisions and updates.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141632] text-xs font-bold text-white uppercase tracking-wider">
                <th className="py-4 px-6 w-24">Revision</th>
                <th className="py-4 px-6 w-32">Affected Pages</th>
                <th className="py-4 px-6 w-36">Date</th>
                <th className="py-4 px-6">Description of Amendments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {amendments.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#F2A900] bg-amber-50 px-2 py-1 rounded">
                      {item.rev}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">{item.pages}</td>
                  <td className="py-4 px-6 text-gray-700 font-mono text-xs">{item.date}</td>
                  <td className="py-4 px-6 text-[#141632] font-medium">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}