// src/pages/Certificates.jsx
import { useOutletContext, Link } from 'react-router-dom';

const Certificates = () => {
  const {
    certificates,
    selectedCerts,
    toggleCertificateSelection,
    handleApprove,
    handleReject,
    handleDelete
  } = useOutletContext();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Marine Certificates</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Search certificates..." 
            className="px-4 py-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      certificates.forEach(cert => toggleCertificateSelection(cert.id));
                    } else {
                      setSelectedCerts([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cert No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trans. Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Premium</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedCerts.includes(cert.id)}
                    onChange={() => toggleCertificateSelection(cert.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    to={`/company-dashboard/certificates/${cert.certNo}`} 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {cert.certNo}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.brokerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.policyNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.transDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.rate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.insuredValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cert.grossPremium}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cert.status === 'PENDING' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {cert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Download
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      More
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCerts.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedCerts.length} certificate(s) selected
            </span>
            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                APPROVE
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                REJECT
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;