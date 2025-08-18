import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const CertificateDetails = () => {
  const { certNo } = useParams();
  const [certificate, setCertificate] = useState({
    certNo: "",
    insuredName: "",
    address: "",
    transDate: "",
    policyNo: "",
    approvalStatus: "",
    specialConditions: "",
    origin: "",
    destination: "",
    interest: "",
    lienClauses: "",
    excess: "",
    insuredValue: "",
    rate: "",
    grossPremium: "",
    clausesConditions: "",
  });
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        // GET request to fetch certificate
        const response = await axios.get(`/api/certificates/${certNo}`);
        setCertificate(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch certificate");
        console.error("Error fetching certificate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PUT request to update certificate
      await axios.put(`/api/certificates/${certNo}`, certificate);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update certificate");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse text-gray-600">
          Loading certificate details...
        </div>
      </div>
    );
  }

  {
    /* do not delete this commented api calls, they are there so when backend is been implemented, this is the code section that will grab the certificaates details from the backend.... DO NOT DELETE*/
  }

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
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Certificate Details
            </h1>
            <p className="text-gray-600">Certificate Detail here</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Certificate No: {certificate.certNo || "10002"}</span>
          </div>
        </div>
      </div>

      {/* Certificate Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Certificate Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing
                  ? "Edit certificate details"
                  : "View certificate details"}
              </p>
            </div>
            {!isEditing && (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Certificate
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certificate No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate No
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="certNo"
                  value={certificate.certNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {certificate.certNo || "10002"}
                </div>
              )}
            </div>

            {/* Insured Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insured Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="insuredName"
                  value={certificate.insuredName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {certificate.insuredName || "MW_STACO"}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={certificate.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 whitespace-pre-line">
                  {certificate.address || "219 HERBERT MULCAULEY\nMAY, YABA"}
                </div>
              )}
            </div>

            {/* Transaction Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="transDate"
                  value={certificate.transDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {certificate.transDate || "1/16/2025"}
                </div>
              )}
            </div>

            {/* Policy No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy No
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="policyNo"
                  value={certificate.policyNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {certificate.policyNo || "STC/2025/10002"}
                </div>
              )}
            </div>

            {/* Per */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="approvalStatus"
                    value={certificate.approvalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="AW APPROVED"
                  />
                  <input
                    type="text"
                    name="specialConditions"
                    value={certificate.specialConditions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="STEMPER(5) AS PER"
                  />
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  <div>{certificate.approvalStatus || "AW APPROVED"}</div>
                  <div className="mt-1">
                    {certificate.specialConditions || "STEMPER(5) AS PER"}
                  </div>
                </div>
              )}
            </div>

            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="origin"
                  value={certificate.origin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.origin || "SWEDEN"}
                </div>
              )}
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="destination"
                  value={certificate.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.destination || "LOS APAPA"}
                </div>
              )}
            </div>

            {/* Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="interest"
                  value={certificate.interest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.interest || "POP......"}
                </div>
              )}
            </div>

            {/* Lien Clauses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien Clauses
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lienClauses"
                  value={certificate.lienClauses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.lienClauses || "NTL"}
                </div>
              )}
            </div>

            {/* Excess */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excess
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="excess"
                  value={certificate.excess}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.excess || "5"}
                </div>
              )}
            </div>

            {/* Insured Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insured Value
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="number"
                    name="insuredValue"
                    value={certificate.insuredValue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    step="0.0001"
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-gray-500 text-sm">
                    ₦
                  </span>
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-green-600">
                  ₦
                  {certificate.insuredValue
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      }).format(certificate.insuredValue)
                    : "142,400,000.0000"}
                </div>
              )}
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate
              </label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      name="rate"
                      value={certificate.rate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-3.5 text-gray-500 text-sm">
                      %
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    Compute
                  </span>
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center justify-between">
                  <span className="font-medium">
                    {certificate.rate || "0"}%
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    Compute
                  </span>
                </div>
              )}
            </div>

            {/* Gross Premium */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gross Premium
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="number"
                    name="grossPremium"
                    value={certificate.grossPremium}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    step="0.0001"
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-gray-500 text-sm">
                    ₦
                  </span>
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-green-600">
                  ₦
                  {certificate.grossPremium
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      }).format(certificate.grossPremium)
                    : "213,800.0000"}
                </div>
              )}
            </div>

            {/* Clauses Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clauses Conditions
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="clausesConditions"
                  value={certificate.clausesConditions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.clausesConditions || "TBA"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </button>
              </>
            ) : (
              <Link
                to="/company-dashboard/certificates"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateDetails;
