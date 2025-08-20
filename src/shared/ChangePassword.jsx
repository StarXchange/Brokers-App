import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ChangePassword = ({ userType = "company", userId = "STACO-MARINE" }) => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordMatch: false,
    passwordStrength: false,
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (name === "newPassword" || name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        passwordMatch: false,
        passwordStrength: false,
      }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: true }));
      setError("New password and confirm password don't match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrors((prev) => ({ ...prev, passwordStrength: true }));
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Backend implementation would go here
      await updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        userType,
        userId,
      });

      // On success, navigate back based on user type
      let redirectPath;
      switch (userType) {
        case "broker":
          redirectPath = "/brokers-dashboard";
          break;
        case "client":
          redirectPath = "/client-dashboard";
          break;
        default: // company
          redirectPath = "/company-dashboard/certificates";
      }
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getDashboardPath = () => {
    switch (userType) {
      case "broker":
        return "/brokers-dashboard";
      case "client":
        return "/client-dashboard";
      default: // company
        return "/company-dashboard/certificates";
    }
  };

  const getUserLabel = () => {
    switch (userType) {
      case "broker":
        return "Broker";
      case "client":
        return "Client";
      default:
        return "My";
    }
  };

  const getIdLabel = () => {
    switch (userType) {
      case "broker":
        return "Broker";
      case "client":
        return "Client";
      default:
        return "Company";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Security Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Change {getUserLabel()} Login Password
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Password Management</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Change Password
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Update your account password for enhanced security
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Current User ID */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Current {getIdLabel()} ID
              </label>
              <div className="text-base sm:text-lg font-semibold text-blue-900 flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0"
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
                <span className="break-all">{userId}</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                This is your current active {userType} account
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start sm:items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-red-800">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="space-y-4 sm:space-y-6">
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
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2a2 2 0 012 2M9 7a2 2 0 012 2v0a2 2 0 01-2 2m0 0a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2z"
                />
              </svg>
              Password Information
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <div className="xl:col-span-2">
                <label
                  htmlFor="oldPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.232 6.232M9.878 9.878a3 3 0 00.007 4.243m4.242-4.242L17.768 17.768M9.878 9.878l4.242 4.242"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:ring-2 transition-colors text-sm sm:text-base ${
                      errors.passwordStrength
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter new password"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.232 6.232M9.878 9.878a3 3 0 00.007 4.243m4.242-4.242L17.768 17.768M9.878 9.878l4.242 4.242"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.passwordStrength && (
                  <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-start sm:items-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 sm:mt-0 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:ring-2 transition-colors text-sm sm:text-base ${
                      errors.passwordMatch
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Confirm new password"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.232 6.232M9.878 9.878a3 3 0 00.007 4.243m4.242-4.242L17.768 17.768M9.878 9.878l4.242 4.242"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.passwordMatch && (
                  <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-start sm:items-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 sm:mt-0 flex-shrink-0"
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

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mr-2"
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
                Password Requirements
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <svg
                    className="w-3 h-3 text-green-500 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3 h-3 text-green-500 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Include uppercase and lowercase letters</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3 h-3 text-green-500 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Include at least one number</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center pt-4 sm:pt-6 mt-6 sm:mt-8 border-t border-gray-200 space-y-3 space-y-reverse sm:space-y-0 gap-3 sm:gap-0">
            <Link
              to={getDashboardPath()}
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
              type="submit"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span className="hidden sm:inline">UPDATING...</span>
                  <span className="sm:hidden">UPDATING</span>
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">UPDATE PASSWORD</span>
                  <span className="sm:hidden">UPDATE</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
