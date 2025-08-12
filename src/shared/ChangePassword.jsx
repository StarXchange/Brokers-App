import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const ChangePassword = ({ userType = 'company', userId = 'STACO-MARINE' }) => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password don't match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Backend implementation would go here
      await updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        userType,
        userId
      });
      
      // On success, navigate back based on user type
      let redirectPath;
      switch(userType) {
        case 'broker':
          redirectPath = '/brokers-dashboard';
          break;
        case 'client':
          redirectPath = '/client-dashboard';
          break;
        default: // company
          redirectPath = '/company-dashboard/certificates';
      }
      navigate(redirectPath);
      
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardPath = () => {
    switch(userType) {
      case 'broker':
        return '/brokers-dashboard';
      case 'client':
        return '/client-dashboard';
      default: // company
        return '/company-dashboard/certificates';
    }
  };

  const getUserLabel = () => {
    switch(userType) {
      case 'broker':
        return 'Broker';
      case 'client':
        return 'Client';
      default:
        return 'My';
    }
  };

  const getIdLabel = () => {
    switch(userType) {
      case 'broker':
        return 'Broker Id';
      case 'client':
        return 'Client Id';
      default:
        return 'Company Id';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        {getUserLabel()} Login Password
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Change Password</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                {getIdLabel()}
              </label>
              <div className="p-2 bg-gray-100 rounded border border-gray-300">
                {userId}
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
                minLength="8"
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
                minLength="8"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between">
              <Link 
                to={getDashboardPath()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Go Back
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'UPDATING...' : 'UPDATE'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;