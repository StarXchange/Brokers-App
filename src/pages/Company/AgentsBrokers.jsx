// src/pages/AgentsBrokers.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AgentsBrokers = () => {
  // Mock data that exactly matches your screenshot
  const mockBrokers = [
    {
      id: 'D1/20003',
      companyCode: 'STACO-MARINE',
      name: 'OMOLOLA.OLAWORE',
      mobile: '2348024242567',
      date: '26 Feb 2025',
      contactPerson: 'STACO, PLC'
    },
    {
      id: 'BR/20003',
      companyCode: 'STACO-MARINE',
      name: 'ENDUARANCE.OTUMUDIA',
      mobile: '2348073333517',
      date: '15 Feb 2025',
      contactPerson: 'STACO-MARINE'
    },
    {
      id: 'MODUPE.STACO',
      companyCode: 'STACO-MARINE',
      name: 'MODUPE AJAYI CCS',
      mobile: '2348133472029',
      date: '23 Aug 2024',
      contactPerson: 'MODUPE'
    }
  ];

  const [brokers, setBrokers] = useState(mockBrokers); // Initialize with mock data
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false since we're using mock data
  const [error, setError] = useState(null);

  /* 
  BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
  Uncomment and implement when backend is ready

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/brokers');
        
        // Handle different response structures
        let brokersData = [];
        if (Array.isArray(response.data)) {
          brokersData = response.data;
        } else if (response.data?.brokers) {
          brokersData = response.data.brokers;
        } else if (response.data?.data) {
          brokersData = response.data.data;
        }
        
        setBrokers(brokersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching brokers:', err);
        setError(err.response?.data?.message || 'Failed to fetch brokers');
        setBrokers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  const handleDelete = async (brokerId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/brokers/${brokerId}`);
      setBrokers(brokers.filter(broker => broker.id !== brokerId));
      setSelectedBroker(null);
    } catch (err) {
      console.error('Error deleting broker:', err);
      setError(err.response?.data?.message || 'Failed to delete broker');
    } finally {
      setLoading(false);
    }
  };
  */

  // Mock delete function for now
  const handleDelete = (brokerId) => {
    setBrokers(brokers.filter(broker => broker.id !== brokerId));
    setSelectedBroker(null);
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading brokers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header  */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">GLOBAL INSURANCE BUSINESS SOLUTION</h1>
        <h2 className="text-xl font-semibold text-gray-700 mt-2">Certificates</h2>
        
       
      </header>

      <hr className="my-4 border-gray-200" />

      {/* Main content */}
      <main>
        <h3 className="text-lg font-medium mb-4 text-gray-800">
          You Can Edit Or Delete A Broker Here
        </h3>
        
        {/* Table with exact layout  */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker Id</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brokers.length > 0 ? (
                brokers.map((broker) => (
                  <tr 
                    key={broker.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedBroker(selectedBroker === broker.id ? null : broker.id)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{broker.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{broker.companyCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <Link 
   to={`/company-dashboard/agents-brokers/edit/${encodeURIComponent(broker.id)}`} // Changed from /broker-signup to /edit-broker
  className="text-blue-600 hover:underline"
  onClick={(e) => e.stopPropagation()}
>
  {broker.name}
</Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{broker.mobile}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{broker.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{broker.contactPerson}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {selectedBroker === broker.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(broker.id);
                          }}
                          className="text-red-600 font-medium hover:text-red-800"
                        >
                          DELETE
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                    No brokers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with "Add a new broker" button */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {/* Additional content can go here */}
          </div>
          <Link 
            to="/company-dashboard/add-broker" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
          >
            Add a new broker
          </Link>
        </div>
      </main>

    </div>
  );
};

export default AgentsBrokers;