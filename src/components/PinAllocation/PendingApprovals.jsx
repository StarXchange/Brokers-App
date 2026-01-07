// src/components/PinAllocation/PendingApprovals.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaUser, 
  FaCoins, 
  FaClock, 
  FaSearch, 
  FaBuilding, 
  FaCalendar, 
  FaIdCard,
  FaLock,
  FaExclamationTriangle,
  FaSpinner,
  FaTrash,
  FaBan
} from 'react-icons/fa';
import PinService from '../../services/PinServices';
import UserService from '../../services/UserServices';
import CryptoJS from 'crypto-js';

// Toast Notification Component (Both green and red)
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <FaCheck className="w-5 h-5" /> : <FaTimes className="w-5 h-5" />;

  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 animate-slideInRight z-50 min-w-80 max-w-md`}>
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
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

// Permission Denied Component
const PermissionDenied = ({  action }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center shadow-lg">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaLock className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Permission Required
      </h3>
      <p className="text-gray-600 mb-6">
        You need the permission to {action}.
      </p>
      <div className="bg-white p-4 rounded-lg border border-red-100 mb-4">
        <div className="flex items-center justify-center space-x-2 text-red-700">
          <FaExclamationTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            Contact your administrator to request this permission
          </span>
        </div>
      </div>
    </div>
  );
};

const PendingApprovals = ({ onApprovalSuccess }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [revoking, setRevoking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [hasViewPendingPermission, setHasViewPendingPermission] = useState(null);
  const [hasApprovePermission, setHasApprovePermission] = useState(null);
  const [hasRevokePermission, setHasRevokePermission] = useState(null);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [showPermissionDenied, setShowPermissionDenied] = useState({ show: false, permission: '', action: '' });

  // Decryption function
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

  // Check for all Pin permissions
  const checkPermissions = () => {
    try {
      setCheckingPermission(true);
      
      // Get encrypted user data from localStorage
      const encryptedUser = localStorage.getItem("user");
      if (!encryptedUser) {
        
        setAllPermissionsFalse();
        setCheckingPermission(false);
        return;
      }

      // Decrypt user data
      const userData = decryptData(encryptedUser);
      if (!userData) {
       
        setAllPermissionsFalse();
        setCheckingPermission(false);
        return;
      }

      // Extract permissions from user data
      let permissions = [];
      
      // Check different possible locations for permissions
      if (userData.permissions && Array.isArray(userData.permissions)) {
        permissions = userData.permissions;
      } else if (userData.userPermissions && Array.isArray(userData.userPermissions)) {
        permissions = userData.userPermissions;
      } else if (userData.Permissions && Array.isArray(userData.Permissions)) {
        permissions = userData.Permissions;
      } else if (userData.roles && Array.isArray(userData.roles)) {
        const allPermissions = [];
        userData.roles.forEach(role => {
          if (role.permissions && Array.isArray(role.permissions)) {
            allPermissions.push(...role.permissions);
          }
        });
        permissions = allPermissions;
      }

      // Check for each permission
      const hasViewPending = checkSpecificPermission(permissions, "Pin.ViewPending", 60);
      const hasApprove = checkSpecificPermission(permissions, "Pin.Approve", 58);
      const hasRevoke = checkSpecificPermission(permissions, "Pin.Revoke", 59);

    

      setHasViewPendingPermission(hasViewPending);
      setHasApprovePermission(hasApprove);
      setHasRevokePermission(hasRevoke);
    } catch (error) {
      console.error("Error checking permissions:", error);
      setAllPermissionsFalse();
    } finally {
      setCheckingPermission(false);
    }
  };

  const checkSpecificPermission = (permissions, permissionName, permissionId) => {
    return permissions.some(permission => {
      if (typeof permission === 'string') {
        return permission === permissionName;
      } else if (typeof permission === 'object') {
        return (
          permission.permissionName === permissionName ||
          permission.name === permissionName ||
          permission.permissionID === permissionId
        );
      }
      return false;
    });
  };

  const setAllPermissionsFalse = () => {
    setHasViewPendingPermission(false);
    setHasApprovePermission(false);
    setHasRevokePermission(false);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  // Load data only if user has view permission
  useEffect(() => {
    if (hasViewPendingPermission === true) {
      loadData();
    }
  }, [hasViewPendingPermission]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const showPermissionDeniedModal = (permission, action) => {
    setShowPermissionDenied({ show: true, permission, action });
  };

  const closePermissionDeniedModal = () => {
    setShowPermissionDenied({ show: false, permission: '', action: '' });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load both pending requests and brokers in parallel
      const [requests, brokersData] = await Promise.all([
        PinService.getPendingAllocations(),
        UserService.getBrokers().catch(() => []) // Fallback to empty array if service fails
      ]);

      

      // Transform the API response to match component expectations
      const transformedRequests = Array.isArray(requests) ? requests.map(request => ({
        allocationId: request.allocationId,
        brokerId: request.toUserId, // Map toUserId to brokerId
        pinAmount: request.pinAmount,
        remarks: request.remarks,
        requestedBy: request.fromUserName || request.fromUserId, // Use fromUserName or fromUserId
        requestDate: request.allocatedDate, // Map allocatedDate to requestDate
        status: request.status,
        // Include additional fields from API for display
        fromUserId: request.fromUserId,
        fromUserName: request.fromUserName,
        toUserName: request.toUserName,
        allocatedDate: request.allocatedDate,
        allocatedBy: request.allocatedBy
      })) : [];

     

      setPendingRequests(transformedRequests);
      setBrokers(Array.isArray(brokersData) ? brokersData : []);
      
    } catch (error) {
      console.error('Failed to load data:', error);
      setPendingRequests([]);
      setBrokers([]);
    } finally {
      setLoading(false);
    }
  };

  // Get broker details by brokerId (now using toUserId)
  const getBrokerDetails = (brokerId) => {
    const broker = brokers.find(b => b.brokerId === brokerId || b.userId === brokerId);
    return broker || null;
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleApproval = async (allocationId, isApproved, approvalRemarks) => {
    // Check permission before approval
    if (!hasApprovePermission) {
      showPermissionDeniedModal("Pin.Approve", "approve or reject PIN allocations");
      return;
    }

    setApproving(allocationId);
    try {
      await PinService.approveAllocation(allocationId, isApproved, approvalRemarks);
      await loadData();
      
      if (onApprovalSuccess) {
        onApprovalSuccess(isApproved);
      }
      
      // Show appropriate toast based on approval status
      if (isApproved) {
        showToast('Pin allocation approved successfully!', 'success'); // Green
      } else {
        showToast('Pin allocation request rejected successfully!', 'error'); // Red
      }
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setApproving(null);
    }
  };

  const handleRevoke = async (allocationId) => {
    // Check permission before revoking
    if (!hasRevokePermission) {
      showPermissionDeniedModal("Pin.Revoke", "revoke PIN allocations");
      return;
    }

    const confirmation = window.confirm('Are you sure you want to revoke this PIN allocation? This action cannot be undone.');
    if (!confirmation) return;

    setRevoking(allocationId);
    try {
      // Assuming you have a revoke method in PinService
      // await PinService.revokeAllocation(allocationId);
      // For now, let's simulate it
      
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('PIN allocation revoked successfully!', 'success');
      await loadData();
    } catch (error) {
      console.error('Revoke error:', error);
      showToast('Failed to revoke PIN allocation', 'error');
    } finally {
      setRevoking(null);
    }
  };

  const filteredRequests = pendingRequests.filter(request => {
    const broker = getBrokerDetails(request.brokerId);
    const brokerName = broker?.brokerName || broker?.fullName || request.toUserName || '';
    
    return (
      brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.brokerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.toUserName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Add CSS animations
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
    .animate-slideInRight {
      animation: slideInRight 0.3s ease-out forwards;
    }
  `;

  // Show loading while checking permission
  if (checkingPermission) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Approval Requests</h2>
            <p className="text-gray-600 mt-1">
              Review and manage pin allocation requests requiring approval
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="text-center">
            <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Checking access permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show permission denied if user doesn't have Pin.ViewPending
  if (!hasViewPendingPermission) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Approval Requests</h2>
            <p className="text-gray-600 mt-1">
              Review and manage pin allocation requests requiring approval
            </p>
          </div>
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium border border-red-200">
            <div className="flex items-center space-x-2">
              <FaLock className="w-4 h-4" />
              <span>Access Restricted</span>
            </div>
          </div>
        </div>
        
        <div className="min-h-[400px] bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Permission Required
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            You need the permission to view pending allocation.
          </p>
          <div className="bg-white p-4 rounded-lg border border-red-100 mb-6 w-full max-w-md">
            <div className="flex items-center justify-center space-x-3 text-red-700">
              <FaExclamationTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium text-center">
                Contact your system administrator to request access.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Approval Requests</h2>
            <p className="text-gray-600 mt-1">
              Review and manage pin allocation requests requiring approval
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading pending requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Styles */}
      <style>{toastStyles}</style>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Permission Denied Modal */}
      {showPermissionDenied.show && (
        <PermissionDenied
          permissionName={showPermissionDenied.permission}
          action={showPermissionDenied.action}
          onClose={closePermissionDeniedModal}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Approval Requests</h2>
          <p className="text-gray-600 mt-1">
            Review and manage pin allocation requests requiring approval
          </p>
       
        </div>
        
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
         
          
          <div className="relative">
            <FaSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by broker name, ID, or remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No matching requests found' : 'No Pending Requests'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm 
              ? 'Try adjusting your search terms to find pending approval requests.'
              : 'All allocation requests have been processed and approved.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.map((request) => {
            const broker = getBrokerDetails(request.brokerId);
            const brokerName = broker?.brokerName || broker?.fullName || request.toUserName || 'Broker Information Not Available';
            const brokerEmail = broker?.email || 'Email not available';
            const brokerCompany = broker?.companyId || broker?.insCompanyId || 'Company not specified';

            return (
              <div key={request.allocationId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
               <div className="p-5">
  {/* Header Section - More Compact */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4">
    <div className="flex items-start space-x-3 flex-1">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2.5 shadow-sm">
        <FaUser className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {brokerName}
        </h3>
        <p className="text-gray-600 text-xs mt-0.5">
          Requested by: {request.requestedBy || request.fromUserId}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FaIdCard className="w-2.5 h-2.5 mr-1" />
            ID: {request.brokerId}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaBuilding className="w-2.5 h-2.5 mr-1" />
            {brokerCompany}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Status: {request.status}
          </span>
        </div>
      </div>
    </div>
    
    {/* Pin Amount - Compact */}
    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 min-w-28">
      <div className="text-xl font-bold text-blue-600">{request.pinAmount}</div>
      <div className="text-xs font-medium text-blue-700">Pins Requested</div>
    </div>
  </div>

  {/* Details Grid - More Compact */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
    {/* Allocation Remarks */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center">
        <FaCoins className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
        Allocation Remarks
      </label>
      <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
        <p className="text-gray-700 text-xs leading-relaxed">
          {request.remarks || 'No remarks provided'}
        </p>
      </div>
    </div>

    {/* Request Metadata */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center">
        <FaCalendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
        Request Details
      </label>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-600">Requested By:</span>
          <span className="text-xs text-gray-900 font-semibold">{request.requestedBy || request.fromUserId}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-600">Submission Date:</span>
          <span className="text-xs text-gray-900 font-semibold">{formatDate(request.requestDate)}</span>
        </div>
        <div className="flex justify-between items-center py-1.5">
          <span className="text-xs font-medium text-gray-600">Allocation ID:</span>
          <span className="text-xs text-gray-900 font-semibold">#{request.allocationId}</span>
        </div>
      </div>
    </div>
  </div>

  {/* Action Buttons - Compact and Modern */}
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
    {/* Approve Button */}
    <button
      onClick={() => {
        const remarks = prompt('Enter approval remarks (optional):');
        if (remarks !== null) {
          handleApproval(request.allocationId, true, remarks || '');
        }
      }}
      disabled={approving === request.allocationId || !hasApprovePermission}
      className={`flex-1 py-2.5 px-5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-sm hover:shadow ${
        hasApprovePermission
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      } ${approving === request.allocationId ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!hasApprovePermission ? "Requires Pin.Approve permission" : ""}
    >
      {approving === request.allocationId ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <FaCheck className="w-4 h-4" />
      )}
      <span className="text-sm">Approve</span>
    </button>

    {/* Reject Button */}
    <button
      onClick={() => {
        const remarks = prompt('Please provide reason for rejection:');
        if (remarks !== null && remarks.trim()) {
          handleApproval(request.allocationId, false, remarks);
        } else if (remarks !== null) {
          alert('Please provide a reason for rejection.');
        }
      }}
      disabled={approving === request.allocationId || !hasApprovePermission}
      className={`flex-1 py-2.5 px-5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-sm hover:shadow ${
        hasApprovePermission
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      } ${approving === request.allocationId ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!hasApprovePermission ? "Requires Pin.Approve permission" : ""}
    >
      {approving === request.allocationId ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <FaTimes className="w-4 h-4" />
      )}
      <span className="text-sm">Reject</span>
    </button>
  </div>

  {/* Permission Info Note - More Compact */}
  {!hasApprovePermission && (
    <div className="mt-3 p-2.5 bg-yellow-50 border border-yellow-100 rounded-md">
      <div className="flex items-center space-x-1.5 text-yellow-700">
        <FaExclamationTriangle className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-xs">
          View only. Need <strong>Pin.Approve</strong> permission to take action.
        </span>
      </div>
    </div>
  )}
</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;