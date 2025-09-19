import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const CertificateDetails = () => {
  const { certNo } = useParams();
  const location = useLocation();
  const basePrefix = location.pathname.startsWith("/admin-dashboard")
    ? "/admin-dashboard/company"
    : "/company-dashboard";
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const API_BASE_URL = "https://gibsbrokersapi.newgibsonline.com/api";

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("token");

        console.log("Fetching certificate:", certNo);
        console.log("Token available:", token ? "Yes" : "No");

        const response = await fetch(`${API_BASE_URL}/Certificates/${certNo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Certificate not found");
          }
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Certificate data received:", data);

        setCertificate(data);
        // Initialize form data for editing
        setFormData(data);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err.message || "Failed to fetch certificate");
      } finally {
        setLoading(false);
      }
    };

    if (certNo) {
      fetchCertificate();
    }
  }, [certNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token");

      // PUT request to update certificate
      const response = await fetch(`${API_BASE_URL}/Certificates/${certNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update certificate: ${response.status} - ${errorText}`
        );
      }

      const updatedData = await response.json();
      setCertificate(updatedData);
      setIsEditing(false);
      alert("Certificate updated successfully!");
    } catch (err) {
      console.error("Error updating certificate:", err);
      setError(err.message || "Failed to update certificate");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₦0.0000";
    return `₦${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount)}`;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading certificate details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate(`${basePrefix}/certificates`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Back to Certificates
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center">
          <div className="mb-4 text-gray-600">Certificate not found</div>
          <button
            onClick={() => navigate(`${basePrefix}/certificates`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Certificate Details
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage certificate information
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="break-all">
              Certificate No: {certificate.certNo}
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Certificate Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {isEditing
                  ? "Edit certificate details"
                  : "View certificate details"}
              </p>
            </div>
            {!isEditing && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
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
                  <span className="hidden xs:inline">Print Certificate</span>
                  <span className="xs:hidden">Print</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Certificate No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate No
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="certNo"
                  value={formData.certNo || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium break-all">
                  {certificate.certNo}
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
                  value={formData.insuredName || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium break-all">
                  {certificate.insuredName}
                </div>
              )}
            </div>

            {/* Broker ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broker ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="brokerId"
                  value={formData.brokerId || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.brokerId || "N/A"}
                </div>
              )}
            </div>

            {/* Client ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.clientId || "N/A"}
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
                  type="datetime-local"
                  name="transDate"
                  value={
                    formData.transDate ? formData.transDate.slice(0, 16) : ""
                  }
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
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
                  {formatDate(certificate.transDate)}
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
                  value={formData.policyNo || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium break-all">
                  {certificate.policyNo || "N/A"}
                </div>
              )}
            </div>

            {/* Per Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Description
              </label>
              {isEditing ? (
                <textarea
                  name="perDesc"
                  value={formData.perDesc || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 whitespace-pre-line">
                  {certificate.perDesc || "N/A"}
                </div>
              )}
            </div>

            {/* From Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fromDesc"
                  value={formData.fromDesc || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.fromDesc || "N/A"}
                </div>
              )}
            </div>

            {/* To Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="toDesc"
                  value={formData.toDesc || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.toDesc || "N/A"}
                </div>
              )}
            </div>

            {/* Interest Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Description
              </label>
              {isEditing ? (
                <textarea
                  name="interestDesc"
                  value={formData.interestDesc || ""}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 whitespace-pre-line">
                  {certificate.interestDesc || "N/A"}
                </div>
              )}
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate || ""}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    step="0.01"
                    min="0"
                    max="1"
                  />
                  <span className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {certificate.rate
                    ? `${(certificate.rate * 100).toFixed(2)}%`
                    : "0.00%"}
                </div>
              )}
            </div>

            {/* Insured Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insured Value
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="insuredValue"
                  value={formData.insuredValue || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  step="0.01"
                  min="0"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg font-semibold text-green-600 break-all">
                  {formatCurrency(certificate.insuredValue)}
                </div>
              )}
            </div>

            {/* Gross Premium */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gross Premium
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="grossPrenium"
                  value={formData.grossPrenium || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  step="0.01"
                  min="0"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg font-semibold text-green-600 break-all">
                  {formatCurrency(certificate.grossPrenium)}
                </div>
              )}
            </div>

            {/* Form Mno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Mno
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="formMno"
                  value={formData.formMno || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.formMno || "N/A"}
                </div>
              )}
            </div>

            {/* Status/Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              {isEditing ? (
                <select
                  name="tag"
                  value={formData.tag || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      certificate.tag === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : certificate.tag === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {certificate.tag || "PENDING"}
                  </span>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              {isEditing ? (
                <textarea
                  name="remarks"
                  value={formData.remarks || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 whitespace-pre-line">
                  {certificate.remarks || "N/A"}
                </div>
              )}
            </div>

            {/* Submit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submit Date
              </label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  name="submitDate"
                  value={
                    formData.submitDate ? formData.submitDate.slice(0, 16) : ""
                  }
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
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
                  {formatDate(certificate.submitDate)}
                </div>
              )}
            </div>

            {/* Insurance Company ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Company ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="insCompanyId"
                  value={formData.insCompanyId || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {certificate.insCompanyId || "N/A"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 mt-6 sm:mt-8 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(certificate); // Reset form data
                    setError(null); // Clear any errors
                  }}
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors order-2 sm:order-1"
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
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors order-1 sm:order-2"
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
                to={`${basePrefix}/certificates`}
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
