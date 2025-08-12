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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Marine Certificates</h1>
        <Link
          to="/client-dashboard/certificates/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create new Certificate
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter certificate No."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
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
        <button 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          onClick={() => console.log('Search triggered for:', searchTerm)}
        >
          Search
        </button>
      </div>

      <div className="mb-6">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleUploadNID}
        >
          UPLOAD NID
        </button>
      </div>

     
        </div>
      )}

export default ClientCertificate;