// src/pages/Client/MakePayment.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MakePayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Get payment details from navigation state
  const amount = state?.amount || '24,000.00';
  const [paymentDetails, setPaymentDetails] = useState({
    name: 'Intteck Global Systems',
    email: 'oseniwasiu@yahoo.com',
    phone: '08023140962',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  /* 
  BACKEND IMPLEMENTATION: Process Payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/payments/process', {
        amount: parseFloat(amount.replace(/,/g, '')),
        currency: 'NGN',
        customerDetails: {
          name: paymentDetails.name,
          email: paymentDetails.email,
          phone: paymentDetails.phone
        },
        paymentMethod: paymentDetails.paymentMethod,
        cardDetails: {
          number: paymentDetails.cardNumber,
          expiry: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv
        }
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSuccess(true);
        // Optionally redirect after successful payment
        setTimeout(() => navigate('/client-dashboard'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // Mock submit handler for frontend development
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log('Payment processed (mock)', {
        amount,
        paymentDetails
      });
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Make Payment</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success ? (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Payment processed successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Names:</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md">
                {paymentDetails.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md">
                {amount}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md">
                {paymentDetails.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md">
                {paymentDetails.phone}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={paymentDetails.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="ussd">USSD</option>
            </select>
          </div>

          {paymentDetails.paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentDetails.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/client-dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MakePayment;