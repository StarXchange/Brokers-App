import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 
  BACKEND IMPLEMENTATION (GET CLIENTS)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients');
        setClients(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);
  */

  // Mock data - Remove when backend is connected
  useEffect(() => {
    const mockClients = [
      { id: 1, name: 'Client One', email: 'client1@example.com' },
      { id: 2, name: 'Client Two', email: 'client2@example.com' }
    ];
    setClients(mockClients);
    setLoading(false);
  }, []);

  /* 
  BACKEND IMPLEMENTATION (DELETE CLIENTS)
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/clients', { 
        data: { clientIds: selectedClients } 
      });
      setClients(clients.filter(client => !selectedClients.includes(client.id)));
      setSelectedClients([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };
  */

  // Mock delete - Remove when backend is connected
  const handleDelete = () => {
    setClients(clients.filter(client => !selectedClients.includes(client.id)));
    setSelectedClients([]);
  };

  const toggleClientSelection = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId) 
        : [...prev, clientId]
    );
  };

  if (loading) return <div className="text-center py-8">Loading clients...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        You Can Edit Or Delete A Client Here
      </h2>
      
      {selectedClients.length > 0 && (
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            DELETE SELECTED ({selectedClients.length})
          </button>
        </div>
      )}

      <div className="mb-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedClients.includes(client.id)}
                    onChange={() => toggleClientSelection(client.id)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    // to={`/company-dashboard/client-management/edit/${client.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Link 
        to="/brokers-dashboard/client-management/add-client"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add a new Client
      </Link>
    </div>
  );
}
