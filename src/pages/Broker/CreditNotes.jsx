// src/pages/Broker/CreditNotes.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreditNotes = () => {
  const { user } = useAuth();
  const [creditNotes, setCreditNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Enhanced mock data with certificate IDs
  // NOTE: In production, this would be replaced with actual API data
  const mockCreditNotes = [
    {
      dncNo: 'CN/70/002566',
      brokerId: 'intteck',
      policyNo: 'SAN/MOC/00471/2018/HQ',
      transDate: '25 Jul 2018',
      rate: '0.8000%',
      insuredValue: '₦1,000,000',
      grossPremium: '₦8,000',
      certificateId: 'SAN-MOC-00471-2018-HQ' // Matching your certificate ID format
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
        setError('Failed to load credit notes');
        setIsLoading(false);
        // In production, you might want to log this error:
        // console.error('Credit notes fetch error:', err);
        // And possibly send to error tracking service
      }
    };

    fetchCreditNotes();
  }, []); // Add dependencies if needed (e.g., [user.token] if making real API calls)

  if (isLoading) return <div className="p-4">Loading credit notes...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Your Transaction Credit Notes</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNCNo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker Id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trans.Date Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross premium</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Print</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creditNotes.map((note) => (
              <tr key={note.dncNo}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to="/brokers-dashboard/certificates/create-certificate/new"
                    className="text-blue-600 hover:underline"
                  >
                    {note.dncNo}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.brokerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.policyNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.transDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.insuredValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.grossPremium}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditNotes;