import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DownloadCertificates = ({
  userType = "company",
  userId = "STACO-MARINE",
}) => {
  const location = useLocation();
  const basePrefix = location.pathname.startsWith("/admin-dashboard")
    ? "/admin/company"
    : "/company";
  const [showCalendar1, setShowCalendar1] = useState(false);
  const [showCalendar2, setShowCalendar2] = useState(false);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);

  const calendar1Ref = useRef(null);
  const calendar2Ref = useRef(null);

  // Determine back link based on user type
  const backLink =
    userType === "broker"
      ? "/brokers-dashboard/certificates"
      : `${basePrefix}/certificates`;

  // Handle click outside calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendar1Ref.current &&
        !calendar1Ref.current.contains(event.target)
      ) {
        setShowCalendar1(false);
      }
      if (
        calendar2Ref.current &&
        !calendar2Ref.current.contains(event.target)
      ) {
        setShowCalendar2(false);
      }
    };

    if (showCalendar1 || showCalendar2) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showCalendar1, showCalendar2]);

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-GB") : "";
  };

  const handleDownload = () => {
    if (date1 && date2) {
      console.log("Downloading certificates for:", {
        certificates: [userId],
        fromDate: date1,
        toDate: date2,
      });
      // Backend download logic will go here
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Download Certificates
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Download certificates within a specific date range
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Certificate Export</span>
          </div>
        </div>
      </div>

      {/* Download Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Export Configuration
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Select certificates and date range for download
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Certificates Selection */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2"
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
              CERTIFICATES
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {userId}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Insurance certificates
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex px-2 sm:px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 border border-green-200 rounded-full">
                    Selected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2"
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
              Date Range
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Transaction Date 1 */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  From Date (Transaction Date 1)
                </label>
                <div className="relative">
                  <div
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                    onClick={() => {
                      setShowCalendar1(true);
                      setShowCalendar2(false);
                    }}
                  >
                    {formatDate(date1) || "Select date"}
                  </div>
                  <svg
                    className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 w-4 h-4 text-gray-400 pointer-events-none"
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
                </div>
                {date1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formatDate(date1)}
                  </p>
                )}
                {showCalendar1 && (
                  <div
                    ref={calendar1Ref}
                    className="absolute z-20 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 left-0 right-0 sm:left-auto sm:right-auto sm:w-auto"
                  >
                    <Calendar
                      onChange={(date) => {
                        setDate1(date);
                        setShowCalendar1(false);
                      }}
                      value={date1}
                      className="react-calendar-mobile"
                    />
                  </div>
                )}
              </div>

              {/* Transaction Date 2 */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  To Date (Transaction Date 2)
                </label>
                <div className="relative">
                  <div
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                    onClick={() => {
                      setShowCalendar2(true);
                      setShowCalendar1(false);
                    }}
                  >
                    {formatDate(date2) || "Select date"}
                  </div>
                  <svg
                    className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 w-4 h-4 text-gray-400 pointer-events-none"
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
                </div>
                {date2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formatDate(date2)}
                  </p>
                )}
                {showCalendar2 && (
                  <div
                    ref={calendar2Ref}
                    className="absolute z-20 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 left-0 right-0 sm:left-auto sm:right-auto sm:w-auto"
                  >
                    <Calendar
                      onChange={(date) => {
                        setDate2(date);
                        setShowCalendar2(false);
                      }}
                      value={date2}
                      className="react-calendar-mobile"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Date Range Summary */}
            {date1 && date2 && (
              <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start sm:items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0"
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
                  <span className="text-xs sm:text-sm font-medium text-green-800">
                    Date range selected: {formatDate(date1)} to{" "}
                    {formatDate(date2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Download Options */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2"
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
              Export Format
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      PDF
                    </p>
                    <p className="text-xs text-gray-500">Portable Document</p>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Excel
                    </p>
                    <p className="text-xs text-gray-500">Spreadsheet Format</p>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      CSV
                    </p>
                    <p className="text-xs text-gray-500">Comma Separated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center pt-4 sm:pt-6 border-t border-gray-200 space-y-3 space-y-reverse sm:space-y-0 gap-3 sm:gap-0">
            <Link
              to={backLink}
              className="inline-flex items-center justify-center sm:justify-start px-4 sm:px-6 py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base"
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
            <button
              onClick={handleDownload}
              className={`inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base ${
                date1 && date2
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!date1 || !date2}
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">DOWNLOAD CERTIFICATES</span>
              <span className="sm:hidden">DOWNLOAD</span>
            </button>
          </div>

          {/* Status Message */}
          {(!date1 || !date2) && (
            <div className="mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start sm:items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-yellow-800">
                  Please select both start and end dates to enable download
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for mobile calendar */}
      <style jsx>{`
        @media (max-width: 640px) {
          .react-calendar-mobile {
            width: 100% !important;
            max-width: 100% !important;
          }
          .react-calendar-mobile .react-calendar__navigation {
            flex-wrap: wrap;
          }
          .react-calendar-mobile .react-calendar__tile {
            max-width: 100%;
            padding: 0.5em 0.2em;
            font-size: 0.8em;
          }
        }
      `}</style>
    </div>
  );
};

export default DownloadCertificates;
