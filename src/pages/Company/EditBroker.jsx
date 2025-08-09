// src/pages/BrokerSignUp.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditBroker = () => {
  const { brokerId } = useParams();
  const navigate = useNavigate();
  
  // Mock data that matches your screenshot
  const mockBrokers = {
    'BR/20003': {
      id: 'BR/20003',
      name: 'ENDURANCE OTUMUDIA',
      address: '219, Herbert Macauley way, Yaba, Lagt',
      mobile: '2348073333517',
      contactName: 'STACO-MARINE',
      email: 'customer_services@stacopic.com',
      status: 'ENABLED',
      rate: '0.5',
      transactionLimit: '10.0000',
      password: 'endurance@2025S'
    },
    'D1/20003': {
      id: 'D1/20003',
      name: 'OMOLOLA OLAWORE',
      address: '123, Insurance Road, Lagos',
      mobile: '2348024242567',
      contactName: 'STACO, PLC',
      email: 'olawore@staco.com',
      status: 'ENABLED',
      rate: '0.6',
      transactionLimit: '15.0000',
      password: 'olawore@2025S'
    },
    'MODUPE.STACO': {
      id: 'MODUPE.STACO',
      name: 'MODUPE AJAYI CCS',
      address: '456, Marina Road, Lagos',
      mobile: '2348133472029',
      contactName: 'MODUPE',
      email: 'modupe@staco.com',
      status: 'DISABLED',
      rate: '0.4',
      transactionLimit: '5.0000',
      password: 'modupe@2024S'
    }
  };

  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    contactName: '',
    email: '',
    status: 'ENABLED',
    rate: '',
    transactionLimit: '',
    password: ''
  });

  /* 
  BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
  Uncomment and implement when backend is ready

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/brokers/${brokerId}`);
        setBroker(response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address,
          mobile: response.data.mobile,
          contactName: response.data.contactName,
          email: response.data.email,
          status: response.data.status,
          rate: response.data.rate,
          transactionLimit: response.data.transactionLimit,
          password: response.data.password
        });
      } catch (err) {
        console.error('Error fetching broker:', err);
        setError(err.response?.data?.message || 'Failed to fetch broker details');
      } finally {
        setLoading(false);
      }
    };

    fetchBroker();
  }, [brokerId]);
  */

  // Using mock data for now
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundBroker = mockBrokers[brokerId];
      if (foundBroker) {
        setBroker(foundBroker);
        setFormData({
          name: foundBroker.name,
          address: foundBroker.address,
          mobile: foundBroker.mobile,
          contactName: foundBroker.contactName,
          email: foundBroker.email,
          status: foundBroker.status,
          rate: foundBroker.rate,
          transactionLimit: foundBroker.transactionLimit,
          password: foundBroker.password
        });
      } else {
        setError('Broker not found');
      }
      setLoading(false);
    }, 500); // Simulate network delay
  }, [brokerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* 
    BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
    try {
      setLoading(true);
      await axios.put(`/api/brokers/${brokerId}`, formData);
      navigate('/company-dashboard/agents-brokers');
    } catch (err) {
      console.error('Error updating broker:', err);
      setError(err.response?.data?.message || 'Failed to update broker');
    } finally {
      setLoading(false);
    }
    */
    
    // Mock submission for now
    setLoading(true);
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setLoading(false);
      navigate('/agents-brokers');
    }, 1000);
  };

  if (loading && !broker) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading broker details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => navigate('/company-dashboard/agents-brokers')} 
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Back to Brokers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Broker Sign-Up</h1>
      <p className="text-gray-600 mb-6">Edit Broker's Detail here</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Broker Id</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md">
              {broker?.id || 'N/A'}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Broker Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Phone</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Broker Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="ENABLED">ENABLED</option>
              <option value="DISABLED">DISABLED</option>
            </select>
          </div>

          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Agreed Rate</label>
            <input
              type="number"
              step="0.01"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="transactionLimit" className="block text-sm font-medium text-gray-700">Transaction Limit</label>
            <input
              type="text"
              id="transactionLimit"
              name="transactionLimit"
              value={formData.transactionLimit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBroker;