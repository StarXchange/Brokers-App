import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function AddProposal() {
  const navigate = useNavigate();
  const [insuredType, setInsuredType] = useState('Individual');
  const [formData, setFormData] = useState({
    // Common fields
    address: '',
    email: '',
    phoneMobile: '',
    phoneNumber: '',
    transactionDate: '',
    classOfBusiness: '',
    startDate: '',
    endDate: '',
    locationId: '',
    premiumDue: '24000.00',
    notePayment: '',
    
    // Individual fields
    lastname: '',
    firstname: '',
    occupation: '',
    
    // Corporate fields
    companyName: '',
    registrationNumber: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedDocs, setScannedDocs] = useState({
    doc1: null,
    doc2: null,
    doc3: null,
    doc4: null
  });
  const [showPaymentSection] = useState(true);
  const [paymentAmount] = useState('24,000.00');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, docName) => {
    setScannedDocs(prev => ({ ...prev, [docName]: e.target.files[0] }));
  };

  const handleMakePayment = () => {
    navigate('/client-dashboard/make-payment', {
      state: { amount: paymentAmount }
    });
  };

  /* 
  BACKEND IMPLEMENTATION: Save as Draft
  const handleSaveProposal = async () => {
    try {
      setSaveLoading(true);
      const formDataToSend = new FormData();
      
      // Append all form data
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      }
      
      // Append scanned documents
      for (const key in scannedDocs) {
        if (scannedDocs[key]) {
          formDataToSend.append('documents', scannedDocs[key]);
        }
      }
      
      formDataToSend.append('status', 'draft');
      formDataToSend.append('insuredType', insuredType);

      const response = await axios.post('/api/proposals/save-draft', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        console.log('Draft saved successfully');
        navigate('/client-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save draft proposal');
      console.error('Error saving draft:', err);
    } finally {
      setSaveLoading(false);
    }
  };
  */

  // Mock save handler for frontend testing
  const handleSaveProposal = () => {
    setSaveLoading(true);
    setTimeout(() => {
      console.log('Proposal saved as draft (mock)', formData);
      setSaveLoading(false);
    }, 1000);
  };

  /* 
  BACKEND IMPLEMENTATION: Submit Proposal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // Append all form data
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      }
      
      // Append scanned documents
      for (const key in scannedDocs) {
        if (scannedDocs[key]) {
          formDataToSend.append('documents', scannedDocs[key]);
        }
      }
      
      formDataToSend.append('status', 'submitted');
      formDataToSend.append('insuredType', insuredType);

      const response = await axios.post('/api/proposals', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        navigate('/client-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Proposal submission failed');
      console.error('Error submitting proposal:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // Mock submit handler for frontend testing
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log('Proposal submitted (mock)', { ...formData, scannedDocs });
      setLoading(false);
      navigate('/client-dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add/Edit A Proposal</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Insured Details</h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="insuredType"
                value="Corporate"
                checked={insuredType === 'Corporate'}
                onChange={() => setInsuredType('Corporate')}
              />
              <span className="ml-2">Corporate</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="insuredType"
                value="Individual"
                checked={insuredType === 'Individual'}
                onChange={() => setInsuredType('Individual')}
              />
              <span className="ml-2">Individual</span>
            </label>
          </div>

          {insuredType === 'Individual' ? (
            <div className="space-y-4">
              {[
                { name: 'lastname', label: 'Lastname', type: 'text' },
                { name: 'firstname', label: 'Firstname', type: 'text' },
                { name: 'address', label: 'Address', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phoneMobile', label: 'Phone Mobile', type: 'tel' },
                { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
                { name: 'occupation', label: 'Occupation', type: 'text' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { name: 'companyName', label: 'Company name', type: 'text' },
                { name: 'registrationNumber', label: 'Registration number', type: 'text' },
                { name: 'address', label: 'Address', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phoneMobile', label: 'Phone Mobile', type: 'tel' },
                { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
                { name: 'industry', label: 'Industry', type: 'text' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Proposal Details</h3>
          <div className="space-y-4">
            {[
              { name: 'transactionDate', label: 'Transaction date', type: 'date' },
              { name: 'startDate', label: 'Start Date', type: 'date' },
              { name: 'endDate', label: 'End Date', type: 'date' },
              { name: 'locationId', label: 'Location ID', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class of business
              </label>
              <select
                name="classOfBusiness"
                value={formData.classOfBusiness}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">--Select Class of business--</option>
                <option value="General Insurance">General Insurance</option>
                <option value="Life Insurance">Life Insurance</option>
                <option value="Health Insurance">Health Insurance</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Scanned documents</h3>
          <div className="space-y-4">
            {['doc1', 'doc2', 'doc3', 'doc4'].map((doc, index) => (
              <div key={doc}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scanned Document {index + 1}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, doc)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Premium Due</h3>
          <div className="px-3 py-2 bg-gray-100 rounded-md">
            {formData.premiumDue}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Note Payment</h3>
          <textarea
            name="notePayment"
            value={formData.notePayment}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {/* Payment Section */}
        {showPaymentSection && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                    saveLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  onClick={handleSaveProposal}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'SAVE'}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleMakePayment}
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        )}
        
        
      </form>
    </div>
  );
}