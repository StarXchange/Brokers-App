// src/pages/Certificates.jsx
import { useOutletContext, Link, useLocation } from "react-router-dom";

import { useState } from "react";

const Certificates = () => {
  const location = useLocation();
  const basePrefix = location.pathname.startsWith("/admin")
    ? "/admin/company"
    : "/company";
  // Read context from parent dashboard (Company or Admin)
  const outletContext = useOutletContext();
  const {
    certificates = [],
    selectedCerts = [],
    toggleCertificateSelection = () => {},
    handleApprove = () => {},
    handleReject = () => {},
    handleDelete = () => {},
  } = outletContext;

  // Add state for activeTab
  const [activeTab, setActiveTab] = useState("investments");

  // Define handleTabChange
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ minWidth: "100%" }}>
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Company Portal
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your certificates and operations
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto">
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
                d="M3 4a1 1 0 011-1h16a1 0 011 v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
          </button>
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

      {/* Certificates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Your Certificates
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage and track all insurance certificates
          </p>
        </div>

        {/* Mobile Card View - Hidden on larger screens */}
        <div className="block lg:hidden">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <div className="p-4 space-y-3">
                {/* Header with checkbox and cert number */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={selectedCerts.includes(cert.id)}
                      onChange={() => toggleCertificateSelection(cert.id)}
                    />
                    <Link
                      to={`${basePrefix}/certificates/${cert.certNo}`}
                      className="text-blue-600 hover:text-blue-800 font-semib极速赛车开奖结果old text-sm hover:underline"
                    >
                      {cert.certNo}
                    </Link>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      cert.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {cert.status}
                  </span>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">
                      Broker ID:
                    </span>
                    <div className="text-gray-900 mt-1">{cert.brokerId}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      Policy No:
                    </span>
                    <div className="text-gray-900 mt-1">{cert.policyNo}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      Trans. Date:
                    </span>
                    <div className="text-gray-900 mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 text-gray-400 mr-1"
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
                      {cert.transDate}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Rate:</span>
                    <div className="text-gray-900 mt-1 font-medium">
                      {cert.rate}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      Insured Value:
                    </span>
                    <div className="text-green-600 mt-1 font-semibold">
                      {cert.insuredValue}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">
                      Gross Premium:
                    </span>
                    <div className="text-green-600 mt-1 font-semibold">
                      {cert.grossPremium}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    Download
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">
                    More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table
            className="w-full divide-y divide-gray-200"
            style={{ minWidth: "1100px" }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={
                      selectedCerts.length === certificates.length &&
                      certificates.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        certificates.forEach((cert) => {
                          if (!selectedCerts.includes(cert.id)) {
                            toggleCertificateSelection(cert.id);
                          }
                        });
                      } else {
                        selectedCerts.forEach((certId) => {
                          toggleCertificateSelection(certId);
                        });
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Cert No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Broker ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Policy No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Trans. Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Insured Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Gross Premium
                </th>
                <th className="px极速赛车开奖结果-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={selectedCerts.includes(cert.id)}
                      onChange={() => toggleCertificateSelection(cert.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`${basePrefix}/certificates/${cert.certNo}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                    >
                      {cert.certNo}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.brokerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.policyNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-2"
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
                      {cert.transDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cert.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {cert.insuredValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {cert.grossPremium}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        cert.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Download
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                        More
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons Section */}
        {selectedCerts.length > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-blue-50 border-t border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  {selectedCerts.length} certificate
                  {selectedCerts.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                  APPROVED
                </button>
                <button
                  onClick={handleReject}
                  className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                  REJECT
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  DELETE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
