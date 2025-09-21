// src/pages/Broker/ViewProfile.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ViewProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Debug: Log the user object to see its structure
  useEffect(() => {
    console.log("User object from auth context:", user);
  }, [user]);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get user ID from auth context - check multiple possible properties
        const userId = user?.userid || user?.id || user?.userId || user?.UserID || 
                      user?.nameid || user?.sub || user?.unique_name;

        console.log("Extracted user ID:", userId);

        if (!userId) {
          console.error("Available user properties:", Object.keys(user || {}));
          throw new Error("User ID not found in authentication context");
        }

        const response = await fetch(
          `https://gibsbrokersapi.newgibsonline.com/api/Users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add authorization header if needed
              ...(user?.token && { Authorization: `Bearer ${user.token}` }),
            },
          }
        );

        if (!response.ok) {
          // If 404, try a different endpoint or approach
          if (response.status === 404) {
            console.warn("User not found at endpoint, trying alternative approach");
            // You might need to use a different endpoint or method to get user data
            // For now, we'll create a mock profile based on auth context
            const mockProfile = createMockProfileFromAuth(user);
            setProfile(mockProfile);
            setFormData(mockProfile);
            setIsLoading(false);
            return;
          }
          
          throw new Error(
            `Failed to fetch profile: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("API response data:", data);

        // Map API response to component state
        const mappedProfile = {
          userid: data.userid || userId,
          brokerId: data.idNumber || data.userid || userId,
          brokerName: data.username || user?.username || user?.unique_name || "Unknown",
          address: data.address || "",
          mobilePhone: data.phone || "",
          contactName: data.insuredName || "",
          email: data.email || user?.email || "",
          password: data.password || "",
          title: data.title || "",
          location: data.location || "",
          identification: data.identification || "",
          occupation: data.occupation || "",
          field01: data.field01 || "",
          field02: data.field02 || "",
          field03: data.field03 || "",
          field04: data.field04 || "",
          field05: data.field05 || "",
        };

        setProfile(mappedProfile);
        setFormData(mappedProfile);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        
        // If we have user data from auth, create a basic profile
        if (user) {
          const fallbackProfile = createMockProfileFromAuth(user);
          setProfile(fallbackProfile);
          setFormData(fallbackProfile);
          setError("Using fallback profile data: " + (err.message || "API unavailable"));
        } else {
          setError(err.message || "Failed to load profile");
        }
        
        setIsLoading(false);
      }
    };

    // Helper function to create profile from auth data
    const createMockProfileFromAuth = (authUser) => {
      return {
        userid: authUser.userid || authUser.id || authUser.nameid || authUser.sub || "unknown",
        brokerId: authUser.idNumber || authUser.userid || authUser.nameid || "unknown",
        brokerName: authUser.username || authUser.unique_name || authUser.name || "Unknown User",
        address: "",
        mobilePhone: "",
        contactName: authUser.insuredName || "",
        email: authUser.email || "",
        password: "",
        title: authUser.title || "",
        location: authUser.location || "",
        identification: authUser.identification || "",
        occupation: authUser.occupation || "",
        field01: authUser.field01 || "",
        field02: authUser.field02 || "",
        field03: authUser.field03 || "",
        field04: authUser.field04 || "",
        field05: authUser.field05 || "",
      };
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      // Get user ID using the same method as in fetch
      const userId = user?.userid || user?.id || user?.userId || user?.UserID || 
                    user?.nameid || user?.sub || user?.unique_name;

      if (!userId) {
        throw new Error("User ID not found");
      }

      // Map form data back to API schema
      const apiData = {
        userid: formData.userid,
        username: formData.brokerName,
        password: formData.password,
        title: formData.title || "",
        insuredName: formData.contactName,
        location: formData.location || "",
        idNumber: formData.brokerId,
        identification: formData.identification || "",
        email: formData.email,
        phone: formData.mobilePhone,
        occupation: formData.occupation || "",
        address: formData.address,
        field01: formData.field01 || "",
        field02: formData.field02 || "",
        field03: formData.field03 || "",
        field04: formData.field04 || "",
        field05: formData.field05 || "",
      };

      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/Users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update profile: ${response.status} ${response.statusText}`
        );
      }

      // If the response has content, parse it
      let updatedData = apiData;
      if (response.headers.get("content-type")?.includes("application/json")) {
        const responseData = await response.json();
        updatedData = responseData;
      }

      // Map the response back to component format
      const mappedUpdatedProfile = {
        userid: updatedData.userid || userId,
        brokerId: updatedData.idNumber || updatedData.userid || userId,
        brokerName: updatedData.username || formData.brokerName,
        address: updatedData.address || formData.address,
        mobilePhone: updatedData.phone || formData.mobilePhone,
        contactName: updatedData.insuredName || formData.contactName,
        email: updatedData.email || formData.email,
        password: updatedData.password || formData.password,
        title: updatedData.title || formData.title,
        location: updatedData.location || formData.location,
        identification: updatedData.identification || formData.identification,
        occupation: updatedData.occupation || formData.occupation,
        field01: updatedData.field01 || formData.field01,
        field02: updatedData.field02 || formData.field02,
        field03: updatedData.field03 || formData.field03,
        field04: updatedData.field04 || formData.field04,
        field05: updatedData.field05 || formData.field05,
      };

      // Update local state with new data
      setProfile(mappedUpdatedProfile);
      setFormData(mappedUpdatedProfile);
      setIsEditing(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same...
  // [Keep all the JSX rendering code unchanged]

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <span className="text-sm sm:text-base">
                <strong>Error:</strong> {error}
              </span>
              <button
                onClick={() => window.location.reload()}
                className="block mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <div className="text-gray-600">No profile data found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View and manage your profile information
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link
              to="/brokers-dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors border border-gray-300 rounded-lg sm:border-0"
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
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-start sm:items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                My Profile Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {isEditing
                  ? "Edit your personal and contact information"
                  : "View your profile information"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broker ID
                  </label>
                  <input
                    type="text"
                    name="brokerId"
                    value={formData.brokerId || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Broker ID cannot be changed
                  </p>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broker Name
                  </label>
                  <input
                    type="text"
                    name="brokerName"
                    value={formData.brokerName || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                    </div>
                    <input
                      type="tel"
                      name="mobilePhone"
                      value={formData.mobilePhone || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-300 rounded-lg sm:border-0 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
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
                      <span className="hidden sm:inline">Updating...</span>
                      <span className="sm:hidden">Updating...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">UPDATE PROFILE</span>
                      <span className="sm:hidden">UPDATE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Broker ID
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                    {profile.brokerId}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Broker Name
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 break-words">
                    {profile.brokerName}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 break-words">
                    {profile.address}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Mobile Phone
                  </label>
                  <div className="flex items-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2 flex-shrink-0"
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
                    <p className="text-sm sm:text-base text-gray-900 break-all">
                      {profile.mobilePhone}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Contact Name
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 break-words">
                    {profile.contactName}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    <p className="text-sm sm:text-base text-gray-900 break-all">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-500">
                    Password
                  </label>
                  <p className="text-sm sm:text-base text-gray-900">••••••••</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
