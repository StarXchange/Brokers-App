// src/pages/brokers/BrokersDashboard.jsx
import { Outlet, Link, useLocation } from "react-router-dom";

const BrokersDashboard = () => {
  const location = useLocation();

  // Helper function to check if current path is active
  const isActivePath = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/brokers-dashboard/certificates"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("certificates")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                <span>Policy</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers-dashboard/credit-notes"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("credit-notes")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 14l6-6m-5.5 3.5l2.5 2.5l6-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Credit Note</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers-dashboard/client-management"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("client-management")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Client</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers-dashboard/download-certificates"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("download-certificates")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                <span>Download Certificates</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers-dashboard/view-documents"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("view-documents")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                <span>View Documents</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers-dashboard/view-profile"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("view-profile")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                <span>View Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers-dashboard/change-password"
                className={`flex items-center font-semibold text-lg p-2 rounded transition-colors ${
                  isActivePath("change-password")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>Change Password</span>
              </Link>
            </li>
            <li>
              <Link
                to="/brokers"
                className="flex items-center font-semibold text-lg p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Marine Certificates</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BrokersDashboard;