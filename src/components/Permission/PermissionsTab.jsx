import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiSave, FiRefreshCw } from 'react-icons/fi';

const PermissionsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const permissionsPerPage = 10;

  // Fetch permissions from API
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      //check user role first
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error('User data not found.')
      }

      // Decrypt user data (if encrypted)
    const decryptedUser = JSON.parse(userData); // Or decrypt if encrypted
    const userRole = decryptedUser.role || decryptedUser.userType;
    
    console.log('User role:', userRole);
    
    if (userRole !== 'Admin' && userRole !== 'Administrator') {
      throw new Error('Access denied. Admin privileges required to view permissions.');
    }

    
      const token = localStorage.getItem('token'); // Adjust key as necessary

      if (!token) {
        throw new Error('No authentication token found.');
      }


      const response = await fetch('https://gibsbrokersapi.newgibsonline.com/api/Auth/permissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // Add authentication headers if required
          // 'Authorization': 'Bearer your-token-here'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPermissions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission =>
    permission.permissionName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.module?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.action?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPermissions.length / permissionsPerPage);
  const currentPermissions = filteredPermissions.slice(
    (currentPage - 1) * permissionsPerPage,
    currentPage * permissionsPerPage
  );

  // Initial permission form state based on your schema
  const initialPermissionState = {
    permissionName: "",
    description: "",
    module: "",
    action: "",
    endpoint: ""
  };

  const [permissionForm, setPermissionForm] = useState(initialPermissionState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPermissionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found');
    }

      const url = 'https://gibsbrokersapi.newgibsonline.com/api/Auth/permissions';
      const method = 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // 'Authorization': 'Bearer your-token-here'
        },
        body: JSON.stringify(permissionForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the permission list after successful operation
      fetchPermissions();
      closeForm();
    } catch (err) {
      setError(err.message);
      console.error('Error saving permission:', err);
    }
  };

  const handleDelete = async (permissionId) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found');
    }
      const response = await fetch(`https://gibsbrokersapi.newgibsonline.com/api/Auth/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
          // 'Authorization': 'Bearer your-token-here'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the permission list after successful deletion
      fetchPermissions();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting permission:', err);
    }
  };

  const handleEdit = (permission) => {
    setPermissionForm(permission);
    setEditingPermission(permission);
    setShowPermissionForm(true);
  };

  const handleView = (permission) => {
    setPermissionForm(permission);
    setEditingPermission({...permission, id: 0});
    setShowPermissionForm(true);
  };

  const closeForm = () => {
    setShowPermissionForm(false);
    setPermissionForm(initialPermissionState);
    setEditingPermission(null);
  };

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
          <button onClick={() => setError(null)} className="float-right font-bold">
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
            placeholder="Search by permission name, module, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg"
            onClick={fetchPermissions}
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg"
            onClick={() => setShowPermissionForm(true)}
            disabled={loading}
          >
            <FiPlus className="mr-2" />
            Add New Permission
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Permissions Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3">S/N</th>
                  <th scope="col" className="px-4 py-3">Permission Name</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                  <th scope="col" className="px-4 py-3">Module</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                  <th scope="col" className="px-4 py-3">Endpoint</th>
                  <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPermissions.length > 0 ? (
                  currentPermissions.map((permission, index) => (
                    <tr key={permission.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{(currentPage - 1) * permissionsPerPage + index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{permission.permissionName}</td>
                      <td className="px-4 py-3">{permission.description}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {permission.module}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          permission.action === 'create' ? 'bg-green-100 text-green-800' :
                          permission.action === 'read' ? 'bg-blue-100 text-blue-800' :
                          permission.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                          permission.action === 'delete' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {permission.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{permission.endpoint}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleView(permission)}
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleEdit(permission)}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(permission.id)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      {searchQuery ? 'No permissions match your search' : 'No permissions found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer with Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{(currentPage - 1) * permissionsPerPage + 1}</span> to <span className="font-medium">
                {Math.min(currentPage * permissionsPerPage, filteredPermissions.length)}
              </span> of <span className="font-medium">{filteredPermissions.length}</span> Permissions
            </span>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Form Modal */}
      {showPermissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingPermission ? (editingPermission.id ? 'Edit Permission' : 'View Permission') : 'Add New Permission'}
              </h3>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permission Name *</label>
                  <input
                    type="text"
                    name="permissionName"
                    value={permissionForm.permissionName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingPermission && !editingPermission.id}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={permissionForm.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={editingPermission && !editingPermission.id}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module *</label>
                  <input
                    type="text"
                    name="module"
                    value={permissionForm.module}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingPermission && !editingPermission.id}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action *</label>
                  <select
                    name="action"
                    value={permissionForm.action}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingPermission && !editingPermission.id}
                  >
                    <option value="">Select Action</option>
                    <option value="create">Create</option>
                    <option value="read">Read</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="manage">Manage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint *</label>
                  <input
                    type="text"
                    name="endpoint"
                    value={permissionForm.endpoint}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="/api/resource/action"
                    disabled={editingPermission && !editingPermission.id}
                  />
                </div>
              </div>
              
              {(!editingPermission || editingPermission.id) && (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <FiSave className="mr-2" />
                    {editingPermission ? 'Update Permission' : 'Create Permission'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsTab;