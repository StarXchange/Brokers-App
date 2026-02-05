import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiX,
  FiUsers,
  FiKey,
  FiLock,
} from "react-icons/fi";
import CryptoJS from "crypto-js";
import { getApiBaseUrl } from "../../utils/config";

const ROLES_API_URL = `${getApiBaseUrl()}/Auth/roles`;
const PERMISSIONS_API_URL = `${getApiBaseUrl()}/Auth/permissions`;

const readResponseBodySafely = async (response) => {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch {
    return "";
  }
};

// Normalizes fetch failures so we don't always show the generic "Failed to fetch".
// Common causes:
// - CORS blocked (browser won't give a status)
// - Network error / SSL / DNS
// - API unreachable
const requestJson = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const body = await readResponseBodySafely(response);

      // Prefer backend message if available
      const backendMessage =
        body && typeof body === "object"
          ? body.message || body.error || JSON.stringify(body)
          : String(body || "");

      if (response.status === 403) {
        throw new Error("Access Denied");
      }
      throw new Error(
        backendMessage?.trim() || `HTTP error! status: ${response.status}`,
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    // Some endpoints return empty body on success (DELETE)
    return null;
  } catch (err) {
    // When fetch throws, there's usually *no HTTP response*.
    // Make it clearer than "Failed to fetch".
    if (
      err instanceof TypeError &&
      String(err.message).includes("Failed to fetch")
    ) {
      throw new Error(
        "Network/CORS error: the browser couldn't reach the API (check API availability, HTTPS, and CORS).",
      );
    }
    throw err;
  }
};

// AccessDenied Component
const AccessDenied = ({ message }) => {
  return (
    <div className="min-h-[400px] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
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
                  {message || "You don't have permission to view this content."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RolesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleDetails, setShowRoleDetails] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editRoleTarget, setEditRoleTarget] = useState(null);
  const [editRoleForm, setEditRoleForm] = useState({
    roleName: "",
    description: "",
    isActive: true,
    permissionIds: [],
  });
  const [createRoleForm, setCreateRoleForm] = useState({
    roleName: "",
    description: "",
    permissionIds: [],
  });

  // Permission check states
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [userPermissions, setUserPermissions] = useState([]);

  const rolesPerPage = 10;

  // Helper to read permissions from storage
  const readPermissionsFromStorage = () => {
    try {
      // Try reading from localStorage.user
      const userStr = localStorage.getItem("user");
      if (userStr) {
        // Try plain JSON first
        if (userStr.trim().startsWith("{")) {
          try {
            const userData = JSON.parse(userStr);
            const perms = userData?.permissions || [];
            if (Array.isArray(perms)) return perms;
          } catch {
            // Not plain JSON
          }
        }

        // Try decrypting
        try {
          const bytes = CryptoJS.AES.decrypt(userStr, "your-secret-key");
          const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
          if (decryptedStr) {
            const userData = JSON.parse(decryptedStr);
            const perms = userData?.permissions || [];
            if (Array.isArray(perms)) return perms;
          }
        } catch {
          // Decryption failed
        }
      }

      // Fallback: try userPermissions
      const permsStr = localStorage.getItem("userPermissions");
      if (permsStr) {
        try {
          const perms = JSON.parse(permsStr);
          if (Array.isArray(perms)) return perms;
        } catch {
          // ignore
        }
      }

      // Fallback: try permissions
      const permsStr2 = localStorage.getItem("permissions");
      if (permsStr2) {
        try {
          const perms = JSON.parse(permsStr2);
          if (Array.isArray(perms)) return perms;
        } catch {
          // ignore
        }
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
    setUserPermissions(perms);
    setCheckingAccess(false);
  }, []);

  // Permission check helpers
  const hasPermission = (permissionName) => {
    return userPermissions.includes(permissionName);
  };

  const canViewRoles = hasPermission("Role.View");
  const canUpdateRole = hasPermission("Role.Update");
  const canDeleteRole = hasPermission("Role.Delete");

  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    setPermissionsError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const data = await requestJson(PERMISSIONS_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const permissionsData = Array.isArray(data) ? data : data.data || [];
      setPermissions(permissionsData);
    } catch (err) {
      setPermissionsError(err.message);
      console.error("Error fetching permissions:", err);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const data = await requestJson(ROLES_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract roles from data.data if it exists, otherwise use data directly
      const rolesData = data.data || data;
      setRoles(rolesData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // View role details
  const handleViewRole = (role) => {
    setSelectedRole(role);
    setShowRoleDetails(true);
  };

  const openCreateRoleModal = () => {
    setCreateRoleForm({ roleName: "", description: "", permissionIds: [] });
    setError(null);
    setSuccess(null);
    setShowCreateRoleModal(true);
  };

  const closeCreateRoleModal = () => {
    if (creatingRole) return;
    setShowCreateRoleModal(false);
  };

  const togglePermissionId = (permissionID) => {
    setCreateRoleForm((prev) => {
      const exists = prev.permissionIds.includes(permissionID);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((id) => id !== permissionID)
          : [...prev.permissionIds, permissionID],
      };
    });
  };

  const toggleEditPermissionId = (permissionID) => {
    setEditRoleForm((prev) => {
      const exists = prev.permissionIds.includes(permissionID);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((id) => id !== permissionID)
          : [...prev.permissionIds, permissionID],
      };
    });
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setCreatingRole(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const payload = {
        roleName: createRoleForm.roleName.trim(),
        description: createRoleForm.description.trim(),
        permissionIds: Array.isArray(createRoleForm.permissionIds)
          ? createRoleForm.permissionIds
          : [],
      };

      if (!payload.roleName) {
        throw new Error("Role Name is required.");
      }

      await requestJson(ROLES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSuccess("Role created successfully.");
      window.alert("Role created successfully.");
      setShowCreateRoleModal(false);
      await fetchRoles();
    } catch (err) {
      console.error("Error creating role:", err);
      setError(err.message);
    } finally {
      setCreatingRole(false);
    }
  };

  const openEditRoleModal = (role) => {
    if (!role || role?.isSystemRole) return;

    // Convert existing permissions to IDs
    const existingPermissionIds = Array.isArray(role?.permissions)
      ? role.permissions
          .map((p) => p?.permissionID)
          .filter((id) => typeof id === "number")
      : [];

    setEditRoleTarget(role);
    setEditRoleForm({
      roleName: role.roleName || "",
      description: role.description || "",
      isActive: role.isActive ?? true,
      permissionIds: existingPermissionIds,
    });
    setError(null);
    setSuccess(null);
    setShowEditRoleModal(true);
  };

  const closeEditRoleModal = () => {
    if (editingRole) return;
    setShowEditRoleModal(false);
    setEditRoleTarget(null);
  };

  const handleEditRole = (role) => {
    openEditRoleModal(role);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!editRoleTarget?.roleID) return;

    setEditingRole(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const payload = {
        roleName: editRoleForm.roleName.trim(),
        description: editRoleForm.description.trim(),
        isActive: Boolean(editRoleForm.isActive),
        permissionIds: Array.isArray(editRoleForm.permissionIds)
          ? editRoleForm.permissionIds
          : [],
      };

      if (!payload.roleName) {
        throw new Error("Role Name is required.");
      }

      await requestJson(`${ROLES_API_URL}/${editRoleTarget.roleID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSuccess("Role updated successfully.");
      window.alert("Role updated successfully.");
      setShowEditRoleModal(false);
      setEditRoleTarget(null);
      await fetchRoles();
    } catch (err) {
      console.error("Error updating role:", err);
      setError(err.message);
    } finally {
      setEditingRole(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (role?.isSystemRole) return;
    const ok = window.confirm(
      `Are you sure you want to delete "${getRoleDisplayName(role.roleName)}"?`,
    );
    if (!ok) return;

    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await requestJson(`${ROLES_API_URL}/${role.roleID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Role deleted successfully.");
      window.alert("Role deleted successfully.");
      await fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      setError(err.message);
    }
  };

  // Close role details modal
  const closeRoleDetails = () => {
    setShowRoleDetails(false);
    setSelectedRole(null);
  };

  // Helper function to get display name for roles
  const getRoleDisplayName = (roleName) => {
    const nameMap = {
      Broker: "Super Agents",
      BrokerAdmin: "Super Agent Admin",
      Customer: "SubAgent",
    };
    return nameMap[roleName] || roleName;
  };

  // Helper function to get display description for roles
  const getRoleDisplayDescription = (description) => {
    if (!description) return description;

    // Replace description text
    return description
      .replace(/Broker User/gi, "Super Agent User")
      .replace(/Broker Administrator/gi, "Super Agent Administrator")
      .replace(/Insured Client/gi, "Sub Agent");
  };

  // Update line 102 to be safe:
  const filteredRoles = (Array.isArray(roles) ? roles : [])
    .filter((role) => !["Company", "CompanyAdmin"].includes(role.roleName))
    .filter(
      (role) =>
        role.roleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
  const currentRoles = filteredRoles.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage,
  );

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Show loading while checking access
  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Access Denied if no Role.View permission
  if (!canViewRoles) {
    return <AccessDenied message="You don't have permission to view roles." />;
  }

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {permissionsError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          Permissions Warning: {permissionsError}
          <button
            onClick={() => setPermissionsError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search by role name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 flex-wrap gap-2">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg"
            onClick={openCreateRoleModal}
            type="button"
          >
            <FiPlus className="mr-2" />
            Add Role
          </button>
          <button
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg"
            onClick={fetchRoles}
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Add Role</h3>
              <button
                onClick={closeCreateRoleModal}
                className="text-gray-500 hover:text-gray-700"
                type="button"
                disabled={creatingRole}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={createRoleForm.roleName}
                  onChange={(e) =>
                    setCreateRoleForm((prev) => ({
                      ...prev,
                      roleName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g. Claims Officer"
                  required
                  disabled={creatingRole}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={createRoleForm.description}
                  onChange={(e) =>
                    setCreateRoleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Short description..."
                  rows={3}
                  disabled={creatingRole}
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  <button
                    type="button"
                    onClick={fetchPermissions}
                    className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                    disabled={permissionsLoading}
                    title="Reload permissions"
                  >
                    {permissionsLoading ? "Loading..." : "Reload"}
                  </button>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="max-h-56 overflow-y-auto">
                    {permissionsLoading ? (
                      <div className="p-3 text-sm text-gray-500">
                        Loading permissions...
                      </div>
                    ) : permissions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">
                        No permissions available.
                      </div>
                    ) : (
                      permissions
                        .filter((p) => p?.isActive !== false)
                        .sort((a, b) =>
                          String(a.permissionName || "").localeCompare(
                            String(b.permissionName || ""),
                          ),
                        )
                        .map((p) => {
                          const checked = createRoleForm.permissionIds.includes(
                            p.permissionID,
                          );
                          return (
                            <label
                              key={p.permissionID}
                              className="flex items-start gap-3 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                className="mt-1"
                                checked={checked}
                                onChange={() =>
                                  togglePermissionId(p.permissionID)
                                }
                                disabled={creatingRole}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {p.permissionName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {p.module} •{" "}
                                  {String(p.action || "").toUpperCase()}
                                  {p.endpoint ? ` • ${p.endpoint}` : ""}
                                </div>
                                {p.description ? (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {p.description}
                                  </div>
                                ) : null}
                              </div>
                            </label>
                          );
                        })
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  Selected:{" "}
                  <span className="font-medium">
                    {createRoleForm.permissionIds.length}
                  </span>
                  {createRoleForm.permissionIds.length > 0 ? (
                    <>
                      {" "}
                      • IDs:{" "}
                      <span className="font-mono">
                        {createRoleForm.permissionIds.join(", ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeCreateRoleModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={creatingRole}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                  disabled={creatingRole}
                >
                  {creatingRole ? "Creating..." : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && editRoleTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Role: {getRoleDisplayName(editRoleTarget.roleName)}
              </h3>
              <button
                onClick={closeEditRoleModal}
                className="text-gray-500 hover:text-gray-700"
                type="button"
                disabled={editingRole}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={editRoleForm.roleName}
                  onChange={(e) =>
                    setEditRoleForm((prev) => ({
                      ...prev,
                      roleName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g. Finance"
                  required
                  disabled={editingRole}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editRoleForm.description}
                  onChange={(e) =>
                    setEditRoleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Short description..."
                  rows={3}
                  disabled={editingRole}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="editRoleIsActive"
                  type="checkbox"
                  checked={Boolean(editRoleForm.isActive)}
                  onChange={(e) =>
                    setEditRoleForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  disabled={editingRole}
                />
                <label
                  htmlFor="editRoleIsActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  <button
                    type="button"
                    onClick={fetchPermissions}
                    className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                    disabled={permissionsLoading}
                    title="Reload permissions"
                  >
                    {permissionsLoading ? "Loading..." : "Reload"}
                  </button>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="max-h-56 overflow-y-auto">
                    {permissionsLoading ? (
                      <div className="p-3 text-sm text-gray-500">
                        Loading permissions...
                      </div>
                    ) : permissions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">
                        No permissions available.
                      </div>
                    ) : (
                      permissions
                        .filter((p) => p?.isActive !== false)
                        .sort((a, b) =>
                          String(a.permissionName || "").localeCompare(
                            String(b.permissionName || ""),
                          ),
                        )
                        .map((p) => {
                          const checked = editRoleForm.permissionIds.includes(
                            p.permissionID,
                          );
                          return (
                            <label
                              key={p.permissionID}
                              className="flex items-start gap-3 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                className="mt-1"
                                checked={checked}
                                onChange={() =>
                                  toggleEditPermissionId(p.permissionID)
                                }
                                disabled={editingRole}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {p.permissionName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {p.module} •{" "}
                                  {String(p.action || "").toUpperCase()}
                                  {p.endpoint ? ` • ${p.endpoint}` : ""}
                                </div>
                              </div>
                            </label>
                          );
                        })
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  Selected:{" "}
                  <span className="font-medium">
                    {editRoleForm.permissionIds.length}
                  </span>
                  {editRoleForm.permissionIds.length > 0 ? (
                    <>
                      {" "}
                      • IDs:{" "}
                      <span className="font-mono">
                        {editRoleForm.permissionIds.join(", ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditRoleModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={editingRole}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                  disabled={editingRole}
                >
                  {editingRole ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Roles Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    S/N
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Role Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Permissions Count
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Created Date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.length > 0 ? (
                  currentRoles.map((role, index) => (
                    <tr
                      key={role.roleID}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {(currentPage - 1) * rolesPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center">
                          <FiKey className="mr-2 text-blue-500" size={16} />
                          <span>{getRoleDisplayName(role.roleName)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getRoleDisplayDescription(role.description)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {role.permissions?.length || 0} permissions
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            role.isSystemRole
                              ? "bg-gray-200 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {role.isSystemRole ? "System" : "Custom"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {role.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(role.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <button
                            className={
                              !canViewRoles
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-blue-600 hover:text-blue-900"
                            }
                            onClick={() => handleViewRole(role)}
                            title={
                              !canViewRoles
                                ? "No permission to view role details"
                                : "View Role Details"
                            }
                            disabled={!canViewRoles}
                          >
                            <FiEye size={16} />
                          </button>

                          <button
                            className={
                              role.isSystemRole || !canUpdateRole
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-green-600 hover:text-green-900"
                            }
                            onClick={() => handleEditRole(role)}
                            title={
                              role.isSystemRole
                                ? "System roles can't be edited"
                                : !canUpdateRole
                                  ? "No permission to update roles"
                                  : "Edit Role"
                            }
                            disabled={role.isSystemRole || !canUpdateRole}
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            className={
                              role.isSystemRole || !canDeleteRole
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-red-600 hover:text-red-900"
                            }
                            onClick={() => handleDeleteRole(role)}
                            title={
                              role.isSystemRole
                                ? "System roles can't be deleted"
                                : !canDeleteRole
                                  ? "No permission to delete roles"
                                  : "Delete Role"
                            }
                            disabled={role.isSystemRole || !canDeleteRole}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No roles match your search"
                        : "No roles found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * rolesPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * rolesPerPage, filteredRoles.length)}
              </span>{" "}
              of <span className="font-medium">{filteredRoles.length}</span>{" "}
              Roles
            </span>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Details Modal */}
      {showRoleDetails && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                Role Details: {getRoleDisplayName(selectedRole.roleName)}
              </h3>
              <button
                onClick={closeRoleDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Role Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-3 text-gray-800">
                    Role Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Role Name:
                      </span>
                      <p className="text-gray-900">
                        {getRoleDisplayName(selectedRole.roleName)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Description:
                      </span>
                      <p className="text-gray-900">
                        {getRoleDisplayDescription(selectedRole.description)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedRole.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedRole.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Created Date:
                      </span>
                      <p className="text-gray-900">
                        {new Date(
                          selectedRole.createdDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-3 text-gray-800">
                    Permissions Summary
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Total Permissions:
                      </span>
                      <p className="text-gray-900">
                        {selectedRole.permissions?.length || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Modules:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ...new Set(
                            selectedRole.permissions?.map((p) => p.module),
                          ),
                        ].map((module) => (
                          <span
                            key={module}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-800">
                  Assigned Permissions
                </h4>
                {selectedRole.permissions &&
                selectedRole.permissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                          <th className="px-4 py-3">Permission Name</th>
                          <th className="px-4 py-3">Module</th>
                          <th className="px-4 py-3">Action</th>
                          <th className="px-4 py-3">Endpoint</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRole.permissions.map((permission, index) => (
                          <tr
                            key={permission.permissionID || index}
                            className="bg-white border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {permission.permissionName}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {permission.module}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  permission.action === "Create"
                                    ? "bg-green-100 text-green-800"
                                    : permission.action === "Read"
                                      ? "bg-blue-100 text-blue-800"
                                      : permission.action === "Update"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : permission.action === "Delete"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {permission.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {permission.endpoint}
                            </td>
                            <td className="px-4 py-3">
                              {permission.isActive ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Inactive
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiKey size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No permissions assigned to this role.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTab;
