// src/pages/AddBroker.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const AddBroker = () => {
  // State for form fields - will be used by backend
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobilePhone: "",
    contactName: "",
    email: "",
    brokerStatus: "ENABLE",
    identityType: "DIRECT",
    excess: "",
    agreedRate: "",
    transactionLimit: "",
    password: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    password: false,
    email: false,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (name === "password" || name === "email") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation - will be enhanced by backend
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, password: true }));
      return;
    }

    if (!formData.email.includes("@")) {
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    // Backend API call will go here
    try {
      /* 
      const response = await fetch('/api/brokers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      // Handle successful registration
      console.log('Broker created successfully');
      */

      console.log("Form data ready for backend:", formData);
    } catch (error) {
      console.error("Registration error:", error);
      // Backend will provide specific error messages
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Broker Registration
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter a new Broker's Details here
            </p>
          </div>
          <Link
            to="/company-dashboard/agents-brokers"
            className="inline-flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors w-full sm:w-auto"
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
            Back to Brokers
          </Link>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Broker Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Complete all required fields to create a new broker account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Contact Information Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2"
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
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broker Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter broker name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base resize-y"
                    placeholder="Enter full address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="e.g., 2348024242567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 transition-colors text-sm sm:text-base ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>

              {/* Broker Details Section */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broker Status
                  </label>
                  <select
                    name="brokerStatus"
                    value={formData.brokerStatus}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  >
                    <option value="ENABLE">ENABLED</option>
                    <option value="DISABLE">DISABLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identity Type
                  </label>
                  <select
                    name="identityType"
                    value={formData.identityType}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  >
                    <option value="DIRECT">DIRECT</option>
                    <option value="INDIRECT">INDIRECT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excess
                  </label>
                  <input
                    type="text"
                    name="excess"
                    value={formData.excess}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter excess amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agreed Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="agreedRate"
                      value={formData.agreedRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-500 text-sm font-medium">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Limit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="transactionLimit"
                      value={formData.transactionLimit}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-500 text-sm font-medium">
                      ₦
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Security Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter secure password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 transition-colors text-sm sm:text-base ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Confirm password"
                  required
                />
                {errors.password && (
                  <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
            <Link
              to="/company-dashboard/agents-brokers"
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
              Go back
            </Link>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base order-1 sm:order-2"
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
              Create Broker Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBroker;
