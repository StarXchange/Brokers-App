// src/pages/AddBroker.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AddBroker = () => {
  // State for form fields - will be used by backend
  const [formData, setFormData] = useState({
    address: '',
    mobilePhone: '',
    contactName: '',
    email: '',
    brokerStatus: 'ENABLE',
    identityType: 'DIRECT',
    excess: '',
    agreedRole: 'ERP',
    transactionLimit: 'ERP',
    password: '',
    confirmPassword: ''
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    password: false,
    email: false
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (name === 'password' || name === 'email') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation - will be enhanced by backend
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, password: true }));
      return;
    }

    if (!formData.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }

    // Backend API call will go here
    try {
      /* 
      const response = await fetch('/api/brokers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      // Handle successful registration
      console.log('Broker created successfully');
      */
      
      console.log('Form data ready for backend:', formData);
      
    } catch (error) {
      console.error('Registration error:', error);
      // Backend will provide specific error messages
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">GLOBAL INSURANCE</h1>
        <h2 className="text-lg font-semibold text-gray-600">BUSINESS SOLUTION</h2>
        <div className="flex space-x-2 mt-2">
          {[1, 2, 3, 4, 5].map(num => (
            <span key={num} className="text-gray-400">({num})</span>
          ))}
        </div>
      </header>

      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        Broker Sign-Up
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter a new Broker's Detail here
      </p>

      <form onSubmit={handleSubmit}>
        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Broker Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                name="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          {/* Broker Details Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Broker Status</label>
              <select
                name="brokerStatus"
                value={formData.brokerStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="ENABLE">ENABLE</option>
                <option value="DISABLE">DISABLE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identity Type</label>
              <select
                name="identityType"
                value={formData.identityType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="DIRECT">DIRECT</option>
                <option value="INDIRECT">INDIRECT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excess</label>
              <input
                type="text"
                name="excess"
                value={formData.excess}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Rate</label>
  <div className="relative">
    <input
      type="number"
      name="agreedRate"  // Changed from agreedRole to agreedRate
      value={formData.agreedRate}
      onChange={handleChange}
      step="0.01"       // Allows decimal values
      min="0"          // Prevents negative numbers
      className="w-full p-2 border border-gray-300 rounded pr-8" // Right padding for symbol
      placeholder="0.00"
    />
    <span className="absolute right-3 top-2.5 text-gray-500">%</span> {/* Percentage symbol */}
  </div>
</div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Limit</label>
  <div className="relative">
    <input
      type="number"
      name="transactionLimit"
      value={formData.transactionLimit}
      onChange={handleChange}
      step="0.01" // Allows decimal values
      min="0"     // Prevents negative numbers
      className="w-full p-2 border border-gray-300 rounded pr-8" // Added padding for currency symbol
      placeholder="0.00"
    />
    <span className="absolute right-3 top-2.5 text-gray-500">₦</span> {/* Currency symbol */}
  </div>
</div>
          </div>
        </div>

        {/* Password Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Link 
            to="/company-dashboard/agents-brokers" 
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Go back
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Create Broker Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBroker;