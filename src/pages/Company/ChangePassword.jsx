// src/pages/ChangePassword.jsx
import { Link } from 'react-router-dom';
import {useState} from "react"

const ChangePassword = () => {
  // State for form fields - will be used when backend is implemented
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This will be implemented by backend
    console.log('Password change submitted:', formData);
    // Add form validation and API call here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Change My Login Password</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Change Password</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Broker Id
              </label>
              <div className="p-2 bg-gray-100 rounded border border-gray-300">
                STACO-MARINE
              </div>
            </div>
            
            <div></div> {/* Empty div for grid alignment */}
            
            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-medium mb-2">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between">
              <Link 
                to="/company-dashboard/certificates" // Goes back to parent route
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Go Back
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                UPDATE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;