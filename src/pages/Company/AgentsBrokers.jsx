// src/pages/AgentsBrokers.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AgentsBrokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://gibsbrokersapi.newgibsonline.com/api";

  // Fetch brokers from real API
  const fetchBrokers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token");

      console.log(
        "Attempting to fetch brokers from:",
        `${API_BASE_URL}/Brokers`
      );
      console.log("Using token:", token ? "Token found" : "No token");

      const response = await fetch(`${API_BASE_URL}/Brokers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        // Handle specific error cases
        if (response.status === 403) {
          throw new Error(
            `Access denied to Brokers API. Please check your permissions or contact your administrator.`
          );
        } else if (response.status === 401) {
          throw new Error(
            `Authentication failed. Please try logging in again.`
          );
        } else {
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorText || "Unknown error"
            }`
          );
        }
      }

      const data = await response.json();
      console.log("Raw API data:", data);

      // Handle different response structures
      let brokersData = [];
      if (Array.isArray(data)) {
        brokersData = data;
      } else if (data?.brokers) {
        brokersData = data.brokers;
      } else if (data?.data) {
        brokersData = data.data;
      } else if (data?.result) {
        brokersData = data.result;
      } else {
        console.warn("Unexpected API response structure:", data);
        brokersData = [];
      }

      console.log("Processed brokers data:", brokersData);

      // Transform API data to match expected format
      const transformedData = brokersData.map((broker) => ({
        id: broker.brokerId || broker.id, // Using brokerId as the main ID
        companyCode: broker.insCompanyId || broker.companyCode || "N/A",
        name: broker.brokerName || broker.name,
        mobile: broker.mobilePhone || broker.mobile,
        date: broker.submitDate
          ? new Date(broker.submitDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        contactPerson: broker.contactPerson,
        // Include all original fields for potential future use
        brokerId: broker.brokerId,
        insCompanyId: broker.insCompanyId,
        brokerName: broker.brokerName,
        address: broker.address,
        email: broker.email,
        mobilePhone: broker.mobilePhone,
        password: broker.password,
        submitDate: broker.submitDate,
        rate: broker.rate,
        value: broker.value,
        remarks: broker.remarks,
        tag: broker.tag,
        ...broker,
      }));

      console.log("Transformed brokers data:", transformedData);
      setBrokers(transformedData);
    } catch (error) {
      console.error("Error fetching brokers:", error);
      setError(`Failed to load brokers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  // Delete broker via API
  const handleDelete = async (brokerId) => {
    if (
      !confirm(
        "Are you sure you want to delete this broker? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/Brokers/${brokerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete broker: ${response.status}`);
      }

      // Remove broker from local state
      setBrokers(brokers.filter((broker) => broker.id !== brokerId));
      setSelectedBroker(null);

      // Show success message (you could use a toast notification here)
      alert("Broker deleted successfully!");
    } catch (error) {
      console.error("Error deleting broker:", error);
      setError("Failed to delete broker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading brokers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base">
              <strong>Error:</strong> {error}
            </span>
          </div>
          <button
            onClick={() => fetchBrokers()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Agents & Brokers
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              You Can Edit Or Delete A Broker Here
            </p>
          </div>
          <Link
            to="/company-dashboard/add-broker"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Broker
          </Link>
        </div>
      </div>

      {/* Brokers Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Broker Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage broker accounts and permissions
          </p>
        </div>

        {/* Mobile Card View - Hidden on larger screens */}
        <div className="block lg:hidden">
          {brokers.length > 0 ? (
            brokers.map((broker) => (
              <div
                key={broker.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div
                  className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setSelectedBroker(
                      selectedBroker === broker.id ? null : broker.id
                    )
                  }
                >
                  {/* Header with ID and Company Code */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {broker.id}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                        {broker.companyCode}
                      </span>
                    </div>
                    {selectedBroker === broker.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(broker.id);
                        }}
                        className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
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
                    )}
                  </div>

                  {/* Broker Name */}
                  <div>
                    <span className="text-gray-500 font-medium text-xs">
                      Broker Name:
                    </span>
                    <div className="mt-1">
                      <Link
                        to={`/company-dashboard/agents-brokers/edit/${encodeURIComponent(
                          broker.id
                        )}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {broker.name}
                      </Link>
                    </div>
                  </div>

                  {/* Broker Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-gray-500 font-medium">
                        Mobile Phone:
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {broker.mobile || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Date:</span>
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
                        {broker.date}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 font-medium">
                        Contact Person:
                      </span>
                      <div className="text-gray-900 mt-1">
                        {broker.contactPerson || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-gray-300 mb-4"
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
                <p className="text-sm text-gray-500">No brokers found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add your first broker to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Broker Id
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Broker Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brokers.length > 0 ? (
                brokers.map((broker) => (
                  <tr
                    key={broker.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      setSelectedBroker(
                        selectedBroker === broker.id ? null : broker.id
                      )
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {broker.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                        {broker.companyCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/company-dashboard/agents-brokers/edit/${encodeURIComponent(
                          broker.id
                        )}`}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {broker.name}
                      </Link>
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {broker.mobile || "N/A"}
                      </div>
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
                        {broker.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {broker.contactPerson || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {selectedBroker === broker.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(broker.id);
                          }}
                          className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
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
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-4"
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
                      <p className="text-sm text-gray-500">No brokers found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Add your first broker to get started
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Add Broker Button */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              {brokers.length} broker{brokers.length !== 1 ? "s" : ""} total
            </p>
            <Link
              to="/company-dashboard/add-broker"
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add a new broker
            </Link>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {selectedBroker && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
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
            <span className="text-sm font-medium text-yellow-800">
              Click on a broker row to select it, then use the DELETE action to
              remove the broker
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsBrokers;
