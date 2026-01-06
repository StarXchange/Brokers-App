import React, { useState, useEffect } from "react";
import {
  FaCoins,
  FaUserCheck,
  FaHistory,
  FaShare,
  FaUserTie,
  FaClock,
  FaCheck,
  FaTimes,
  FaLock,
  FaSpinner,
} from "react-icons/fa";
import PinService from "../../services/PinServices";
import AllocatePinsModal from "./AllocatePinsModal";
import PendingApprovals from "./PendingApprovals";
import AllocationHistory from "./AllocationHistory";

// Import CryptoJS for decryption
import CryptoJS from "crypto-js";

// Toast Notification Component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon =
    type === "success" ? (
      <FaCheck className="w-5 h-5" />
    ) : (
      <FaTimes className="w-5 h-5" />
    );
  const title = type === "success" ? "Success!" : "Error!";

  return (
    <div
      className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-4 rounded-xl shadow-xl flex items-start space-x-3 animate-slideInRight z-50 min-w-80 max-w-md`}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-200"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
};

// Access Denied Component
const AccessDenied = ({ errorMessage, permissionName }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            {errorMessage || "You don't have permission to access the Pin Allocation System."}
            Please contact your administrator to request the necessary permissions.
          </p>
         
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

const PinAllocationSystem = () => {
  const [activeTab, setActiveTab] = useState("allocate");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [hasAccess, setHasAccess] = useState(null);
  const [accessError, setAccessError] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    checkAccessAndLoadData();
  }, []);

  // Function to decrypt user data (same as in AuthContext)
  const decryptData = (encryptedData) => {
    if (!encryptedData) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "your-secret-key");
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedString ? JSON.parse(decryptedString) : null;
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };

 // Function to check if user has ANY Pin-related permission
const hasAnyPinPermission = (permissions) => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }


  // Define all Pin-related permission names
  const pinPermissions = [
    "Pin.ViewPending",
    "Pin.Share",
    "Pin.ViewBalance",
    "Pin.ViewAllocations",
    "Pin.ViewAudit",
    "Pin.ViewSummary",
    "Pin.ViewAllocations",
    "Pin.Approve",
    "Pin.Revoke"
  ];

  // Check if it's an array of permission names or objects
  if (permissions.length > 0) {
    // If first item is a string, it's an array of permission names
    if (typeof permissions[0] === 'string') {
      
      // Check if ANY of the user's permissions starts with "Pin."
      const hasPinPermission = permissions.some(permission => 
        permission.startsWith("Pin.")
      );
      
      if (hasPinPermission) {
        // Also check which specific Pin permissions were found
        const foundPinPermissions = permissions.filter(p => pinPermissions.includes(p));
        ( foundPinPermissions);
      }
      
      return hasPinPermission;
    }
    
    // If first item is an object, look for permissionName
    else if (typeof permissions[0] === 'object' && permissions[0] !== null) {
     
      
      // Look for ANY Pin permission
      const hasPinPermission = permissions.some(permission => {
        // Check permissionName
        if (permission.permissionName && permission.permissionName.startsWith("Pin.")) {
          return true;
        }
        
        // Check name property
        if (permission.name && permission.name.startsWith("Pin.")) {
        
          return true;
        }
        
        // Check specific Pin permission IDs (optional - you can add IDs if needed)
        const pinPermissionIds = [29, 30, 32, 33, 34, 35, 36, 61, 62];
        if (permission.permissionID && pinPermissionIds.includes(permission.permissionID)) {
         
          return true;
        }
        
        return false;
      });
      
      if (hasPinPermission) {
       
        // Log which specific Pin permissions were found
        const foundPermissions = permissions.filter(p => 
          (p.permissionName && p.permissionName.startsWith("Pin.")) ||
          (p.name && p.name.startsWith("Pin."))
        );
       ( foundPermissions);
      }
      
      return hasPinPermission;
    }
  }

  
  return false;
};

  // Function to get decrypted user data from localStorage
  const getDecryptedUserData = () => {
    try {
      // Get encrypted user data from localStorage
      const encryptedUser = localStorage.getItem("user");
      
      
      if (!encryptedUser) {
     
        return null;
      }

      // Decrypt the user data
      const userData = decryptData(encryptedUser);
      
      
      return userData;
    } catch (error) {
      console.error("Error getting decrypted user data:", error);
      return null;
    }
  };

  // Main function to check access and load data
const checkAccessAndLoadData = async () => {
  try {
    setLoading(true);
    
  

    // Get token and check authentication
    const token = localStorage.getItem("token");
    if (!token) {
     
      setHasAccess(false);
      setAccessError("Authentication required. Please login.");
      setLoading(false);
      return;
    }

    // Get user role from localStorage
    const storedRole = localStorage.getItem("role");

    setUserRole(storedRole || "user");

    // Get decrypted user data
    const userData = getDecryptedUserData();
    
    if (!userData) {

      setHasAccess(false);
      setAccessError("Could not retrieve user information. Please login again.");
      setLoading(false);
      return;
    }

    
    // Extract permissions from user data
    let permissions = [];
    
    // Check different possible locations for permissions in user data
    if (userData.permissions && Array.isArray(userData.permissions)) {
      permissions = userData.permissions;
      
    } else if (userData.userPermissions && Array.isArray(userData.userPermissions)) {
      permissions = userData.userPermissions;
     
    } else if (userData.Permissions && Array.isArray(userData.Permissions)) {
      permissions = userData.Permissions;
      
    } else if (userData.roles && Array.isArray(userData.roles)) {
      // If roles contain permissions
      const allPermissions = [];
      userData.roles.forEach(role => {
        if (role.permissions && Array.isArray(role.permissions)) {
          allPermissions.push(...role.permissions);
        }
      });
      permissions = allPermissions;
     
    }

  

    // Check if user has ANY Pin-related permission
    const hasPinPermission = hasAnyPinPermission(permissions);
    
    if (!hasPinPermission) {
      
      setHasAccess(false);
      setAccessError("You don't have any Pin-related permissions to access the Pin Allocation System.");
      setLoading(false);
      return;
    }

    // User has at least one Pin permission, load data
    
    setHasAccess(true);
    
    try {
      const [balanceData, pendingData] = await Promise.all([
        PinService.getBalance().catch(() => ({ balance: 0, availablePins: 0 })),
        PinService.getPendingAllocations().catch(() => []),
      ]);

     

      setBalance(balanceData.balance || balanceData.availablePins || 0);
      setPendingCount(Array.isArray(pendingData) ? pendingData.length : 0);
    } catch (error) {
      console.error("Failed to load data:", error);
      // Set default values even if loading fails
      setBalance(0);
      setPendingCount(0);
    }
    
  } catch (error) {
    console.error("Failed to check access:", error);
    setHasAccess(false);
    setAccessError("Failed to verify access permissions. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleAllocationSuccess = () => {
    checkAccessAndLoadData();
    showToast(
      "Pin allocation request submitted successfully! Awaiting approval."
    );
  };

  const handleApprovalSuccess = (isApproved = true) => {
    checkAccessAndLoadData();
    if (isApproved) {
      showToast("Pin allocation approved successfully!");
    } else {
      showToast("Pin allocation rejected successfully!");
    }
  };

  // Update tabs
  const tabs = [
    {
      id: "allocate",
      name: "Allocate to Super Agents",
      icon: FaCoins,
      description: "Allocate pins to super agents (requires approval)",
    },
    {
      id: "approvals",
      name: "Pending Approvals",
      icon: FaUserCheck,
      description: "Approve/reject allocation requests",
      badge: pendingCount,
    },
    {
      id: "history",
      name: "Allocation History",
      icon: FaHistory,
      description: "View allocation records",
    },
  ];

  // Add CSS animations for the toast
  const toastStyles = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .animate-slideInRight {
      animation: slideInRight 0.3s ease-out forwards;
    }
    
    .animate-slideOutRight {
      animation: slideOutRight 0.3s ease-out forwards;
    }
  `;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Checking Access
          </h3>
          <p className="text-gray-500">
            Verifying your access to Pin Allocation System...
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have permission
  if (hasAccess === false) {
    return (
     <AccessDenied 
  errorMessage="You don't have any Pin-related permissions to access this system."
  permissionName="Pin.* (Any Pin permission)"
/>
    );
  }

  // Show the main interface if user has access
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast Styles */}
      <style>{toastStyles}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pin Allocation System
                
              </h1>
              <p className="text-gray-600 mt-1">
                Complete pin allocation and approval workflow
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FaUserTie className="w-3 h-3 mr-1" />
                  {userRole || "User"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FaCoins className="w-3 h-3 mr-1" />
                  Balance: {balance} pins
                </span>
              
              </div>
            </div>
            <div className="text-right">
              {pendingCount > 0 && (
                <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg mb-2">
                  <div className="flex items-center space-x-2">
                    <FaClock className="w-4 h-4" />
                    <span className="font-semibold">
                      {pendingCount} pending approval(s)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pin Allocation Workflow
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaCoins className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Admin Allocates</p>
              <p className="text-xs text-gray-500">Pins to Super Agent</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaUserCheck className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Approver Reviews</p>
              <p className="text-xs text-gray-500">Pending Request</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaShare className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium">Super Agent Shares</p>
              <p className="text-xs text-gray-500">With Clients</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap relative ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.name}</span>
                    {tab.badge > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "allocate" && (
              <AllocatePinsModal
                onAllocationSuccess={handleAllocationSuccess}
              />
            )}
            {activeTab === "approvals" && (
              <PendingApprovals
                onApprovalSuccess={() => handleApprovalSuccess(true)}
              />
            )}
            {activeTab === "history" && <AllocationHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinAllocationSystem;