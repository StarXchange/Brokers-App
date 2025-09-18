import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown states
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isBrokerDropdownOpen, setIsBrokerDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  // Company certificates state for admin context
  const [certificates, setCertificates] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [isProcessing] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = "https://gibsbrokersapi.newgibsonline.com/api";

  // Client proposals state for admin context
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const handleRowClick = (proposal) => {
    setSelectedProposal(proposal.id);
  };

  const handleAddProposal = () => {
    navigate("/admin-dashboard/client/add-proposal");
  };

  // Auto-expand dropdowns based on current path
  useEffect(() => {
    if (location.pathname.includes("/admin-dashboard/company")) {
      setIsCompanyDropdownOpen(true);
    }
    if (location.pathname.includes("/admin-dashboard/broker")) {
      setIsBrokerDropdownOpen(true);
    }
    if (location.pathname.includes("/admin-dashboard/client")) {
      setIsClientDropdownOpen(true);
    }
  }, [location.pathname]);

  // Seed client proposals for admin context using the exact mock from client page
  useEffect(() => {
    if (location.pathname.startsWith("/admin-dashboard/client")) {
      setProposals([
        {
          id: 1,
          entryDate: "22 Aug 15",
          lastName: "Other Names",
          firstName: "intteck",
          address: "233 ikorodu road",
          mobile: "08023140962",
          regNumber: "LAG 987 67",
          amount: "5000.0000",
        },
        {
          id: 2,
          entryDate: "22 Aug 15",
          lastName: "Other Names",
          firstName: "intteck",
          address: "233 ikorodu road",
          mobile: "08023140962",
          regNumber: "LAG 987 GH",
          amount: "5000.0000",
        },
      ]);
    }
  }, [location.pathname]);

  // Helper function to check if current path is active
  const isActivePath = (path) => {
    return location.pathname.includes(path);
  };

  // Toggle selection (used by Company Certificates page)
  const toggleCertificateSelection = (certId) => {
    setSelectedCerts((prev) =>
      prev.includes(certId)
        ? prev.filter((id) => id !== certId)
        : [...prev, certId]
    );
  };

  // Fetch company certificates for admin context
  const fetchCompanyCertificates = async () => {
    setError(null);
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/Certificates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = (Array.isArray(data) ? data : []).map((cert) => ({
        id: cert.certNo,
        certNo: cert.certNo,
        brokerId: cert.brokerId,
        clientId: cert.clientId,
        insCompanyId: cert.insCompanyId,
        insuredName: cert.insuredName,
        policyNo: cert.policyNo,
        transDate: cert.transDate
          ? new Date(cert.transDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null,
        submitDate: cert.submitDate
          ? new Date(cert.submitDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null,
        rate:
          typeof cert.rate === "number"
            ? `${(cert.rate * 100).toFixed(2)}%`
            : cert.rate,
        insuredValue:
          typeof cert.insuredValue === "number"
            ? `₦${cert.insuredValue.toLocaleString()}`
            : cert.insuredValue,
        grossPremium:
          typeof cert.grossPrenium === "number"
            ? `₦${cert.grossPrenium.toLocaleString()}`
            : cert.grossPrenium,
        status: cert.tag || "PENDING",
        perDesc: cert.perDesc,
        fromDesc: cert.fromDesc,
        toDesc: cert.toDesc,
        interestDesc: cert.interestDesc,
        formMno: cert.formMno,
        remarks: cert.remarks,
        ...cert,
      }));
      setCertificates(transformedData);
    } catch (err) {
      setError(err.message || "Failed to fetch certificates");
      setCertificates([]);
    }
  };

  // Auto-load certificates when navigating to company section under admin
  useEffect(() => {
    if (location.pathname.startsWith("/admin-dashboard/company")) {
      fetchCompanyCertificates();
    }
  }, [location.pathname]);

  // Check if we're at the root admin dashboard path
  const isRootPath =
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/admin-dashboard/";

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

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Admin User</span>
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
              {/* Company Section */}
              <div className="mb-6">
                <button
                  onClick={() =>
                    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Company Management</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCompanyDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isCompanyDropdownOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/admin-dashboard/company/certificates"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("company/certificates")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("company/certificates")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span>Policy</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/company/agents-brokers"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("company/agents-brokers")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("company/agents-brokers")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <span>Agents/Brokers</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/company/download-certificates"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("company/download-certificates")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("company/download-certificates")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <span>Download Certificates</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Broker Section */}
              <div className="mb-6">
                <button
                  onClick={() => setIsBrokerDropdownOpen(!isBrokerDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Broker Management</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isBrokerDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isBrokerDropdownOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/admin-dashboard/broker/certificates"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("broker/certificates")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("broker/certificates")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span>Policy</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/broker/client-management"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("broker/client-management")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("broker/client-management")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <span>Client Management</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/broker/view-documents"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("broker/view-documents")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("broker/view-documents")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span>View Documents</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/broker/download-certificates"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("broker/download-certificates")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("broker/download-certificates")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <span>Download Certificates</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/broker/credit-notes"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("broker/credit-notes")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("broker/credit-notes")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span>Credit Notes</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/broker/view-profile"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("broker/view-profile")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("broker/view-profile")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span>View Profile</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Client Section */}
              <div className="mb-6">
                <button
                  onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Client Management</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isClientDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isClientDropdownOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/admin-dashboard/client/business-proposals"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("client/business-proposals")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("client/business-proposals")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span>Business Proposals</span>
                    </Link>

                    <Link
                      to="/admin-dashboard/client/client-certificate"
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath("client/client-certificate")
                          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActivePath("client/client-certificate")
                            ? "bg-blue-100"
                            : "group-hover:bg-blue-50"
                        }`}
                      >
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span>Certificate</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Shared Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                  Shared Features
                </h3>

                <Link
                  to="/admin-dashboard/change-password"
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath("change-password")
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`p-1 rounded-md ${
                      isActivePath("change-password")
                        ? "bg-blue-100"
                        : "group-hover:bg-blue-50"
                    }`}
                  >
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <span>Change Password</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <Link
                  to="/"
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
              {isRootPath ? (
                // Default dashboard content when at root path
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Welcome to Admin Dashboard
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Select a section from the sidebar to get started with
                      managing your insurance platform.
                    </p>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">
                              Companies
                            </h3>
                            <p className="text-blue-600">
                              Manage insurance companies
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <svg
                              className="w-6 h-6 text-green-600"
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
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-green-900">
                              Brokers
                            </h3>
                            <p className="text-green-600">
                              Manage broker accounts
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <svg
                              className="w-6 h-6 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-purple-900">
                              Clients
                            </h3>
                            <p className="text-purple-600">
                              Manage client services
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                          to="/admin-dashboard/company/certificates"
                          className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="p-2 bg-blue-50 rounded-lg mr-3">
                            <svg
                              className="w-5 h-5 text-blue-600"
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
                            <h4 className="font-medium text-gray-900">
                              Review Policies
                            </h4>
                            <p className="text-sm text-gray-600">
                              View and manage company policies
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/admin-dashboard/broker/client-management"
                          className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="p-2 bg-green-50 rounded-lg mr-3">
                            <svg
                              className="w-5 h-5 text-green-600"
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
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Manage Clients
                            </h4>
                            <p className="text-sm text-gray-600">
                              Handle broker client relationships
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Render child routes with company context for admin
                <Outlet
                  context={{
                    certificates,
                    selectedCerts,
                    toggleCertificateSelection,
                    // Wire company actions to no-ops for now (admin view-only). If needed, we can call company endpoints.
                    handleApprove: () => {},
                    handleReject: () => {},
                    handleDelete: () => {},
                    isProcessing,
                    error,
                    setError,
                    fetchCertificates: fetchCompanyCertificates,
                    // Client context for admin client routes
                    proposals,
                    selectedProposal,
                    showDelete,
                    handleRowClick,
                    handleAddProposal,
                    setProposals,
                    setSelectedProposal,
                    setShowDelete,
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
