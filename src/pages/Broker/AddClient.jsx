import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    address: "",
    mobilePhone: "",
    contactName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* 
  BACKEND IMPLEMENTATION (CREATE CLIENT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/clients', formData);
      navigate('/company-dashboard/client-management');
    } catch (err) {
      setError(err.response?.data?.message || 'Client creation failed');
    } finally {
      setLoading(false);
    }
  };
  */

  // Mock submit - Remove when backend is connected
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/company-dashboard/client-management");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Client Sign-Up
      </h2>
      <p className="text-gray-600 mb-6">Enter a new Client's Detail here</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "clientId", label: "Client Id", type: "text" },
          { name: "clientName", label: "Client Name", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "mobilePhone", label: "Mobile Phone", type: "tel" },
          { name: "contactName", label: "Contact Name", type: "text" },
          { name: "email", label: "Email Address", type: "email" },
          { name: "password", label: "Password", type: "password" },
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

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "SUBMIT"}
          </button>

          <Link
            to="/brokers-dashboard/client-management"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </form>
    </div>
  );
}
