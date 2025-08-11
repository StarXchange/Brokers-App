// src/pages/Broker/ViewProfile.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ViewProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  // Mock data structure
  const mockProfile = {
    brokerId: 'intieck',
    brokerName: 'intiec123',
    address: 'fdsdfdf',
    mobilePhone: '8043443445',
    contactName: '6455',
    email: 'DDSSD@YAHOO.COM',
    password: '1234'
  };

  // Simulate fetching profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would call your API here:
        // const response = await fetch('/api/broker/profile');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setProfile(mockProfile);
          setFormData(mockProfile);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load profile');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      
      // In a real app, you would call your API here:
      // const response = await fetch('/api/broker/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user.token}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new data
      setProfile(formData);
      setIsEditing(false);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to update profile');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mx-auto max-w-3xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">My Details</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">My Details View</h3>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Broker Id
                </label>
                <input
                  type="text"
                  name="brokerId"
                  value={formData.brokerId || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Broker Name
                </label>
                <input
                  type="text"
                  name="brokerName"
                  value={formData.brokerName || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  name="mobilePhone"
                  value={formData.mobilePhone || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
             <div className="mb-4">
  <label className="block text-gray-700 text-sm font-medium mb-2">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password || ''}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
      )}
    </button>
  </div>
</div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'UPDATE'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Broker Id</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.brokerId}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Broker Name</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.brokerName}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Address</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.address}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mobile Phone</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.mobilePhone}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Contact Name</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.contactName}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Email Address</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.email}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Password</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">••••••••</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Link 
                to="/brokers-dashboard" 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Go Back
              </Link>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                EDIT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;