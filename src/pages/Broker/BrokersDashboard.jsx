// src/pages/brokers/BrokersDashboard.jsx

import { Outlet, Link, useLocation } from "react-router-dom";

const BrokersDashboard = () => {
  const location = useLocation();

  // Helper function to check if current path is active
  const isActivePath = (path) => {
    return location.pathname.includes(path);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="text-white px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-50 w-full"
        style={{ backgroundColor: "#3f33ef" }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Globe Icon */}
            <div className="w-8 h-8 bg-white bg-opacity-15 rounded-lg flex items-center justify-center shadow-md backdrop-blur-sm border border-white border-opacity-20">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">
                Global Insurance
              </h1>
              <p className="text-white text-opacity-80 text-md font-normal">
                Broker Portal
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on small screens */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-white text-gray-800 pl-4 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-48 lg:w-64"
              />
              <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
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
            {/* Search Icon for mobile */}
            <button className="md:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10">
              <svg
                className="h-5 w-5"
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
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">B</span>
              </div>
              <span className="text-sm hidden sm:block">Broker</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`w-64 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 h-screen pt-20 z-40 transform transition-transform duration-300 ease-in-out lg:transform-none ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="p-4 pt-8 h-full overflow-y-auto">
            <nav className="space-y-1">
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

              <div className="pt-6 mt-6 border-t border-gray-200">
                <Link
                  to="/brokers"
                  className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                >
                  <div className="p-1 rounded-md group-hover:bg-red-100">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <span>Logout</span>
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-x-auto lg:ml-64">
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Broker Portal
                </h1>
              </div>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrokersDashboard;