import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CertificateDetails = () => {
  const { certNo } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState({
    certNo: '',
    insuredName: '',
    address: '',
    transDate: '',
    policyNo: '',
    approvalStatus: '',
    specialConditions: '',
    origin: '',
    destination: '',
    interest: '',
    lienClauses: '',
    excess: '',
    insuredValue: '',
    rate: '',
    grossPremium: '',
    clausesConditions: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        // GET request to fetch certificate
        const response = await axios.get(`/api/certificates/${certNo}`);
        setCertificate(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch certificate');
        console.error('Error fetching certificate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // PUT request to update certificate
      await axios.put(`/api/certificates/${certNo}`, certificate);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update certificate');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading certificate details...</div>
      </div>
    );
  }

  {/* do not delete this commented api calls, they are there so when backend is been implemented, this is the code section that will grab the certificaates details from the backend.... DO NOT DELETE*/}

  //   if (error) {
  //     return (
  //       <div className="p-4">
  //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
  //           <strong>Error:</strong> {error}
  //           <button 
  //             onClick={() => navigate('/company-dashboard/certificates')} 
  //             className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
  //           >
  //             Back to Certificates
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!certificate.certNo) {
  //     return (
  //       <div className="p-4">
  //         <div className="mb-4">Certificate not found</div>
  //         <button
  //           onClick={() => navigate('/company-dashboard/certificates')}
  //           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //         >
  //           Back to Certificates
  //         </button>
  //       </div>
  //     );
  //   }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Marine Certificate Setup</h1>
      <p className="text-gray-600 mb-6">Certificate Detail here</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          {/* Certificate No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Certificate No</label>
            {isEditing ? (
              <input
                type="text"
                name="certNo"
                value={certificate.certNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.certNo || '10002'}
              </div>
            )}
          </div>

          {/* Insured Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Insured Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="insuredName"
                value={certificate.insuredName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.insuredName || 'MW_STACO'}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            {isEditing ? (
              <textarea
                name="address"
                value={certificate.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md whitespace-pre-line">
                {certificate.address || '219 HERBERT MULCAULEY\nMAY, YABA'}
              </div>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Date:</label>
            {isEditing ? (
              <input
                type="date"
                name="transDate"
                value={certificate.transDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.transDate || '1/16/2025'}
              </div>
            )}
          </div>

          {/* Policy No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Policy No:</label>
            {isEditing ? (
              <input
                type="text"
                name="policyNo"
                value={certificate.policyNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.policyNo || 'STC/2025/10002'}
              </div>
            )}
          </div>

          {/* Per */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Per:</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="approvalStatus"
                  value={certificate.approvalStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="AW APPROVED"
                />
                <input
                  type="text"
                  name="specialConditions"
                  value={certificate.specialConditions}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="STEMPER(5) AS PER"
                />
              </>
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.approvalStatus || 'AW APPROVED'}<br />
                {certificate.specialConditions || 'STEMPER(5) AS PER'}
              </div>
            )}
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700">From:</label>
            {isEditing ? (
              <input
                type="text"
                name="origin"
                value={certificate.origin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.origin || 'SWEDEN'}
              </div>
            )}
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700">To:</label>
            {isEditing ? (
              <input
                type="text"
                name="destination"
                value={certificate.destination}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.destination || 'LOS APAPA'}
              </div>
            )}
          </div>

          {/* Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest:</label>
            {isEditing ? (
              <input
                type="text"
                name="interest"
                value={certificate.interest}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.interest || 'POP......'}
              </div>
            )}
          </div>

          {/* Lien Clauses */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Lien Clauses:</label>
            {isEditing ? (
              <input
                type="text"
                name="lienClauses"
                value={certificate.lienClauses}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.lienClauses || 'NTL'}
              </div>
            )}
          </div>

          {/* Excess */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Excess:</label>
            {isEditing ? (
              <input
                type="text"
                name="excess"
                value={certificate.excess}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.excess || '5'}
              </div>
            )}
          </div>

          {/* Insured Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Insured Value:</label>
            {isEditing ? (
              <input
                type="number"
                name="insuredValue"
                value={certificate.insuredValue}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                step="0.0001"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.insuredValue ? new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4
                }).format(certificate.insuredValue) : '142400000.0000'}
              </div>
            )}
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate:</label>
            {isEditing ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="rate"
                  value={certificate.rate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
                <span className="ml-2">Compute</span>
              </div>
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.rate || '0'}    Compute
              </div>
            )}
          </div>

          {/* Gross Premium */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gross Premium:</label>
            {isEditing ? (
              <input
                type="number"
                name="grossPremium"
                value={certificate.grossPremium}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                step="0.0001"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.grossPremium ? new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4
                }).format(certificate.grossPremium) : '213800.0000'}
              </div>
            )}
          </div>

          {/* Clauses Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Clauses Conditions:</label>
            {isEditing ? (
              <input
                type="text"
                name="clausesConditions"
                value={certificate.clausesConditions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {certificate.clausesConditions || 'TBA'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          {isEditing ? (
            <>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <Link
                to="/company-dashboard/certificates"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go Back
              </Link>
              <div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Print Certificate
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default CertificateDetails;