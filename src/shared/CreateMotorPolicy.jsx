import React, { useState } from 'react';
import axios from 'axios';

const CreateMotorPolicy = () => {
  const [formData, setFormData] = useState({
    certificateNo: '',
    insuredName: '',
    email: '',
    address: '',
    transactionDate: '',
    vehicleRegNum: '',
    vehicleMake: '',
    engineNum: '',
    vehicleBrand: '',
    startDate: '',
    engineCapacity: '',
    sumInsured: '',
    mobilePhone: '',
    policyNo: '',
    vehicleType: '',
    vehicleColor: '',
    chassisNum: '',
    vehicleYear: '',
    expiryDate: '',
    grossPremium: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('https://your-api-endpoint.com/motor-policies', formData);
      
      if (response.status === 200 || response.status === 201) {
        setMessage('Policy created successfully!');
        setIsError(false);
        // Reset form after successful submission
        setFormData({
          certificateNo: '',
          insuredName: '',
          email: '',
          address: '',
          transactionDate: '',
          vehicleRegNum: '',
          vehicleMake: '',
          engineNum: '',
          vehicleBrand: '',
          startDate: '',
          engineCapacity: '',
          sumInsured: '',
          mobilePhone: '',
          policyNo: '',
          vehicleType: '',
          vehicleColor: '',
          chassisNum: '',
          vehicleYear: '',
          expiryDate: '',
          grossPremium: ''
        });
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      setMessage('Failed to create policy. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill form with sample data (for demonstration)
  const prefillForm = () => {
    setFormData({
      certificateNo: '8000293612',
      insuredName: 'AGHEDO PAUL OSAKHUY',
      email: 'JOIN@GMAIL.COM',
      address: 'BEHIM',
      transactionDate: '2025-08-29',
      vehicleRegNum: 'BEN807TA',
      vehicleMake: 'MERCEDES BENZ',
      engineNum: 'NIL',
      vehicleBrand: 'C-CLASS',
      startDate: '2025-08-29',
      engineCapacity: '',
      sumInsured: '3000000.00',
      mobilePhone: '980',
      policyNo: 'STC/2025/8000293612',
      vehicleType: 'Saloon Car',
      vehicleColor: 'ASH',
      chassisNum: 'WDB2020821F643921',
      vehicleYear: '2005',
      expiryDate: '2026-08-29',
      grossPremium: '15100.00'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Motor Third Party Insurance
              </h1>
              <p className="text-gray-600 font-bold text-sm md:text-base">
                Create a new motor insurance policy
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Display */}
        {message && (
          <div className="mb-4 md:mb-6">
            <div className={`${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} border px-4 py-3 md:px-6 md:py-4 rounded-lg`}>
              <div className="flex items-center">
                {isError ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm md:text-base">{message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Content */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                Third Party Motor Details
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Certificate No */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Certificate No
                  </label>
                  <input
                    type="text"
                    name="certificateNo"
                    value={formData.certificateNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Insured Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Insured Name
                  </label>
                  <input
                    type="text"
                    name="insuredName"
                    value={formData.insuredName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Transaction Date */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Vehicle Registration Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    name="vehicleRegNum"
                    value={formData.vehicleRegNum}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Vehicle Make */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Make
                  </label>
                  <input
                    type="text"
                    name="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Engine Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Engine Number
                  </label>
                  <input
                    type="text"
                    name="engineNum"
                    value={formData.engineNum}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Vehicle Brand */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Brand
                  </label>
                  <input
                    type="text"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Engine Capacity */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Engine Capacity
                  </label>
                  <input
                    type="text"
                    name="engineCapacity"
                    value={formData.engineCapacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Sum Insured */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Sum Insured
                  </label>
                  <input
                    type="number"
                    name="sumInsured"
                    value={formData.sumInsured}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                    step="0.01"
                  />
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Policy Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    name="policyNo"
                    value={formData.policyNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Saloon Car">Saloon Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>

                {/* Vehicle Color */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Chassis Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Chassis Number
                  </label>
                  <input
                    type="text"
                    name="chassisNum"
                    value={formData.chassisNum}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Vehicle Year */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Year
                  </label>
                  <input
                    type="number"
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                    min="1900"
                    max="2030"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Gross Premium */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Gross Premium
                  </label>
                  <input
                    type="number"
                    name="grossPremium"
                    value={formData.grossPremium}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                    step="0.01"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        SUBMIT
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMotorPolicy;