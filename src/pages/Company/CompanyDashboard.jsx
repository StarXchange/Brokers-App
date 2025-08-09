// src/pages/CompanyDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AgentsBrokers from './AgentsBrokers';
import Certificates from './Certificates';
// import ChangePassword from './ChangePassword';


const CompanyDashboard = () => {
  // State that will connect to backend
  const [certificates, setCertificates] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // This will be replaced with real API call
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        /* REAL IMPLEMENTATION:
        const response = await fetch('/api/certificates');
        const data = await response.json();
        setCertificates(data);
        */
        
        // Temporary mock (will be removed)
        setTimeout(() => {
          setCertificates([
            {
              id: 1,
              certNo: '10002',
              brokerId: 'MODUPE_STACO',
              policyNo: 'STC/2025/10002',
              transDate: '16 Jan 2025',
              rate: '0%',
              insuredValue: '₦142,400,000',
              grossPremium: '₦213,600',
              status: 'PENDING'
            },
            {
              id: 2,
              certNo: '110001',
              brokerId: 'MODUPE_STACO',
              policyNo: 'STC/2024/110001',
              transDate: '18 Nov 2024',
              rate: '0.15%',
              insuredValue: '₦156,750,000',
              grossPremium: 'MS',
              status: 'PENDING'
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // These will connect to real backend endpoints
  const handleApprove = () => {
    console.log('Approving certificates:', selectedCerts);
    /* REAL IMPLEMENTATION:
    await fetch('/api/certificates/approve', {
      method: 'POST',
      body: JSON.stringify({ ids: selectedCerts })
    });
    */
  };

  const handleReject = () => {
    console.log('Rejecting certificates:', selectedCerts);
    // Similar API call
  };

  const handleDelete = () => {
    console.log('Deleting certificates:', selectedCerts);
    // Similar API call
  };

  const toggleCertificateSelection = (certId) => {
    setSelectedCerts(prev =>
      prev.includes(certId)
        ? prev.filter(id => id !== certId)
        : [...prev, certId]
    );
  };

  if (isLoading) return <div className="p-4">Loading certificates...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-xl font-bold">GLOBAL INSURANCE BUSINESS SOLUTION</h1>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 min-h-screen shadow">
        <nav>
          
        <ul className="space-y-2">

        <Link to ="certificates"><li><button className="font-semibold text-lg mb-4 hover:bg-blue-50 rounded">Certificates</button></li>
        </Link>
          
        <Link to ="agents-brokers"><li><button className="font-semibold text-lg mb-4 hover:bg-blue-50 rounded ">Agents/Brokers</button></li>
              </Link>
              <Link to ="download-certificates"><li><button className="font-semibold text-lg mb-4  text-left hover:bg-blue-50 rounded">Download Certificates</button></li>
              </Link>
              <Link to ="change-password"><li><button className="font-semibold text-lg mb-4  text-left hover:bg-blue-50 rounded">Change Password</button></li>
              </Link>
              <li><Link to="/company" className="font-semibold text-lg mb-4  text-left p-2 text-red-600 hover:bg-red-50 rounded">Logout</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content - Replaced with Outlet */}
        <main className="flex-1 p-6">
          <Outlet context={{
            certificates,
            selectedCerts,
            toggleCertificateSelection,
            handleApprove,
            handleReject,
            handleDelete
          }} />
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;