import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
  FaArrowLeft,
  FaLock,
  FaIdCard,
  FaFingerprint,
  FaUser,
  FaKey,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaUserCircle,
  FaMapMarkerAlt,
  FaTag,
  FaCommentAlt,
  FaPercentage,
  FaDollarSign,
  FaCalendarAlt,
  FaBriefcase,
  FaShieldAlt
} from "react-icons/fa";

const AccessDenied = ({ title, message }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />

          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <FaLock className="w-7 h-7 text-red-600" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                  {title || "Access denied"}
                </h2>
                <p className="text-gray-600 mt-3">
                  {message ||
                    "You don't have permission to view this page. Please contact your administrator."}
                </p>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <FaArrowLeft />
                    Go back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const initialState = {
  username: "",
  password: "",
  brokerName: "",
  email: "",
  mobilePhone: "",
  contactPerson: "",
  address: "",
  insCompanyID: "",
  tag: "",
  remarks: "",
  rate: "",
  value: "",
  lStartDate: "",
  lEndDate: "",
  field1: "", // Used for BVN
  field2: "", // Used for NIN
};

const AddSuperAgent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Permission check state
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check permission on mount
  useEffect(() => {
    const checkPermission = () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          let userData = null;

          // Try parsing as plain JSON first
          if (rawUser.trim().startsWith("{")) {
            try {
              userData = JSON.parse(rawUser);
            } catch {
              // Not plain JSON
            }
          }

          // If not plain JSON, try decrypting (AuthContext stores encrypted)
          if (!userData) {
            try {
              const bytes = CryptoJS.AES.decrypt(rawUser, "your-secret-key");
              const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
              if (decryptedString) {
                userData = JSON.parse(decryptedString);
              }
            } catch {
              // Decrypt failed
            }
          }

          // Check permissions array
          if (userData && Array.isArray(userData.permissions)) {
            if (userData.permissions.includes("SuperAgent.Create")) {
              setHasAccess(true);
              setCheckingAccess(false);
              return;
            }
          }
        }

        // Fallback: check userPermissions in localStorage
        const permsStr = localStorage.getItem("userPermissions");
        if (permsStr) {
          try {
            const perms = JSON.parse(permsStr);
            if (Array.isArray(perms) && perms.includes("SuperAgent.Create")) {
              setHasAccess(true);
              setCheckingAccess(false);
              return;
            }
          } catch {
            // ignore
          }
        }

        // Fallback: check permissions in localStorage
        const permsStr2 = localStorage.getItem("permissions");
        if (permsStr2) {
          try {
            const perms = JSON.parse(permsStr2);
            if (Array.isArray(perms) && perms.includes("SuperAgent.Create")) {
              setHasAccess(true);
              setCheckingAccess(false);
              return;
            }
          } catch {
            // ignore
          }
        }

        // No permission found
        setHasAccess(false);
      } catch (e) {
        console.error("Permission check error:", e);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkPermission();
  }, []);

  // Show loading while checking
  if (checkingAccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Access Denied immediately if no permission
  if (!hasAccess) {
    return (
      <AccessDenied
        title="Access Denied"
        message="You don't have permission to create a Super Agent."
      />
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate field1 (BVN) - only numbers, max 11 digits
    if (name === "field1") {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
    }
    // Validate field2 (NIN) - only numbers, max 11 digits
    else if (name === "field2") {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
    }
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validate field1 (BVN) - optional but must be 11 digits if provided
    if (form.field1 && form.field1.length !== 11) {
      setError("BVN must be 11 digits");
      setSubmitting(false);
      return;
    }

    // Validate field2 (NIN) - optional but must be 11 digits if provided
    if (form.field2 && form.field2.length !== 11) {
      setError("NIN must be 11 digits");
      setSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      username: form.username,
      password: form.password,
      email: form.email,
      mobilePhone: form.mobilePhone,
      address: form.address || "",
      contactPerson: form.contactPerson || "",
      submitDate: new Date().toISOString(),
      tag: form.tag || "",
      remarks: form.remarks || "",
      a1: 0,
      a2: 0,
      roleIds: [4],
      brokerName: form.brokerName,
      insCompanyID: form.insCompanyID || "",
      rate: form.rate || "",
      value: form.value || "",
      lStartDate: form.lStartDate
        ? new Date(form.lStartDate).toISOString()
        : null,
      lEndDate: form.lEndDate ? new Date(form.lEndDate).toISOString() : null,
      a3: 0,
      a4: 0,
      a5: 0,
      field1: form.field1 || "", // BVN
      field2: form.field2 || "", // NIN
    };

    try {
      await axios.post(
        "https://gibsbrokersapi.newgibsonline.com/api/Auth/create-broker",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      setSuccess("Super Agent created successfully.");
      window.alert("Super Agent created successfully.");
      setForm(initialState);
      setTimeout(() => navigate("/admin/users/agents-brokers"), 800);
    } catch (err) {
      console.error("Create broker error", err);

      // If 403 Forbidden, show error message (shouldn't happen if local check passed)
      if (err?.response?.status === 403) {
        setError(
          "Access Denied. You don't have permission to create a Super Agent."
        );
        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to create Super Agent";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Admin • Super Agents
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Add Super Agent
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Create a new super agent profile. Required fields are marked with *.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-lg text-gray-600 hover:text-gray-800 font-bold"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
            {success}
          </div>
        )}

       <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Personal Information Section */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
   
        Username *
      </label>
      <div className="relative">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="sam.doe"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
      
        Password *
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-10"
        />
        <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
      
        Super Agent Name *
      </label>
      <div className="relative">
        <input
          name="brokerName"
          value={form.brokerName}
          onChange={handleChange}
          required
          placeholder="Staco Insurance"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
       
        Email *
      </label>
      <div className="relative">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="contact@agency.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
       
        Mobile Phone *
      </label>
      <div className="relative">
        <input
          name="mobilePhone"
          type="number"
          value={form.mobilePhone}
          onChange={handleChange}
          required
          placeholder="08012345678"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
       
        Contact Person
      </label>
      <div className="relative">
        <input
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
      
        Address
      </label>
      <div className="relative">
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="123 Main Street, Lagos"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
        
        Insurance Company ID
      </label>
      <div className="relative">
        <input
          name="insCompanyID"
          value={form.insCompanyID}
          onChange={handleChange}
          placeholder="INS-12345"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    {/* Identity Verification Section */}
    <div className="md:col-span-2  pt-4 mt-2">
      
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
    
        BVN (Bank Verification Number)
      </label>
      <div className="relative">
        <input
          name="field1"
          value={form.field1}
          onChange={handleChange}
          placeholder="Enter 11-digit BVN"
          maxLength="11"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      {form.field1 && form.field1.length !== 11 && (
        <p className="text-xs text-red-500 mt-1">BVN must be exactly 11 digits</p>
      )}
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
    
        NIN (National Identity Number)
      </label>
      <div className="relative">
        <input
          name="field2"
          value={form.field2}
          onChange={handleChange}
          placeholder="Enter 11-digit NIN"
          maxLength="11"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaFingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      {form.field2 && form.field2.length !== 11 && (
        <p className="text-xs text-red-500 mt-1">NIN must be exactly 11 digits</p>
      )}
    </div>
    
    {/* Other Information */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
     
        Tag
      </label>
      <div className="relative">
        <input
          name="tag"
          value={form.tag}
          onChange={handleChange}
          placeholder="Premium, Standard, etc."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1 md:col-span-2">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
     
        Remarks
      </label>
      <div className="relative">
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Additional notes or comments..."
          rows="3"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaCommentAlt className="absolute left-3 top-3 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
    
        Rate
      </label>
      <div className="relative">
        <input
          name="rate"
          value={form.rate}
          type="number"
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaPercentage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
  <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
   
    Value
  </label>
  <div className="relative">
    <input
      name="value"
      value={form.value}
      onChange={handleChange}
      placeholder="Amount in Naira"
      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
    />
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">₦</span>
  </div>
</div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
     
        License Start Date
      </label>
      <div className="relative">
        <input
          type="date"
          name="lStartDate"
          value={form.lStartDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">

        License End Date
      </label>
      <div className="relative">
        <input
          type="date"
          name="lEndDate"
          value={form.lEndDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  </div>

  <div className="flex justify-end gap-3">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
    >
      <FaArrowLeft />
      Cancel
    </button>
    <button
      type="submit"
      disabled={submitting}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
    >
      {submitting ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </>
      ) : (
        <>
          <FaBriefcase />
          Save Super Agent
        </>
      )}
    </button>
  </div>
</form>
      </div>
    </div>
  );
};

export default AddSuperAgent;