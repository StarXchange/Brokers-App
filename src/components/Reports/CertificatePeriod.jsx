import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaDownload,
  FaChartLine,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSync,
  FaUser,
  FaFileInvoiceDollar,
  FaSpinner,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

// Constants
const API_BASE_URL = "https://gibsbrokersapi.newgibsonline.com/api";

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const formatCurrency = (amount, currency = "NGN") => {
  if (amount === null || amount === undefined || isNaN(amount)) return "N/A";

  let validCurrency;

  if (
    !currency ||
    currency === "NULL" ||
    currency === "null" ||
    currency.trim() === ""
  ) {
    validCurrency = "NGN";
  } else if (currency === "¥") {
    validCurrency = "CNY";
  } else if (currency === "JPY" || currency === "JP¥") {
    validCurrency = "JPY";
  } else if (currency === "$" || currency === "DOLLAR") {
    validCurrency = "USD";
  } else {
    validCurrency = currency;
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};

const generateId = () => {
  return `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div className="text-center">
      <p className="text-gray-700 font-semibold">Loading Certificates</p>
      <p className="text-sm text-gray-500">
        Please wait while we fetch the data...
      </p>
    </div>
  </div>
);

// Error Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8">
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
      <svg
        className="w-10 h-10 text-red-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        <FaSync />
        <span>Try Again</span>
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ message = "No certificates found" }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
      <FaFileInvoiceDollar className="w-12 h-12 text-gray-400" />
    </div>
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-600 mb-6">{message}</p>
    </div>
  </div>
);

// Main Component
const CertificatePeriod = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});

  // Date range states
  const [dateRange, setDateRange] = useState({
    period1: new Date().toISOString().split("T")[0], // Today
    period2: new Date().toISOString().split("T")[0], // Today
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "transDate",
    direction: "desc",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch certificates from API
  const fetchCertificates = useCallback(async (dates = dateRange) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Prepare parameters
      const params = {
        period1: dates.period1 + "T00:00:00Z",
        period2: dates.period2 + "T23:59:59Z",
      };

      console.log("Fetching with params:", params);

      // Call the API endpoint
      const response = await axios.get(
        `${API_BASE_URL}/Reports/All-Certificate-Period`,
        {
          headers,
          params,
          timeout: 30000,
        }
      );

      console.log("API Response:", response.data);

      // Handle different response formats
      let certificatesData = [];

      if (Array.isArray(response.data)) {
        certificatesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        certificatesData = response.data.data;
      } else if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        certificatesData = response.data.data;
      } else {
        throw new Error("Invalid response format from server");
      }

      // Transform data
      const transformedCertificates = certificatesData.map((cert, index) => ({
        id: cert.CertNo || cert.CertificateNo || generateId(),
        certNo: cert.CertNo || cert.CertificateNo || `CERT-${index + 1}`,
        policyNo: cert.PolicyNo || cert.PolicyNumber || "N/A",
        insuredName: (cert.InsuredName || "").trim() || "N/A",
        brokerId: cert.BrokerID || cert.Broker || "N/A",
        clientId: cert.ClientID || cert.Client || "N/A",
        insuredValue: cert.InsuredValue || cert.SumInsured || 0,
        premium: cert.GrossPrenium || cert.Premium || 0,
        rate: cert.Rate || 0,
        from: cert.FromDesc || cert.Origin || "N/A",
        to: cert.ToDesc || cert.Destination || "N/A",
        description: cert.PerDesc || cert.Description || "N/A",
        transDate:
          cert.TransDate || cert.TransactionDate || new Date().toISOString(),
        status: cert.Tag || cert.Status || "PENDING",
        formMNo: cert.FormMNo || cert.FormNumber || "N/A",
        remarks: cert.Remarks || "",
        currency:
          (cert.Field101 && cert.Field101 !== "NULL" ? cert.Field101 : "₦") ||
          (cert.Currency && cert.Currency !== "NULL" ? cert.Currency : "₦") ||
          "₦",
      }));

      setCertificates(transformedCertificates);
      toast.success(`Loaded ${transformedCertificates.length} certificates`);
    } catch (error) {
      console.error("Error fetching certificates:", error);

      let errorMessage = "Failed to fetch certificates";

      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check the URL.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Download certificate function
  const downloadCertificate = async (certNo) => {
    try {
      setDownloading((prev) => ({ ...prev, [certNo]: true }));

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        Accept: "application/pdf",
      };

      toast.loading(`Downloading certificate ${certNo}...`);

      const response = await axios.get(
        `${API_BASE_URL}/CertificateDocument/download/${certNo}`,
        {
          headers,
          responseType: "blob", // Important for file download
          timeout: 30000,
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Get filename from headers or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `Certificate_${certNo}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success(`Certificate ${certNo} downloaded successfully!`);
    } catch (error) {
      console.error("Error downloading certificate:", error);

      let errorMessage = "Failed to download certificate";

      if (error.response?.status === 404) {
        errorMessage = `Certificate ${certNo} not found`;
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      }

      toast.error(errorMessage);
    } finally {
      setDownloading((prev) => ({ ...prev, [certNo]: false }));
    }
  };

  // Handle date change and fetch
  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  const handleFetch = () => {
    if (!dateRange.period1 || !dateRange.period2) {
      toast.error("Please select both start and end dates");
      return;
    }

    const startDate = new Date(dateRange.period1);
    const endDate = new Date(dateRange.period2);

    if (startDate > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setCurrentPage(1);
    fetchCertificates(dateRange);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-blue-600" />
    ) : (
      <FaSortDown className="text-blue-600" />
    );
  };

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    let filtered = [...certificates];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          cert.insuredName.toLowerCase().includes(searchLower) ||
          cert.policyNo.toLowerCase().includes(searchLower) ||
          cert.certNo.toLowerCase().includes(searchLower) ||
          (cert.description &&
            cert.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "transDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [certificates, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const paginatedCertificates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCertificates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCertificates, currentPage, itemsPerPage]);

  // Calculate statistics
  const statistics = useMemo(
    () => ({
      totalCertificates: filteredCertificates.length,
      totalInsuredValue: filteredCertificates.reduce(
        (sum, cert) => sum + (cert.insuredValue || 0),
        0
      ),
      totalPremium: filteredCertificates.reduce(
        (sum, cert) => sum + (cert.premium || 0),
        0
      ),
      averageRate:
        filteredCertificates.length > 0
          ? filteredCertificates.reduce(
              (sum, cert) => sum + (cert.rate || 0),
              0
            ) / filteredCertificates.length
          : 0,
      pendingCount: filteredCertificates.filter(
        (cert) => cert.status === "PENDING"
      ).length,
    }),
    [filteredCertificates]
  );

  // Quick date presets
  const setQuickDate = (preset) => {
    const today = new Date();
    const newDates = { ...dateRange };

    switch (preset) {
      case "today":
        newDates.period1 = today.toISOString().split("T")[0];
        newDates.period2 = today.toISOString().split("T")[0];
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        newDates.period1 = yesterday.toISOString().split("T")[0];
        newDates.period2 = yesterday.toISOString().split("T")[0];
        break;
      case "thisMonth":
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        newDates.period1 = firstDay.toISOString().split("T")[0];
        newDates.period2 = lastDay.toISOString().split("T")[0];
        break;
      case "lastMonth":
        const lastMonthFirst = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastMonthLast = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        newDates.period1 = lastMonthFirst.toISOString().split("T")[0];
        newDates.period2 = lastMonthLast.toISOString().split("T")[0];
        break;
      case "thisYear":
        newDates.period1 = `${today.getFullYear()}-01-01`;
        newDates.period2 = `${today.getFullYear()}-12-31`;
        break;
    }

    setDateRange(newDates);
    toast.success(
      `Date range set to ${preset.replace(/([A-Z])/g, " $1").toLowerCase()}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <FaFileInvoiceDollar className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Certificate Period
              </h1>
              <p className="text-gray-600 text-lg">
                Search and download certificates by date range
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => fetchCertificates(dateRange)}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <FaSync />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <FaCalendarAlt className="text-blue-600" />
            <span>Select Date Range</span>
          </h3>
          <div className="text-sm text-gray-500">Format: MM-DD-YYYY</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date (period1)
            </label>
            <input
              type="date"
              value={dateRange.period1}
              onChange={(e) => handleDateChange("period1", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (period2)
            </label>
            <input
              type="date"
              value={dateRange.period2}
              onChange={(e) => handleDateChange("period2", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuickDate("today")}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setQuickDate("yesterday")}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Yesterday
              </button>
              <button
                onClick={() => setQuickDate("thisMonth")}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                This Month
              </button>
              <button
                onClick={() => setQuickDate("lastMonth")}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Last Month
              </button>
            </div>
          </div>
        </div>

        {/* Fetch Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleFetch}
            disabled={loading}
            className="w-full px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <FaSpinner className="animate-spin" />
                <span>Fetching Certificates...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <FaChartLine />
                <span>Fetch Certificates for Selected Date Range</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!loading && !error && certificates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Certificates
              </h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <FaFileInvoiceDollar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
              {statistics.totalCertificates.toLocaleString()}
            </p>
            <div className="mt-2">
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                {statistics.pendingCount} pending
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-green-300 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Insured Value
              </h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                <FaChartLine className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
              {formatCurrency(statistics.totalInsuredValue)}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-purple-300 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Premium
              </h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                <FaChartLine className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
              {formatCurrency(statistics.totalPremium)}
            </p>
            <div className="mt-2">
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                Avg rate: {(statistics.averageRate * 100).toFixed(2)}%
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Card 4 */}
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-yellow-300 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Date Range</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                <FaUser className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 group-hover:text-yellow-700 transition-colors duration-300">
              {formatDate(dateRange.period1)} - {formatDate(dateRange.period2)}
            </p>
            <div className="mt-2">
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                {filteredCertificates.length} results
              </span>
            </div>
            <div className="absolute bottom-0 left-x w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {certificates.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search certificates by policy number, insured name, or certificate number..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Certificates
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredCertificates.length > 0
                  ? `Showing ${paginatedCertificates.length} of ${filteredCertificates.length} certificates`
                  : "No certificates to display"}
              </p>
            </div>

            {filteredCertificates.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && !loading && (
          <ErrorDisplay
            error={error}
            onRetry={() => fetchCertificates(dateRange)}
          />
        )}

        {/* Certificates Table */}
        {!loading && !error && (
          <>
            {filteredCertificates.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort("certNo")}
                            className="flex items-center space-x-2 hover:text-gray-900"
                          >
                            <span>Certificate No</span>
                            {getSortIcon("certNo")}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort("policyNo")}
                            className="flex items-center space-x-2 hover:text-gray-900"
                          >
                            <span>Policy No</span>
                            {getSortIcon("policyNo")}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort("insuredName")}
                            className="flex items-center space-x-2 hover:text-gray-900"
                          >
                            <span>Insured Name</span>
                            {getSortIcon("insuredName")}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort("insuredValue")}
                            className="flex items-center space-x-2 hover:text-gray-900"
                          >
                            <span>Insured Value</span>
                            {getSortIcon("insuredValue")}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort("premium")}
                            className="flex items-center space-x-2 hover:text-gray-900"
                          >
                            <span>Premium</span>
                            {getSortIcon("premium")}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort("transDate")}
                            className="flex items-center space-x-2 hover:text-gray-900"
                          >
                            <span>Date</span>
                            {getSortIcon("transDate")}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedCertificates.map((cert) => (
                        <tr
                          key={cert.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {cert.certNo}
                            </div>
                            <div className="text-xs text-gray-500">
                              Broker: {cert.brokerId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-blue-600">
                              {cert.policyNo}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {cert.insuredName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Client: {cert.clientId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(cert.insuredValue, cert.currency)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Rate: {(cert.rate * 100).toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-green-600">
                              {formatCurrency(cert.premium, cert.currency)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(cert.transDate)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                cert.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : cert.status === "APPROVED"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : cert.status === "ISSUED"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}
                            >
                              {cert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => downloadCertificate(cert.certNo)}
                                disabled={downloading[cert.certNo]}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Download Certificate"
                              >
                                {downloading[cert.certNo] ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaDownload />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block lg:hidden p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {paginatedCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {cert.policyNo}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {cert.certNo}
                            </p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              cert.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {cert.status}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="font-medium text-gray-900">
                            {cert.insuredName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Client: {cert.clientId}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Insured Value
                            </p>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(cert.insuredValue, cert.currency)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Premium</p>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(cert.premium, cert.currency)}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          <p>Date: {formatDate(cert.transDate)}</p>
                          <p>Rate: {(cert.rate * 100).toFixed(2)}%</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <button
                            onClick={() => downloadCertificate(cert.certNo)}
                            disabled={downloading[cert.certNo]}
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                          >
                            {downloading[cert.certNo] ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaDownload />
                            )}
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState message="No certificates found for the selected date range. Try adjusting your search or date range." />
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && filteredCertificates.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Items per page */}
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-600 font-medium">
                  Show:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {certificates.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => {
              // Download all certificates as PDF
              certificates.forEach((cert) => {
                downloadCertificate(cert.certNo);
              });
              toast.success(
                `Started downloading ${certificates.length} certificates`
              );
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
          >
            <FaDownload />
            <span>Download All Certificates</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificatePeriod;
