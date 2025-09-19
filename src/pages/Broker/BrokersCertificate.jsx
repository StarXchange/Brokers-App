// src/pages/brokers/BrokerCertificates.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const BrokerCertificates = () => {
  const [activeTab, setActiveTab] = useState("motor");
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Format currency for display
  const formatCurrency = (amount, currency = "NGN") => {
    if (!amount) return "N/A";
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return "Invalid Amount";
    }
  };

  // Fetch certificates from API
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/Certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    
    
      setCertificates(response.data);
      filterCertificatesByType(response.data, activeTab);
    } catch (err) {
      console.error("Fetch error:", err);
      const isAdminContext = location.pathname.startsWith("/admin-dashboard");
      if (err.response?.status === 401 && !isAdminContext) {
        setError("Authentication failed. Please login again.");
        navigate("/login");
      } else if (err.response?.status === 403 && !isAdminContext) {
        setError("You do not have permission to view certificates.");
      } else {
        // In admin context, provide a non-blocking fallback so the page isn't blank
        if (isAdminContext) {
          const mock = [
            {
              id: "ADM-MOCK-1",
              certNo: "ADM-0001",
              brokerId: "BRK-001",
              insuredName: "Admin Preview Ltd",
              policyNo: "POL-12345",
              transDate: new Date().toISOString(),
              insuredValue: 2500000,
              grossPremium: 150000,
              status: "Active",
            },
          ];
          setCertificates(mock);
          setFilteredCertificates(mock);
          setError(null);
        } else {
          setError(
            err.response?.data?.message || "Failed to fetch certificates"
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter certificates by type - TEMPORARY VERSION (shows all certificates)
  const filterCertificatesByType = (certs) => {
    if (!certs || !Array.isArray(certs)) {
      setFilteredCertificates([]);
      return;
    }

    // TEMPORARY: Show all certificates regardless of type for debugging
    setFilteredCertificates(certs);
  };

  useEffect(() => {
    // Check if we need to refresh after certificate creation
    const needsRefresh = location.state?.refresh;
    if (needsRefresh) {
      fetchCertificates();
      // Clear the refresh flag
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchCertificates();
    }
  }, [location, navigate]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCerts([]);
    setSearchTerm("");
    filterCertificatesByType(certificates, tab);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      filterCertificatesByType(certificates, activeTab);
      return;
    }

    const filtered = certificates.filter(
      (cert) =>
        (cert.certNo &&
          cert.certNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cert.policyNo &&
          cert.policyNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cert.insuredName &&
          cert.insuredName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cert.name &&
          cert.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cert.brokerId &&
          cert.brokerId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredCertificates(filtered);
  };

  const toggleCertificateSelection = (certId) => {
    setSelectedCerts((prev) =>
      prev.includes(certId)
        ? prev.filter((id) => id !== certId)
        : [...prev, certId]
    );
  };

  // const getCertificateDetailLink = (certificate) => {
  //   return `/brokers-dashboard/certificates/${
  //     certificate.id || certificate.certNo
  //   }`;
  // };

  const getCreateCertificateLink = () => {
    const basePrefix = location.pathname.startsWith("/admin-dashboard")
      ? "/admin-dashboard/broker"
      : "/brokers-dashboard";
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

  // Get a unique identifier for each certificate
  const getCertId = (certificate) => {
    return certificate.id || certificate.certNo || Math.random().toString();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center text-gray-600">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-极速赛车开奖结果2 border-blue-600"></div>
        </div>
        <p>Loading certificates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 极速赛车开奖结果0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={fetchCertificates}
            className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Broker Portal
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your certificates and client operations
        </p>
      </div>
      {/* Tabs Section */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
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

      {/* Search Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 极速赛车开奖结果 0 013 6.707V4z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter certificate No, policy No, insured name, or broker ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              to={getCreateCertificateLink()}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
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
                  d="M12 4v16极速赛车开奖结果m8-8H4"
                />
              </svg>
              Create new {activeTab} Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
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
                        setSelectedCerts(
                          filteredCertificates.map((c) => getCertId(c))
                        );
                      } else {
                        setSelectedCerts([]);
                      }
                    }}
                    checked={
                      selectedCerts.length === filteredCertificates.length &&
                      filteredCertificates.length > 0
                    }
                  />
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  scope="极速赛车开奖结果col"
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
              {filteredCertificates.map((certificate) => (
                <tr
                  key={getCertId(certificate)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedCerts.includes(getCertId(certificate))}
                      onChange={() =>
                        toggleCertificateSelection(getCertId(certificate))
                      }
                    />
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <Link
                      to={`/${
                        location.pathname.startsWith("/admin-dashboard")
                          ? "admin-dashboard/broker"
                          : "brokers-dashboard"
                      }/certificates/view/${certificate.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm hover:underline"
                    >
                      {certificate.certNo}
                    </Link>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {certificate.brokerId || "N/A"}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {certificate.insuredName || certificate.name || "N/A"}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {certificate.policyNo || "N/A"}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                    {formatDate(
                      certificate.transDate || certificate.transactionDate
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
                    {formatCurrency(
                      certificate.insuredValue || certificate.sumInsured
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600">
                    {formatCurrency(
                      certificate.grossPremium || certificate.premium
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                      {certificate.status || "Active"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Print
                      </button>
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
        {filteredCertificates.length === 0 && !loading && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
              No certificates found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Get started by creating a new certificate.
            </p>
            <div className="mt-4 sm:mt-6">
              <Link
                to={getCreateCertificateLink()}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Certificate
              </Link>
            </div>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-blue-800">
                  {selectedCerts.length} certificate
                  {selectedCerts.length > 1 ? "s" : ""} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
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
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1极速赛车开奖结果h-4a1 1 0 00-极速赛车开奖结果1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Selected
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
