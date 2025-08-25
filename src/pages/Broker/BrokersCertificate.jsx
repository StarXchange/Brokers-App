// src/pages/brokers/BrokerCertificates.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BrokerCertificates = () => {
  // Mock data matching your screenshot
  const mockCertificates = [
    {
      id: "PRESTIGE/20/8/70002566",
      brokerId: "intteck",
      certNo: "PRESTIGE/2018/70002566",
      policyNo: "SAN/MOC/00471/2018/HQ",
      transDate: "25 Jul 2018",
      rate: "0.8%",
      insuredValue: "₦1,000,000",
      grossPremium: "₦8,000",
      status: "Download",
    },
    {
      id: "ADP/16/6/000077",
      brokerId: "INTTECK",
      certNo: "ADP/16/6/000077",
      policyNo: "POLN/16/6/000077",
      transDate: "19 Jun 2016",
      rate: "0.89%",
      insuredValue: "₦888,888",
      grossPremium: "₦7,911",
      status: "Download",
    },
    {
      id: "CRN/16/6/000061",
      brokerId: "INTTECK",
      certNo: "CRN/16/6/000061",
      policyNo: "POLN/16/6/000061",
      transDate: "08 Jun 2016",
      rate: "0.89%",
      insuredValue: "₦500,000",
      grossPremium: "₦4,450",
      status: "Download",
    },
  ];

  const [certificates, setCertificates] = useState(mockCertificates);
  const [selectedCerts, setSelectedCerts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
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
    const filtered = mockCertificates.filter(
      (cert) =>
        cert.certNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.policyNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCertificates(filtered);
  };

  const toggleCertificateSelection = (certId) => {
    setSelectedCerts((prev) =>
      prev.includes(certId)
        ? prev.filter((id) => id !== certId)
        : [...prev, certId]
    );
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 text-center text-gray-600">
        Loading certificates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Your Marine Certificates
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your certificates and client operations
            </p>
          </div>

          {/* Mobile-first responsive controls */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter certificate No."
                  className="w-full sm:w-auto px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search</span>
              </button>
            </div>

            <Link
              to="/brokers-dashboard/certificates/create"
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="whitespace-nowrap">Create new Certificate</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Certificates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Certificates
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track all your insurance certificates
          </p>
        </div>

        {/* Mobile Card View for small screens */}
        <div className="block lg:hidden">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                    checked={selectedCerts.includes(certificate.id)}
                    onChange={() => toggleCertificateSelection(certificate.id)}
                  />
                  <div>
                    <Link
                      to={`/brokers-dashboard/certificates/${certificate.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline block"
                    >
                      {certificate.certNo}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {certificate.brokerId}
                    </p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                  {certificate.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Policy No</p>
                  <p className="font-medium text-gray-900 truncate">
                    {certificate.policyNo}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Trans. Date</p>
                  <p className="font-medium text-gray-600">
                    {certificate.transDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Rate</p>
                  <p className="font-medium text-gray-900">
                    {certificate.rate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Insured Value</p>
                  <p className="font-semibold text-green-600">
                    {certificate.insuredValue}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Gross Premium</p>
                    <p className="font-semibold text-green-600">
                      {certificate.grossPremium}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm">
                      Print
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm">
                      More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View for large screens */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table
            className="w-full divide-y divide-gray-200"
            style={{ minWidth: "1100px" }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={
                      selectedCerts.length === certificates.length &&
                      certificates.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        certificates.forEach((cert) => {
                          if (!selectedCerts.includes(cert.id)) {
                            toggleCertificateSelection(cert.id);
                          }
                        });
                      } else {
                        selectedCerts.forEach((certId) => {
                          toggleCertificateSelection(certId);
                        });
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  CertNo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Broker Id
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Cert No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Policy No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Trans.Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Insured Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Gross premium
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => (
                <tr
                  key={certificate.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={selectedCerts.includes(certificate.id)}
                      onChange={() =>
                        toggleCertificateSelection(certificate.id)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.brokerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/brokers-dashboard/certificates/${certificate.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                    >
                      {certificate.certNo}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.policyNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
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
                      {certificate.transDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {certificate.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {certificate.insuredValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {certificate.grossPremium}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                      {certificate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Print
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                        More
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selection Actions Section - Mobile Responsive */}
        {selectedCerts.length > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-blue-50 border-t border-blue-200">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  {selectedCerts.length} certificate
                  {selectedCerts.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  DOWNLOAD SELECTED
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
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
                  PRINT SELECTED
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerCertificates;
