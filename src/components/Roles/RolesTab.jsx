import React, { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const RolesTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg">
          <FiPlus className="mr-2" />
          Add New Role
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3">Role Name</th>
                <th scope="col" className="px-4 py-3">Description</th>
                <th scope="col" className="px-4 py-3">Users</th>
                <th scope="col" className="px-4 py-3">Permissions</th>
                <th scope="col" className="px-4 py-3">Last Modified</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role, index) => (
                  <tr key={role.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{role.name}</td>
                    <td className="px-4 py-3">{role.description}</td>
                    <td className="px-4 py-3">{role.userCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission, i) => (
                          <span key={i} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{role.lastModified}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FiEye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <FiEdit2 size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination for roles */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-t border-gray-200">
          <span className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">0</span> to <span className="font-medium">0</span> of <span className="font-medium">0</span> Roles
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesTab;