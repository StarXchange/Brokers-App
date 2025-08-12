import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  // State for proposals data
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  /* 
  BACKEND IMPLEMENTATION (COMMENTED FOR FRONTEND STRUCTURE)
  
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/client/proposals');
        if (!response.ok) throw new Error('Failed to fetch proposals');
        const data = await response.json();
        setProposals(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching proposals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);
  */

  // Mock data for frontend display
  useEffect(() => {
    setProposals([
      { 
        id: 1, 
        entryDate: '22 Aug 15', 
        lastName: 'Other Names', 
        firstName: 'intteck', 
        address: '233 ikorodu road', 
        mobile: '08023140962', 
        regNumber: 'LAG 987 67', 
        amount: '5000.0000' 
      },
      { 
        id: 2, 
        entryDate: '22 Aug 15', 
        lastName: 'Other Names', 
        firstName: 'intteck', 
        address: '233 ikorodu road', 
        mobile: '08023140962', 
        regNumber: 'LAG 987 GH', 
        amount: '5000.0000' 
      }
    ]);
    setLoading(false);
  }, []);

  const handleRowClick = (proposal) => {
    setSelectedProposal(proposal.id === selectedProposal ? null : proposal.id);
    setShowDelete(proposal.id === selectedProposal ? false : true);
  };

  /* 
  BACKEND IMPLEMENTATION FOR DELETE
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/proposals/${selectedProposal}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error('Failed to delete proposal');
      setProposals(proposals.filter(p => p.id !== selectedProposal));
      setSelectedProposal(null);
      setShowDelete(false);
    } catch (err) {
      console.error('Error deleting proposal:', err);
      setError(err.message);
    }
  };
  */

  const handleAddProposal = () => {
    navigate('add-proposal');
  };

  if (loading) return <div className="p-4">Loading proposals...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/client-dashboard" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded text-blue-600"
              >
                Business Proposals
              </Link>
            </li>
            <li>
              <Link 
                to="/client-dashboard" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Policies
              </Link>
            </li>
            <li>
              <Link 
                to="/client-dashboard/client-certificate" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Certificates
              </Link>
            </li>
            <li>
              <Link 
                to="/client-dashboard/change-password" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link 
                to="/" 
                className="block font-semibold text-lg p-2 text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ 
            proposals, 
            selectedProposal, 
            showDelete, 
            handleRowClick, 
            handleAddProposal,
            setProposals,
            setSelectedProposal,
            setShowDelete
          }} />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;