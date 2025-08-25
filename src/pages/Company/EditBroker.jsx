// src/pages/EditBroker.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EditBroker = () => {
  const { brokerId } = useParams();
  const navigate = useNavigate();

  // Mock data that matches your screenshot
  const mockBrokers = {
    "BR/20003": {
      id: "BR/20003",
      name: "ENDURANCE OTUMUDIA",
      address: "219, Herbert Macauley way, Yaba, Lagos",
      mobile: "2348073333517",
      contactName: "STACO-MARINE",
      email: "customer_services@stacopic.com",
      status: "ENABLED",
      rate: "0.5",
      transactionLimit: "10.0000",
      password: "endurance@2025S",
    },
    "D1/20003": {
      id: "D1/20003",
      name: "OMOLOLA OLAWORE",
      address: "123, Insurance Road, Lagos",
      mobile: "2348024242567",
      contactName: "STACO, PLC",
      email: "olawore@staco.com",
      status: "ENABLED",
      rate: "0.6",
      transactionLimit: "15.0000",
      password: "olawore@2025S",
    },
    "MODUPE.STACO": {
      id: "MODUPE.STACO",
      name: "MODUPE AJAYI CCS",
      address: "456, Marina Road, Lagos",
      mobile: "2348133472029",
      contactName: "MODUPE",
      email: "modupe@staco.com",
      status: "DISABLED",
      rate: "0.4",
      transactionLimit: "5.0000",
      password: "modupe@2024S",
    },
  };

  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: "",
    contactName: "",
    email: "",
    status: "ENABLED",
    rate: "",
    transactionLimit: "",
    password: "",
  });

  /* 
  BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
  Uncomment and implement when backend is ready

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/brokers/${brokerId}`);
        setBroker(response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address,
          mobile: response.data.mobile,
          contactName: response.data.contactName,
          email: response.data.email,
          status: response.data.status,
          rate: response.data.rate,
          transactionLimit: response.data.transactionLimit,
          password: response.data.password
        });
      } catch (err) {
        console.error('Error fetching broker:', err);
        setError(err.response?.data?.message || 'Failed to fetch broker details');
      } finally {
        setLoading(false);
      }
    };

    fetchBroker();
  }, [brokerId]);
  */

  // Using mock data for now
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundBroker = mockBrokers[brokerId];
      if (foundBroker) {
        setBroker(foundBroker);
        setFormData({
          name: foundBroker.name,
          address: foundBroker.address,
          mobile: foundBroker.mobile,
          contactName: foundBroker.contactName,
          email: foundBroker.email,
          status: foundBroker.status,
          rate: foundBroker.rate,
          transactionLimit: foundBroker.transactionLimit,
          password: foundBroker.password,
        });
      } else {
        setError("Broker not found");
      }
      setLoading(false);
    }, 500); // Simulate network delay
  }, [brokerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* 
    BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
    try {
      setLoading(true);
      await axios.put(`/api/brokers/${brokerId}`, formData);
      navigate('/company-dashboard/agents-brokers');
    } catch (err) {
      console.error('Error updating broker:', err);
      setError(err.response?.data?.message || 'Failed to update broker');
    } finally {
      setLoading(false);
    }
    */

    // Mock submission for now
    setLoading(true);
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setLoading(false);
      navigate("/company-dashboard/agents-brokers");
    }, 1000);
  };

  if (loading && !broker) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <div className="animate-pulse text-gray-600">
          Loading broker details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="break-words">
              <strong>Error:</strong> {error}
            </span>
          </div>
          <button
            onClick={() => navigate("/company-dashboard/agents-brokers")}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Back to Brokers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Edit Broker
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Edit Broker's Details here
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">
              Broker ID: {broker?.id || "Loading..."}
            </span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Broker Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Update broker details and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-6 lg:space-y-8">
            {/* Broker ID Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broker ID
              </label>
              <div className="text-base sm:text-lg font-semibold text-gray-900 break-all">
                {broker?.id || "N/A"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This ID cannot be changed
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2 flex-shrink-0"
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
                Contact Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Broker Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base resize-y"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Broker Settings */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Broker Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Broker Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  >
                    <option value="ENABLED">ENABLED</option>
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="rate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Agreed Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      id="rate"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      placeholder="0.00"
                      required
                    />
                    <span className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-500 text-sm font-medium">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="transactionLimit"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Transaction Limit
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="transactionLimit"
                      name="transactionLimit"
                      value={formData.transactionLimit}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      placeholder="0.0000"
                      required
                    />
                    <span className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-500 text-sm font-medium">
                      ₦
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 mt-6 sm:mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/company-dashboard/agents-brokers")}
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base order-2 sm:order-1"
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
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
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
                  Update Broker
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBroker;
