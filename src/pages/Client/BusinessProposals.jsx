import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const BusinessProposals = () => {
  const {
    proposals,
    selectedProposal,
    showDelete,
    handleRowClick,
    handleAddProposal,
    setProposals,
    setSelectedProposal,
    setShowDelete
  } = useOutletContext();

  const handleDelete = () => {
    // For now using mock implementation
    // Replace with actual API call when backend is ready
    setProposals(proposals.filter(p => p.id !== selectedProposal));
    setSelectedProposal(null);
    setShowDelete(false);
    
    /* 
    BACKEND IMPLEMENTATION:
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
    }
    */
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Proposals</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome back, Client</span>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            CN
          </div>
        </div>
      </div>

      {/* Proposal Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lastname</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firstname</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal) => (
              <tr 
                key={proposal.id}
                className={`cursor-pointer ${selectedProposal === proposal.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => handleRowClick(proposal)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProposal === proposal.id}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.entryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.regNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proposal.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          {showDelete && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete Selected
            </button>
          )}
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddProposal}
          >
            Add a new proposal
          </button>
        </div>
      </div>
    </>
  );
};

export default BusinessProposals;