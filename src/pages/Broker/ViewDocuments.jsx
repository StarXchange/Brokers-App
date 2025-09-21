// src/pages/ViewDocuments.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Function to refresh token (you'll need to implement this based on your auth system)
  const refreshToken = async () => {
    try {
      // This is a placeholder - implement based on your authentication flow
      const response = await axios.post(
        "https://gibsbrokersapi.newgibsonline.com/api/auth/refresh",
        {},
        { withCredentials: true }
      );
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (err) {
      throw new Error("Failed to refresh token");
    }
  };

  // Fetch documents from API with retry logic
  const fetchDocuments = async (retry = false) => {
    try {
      let token = localStorage.getItem("token") || 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyMTAwNCIsInVuaXF1ZV9uYW1lIjoic3RyaW5nMTExIiwiVXNlclR5cGUiOiJVc2VyIiwiUGVybWlzc2lvbiI6WyJBdXRoLkNoZWNrVXNlcm5hbWUiLCJCcm9rZXIuQ3JlYXRlIiwiQnJva2VyLkRlbGV0ZSIsIkJyb2tlci5MaXN0IiwiQnJva2VyLlJlYWQiLCJCcm9rZXIuVXBkYXRlIiwiQ2VydGlmaWNhdGUuQ3JlYXRlIiwiQ2VydGlmaWNhdGUuRGVsZXRlIiwiQ2VydGlmaWNhdGUuTGlzdCIsIkNlcnRpZmljYXRlLlJlYWQiLCJDZXJ0aWZpY2F0ZS5VcGRhdGUiLCJDbGllbnQuQ3JlYXRlIiwiQ2xpZW50LkRlbGV0ZSIsIkNsaWVudC5MaXN0IiwiQ2xpZW50LlJlYWQiLCJDbGllbnQuVXBkYXRlIiwiQ29tcGFueS5DcmVhdGUiLCJDb21wYW55LkRlbGV0ZSIsIkNvbXBhbnkuTGlzdCIsIkNvbXBhbnkuUmVhZCIsIkNvbXBhbnkuVXBkYXRlIiwiUGVybWlzc2lvbi5DcmVhdGUiLCJQZXJtaXNzaW9uLk1hbmFnZSIsIlBlcm1pc3Npb24uUmVhZCIsIlBlcm1pc3Npb24uVXBkYXRlIiwiUm9sZS5NYW5hZ2UiLCJVc2VyLkNyZWF0ZSIsIlVzZXIuQ3JlYXRlQnJva2VyIiwiVXNlci5DcmVhdGVDb21wYW55IiwiVXNlci5DcmVhdGVDdXN0b21lciIsIlVzZXIuQ3JlYXRlU3lzdGVtVXNlciIsIlVzZXIuRGVsZXRlIiwiVXNlci5MaXN0IiwiVXNlci5SZWFkIiwiVXNlci5VcGRhdGUiXSwicm9sZSI6IkFkbWluIiwibmJmIjoxNzU4MjM2MDg3LCJleHAiOjE3NTgzMjI0ODcsImlhdCI6MTc1ODIzNjA4N30.WYxkqI6KwK-1PvRi_IOdUiEgoRzgOXf4cjp6BfQllDE";
      
      const response = await axios.get(
        "https://gibsbrokersapi.newgibsonline.com/api/AttachDocs",
        {
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 403 && !retry && retryCount < 3) {
        // Try to refresh token and retry
        try {
          await refreshToken();
          setRetryCount(prev => prev + 1);
          await fetchDocuments(true);
        } catch {
          setError("Authentication failed. Please log in again.");
        }
      } else {
        setError(err.response?.data?.message || 
          "Access forbidden. You may not have permission to view these documents.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearch = () => {
    // For demonstration, using mock data when API fails
    const mockDocuments = [
      {
        attachId: 1,
        docDetails: "Marine Insurance Policy",
        docTypes: "PDF",
        docFrom: "Insurance Department",
        entryDate: "2025-09-19T12:22:55.869Z",
        zDocuments: "2.4 MB",
        mailStatus: "Active",
      },
      {
        attachId: 2,
        docDetails: "Certificate of Coverage",
        docTypes: "PDF",
        docFrom: "Underwriting",
        entryDate: "2025-09-18T10:15:30.123Z",
        zDocuments: "1.8 MB",
        mailStatus: "Processed",
      },
      {
        attachId: 3,
        docDetails: "Claims Report",
        docTypes: "DOCX",
        docFrom: "Claims Department",
        entryDate: "2025-09-17T14:45:22.456Z",
        zDocuments: "3.2 MB",
        mailStatus: "Pending",
      },
    ];
    
    const filtered = mockDocuments.filter(
      (doc) =>
        doc.docDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.docTypes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.docFrom?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDocuments(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
      case "Processed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Pending":
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Inactive":
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    fetchDocuments();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 text-center text-gray-600">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Marine Documents
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View and manage your marine insurance documents
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2 flex-shrink-0"
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
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for documents..."
                className="w-full sm:w-64 px-3 sm:px-4 py-2 pl-9 sm:pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-2.5 sm:left-3 top-2.5 h-4 w-4 text-gray-400"
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
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
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
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Document Library
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {error ? "Showing sample documents for demonstration" : "Access and download your marine insurance documents"}
          </p>
        </div>

        {/* Document Grid */}
       <div className="p-4 sm:p-6">
  {/* Always show the grid container */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
    {documents.length > 0 ? (
      // Render actual documents
      documents.map((document) => (
        <div
          key={document.attachId}
          className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 00-.293-.707l-5.414-5.414A1 1 0012.586 3H7a2 2 00-2 2v14a2 2 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                  {document.docTypes || "Document"}
                </span>
              </div>
            </div>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusBadge(
                document.mailStatus
              )}`}
            >
              {document.mailStatus || "Unknown"}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 break-words">
            {document.docDetails || "Untitled Document"}
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <svg
                className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="truncate">{document.docFrom || "Unknown Source"}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 mr-2 flex-shrink-0"
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
              <span>{formatDate(document.entryDate)}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 mr-2 flex-shrink-0"
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
              <span>{document.zDocuments || "Unknown Size"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <div className="flex items-center justify-center">
                <svg
                  className="w-3 sm:w-4 h-3 sm:h-4 mr-1"
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
              </div>
            </button>
            <button className="flex-1 px-3 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              <div className="flex items-center justify-center">
                <svg
                  className="w-3 sm:w-4 h-3 sm:h-4 mr-1"
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
                Download
              </div>
            </button>
          </div>
        </div>
      ))
    ) : (
      // Show empty state within the grid
      <div className="col-span-full">
        <div className="text-center py-8 sm:py-12">
          <div className="flex flex-col items-center">
            <svg
              className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mb-4"
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
            <p className="text-sm text-gray-500">No documents found</p>
            <p className="text-xs text-gray-400 mt-1">
              Your documents will appear here when available
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        {/* Important Link Section */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-gray-600">
              {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
              available
            </p>
            <Link
              to="download-certificates"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Certificates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocuments;