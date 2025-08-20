// src/pages/Broker/CreditNotes.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CreditNotes = () => {
  const { user } = useAuth();
  const [creditNotes, setCreditNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Enhanced mock data with certificate IDs
  // NOTE: In production, this would be replaced with actual API data
  const mockCreditNotes = [
    {
      dncNo: "CN/70/002566",
      brokerId: "intteck",
      policyNo: "SAN/MOC/00471/2018/HQ",
      transDate: "25 Jul 2018",
      rate: "0.8000%",
      insuredValue: "₦1,000,000",
      grossPremium: "₦8,000",
      certificateId: "SAN-MOC-00471-2018-HQ", // Matching your certificate ID format
    },
    // Add more mock data as needed
  ];

  // Simulate fetching credit notes
  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        setIsLoading(true);

        /* 
        BACKEND IMPLEMENTATION NOTES:
        
        1. Actual API call would look something like this:
        
        const response = await fetch('/api/credit-notes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Assuming JWT auth
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch credit notes');
        }
        
        const data = await response.json();
        setCreditNotes(data);
        
        2. For filtering by broker (if needed):
        const response = await fetch(`/api/credit-notes?brokerId=${user.brokerId}`);
        
        3. For pagination:
        const response = await fetch(`/api/credit-notes?page=1&limit=10`);
        
        4. Error handling would be as shown below in the catch block
        */

        // Mock implementation (remove in production)
        setTimeout(() => {
          setCreditNotes(mockCreditNotes);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load credit notes");
        setIsLoading(false);
        // In production, you might want to log this error:
        // console.error('Credit notes fetch error:', err);
        // And possibly send to error tracking service
      }
    };

    fetchCreditNotes();
  }, []); // Add dependencies if needed (e.g., [user.token] if making real API calls)

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="animate-pulse text-gray-600">
          Loading credit notes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>Error:</strong> {error}
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Transaction Credit Notes
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage your credit note transactions
            </p>
          </div>
          <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Credit Notes Table/Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Credit Notes Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track and download your transaction credit notes
          </p>
        </div>

        {/* Mobile Card View for small screens */}
        <div className="block lg:hidden">
          {creditNotes.length > 0 ? (
            creditNotes.map((note) => (
              <div
                key={note.dncNo}
                className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      to="/brokers-dashboard/certificates/create"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors block"
                    >
                      {note.dncNo}
                    </Link>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md mt-1">
                      {note.brokerId}
                    </span>
                  </div>
                  <button className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Policy No</p>
                    <p className="font-medium text-gray-900 truncate">
                      {note.policyNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Trans. Date</p>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 text-gray-400 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="font-medium text-gray-600 text-xs">
                        {note.transDate}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Rate</p>
                    <p className="font-medium text-gray-900">{note.rate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Insured Value</p>
                    <p className="font-semibold text-green-600">
                      {note.insuredValue}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-gray-500 text-xs">Gross Premium</p>
                    <p className="font-semibold text-green-600">
                      {note.grossPremium}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">No credit notes found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Your credit notes will appear here when available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View for large screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  DNC No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Broker ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Policy No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trans. Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Insured Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Gross Premium
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {creditNotes.length > 0 ? (
                creditNotes.map((note) => (
                  <tr
                    key={note.dncNo}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link
                        to="/brokers-dashboard/certificates/create"
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                      >
                        {note.dncNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                        {note.brokerId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {note.policyNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {note.transDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {note.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {note.insuredValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {note.grossPremium}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        // onClick={() => {
                        /* 
                          BACKEND IMPLEMENTATION FOR DOWNLOAD:
                          
                          1. PDF download endpoint might look like:
                          window.open(`/api/credit-notes/${note.dncNo}/download`, '_blank');
                          
                          2. Or if you need to POST first:
                          const response = await fetch(`/api/credit-notes/${note.dncNo}/download`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${user.token}`
                            }
                          });
                          // Then handle the blob response
                          */

                        // Mock implementation (remove in production)
                        //   window.open('#', '_blank');
                        // }}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">
                        No credit notes found
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Your credit notes will appear here when available
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Summary - Mobile Responsive */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              {creditNotes.length} credit note
              {creditNotes.length !== 1 ? "s" : ""} total
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-500 text-center">
                Last updated: {new Date().toLocaleDateString()}
              </span>
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditNotes;
