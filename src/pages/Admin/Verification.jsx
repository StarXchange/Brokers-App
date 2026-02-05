import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
} from "react-icons/fi";
import CryptoJS from "crypto-js";
import { getApiBaseUrl } from "../../utils/config";

// AccessDenied Component
const AccessDenied = ({ message }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />

          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <FiLock className="w-7 h-7 text-red-600" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                  Access Denied
                </h2>
                <p className="text-gray-600 mt-3">
                  {message || "You don't have permission to view this page."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Verification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Permission states
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentUserPermissions, setCurrentUserPermissions] = useState([]);

  // Helper to read permissions from storage
  const readPermissionsFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        if (userStr.trim().startsWith("{")) {
          try {
            const userData = JSON.parse(userStr);
            const perms = userData?.permissions || [];
            if (Array.isArray(perms)) return perms;
          } catch {}
        }

        try {
          const bytes = CryptoJS.AES.decrypt(userStr, "your-secret-key");
          const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
          if (decryptedStr) {
            const userData = JSON.parse(decryptedStr);
            const perms = userData?.permissions || [];
            if (Array.isArray(perms)) return perms;
          }
        } catch {}
      }

      const permsStr = localStorage.getItem("userPermissions");
      if (permsStr) {
        try {
          const perms = JSON.parse(permsStr);
          if (Array.isArray(perms)) return perms;
        } catch {}
      }

      const permsStr2 = localStorage.getItem("permissions");
      if (permsStr2) {
        try {
          const perms = JSON.parse(permsStr2);
          if (Array.isArray(perms)) return perms;
        } catch {}
      }

      return [];
    } catch (e) {
      console.error("Error reading permissions:", e);
      return [];
    }
  };

  // Check permissions on mount
  useEffect(() => {
    const perms = readPermissionsFromStorage();
    setCurrentUserPermissions(perms);
    setCheckingAccess(false);
  }, []);

  const hasPermission = (permissionName) => {
    return currentUserPermissions.includes(permissionName);
  };

  const canApproveUsers = hasPermission("User.Approve");

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${getApiBaseUrl()}/Auth/approvals/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 403) {
          setError(
            "Access denied. You don't have permission to view pending approvals.",
          );
          return;
        }
        throw new Error("Failed to fetch pending users");
      }

      const result = await response.json();

      if (result.success) {
        setPendingUsers(result.data || []);
      } else {
        setError("Failed to load pending users");
      }
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError(err.message || "Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAccess && canApproveUsers) {
      fetchPendingUsers();
    }
  }, [checkingAccess, canApproveUsers]);

  // Handle approve user
  const handleApprove = async () => {
    if (!selectedUser) return;

    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${getApiBaseUrl()}/Auth/approvals/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser.userId,
            userType: selectedUser.userType,
            approvalNotes: approvalNotes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      // Success - refresh the list
      await fetchPendingUsers();
      setShowApprovalModal(false);
      setSelectedUser(null);
      setApprovalNotes("");

      // Show success message (you can use a toast notification library)
      alert("User approved successfully!");
    } catch (err) {
      console.error("Error approving user:", err);
      setError(err.message || "Failed to approve user");
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject user
  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${getApiBaseUrl()}/Auth/approvals/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.userId,
          userType: selectedUser.userType,
          rejectionReason: rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject user");
      }

      // Success - refresh the list
      await fetchPendingUsers();
      setShowRejectionModal(false);
      setSelectedUser(null);
      setRejectionReason("");

      // Show success message
      alert("User rejected successfully!");
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError(err.message || "Failed to reject user");
    } finally {
      setProcessing(false);
    }
  };

  // Open approval modal
  const openApprovalModal = (user) => {
    setSelectedUser(user);
    setShowApprovalModal(true);
    setError("");
  };

  // Open rejection modal
  const openRejectionModal = (user) => {
    setSelectedUser(user);
    setShowRejectionModal(true);
    setError("");
  };

  // Filter users based on search
  const filteredUsers = pendingUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.fullName?.toLowerCase().includes(search) ||
      user.mobilePhone?.includes(search)
    );
  });

  // Show loading while checking access
  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Access Denied if no permission
  if (!canApproveUsers) {
    return (
      <AccessDenied message="You don't have permission to approve users. Required permission: User.Approve" />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-600">
              Admin • Security Management
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              User Verification
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Review and approve pending user registrations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by username, email, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingUsers.length}
                  </p>
                </div>
                <FiClock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Pending Users Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <FiClock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Approvals
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No users match your search criteria"
                    : "All users have been processed"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.fullName || "No name provided"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiMail className="w-4 h-4" />
                            <span>{user.email || "N/A"}</span>
                          </div>
                          {user.mobilePhone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FiPhone className="w-4 h-4" />
                              <span>{user.mobilePhone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-purple-100 text-purple-800">
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.assignedRoles?.map((role, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {user.approvalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openApprovalModal(user)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                          >
                            <FiCheck className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => openRejectionModal(user)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1"
                          >
                            <FiX className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Approve User
                </h3>
                <p className="text-sm text-gray-600">
                  Approve {selectedUser.username}
                </p>
              </div>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{selectedUser.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Type:</span>
                  <span className="font-medium">{selectedUser.userType}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Notes (Optional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add any notes about this approval..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedUser(null);
                  setApprovalNotes("");
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Approve User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reject User</h3>
                <p className="text-sm text-gray-600">
                  Reject {selectedUser.username}
                </p>
              </div>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{selectedUser.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Type:</span>
                  <span className="font-medium">{selectedUser.userType}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Provide a reason for rejecting this user..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedUser(null);
                  setRejectionReason("");
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4" />
                    <span>Reject User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
