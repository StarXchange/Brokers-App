import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  FaCalendarAlt,
  FaDownload,
  FaFileExcel,
  FaSpinner,
  FaTable,
  FaFilter,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const API_BASE_URL = "https://gibsbrokersapi.newgibsonline.com/api";

const CertificatePeriodReport = () => {
  const [dateRange, setDateRange] = useState({
    period1: new Date().toISOString().split("T")[0],
    period2: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [dataCount, setDataCount] = useState(0);

  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

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
      default:
        break;
    }

    setDateRange(newDates);
    toast.success(`Date range set to ${preset}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const generateExcelReport = async () => {
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

    try {
      setLoading(true);
      toast.loading("Fetching certificate data...");

      const token = localStorage.getItem("token");
      const headers = {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Prepare parameters with time component
      const params = {
        period1: dateRange.period1 + "T00:00:00",
        period2: dateRange.period2 + "T23:59:59",
      };

      console.log("Fetching data with params:", params);

      // Fetch the JSON data
      const response = await axios.get(
        `${API_BASE_URL}/Reports/All-Certificate-Period`,
        {
          headers,
          params,
          timeout: 60000,
        }
      );

      // Extract data from response
      let certificatesData = [];
      
      if (Array.isArray(response.data)) {
        certificatesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        certificatesData = response.data.data;
      } else if (response.data?.data) {
        certificatesData = response.data.data;
      } else {
        throw new Error("Invalid response format from server");
      }

      if (certificatesData.length === 0) {
        toast.error("No certificates found for the selected date range");
        setLoading(false);
        return;
      }

      setDataCount(certificatesData.length);
      toast.dismiss();
      toast.success(`Found ${certificatesData.length} certificates. Generating Excel file...`);

      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Prepare data for main sheet (structured like NSIA report)
      const mainSheetData = [];
      
      // Report Header
      mainSheetData.push(["CERTIFICATE PERIOD REPORT"]);
      mainSheetData.push([]);
      mainSheetData.push([
        "Report Period:",
        `${formatDate(dateRange.period1)} to ${formatDate(dateRange.period2)}`
      ]);
      mainSheetData.push([
        "Generated On:",
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      ]);
      mainSheetData.push([]);
      mainSheetData.push([]);

      // Table Headers (matching NSIA format)
      const  tableHeaders= [
        "Date",
        "Full Name",
        "Policy No",
        "Certificate No",
        "Insured Value",
        "Premium",
        "Rate %",
        "From",
        "To",
        "Description",
        "Status",
        "Broker ID",
        "Transaction Date",
        "Form M No",
        "Remarks",
        "Phone",
        "Email"
      ];
      mainSheetData.push( tableHeaders);

      // Data rows
      certificatesData.forEach((cert, index) => {
        mainSheetData.push([
          formatDate(cert.TransDate),  // Date
          cert.InsuredName || "",       // Full Name
          cert.PolicyNo || "",          // Policy No
          cert.CertNo || "",            // Certificate No
          cert.InsuredValue || 0,       // Insured Value
          cert.GrossPrenium || 0,       // Premium
          cert.Rate ? `${(cert.Rate * 100).toFixed(2)}%` : "0.00%", // Rate %
          cert.FromDesc || "",          // From
          cert.ToDesc || "",            // To
          cert.PerDesc || "",           // Description
          cert.Tag || "PENDING",        // Status
          cert.BrokerID || "",          // Broker ID
          formatDate(cert.TransDate),   // Transaction Date
          cert.FormMNo || "",           // Form M No
          cert.Remarks || "",           // Remarks
          cert.Field104 || "",          // Phone
          cert.Field105 || ""           // Email
        ]);
      });

      // Add summary section
      mainSheetData.push([]);
      mainSheetData.push([]);
      mainSheetData.push(["SUMMARY"]);
      mainSheetData.push([]);
      
      // Calculate totals
      const totalInsuredValue = certificatesData.reduce(
        (sum, cert) => sum + (cert.InsuredValue || 0), 0
      );
      const totalPremium = certificatesData.reduce(
        (sum, cert) => sum + (cert.GrossPrenium || 0), 0
      );
      
      mainSheetData.push(["Total Certificates:", certificatesData.length]);
      mainSheetData.push(["Total Insured Value:", totalInsuredValue]);
      mainSheetData.push(["Total Premium:", totalPremium]);
      mainSheetData.push(["Average Rate:", 
        `${(certificatesData.reduce((sum, cert) => sum + (cert.Rate || 0), 0) / certificatesData.length * 100).toFixed(2)}%`
      ]);

      // Create main worksheet
      const ws = XLSX.utils.aoa_to_sheet(mainSheetData);

      // Set column widths
      const colWidths = [
        { wch: 12 },  // Date
        { wch: 35 },  // Full Name
        { wch: 20 },  // Policy No
        { wch: 20 },  // Certificate No
        { wch: 15 },  // Insured Value
        { wch: 15 },  // Premium
        { wch: 10 },  // Rate %
        { wch: 15 },  // From
        { wch: 15 },  // To
        { wch: 40 },  // Description
        { wch: 12 },  // Status
        { wch: 15 },  // Broker ID
        { wch: 15 },  // Transaction Date
        { wch: 20 },  // Form M No
        { wch: 30 },  // Remarks
        { wch: 15 },  // Phone
        { wch: 30 },  // Email
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Certificate Report");

      // Create a detailed sheet with all fields
      const detailedSheetData = [];
      detailedSheetData.push(["DETAILED CERTIFICATE DATA"]);
      detailedSheetData.push([]);
      
      // Detailed headers
      const detailedHeaders = [
        "Certificate No",
        "Policy No",
        "Insured Name",
        "Broker ID",
        "Insurance Company",
        "Transaction Date",
        "From",
        "To",
        "Description",
        "Interest",
        "Insured Value",
        "Premium",
        "Rate",
        "Form M No",
        "Status",
        "Remarks",
        "Currency",
        "Phone",
        "Email",
        "Vehicle Type",
        "Vehicle Make",
        "Vehicle Model",
        "Address",
        "Additional Info",
        "Clause Type"
      ];
      detailedSheetData.push(detailedHeaders);

      // Detailed data
      certificatesData.forEach((cert) => {
        detailedSheetData.push([
          cert.CertNo || "",
          cert.PolicyNo || "",
          cert.InsuredName || "",
          cert.BrokerID || "",
          cert.InsCompanyID || "",
          formatDate(cert.TransDate),
          cert.FromDesc || "",
          cert.ToDesc || "",
          cert.PerDesc || "",
          cert.InterestDesc || "",
          cert.InsuredValue || 0,
          cert.GrossPrenium || 0,
          cert.Rate || 0,
          cert.FormMNo || "",
          cert.Tag || "",
          cert.Remarks || "",
          cert.Field101 || cert.Field102 || "NGN",
          cert.Field104 || "",
          cert.Field105 || "",
          cert.Field5 || "",
          cert.Field2 || "",
          cert.Field3 || "",
          cert.Field1 || "",
          cert.Field4 || "",
          cert.Field106 || ""
        ]);
      });

      const ws2 = XLSX.utils.aoa_to_sheet(detailedSheetData);
      XLSX.utils.book_append_sheet(wb, ws2, "Detailed Data");

      // Generate filename
      const filename = `Certificate_Report_${dateRange.period1}_to_${dateRange.period2}.xlsx`;

      // Write and download the file
      XLSX.writeFile(wb, filename);

      toast.success(`Excel report "${filename}" downloaded successfully!`);

    } catch (error) {
      console.error("Error generating report:", error);
      toast.dismiss();

      let errorMessage = "Failed to generate report";

      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
              <FaFileExcel className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Certificate Report
              </h1>
              <p className="text-gray-600 text-lg">
                Generate reports for certificates by date range
              </p>
            </div>
          </div>
          
          {dataCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <FaTable className="text-green-600" />
                <span className="text-green-800 font-medium">
                  Last report: {dataCount} certificates
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FaFilter className="text-blue-600" />
              <span>Select Report Date Range</span>
            </h3>
            <div className="text-sm text-gray-500">
              Format: MM-DD-YYYY
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
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
                End Date
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

          {/* Generate Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={generateExcelReport}
              disabled={loading}
              className="w-full px-5 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xl" />
                  <span className="text-lg">Generating Report...</span>
                </>
              ) : (
                <>
                  <FaDownload className="text-xl" />
                  <span className="text-lg">Generate Excel Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePeriodReport;