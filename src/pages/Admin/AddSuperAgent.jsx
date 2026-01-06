import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";

import { FaArrowLeft, FaLock } from "react-icons/fa";

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
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

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
      field1: "",
      field2: "",
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
              Create a new super agent profile. Required fields are marked with
              *.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Back
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Username *
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Super Agent Name *
              </label>
              <input
                name="brokerName"
                value={form.brokerName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Mobile Phone *
              </label>
              <input
                name="mobilePhone"
                value={form.mobilePhone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Contact Person
              </label>
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Insurance Company ID
              </label>
              <input
                name="insCompanyID"
                value={form.insCompanyID}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Tag</label>
              <input
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                Remarks
              </label>
              <input
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Rate</label>
              <input
                name="rate"
                value={form.rate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">Value</label>
              <input
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                License Start Date
              </label>
              <input
                type="date"
                name="lStartDate"
                value={form.lStartDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">
                License End Date
              </label>
              <input
                type="date"
                name="lEndDate"
                value={form.lEndDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Super Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSuperAgent;
