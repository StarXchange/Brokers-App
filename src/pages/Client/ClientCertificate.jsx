import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientCertificate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);

  // Mock data fetch - would be replaced with real API call
  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        /*
        // REAL API IMPLEMENTATION:
        // const response = await axios.get('/api/client/certificates');
        // setCertificates(response.data);
        */

        // MOCK DATA - REMOVE IN PRODUCTION
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = [
          { 
            id: 'MC-2025-001', 
            date: '01 Aug, 2025', 
            insured: 'Oceanic Shipping Ltd', 
            status: 'Active',
            viewUrl: '/client-dashboard/certificates/MC-2025-001'
          },
          { 
            id: 'MC-2025-002', 
            date: '05 Aug, 2025', 
            insured: 'Global Freight Solutions', 
            status: 'Active',
            viewUrl: '/client-dashboard/certificates/MC-2025-002'
          },
          { 
            id: 'MC-2025-003', 
            date: '10 Aug, 2025', 
            insured: 'Maritime Traders Inc', 
            status: 'Pending',
            viewUrl: '/client-dashboard/certificates/MC-2025-003'
          },
        ];
        setCertificates(mockData);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load certificates');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert =>
    cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.insured.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadNID = () => {
    /*
    // REAL IMPLEMENTATION:
    // try {
    //   const formData = new FormData();
    //   formData.append('nidFile', selectedFile);
    //   await axios.post('/api/upload-nid', formData);
    //   alert('NID uploaded successfully!');
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Upload failed');
    // }
    */
    alert('NID upload functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ minWidth: "1200px" }}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your Marine Certificates
            </h1>
            <p className="text-gray-600">
              View and manage your marine certificates
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Welcome back, Client</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              CN
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
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
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Certificates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Certificate Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all your marine certificates
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/client-dashboard/certificates/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create new Certificate
              </Link>
              <button
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={handleUploadNID}
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload NID
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by certificate No. or insured name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto">
          <table
            className="w-full divide-y divide-gray-200"
            style={{ minWidth: "1100px" }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Certificate ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Insured
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.insured}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={cert.viewUrl}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientCertificate;