// src/pages/ViewDocuments.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// This component is a placeholder for viewing documents
// It can be expanded to include actual document viewing functionality

const ViewDocuments = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Marine Documents</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for documents..." 
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 my-2"></div>
        
        <div className="text-center py-8">

          {/* This is where you would map through documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {/* Example document cards would go here */}
          </div>
        </div>
        
        <div className="mt-8">
          <Link 
            to="download-certificates" 
            className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded text-blue-600"
          >
            Download Certificates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewDocuments;