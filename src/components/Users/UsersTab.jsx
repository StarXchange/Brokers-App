import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiX,
  FiRefreshCw,
  FiKey,
  FiMinus,
  FiCheck,
  FiUserPlus,
} from "react-icons/fi";
import { FiShield } from "react-icons/fi";
import Addnewuser from "./Addnewuser";

const UsersTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usersPerPage = 10;
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Permission Modal States
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [assigningPermission, setAssigningPermission] = useState(false);

  // Assign permission UI state (inside modal)
  const [permissionSearch, setPermissionSearch] = useState("");
  const [selectedPermissionIdToAssign, setSelectedPermissionIdToAssign] =
    useState("");

  // Roles assignment states
  const [availableRoles, setAvailableRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [rolesTargetUser, setRolesTargetUser] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [replaceExistingRoles, setReplaceExistingRoles] = useState(true);
  const [assigningRoles, setAssigningRoles] = useState(false);

  const USERS_API = "https://gibsbrokersapi.newgibsonline.com/api/Auth/users";
  const PERMISSIONS_API =
    "https://gibsbrokersapi.newgibsonline.com/api/Auth/permissions";
  const USER_PERMISSIONS_API =
    "https://gibsbrokersapi.newgibsonline.com/api/Auth/user-permissions";
  const ASSIGN_PERMISSION_API =
    "https://gibsbrokersapi.newgibsonline.com/api/Auth/assign-permission";
  const REVOKE_PERMISSION_API =
    "https://gibsbrokersapi.newgibsonline.com/api/Auth/revoke-permission";

  const ROLES_API = "https://gibsbrokersapi.newgibsonline.com/api/Auth/roles";

  // ========== LOCAL STORAGE HELPER FUNCTIONS ==========
  
  // Save user status to localStorage
  const saveUserStatusToStorage = (userId, status, approvalStatus = '') => {
    try {
      const storedStatuses = JSON.parse(localStorage.getItem('userStatuses') || '{}');
      storedStatuses[userId] = {
        status,
        approvalStatus,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('userStatuses', JSON.stringify(storedStatuses));
    } catch (error) {
      console.error('Error saving user status:', error);
    }
  };

  // Get user status from localStorage
  const getUserStatusFromStorage = (userId) => {
    try {
      const storedStatuses = JSON.parse(localStorage.getItem('userStatuses') || '{}');
      return storedStatuses[userId]?.status || null;
    } catch (error) {
      console.error('Error getting user status:', error);
      return null;
    }
  };

  // Get user approvalStatus from localStorage
  const getUserApprovalStatusFromStorage = (userId) => {
    try {
      const storedStatuses = JSON.parse(localStorage.getItem('userStatuses') || '{}');
      return storedStatuses[userId]?.approvalStatus || null;
    } catch (error) {
      console.error('Error getting approval status:', error);
      return null;
    }
  };

  // Clear stored statuses (for testing)
  const clearStoredStatuses = () => {
    localStorage.removeItem('userStatuses');
    fetchUsers(); // Refresh the list
  };

  // ========== END LOCAL STORAGE FUNCTIONS ==========

  // Helpers for new Users API shape
  const getUserRolesText = (user) => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    if (roles.length === 0) return "";
    return roles
      .map((r) => r?.roleName)
      .filter(Boolean)
      .join(", ");
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(USERS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          console.log("Could not parse error as JSON");
        }
        throw new Error(
          errorData.message ||
            errorData.error ||
            errorText ||
            `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Handle different response structures
      let usersArray = [];

      if (data.success && Array.isArray(data.data)) {
        usersArray = data.data;
      } else if (Array.isArray(data)) {
        usersArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        usersArray = data.data;
      } else {
        console.warn(
          "Unexpected API response format, using empty array:",
          data
        );
        usersArray = [];
      }

      // Transform users to ensure consistent field names
      const transformedUsers = usersArray.map((user) => {
        const userId = user.userId || user.userid;
        
        // Get stored status from localStorage first
        const storedStatus = getUserStatusFromStorage(userId);
        const storedApprovalStatus = getUserApprovalStatusFromStorage(userId);
        
        // Determine the final status
        let finalStatus = "Active"; // Default
        
        // Priority: localStorage > API approvalStatus > API status
        if (storedStatus) {
          finalStatus = storedStatus;
        } else if (user.approvalStatus) {
          // Map approvalStatus from API to frontend status
          finalStatus = user.approvalStatus === "Rejected" ? "Inactive" : 
                        user.approvalStatus === "Approved" ? "Active" : 
                        user.approvalStatus === "Pending" ? "Pending" : 
                        "Active";
        } else if (user.status) {
          finalStatus = user.status;
        }

        const userObj = {
          // Standardize field names
          userId: user.userId || user.userid || "",
          userid: user.userid || user.userId || "",
          username: user.username || "",
          email: user.email || "",
          fullName: user.fullName || "",
          mobilePhone: user.mobilePhone || "",
          entityType: user.entityType || "",
          userType: user.entityType || "",
          insuredName: user.insuredName || "",
          roles: user.roles || [],
          submitDate: user.submitDate || "",
          // Use the determined status
          status: finalStatus,
          // Store approvalStatus from localStorage or API
          approvalStatus: storedApprovalStatus || user.approvalStatus || "",
          approvedDate: user.approvedDate || "",
          approvedBy: user.approvedBy || "",
        };

        return userObj;
      });

      setUsers(transformedUsers);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch roles for role assignment
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const response = await fetch(ROLES_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rolesArray =
        (data && data.success && Array.isArray(data.data) && data.data) ||
        (Array.isArray(data) ? data : []) ||
        [];

      // Normalize a bit
      const normalized = rolesArray
        .map((r) => ({
          roleID: r.roleID ?? r.roleId ?? r.id,
          roleName: r.roleName ?? r.name,
          description: r.description,
          isActive: r.isActive,
          isSystemRole: r.isSystemRole,
        }))
        .filter((r) => Boolean(r.roleID) && Boolean(r.roleName));

      setAvailableRoles(normalized);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setAvailableRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openRolesModal = (user) => {
    const existingRoleIds = Array.isArray(user?.roles)
      ? user.roles.map((r) => r?.roleID).filter(Boolean)
      : [];

    setRolesTargetUser(user);
    setSelectedRoleIds(existingRoleIds);
    setReplaceExistingRoles(true);
    setShowRolesModal(true);
  };

  const closeRolesModal = () => {
    setShowRolesModal(false);
    setRolesTargetUser(null);
    setSelectedRoleIds([]);
    setReplaceExistingRoles(true);
  };

  const toggleRoleId = (roleID) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleID)
        ? prev.filter((id) => id !== roleID)
        : [...prev, roleID]
    );
  };

  const assignRolesToUser = async () => {
    const userId = rolesTargetUser?.userId || rolesTargetUser?.userid;
    if (!userId) {
      setError("User ID not found.");
      return;
    }

    setAssigningRoles(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const payload = {
        userId: String(userId),
        roleIds: selectedRoleIds,
        replaceExisting: replaceExistingRoles,
      };

      const response = await fetch(
        `https://gibsbrokersapi.newgibsonline.com/api/Auth/users/${encodeURIComponent(
          String(userId)
        )}/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      alert("Roles updated successfully.");
      closeRolesModal();
      await fetchUsers();
    } catch (err) {
      console.error("Error assigning roles:", err);
      alert(err.message || "Failed to update roles");
    } finally {
      setAssigningRoles(false);
    }
  };

  // Handle user added successfully
  const handleUserAdded = () => {
    // Refresh the users list after adding a new user
    fetchUsers();
    setShowAddUserModal(false);
  };

  // Handle approve user
  const handleApproveUser = async (user) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");


      const requestBody = {
        userId: String(user.userId || user.userid),
        userType: user.userType || user.entityType || "User",
        approvalNotes: "Approved via admin panel"
      };

      // Optimistic update
      setUsers(prev => prev.map(u => 
        (u.userId || u.userid) === (user.userId || user.userid)
          ? { 
              ...u, 
              status: "Active",
              approvalStatus: "Approved",
              approvedDate: new Date().toISOString()
            }
          : u
      ));

      // Save to localStorage
      saveUserStatusToStorage(
        user.userId || user.userid, 
        "Active", 
        "Approved"
      );

      const response = await fetch(
        'https://gibsbrokersapi.newgibsonline.com/api/Auth/approvals/approve',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        // Revert on error
        setUsers(prev => prev.map(u => 
          (u.userId || u.userid) === (user.userId || user.userid) ? user : u
        ));
        
        const errorText = await response.text();
        throw new Error(`Failed to approve user: ${errorText}`);
      }

      const result = await response.json();
      console.log("Approve successful:", result);
      
      setError("User approved successfully");
      setTimeout(() => setError(null), 3000);

    } catch (err) {
      console.error("Error approving user:", err);
      // Revert on error
      setUsers(prev => prev.map(u => 
        (u.userId || u.userid) === (user.userId || user.userid) ? user : u
      ));
      alert(err.message || "Failed to approve user. Please try again.");
    }
  };

  // Handle reject user
  const handleRejectUser = async (user) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");


      const requestBody = {
        userId: String(user.userId || user.userid),
        userType: user.userType || user.entityType || "User",
        rejectionReason: "Rejected via admin panel"
      };

      // Optimistic update
      setUsers(prev => prev.map(u => 
        (u.userId || u.userid) === (user.userId || user.userid)
          ? { 
              ...u, 
              status: "Inactive",
              approvalStatus: "Rejected",
              approvedDate: new Date().toISOString()
            }
          : u
      ));

      // Save to localStorage
      saveUserStatusToStorage(
        user.userId || user.userid, 
        "Inactive", 
        "Rejected"
      );

      const response = await fetch(
        'https://gibsbrokersapi.newgibsonline.com/api/Auth/approvals/reject',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        // Revert on error
        setUsers(prev => prev.map(u => 
          (u.userId || u.userid) === (user.userId || user.userid) ? user : u
        ));
        
        const errorText = await response.text();
        throw new Error(`Failed to reject user: ${errorText}`);
      }

      const result = await response.json();
      console.log("Reject successful:", result);
      
      setError("User rejected successfully");
      setTimeout(() => setError(null), 3000);

    } catch (err) {
      console.error("Error rejecting user:", err);
      // Revert on error
      setUsers(prev => prev.map(u => 
        (u.userId || u.userid) === (user.userId || user.userid) ? user : u
      ));
      alert(err.message || "Failed to reject user. Please try again.");
    }
  };

  // Fetch user permissions
  const fetchUserPermissions = async (userId) => {
    setPermissionsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      // Extract just the username portion before any colon
      const cleanUserId = userId.split(":")[0];

      // URL-encode the userId to handle special characters
      const encodedUserId = encodeURIComponent(cleanUserId);

      console.log(
        `Fetching permissions for userId: "${userId}" -> encoded: "${encodedUserId}"`
      );

      const response = await fetch(`${USER_PERMISSIONS_API}/${encodedUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If response is not JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Permissions API response:", data);

      // Handle different response structures
      let permissions = [];
      if (data.success && Array.isArray(data.data)) {
        permissions = data.data;
      } else if (Array.isArray(data)) {
        permissions = data;
      } else if (data.permissions && Array.isArray(data.permissions)) {
        permissions = data.permissions;
      } else if (data.data && Array.isArray(data.data)) {
        permissions = data.data;
      }

      // Extract permission names from the response
      const permissionNames = permissions
        .map((p) => p.permissionName || p.name || p)
        .filter(Boolean);
      console.log("Extracted permission names:", permissionNames);

      setUserPermissions(permissionNames);

      return permissions;
    } catch (err) {
      console.error("Error fetching user permissions:", err);
      setUserPermissions([]);
      setError(`Failed to fetch permissions: ${err.message}`);
      return [];
    } finally {
      setPermissionsLoading(false);
    }
  };


  // Add this function to your component
const handleStatusToggle = (user) => {
  const currentStatus = user.status?.toLowerCase();
  
  if (currentStatus === 'pending') {
    // This shouldn't happen since pending users have separate buttons
    const choice = window.confirm(
      `User "${user.username}" is pending approval.\n\nClick OK to approve, Cancel to reject.`
    );
    
    if (choice) {
      handleApproveUser(user);
    } else {
      handleRejectUser(user);
    }
    return;
  }
  
  if (currentStatus === 'inactive') {
    // If inactive, activate (approve)
    if (window.confirm(`Activate user "${user.username}"?`)) {
      handleApproveUser(user);
    }
  } else if (currentStatus === 'active') {
    // If active, deactivate (reject)
    if (window.confirm(`Deactivate user "${user.username}"?`)) {
      handleRejectUser(user);
    }
  }
};

  // Fetch all available permissions
  const fetchAllPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(PERMISSIONS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Filter active permissions
      const activePermissions = Array.isArray(data)
        ? data.filter((p) => p.isActive === true)
        : [];
      setAllPermissions(activePermissions);

      return activePermissions;
    } catch (err) {
      console.error("Error fetching all permissions:", err);
      setAllPermissions([]);
      setError(`Failed to load permissions: ${err.message}`);
      return [];
    }
  };

  // Assign a permission to the selected user from the modal
  const handleAssignPermission = async () => {
    const permissionIdNum = Number(selectedPermissionIdToAssign);
    if (!selectedUser) {
      setError("No user selected.");
      return;
    }
    if (!Number.isFinite(permissionIdNum) || permissionIdNum <= 0) {
      setError("Please select a permission to assign.");
      return;
    }

    setAssigningPermission(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const permission = allPermissions.find(
        (p) => p.permissionID === permissionIdNum
      );
      if (!permission) {
        throw new Error("Permission not found.");
      }

      const requestBody = {
        userId: (selectedUser.userid || selectedUser.userId).toString(),
        userType: selectedUser.userType || "User",
        permissionId: permissionIdNum,
      };

      const response = await fetch(ASSIGN_PERMISSION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await response.json().catch(() => null);

      // Refresh user permissions after assignment
      await fetchUserPermissions(selectedUser.userid || selectedUser.userId);

      // Clear selection
      setSelectedPermissionIdToAssign("");

      setError("Permission assigned successfully.");
      setTimeout(() => setError(null), 2500);
    } catch (err) {
      console.error("Error assigning permission:", err);
      setError(`Failed to assign permission: ${err.message}`);
    } finally {
      setAssigningPermission(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleViewPermissions = async (user) => {
    console.log("Opening permissions for user:", user);

    // Ensure we have the user ID correctly
    const userId = user.userId || user.userid;
    if (!userId) {
      setError("User ID not found");
      return;
    }

    setSelectedUser(user);
    setShowPermissionsModal(true);
    setPermissionsLoading(true);

    try {
      // Load both user permissions and all permissions
      await Promise.all([fetchUserPermissions(userId), fetchAllPermissions()]);
    } catch (err) {
      console.error("Error loading permissions:", err);
      setError(`Failed to load permissions: ${err.message}`);
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Handle revoking permission
  const handleRevokePermission = async (permissionId, permissionName) => {
    if (!selectedUser || !permissionId) return;

    if (
      !window.confirm(
        `Are you sure you want to revoke permission: ${permissionName}?`
      )
    ) {
      return;
    }

    setAssigningPermission(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const requestBody = {
        userId: (selectedUser.userid || selectedUser.userId).toString(),
        userType: selectedUser.userType || "User",
        permissionId: permissionId,
      };

      const response = await fetch(REVOKE_PERMISSION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Refresh user permissions after revocation
      await fetchUserPermissions(selectedUser.userid || selectedUser.userId);

      // Show success message
      const successMsg =
        result.message || `Permission "${permissionName}" revoked successfully`;
      setError(successMsg);
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error("Error revoking permission:", err);
      setError(`Failed to revoke permission: ${err.message}`);
    } finally {
      setAssigningPermission(false);
    }
  };

  // Close permissions modal
  const closePermissionsModal = () => {
    setShowPermissionsModal(false);
    setSelectedUser(null);
    setUserPermissions([]);
    setPermissionSearch("");
    setSelectedPermissionIdToAssign("");
  };

  // Open the permissions modal from the table
  const openPermissionsModal = async (user) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
    // Keep allPermissions in the background (needed to resolve Permission ID for revokes)
    // but the UI will show only assigned permissions.
    await fetchAllPermissions();
    await fetchUserPermissions(user?.userid || user?.userId);
  };

  // Note: we now render only assigned permissions in the modal,
  // so we no longer need an "isPermissionAssigned" check over allPermissions.

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.fullName?.toLowerCase().includes(q) ||
      user.insuredName?.toLowerCase().includes(q) ||
      user.userId?.toString().toLowerCase().includes(q) ||
      user.userid?.toString().toLowerCase().includes(q) ||
      user.mobilePhone?.toLowerCase().includes(q) ||
      user.entityType?.toLowerCase().includes(q) ||
      user.contactPerson?.toLowerCase().includes(q) ||
      getUserRolesText(user).toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div>
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search by username, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg"
            onClick={() => setShowAddUserModal(true)}
          >
            <FiUserPlus className="mr-2" />
            Add User
          </button>
          <button
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg"
            onClick={fetchUsers}
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Users Table */}
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
                    User ID
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Full Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Roles
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Permissions
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Manage Roles
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user.userId || user.userid || index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {(currentPage - 1) * usersPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {user.userId || user.userid || ""}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {user.username || ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.entityType || user.userType || "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.fullName || user.insuredName || ""}
                      </td>
                      <td className="px-4 py-3">{user.email || ""}</td>
                      <td className="px-4 py-3">
                        {user.mobilePhone || user.phone || ""}
                      </td>
                      <td className="px-4 py-3">
                        {Array.isArray(user.roles) && user.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.roles
                              .filter((r) => r?.roleName)
                              .map((r) => (
                                <span
                                  key={r.roleID ?? r.roleName}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  title={r.description || r.roleName}
                                >
                                  {r.roleName}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openPermissionsModal(user)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium"
                          title="Manage user permissions"
                        >
                          <FiShield className="mr-2" size={14} />
                          Permissions
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openRolesModal(user)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium disabled:opacity-50"
                          disabled={rolesLoading}
                          title="Assign roles to user"
                        >
                          Manage
                        </button>
                      </td>
                      
                     {/* Status Column */}
<td className="px-4 py-3">
  {user.status?.toLowerCase() === 'pending' ? (
    <div className="flex gap-2">
      <button
        onClick={() => handleApproveUser(user)}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
      >
        Approve
      </button>
      <button
        onClick={() => handleRejectUser(user)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
      >
        Reject
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleStatusToggle(user)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          (user.status?.toLowerCase() || "active") === "active"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            (user.status?.toLowerCase() || "active") === "active"
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        user.status?.toLowerCase() === 'active' 
          ? 'bg-green-100 text-green-800'
          : user.status?.toLowerCase() === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {user.status || "Active"}
      </span>
    </div>
  )}
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No users match your search"
                        : "No users found"}
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
                {(currentPage - 1) * usersPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * usersPerPage, filteredUsers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredUsers.length}</span>{" "}
              Users
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

      {/* Add User Modal */}
      <Addnewuser
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleUserAdded}
      />

      {/* Assign Roles Modal */}
      {showRolesModal && rolesTargetUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Assign Roles
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  User:{" "}
                  <span className="font-medium">
                    {rolesTargetUser.fullName ||
                      rolesTargetUser.username ||
                      rolesTargetUser.userId ||
                      rolesTargetUser.userid}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeRolesModal}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                disabled={assigningRoles}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={replaceExistingRoles}
                  onChange={(e) => setReplaceExistingRoles(e.target.checked)}
                  disabled={assigningRoles}
                />
                Replace existing roles
              </label>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-72 overflow-y-auto">
                  {rolesLoading ? (
                    <div className="p-3 text-sm text-gray-500">
                      Loading roles...
                    </div>
                  ) : availableRoles.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      No roles available.
                    </div>
                  ) : (
                    availableRoles
                      .filter((r) => r?.isActive !== false)
                      .filter(
                        (r) => !["Company", "CompanyAdmin"].includes(r.roleName)
                      )
                      .sort((a, b) =>
                        String(a.roleName).localeCompare(String(b.roleName))
                      )
                      .map((r) => {
                        const checked = selectedRoleIds.includes(r.roleID);
                        return (
                          <label
                            key={r.roleID}
                            className="flex items-start gap-3 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={checked}
                              onChange={() => toggleRoleId(r.roleID)}
                              disabled={assigningRoles}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {r.roleName}
                              </div>
                              {r.description ? (
                                <div className="text-xs text-gray-500">
                                  {r.description}
                                </div>
                              ) : null}
                            </div>
                          </label>
                        );
                      })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={fetchRoles}
                  className="text-xs px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  disabled={rolesLoading || assigningRoles}
                >
                  {rolesLoading ? "Refreshing..." : "Refresh Roles"}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeRolesModal}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    disabled={assigningRoles}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={assignRolesToUser}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={assigningRoles || selectedRoleIds.length === 0}
                  >
                    {assigningRoles ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Manage Permissions: {selectedUser.username}
                </h3>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <FiKey className="text-purple-500 mr-1" size={16} />
                    <span className="text-sm text-gray-600">
                      User ID:{" "}
                      <span className="font-bold">
                        {selectedUser.userid || selectedUser.userId}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiKey className="text-blue-500 mr-1" size={16} />
                    <span className="text-sm text-gray-600">
                      Roles:{" "}
                      <span className="font-bold capitalize">
                        {selectedUser.entityType ||
                          selectedUser.userType ||
                          "User"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiKey className="text-green-500 mr-1" size={16} />
                    <span className="text-sm text-gray-600">
                      Assigned:{" "}
                      <span className="font-bold">
                        {userPermissions.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closePermissionsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* In-modal Feedback */}
              {error && (
                <div
                  className={`border px-4 py-3 rounded mb-4 ${
                    String(error).toLowerCase().includes("success")
                      ? "bg-green-100 border-green-300 text-green-800"
                      : "bg-red-100 border-red-300 text-red-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm">{error}</div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="font-bold leading-none"
                      aria-label="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Assign Permission */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search permissions
                    </label>
                    <input
                      type="text"
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      placeholder="Type to filter permissions..."
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select permission to assign
                    </label>
                    <select
                      value={selectedPermissionIdToAssign}
                      onChange={(e) =>
                        setSelectedPermissionIdToAssign(e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="">-- Select a permission --</option>
                      {allPermissions
                        .filter((p) => {
                          const name = p.permissionName || "";
                          const matchesSearch = !permissionSearch
                            ? true
                            : name
                                .toLowerCase()
                                .includes(permissionSearch.toLowerCase());
                          const isAssigned = userPermissions.includes(name);
                          return matchesSearch && !isAssigned;
                        })
                        .map((p) => (
                          <option key={p.permissionID} value={p.permissionID}>
                            {p.permissionName}
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-600 mt-1">
                      Only unassigned permissions are shown.
                    </p>
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={handleAssignPermission}
                      disabled={
                        assigningPermission || !selectedPermissionIdToAssign
                      }
                      className={`w-full px-4 py-2 rounded text-white text-sm font-medium transition-colors ${
                        assigningPermission || !selectedPermissionIdToAssign
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {assigningPermission
                        ? "Assigning..."
                        : "Assign Permission"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Assigned Permissions ({userPermissions.length})
                  </h4>
                  {permissionsLoading && (
                    <div className="flex items-center text-blue-600">
                      <FiRefreshCw className="animate-spin mr-2" size={16} />
                      <span className="text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      fetchUserPermissions(
                        selectedUser?.userid || selectedUser?.userId
                      )
                    }
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FiRefreshCw className="mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Assigned Permissions Table (only what this user has) */}
              {userPermissions.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Permission
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userPermissions.map((permissionName, idx) => (
                        <tr
                          key={`${permissionName}-${idx}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <FiKey
                                className="mr-2 text-green-500"
                                size={16}
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {permissionName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const match = allPermissions.find(
                                  (p) => p.permissionName === permissionName
                                );
                                if (!match) {
                                  setError(
                                    `Can't revoke "${permissionName}" because its Permission ID wasn't found in the permissions list.`
                                  );
                                  return;
                                }
                                handleRevokePermission(
                                  match.permissionID,
                                  match.permissionName
                                );
                              }}
                              disabled={assigningPermission}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiMinus className="mr-1" size={12} />
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FiKey size={56} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Assigned Permissions
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This user currently has no permissions assigned.
                  </p>
                </div>
              )}

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Assigned Permissions
                      </p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {userPermissions.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FiKey className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Available Permissions
                      </p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {allPermissions.length}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FiKey className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Current Roles
                      </p>
                      <p className="text-2xl font-bold text-purple-900 mt-1 capitalize">
                        {selectedUser.userType || "User"}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FiKey className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                User:{" "}
                <span className="font-medium">{selectedUser.username}</span> •
                ID:{" "}
                <span className="font-medium">
                  {selectedUser.userid || selectedUser.userId}
                </span>{" "}
                • Type:{" "}
                <span className="font-medium capitalize">
                  {selectedUser.userType || "User"}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={closePermissionsModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;