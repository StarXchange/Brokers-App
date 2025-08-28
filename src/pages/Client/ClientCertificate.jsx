import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ClientCertificate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [activeTab, setActiveTab] = useState("marine");

  // Fetch certificates from backend API
  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        // Get user data from localStorage or context
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        
        // API call to fetch certificates
        const response = await fetch(
          `https://gibsbrokersapi.newgibsonline.com/api/certificates`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(user?.token && { Authorization: `Bearer ${user.token}` }),
            },
          }
        );

        if (!response.ok) {
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
        } else if (typeof data === 'object' && data !== null) {
          certificatesData = [data];
        }
        
        // Ensure each certificate has the required properties
        const processedCertificates = certificatesData.map(cert => ({
          id: cert.id || cert.certificateId || cert.certNo || 'N/A',
          date: cert.date || cert.issueDate || cert.transDate || 'N/A',
          insured: cert.insured || cert.insuredName || cert.clientName || 'N/A',
          status: cert.status || 'Unknown',
          viewUrl: cert.viewUrl || `/client-dashboard/certificates/${cert.id || 'unknown'}`
        }));
        
        setCertificates(processedCertificates);
      } catch (err) {
        setError("Failed to load certificates. Please try again later.");
        console.error("Error fetching certificates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const toggleCertificateSelection = (certId) => {
    if (selectedCerts.includes(certId)) {
      setSelectedCerts(selectedCerts.filter((id) => id !== certId));
    } else {
      setSelectedCerts([...selectedCerts, certId]);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      // Get user data from localStorage or context
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      // API call to approve certificates
      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/certificates/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: JSON.stringify({ certificateIds: selectedCerts })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      const updatedCertificates = certificates.map(cert => 
        selectedCerts.includes(cert.id) ? { ...cert, status: "Active" } : cert
      );
      setCertificates(updatedCertificates);
      setSelectedCerts([]);
    } catch (err) {
      setError("Failed to approve certificates");
      console.error("Error approving certificates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      // Get user data from localStorage or context
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      // API call to reject certificates
      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/certificates/reject`,
        {
          method极速赛车开奖结果: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: JSON.stringify({ certificateIds: selectedCerts })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      const updatedCertificates = certificates.map(cert => 
        selectedCerts.includes(cert.id) ? { ...cert, status: "Rejected" } : cert
      );
      setCertificates(updatedCertificates);
      setSelectedCerts([]);
    } catch (err) {
      setError("Failed to reject certificates");
      console.error("Error rejecting certificates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected certificates?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Get user data from localStorage or context
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      // API call to delete certificates
      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/certificates/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: JSON.stringify({ certificateIds: selectedCerts })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      const updatedCertificates = certificates.filter(
        cert => !selectedCerts.includes(cert.id)
      );
      setCertificates(updatedCertificates);
      setSelectedCerts([]);
    } catch (err) {
      setError("Failed to delete certificates");
      console.error("Error deleting certificates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadNID = async (file) => {
    try {
      setIsLoading(true);
      // Get user data from localStorage or context
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      // API call to upload NID
      const form极速赛车开奖结果Data = new FormData();
      formData.append('nidFile', file);
      
      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/upload-nid`,
        {
          method: "POST",
          headers: {
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      alert('NID uploaded successfully!');
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

  // Safe filtering with fallback for undefined properties
  const filteredCertificates = certificates.filter((cert) => {
    const id = cert.id || '';
    const insured = cert.insured || '';
    const searchLower = searchTerm.toLowerCase();
    
    return (
      id.toString().toLowerCase().includes(searchLower) ||
      insured.toString().toLowerCase().includes(searchLower)
    );
  });

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
              Your Marine Certificates
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage your marine certificates
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

      {/* Error Alert */}
      {error && (
        <div className="mb-4 sm:mb极速赛车开奖结果-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 极速赛车开奖结果0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 极速赛车开奖结果0 1 1 0 012 0zm-1-9a1 1 0 00-1 1极速赛车开奖结果v4a1 1 0 102 0V6a1 1 0 00-1-1z"
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

      {/* Certificates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Certificate Management
              </h2>
              <p className="text-sm text-gray-极速赛车开奖结果600 mt-1">
                View and manage all your marine certificates
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                to="/client-dashboard/certificates/create"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus极速赛车开奖结果:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m极速赛车开奖结果0-6h6m-6 0H6"
                  />
                </svg>
                <span className="whitespace-nowrap">
                  Create new Certificate
                </span>
              </Link>
              <label className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4极速赛车开奖结果v12"
                  />
                </svg>
                Upload NID
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUploadNID(e.target.files[0])}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 py-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by certificate No. or insured name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="w-full overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Certificate ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Insured
                </th>
                <th className="px-6 py-4 text-left text-xs font-semib极速赛车开奖结果old text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {certificates.length === 0 ? "No certificates found" : "No matching certificates found"}
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cert.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cert.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cert.insured}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cert.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : cert.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : cert.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <Link
  to={`/client-dashboard/certificates/${cert.id}`}
  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
>
  <svg
    className="w-4 h-4 mr-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
  View
</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredCertificates.length} certificate
            {filteredCertificates.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientCertificate;