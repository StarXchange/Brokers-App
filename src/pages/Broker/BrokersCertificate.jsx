// src/pages/brokers/BrokerCertificates.jsx
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const BrokerCertificates = () => {
  // Mock data matching your screenshot
  const mockCertificates = [
    {
      id: 'PRESTIGE2018/70002566',
      brokerId: 'intteck',
      certNo: 'PRESTIGE2018/70002566',
      policyNo: 'SAN/MOC/00471/2018/HQ',
      transDate: '25 Jul 2018',
      rate: '0.8%',
      insuredValue: '₦1,000,000',
      grossPremium: '₦8,000',
      status: 'Download'
    },
    {
      id: 'ADP/16/6/000077',
      brokerId: 'INTTECK',
      certNo: 'ADP/16/6/000077',
      policyNo: 'POLN/16/6/000077',
      transDate: '19 Jun 2016',
      rate: '0.89%',
      insuredValue: '₦888,888',
      grossPremium: '₦7,911',
      status: 'Download'
    },
    {
      id: 'CRN/16/6/000061',
      brokerId: 'INTTECK',
      certNo: 'CRN/16/6/000061',
      policyNo: 'POLN/16/6/000061',
      transDate: '08 Jun 2016',
      rate: '0.89%',
      insuredValue: '₦500,000',
      grossPremium: '₦4,450',
      status: 'Download'
    }
  ];

  const [certificates, setCertificates] = useState(mockCertificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* 
  BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/brokers/certificates');
        setCertificates(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);
  */

  const handleSearch = () => {
    /* 
    BACKEND SEARCH IMPLEMENTATION
    try {
      setLoading(true);
      const response = await axios.get(`/api/brokers/certificates?search=${searchTerm}`);
      setCertificates(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
    */
    
    // Mock search implementation
    const filtered = mockCertificates.filter(cert => 
      cert.certNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.policyNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCertificates(filtered);
  };

  if (loading) {
    return <div className="text-center py-4">Loading certificates...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 ">
          <input
            type="text"
            placeholder="Enter certificate No."
            className=" px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
          <div className="flex justify-end">
  <Link 
to="/brokers-dashboard/certificates/create-certificate/new" 
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    Create new Certificate
  </Link>
</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CertNo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker Id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cert No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trans.Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross premium</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Print</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certificates.map((certificate) => (
              <tr key={certificate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="h-4 w-4" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{certificate.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.brokerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link to={`/brokers-dashboard/certificates/${certificate.id}`} className="text-blue-600 hover:underline">
                    {certificate.certNo}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.policyNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.transDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.rate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.insuredValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificate.grossPremium}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {certificate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrokerCertificates;