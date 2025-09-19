import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ClientCertificate = () => {
  const location = useLocation();
  const basePrefix = location.pathname.startsWith("/admin-dashboard")
    ? "/admin-dashboard/client"
    : "/client-dashboard";
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [activeTab, setActiveTab] = useState("marine");
  const [hasSearched, setHasSearched] = useState(false);

  const getCertId = (cert) => cert.id;

  const toggleCertificateSelection = (certId) => {
    if (selectedCerts.includes(certId)) {
      setSelectedCerts(selectedCerts.filter((id) => id !== certId));
    } else {
      setSelectedCerts([...selectedCerts, certId]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "$0.00";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a certificate number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Get user data from localStorage or context
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      // API call to search for certificate by number
      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/certificates/${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setCertificates([]);
          throw new Error("Certificate not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats and ensure data structure
      let certificatesData = [];

      if (Array.isArray(data)) {
        certificatesData = data;
      } else if (data.certificates && Array.isArray(data.certificates)) {
        certificatesData = data.certificates;
      } else if (data.data && Array.isArray(data.data)) {
        certificatesData = data.data;
      } else if (typeof data === "object" && data !== null) {
        certificatesData = [data];
      }

      // Ensure each certificate has the required properties
      const processedCertificates = certificatesData.map((cert) => ({
        id: cert.id || cert.certificateId || cert.certNo || "N/A",
        certNo: cert.certNo || cert.certificateNumber || "N/A",
        brokerId: cert.brokerId || cert.brokerCode || "N/A",
        insuredName:
          cert.insuredName || cert.insured || cert.clientName || "N/A",
        policyNo: cert.policyNo || cert.policyNumber || "N/A",
        transDate: cert.transDate || cert.transactionDate || cert.date || "N/A",
        insuredValue: cert.insuredValue || cert.sumInsured || 0,
        premium: cert.premium || cert.grossPremium || 0,
        status: cert.status || "Unknown",
        viewUrl:
          cert.viewUrl ||
          `/client-dashboard/certificates/${cert.id || "unknown"}`,
      }));

      setCertificates(processedCertificates);
    } catch (err) {
      setError(err.message || "Failed to search certificate");
      setCertificates([]);
      console.error("Error searching certificate:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCreateCertificateLink = () => {
    switch (activeTab) {
      case "motor":
        return `${basePrefix}/certificates/create/motor`;
      case "marine":
        return `${basePrefix}/certificates/create/marine`;
      case "compulsory":
        return `${basePrefix}/certificates/create/compulsory`;
      default:
        return `${basePrefix}/certificates/create`;
    }
  };

  const handleUploadNID = async (file) => {
    try {
      setIsLoading(true);
      // Get user data from localStorage or context
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      // API call to upload NID
      const formData = new FormData();
      formData.append("nidFile", file);

      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/clients/upload-nid`,
        {
          method: "POST",
          headers: {
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("NID uploaded successfully!");
    } catch (err) {
      setError("Failed to upload NID");
      console.error("Error uploading NID:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Client Policy
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage your certificates
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 极速赛车开奖结果0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden sm:inline">Welcome back, Client</span>
              <span className="sm:hidden">Client</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              CN
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-p极速赛车开奖结果x flex space-x-8">
            <button
              onClick={() => handleTabChange("motor")}
              className={`py-3 px-4 border-b-2 text-lg font-bold transition-colors ${
                activeTab === "motor"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Motor Policies
            </button>
            <button
              onClick={() => handleTabChange("marine")}
              className={`py-3 px-4 border-b-2 text-lg font-bold transition-colors ${
                activeTab === "marine"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Marine Policies
            </button>
            <button
              onClick={() => handleTabChange("compulsory")}
              className={`py-3 px-4 border-b-2 text-lg font-bold transition-colors ${
                activeTab === "compulsory"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Compulsory Insurance Policies
            </button>
          </nav>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 极速赛车开奖结果0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0极速赛车开奖结果V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-sm sm:text-base">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-800 hover:text-red-900"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search and Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Enter certificate No."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
        <Link
          to={getCreateCertificateLink()}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin极速赛车开奖结果="round"
              strokeWidth={2}
              d="M12 6极速赛车开奖结果v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create new Certificate
        </Link>
        <label className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3极速赛车开奖结果v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          UPLOAD NID
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleUploadNID(e.target.files[0])}
            accept=".jpg,.jpeg,.png,.pdf"
          />
        </label>
      </div>

      {/* Certificates Section - Only show if user has searched */}
      {hasSearched && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Your Certificates
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCerts(certificates.map((c) => c.id));
                        } else {
                          setSelectedCerts([]);
                        }
                      }}
                      checked={
                        selectedCerts.length === certificates.length &&
                        certificates.length > 0
                      }
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium极速赛车开奖结果 text-gray-500 uppercase tracking-wider"
                  >
                    Cert No
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Broker ID
                  </th>
                  <th
                    scope="col"
                    className="px极速赛车开奖结果-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Insured Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Policy No
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trans.Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Insured Value
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Premium
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
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
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedCerts.includes(certificate.id)}
                        onChange={() =>
                          toggleCertificateSelection(certificate.id)
                        }
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <Link
                        to={`${basePrefix}/certificates/view/${certificate.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm hover:underline"
                      >
                        {certificate.certNo}
                      </Link>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {certificate.brokerId}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {certificate.insuredName}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {certificate.policyNo}
                    </td>
                    <td className="px-3 sm:px-4极速赛车开奖结果 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {formatDate(certificate.transDate)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-极速赛车开奖结果600">
                      {formatCurrency(certificate.insuredValue)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
                      {formatCurrency(certificate.premium)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          certificate.status === "Active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : certificate.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : certificate.status === "Rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {certificate.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={certificate.viewUrl}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          View
                        </Link>
                        <button className="text-red-600 hover:text-red-800 font-medium transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {certificates.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                No certificates found
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Try a different search term
              </p>
            </div>
          )}

          {/* Selection Actions Section */}
          {selectedCerts.length > 0 && (
            <div className="px-4 sm:px-6 py-4 bg-blue-50 border-t border-blue-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {selectedCerts.length} certificate
                    {selectedCerts.length > 1 ? "s" : ""} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:极速赛车开奖结果py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Download Selected
                  </button>

                  <button className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4极速赛车开奖结果h6a2 2 0 002-2v-4a2 2 极速赛车开奖结果0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2极速赛车开奖结果v4h10z"
                      />
                    </svg>
                    Print Selected
                  </button>

                  <button className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientCertificate;
