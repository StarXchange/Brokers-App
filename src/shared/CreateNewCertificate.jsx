import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const API_BASE_URL = '/api';

const CreateNewCertificate = ({ viewMode = false, userRole = 'broker' }) => {
  const { user, token } = useAuth();
  const { brokerId, year, month, certId } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0]; // "2024-01-15"
  const insCompanyId ='00000000-0000-0000-0000-000000000001';
  // // Add the isValidGuid function definition FIRST
  const isValidGuid = (guid) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid);
  };

  
  const [formData, setFormData] = useState({
    certificateNo: viewMode ? '' : 'AUTO',
    insuredName: '',
    address: '',
    transactionDate:today,
    vesselName: 'AMY APPROVED STEAMER(S) AS PER',
    subject: '',
    typeOfCover: "ICC 'A'",
    voyageFrom: '',
    origin: '',
    email: '',
    mobilePhone: '',
    policyNo: '',
    conveyance: '',
    tinNo: '',
    destination: '',
    packagingType: '',
    proformaInvNo: '',
    containerized: false,
    interestInsured: '',
    natureOfGoods: '',
    paymentType: 'Credit Note',
    terms: '',
    loading: '100%',
    currencyType: '',
    sumInsured: '0.0',
    clausesType: '',
    rate: '0.0',
    conditionsClauses: '',
    lendingTitle: '',
    legendTitle: '',
    date: '',
    lendingAddress: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const getToken = () => {
  return localStorage.getItem('token')
};

  const fetchCertificateData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/Certificates/${certId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Map API response to form fields
      const apiData = response.data;
      setFormData({
        certificateNo: apiData.certNo,
        insuredName: apiData.insuredName,
        address: apiData.field6 || '',
        transactionDate: apiData.transDate,
        vesselName: apiData.field1 || 'AMY APPROVED STEAMER(S) AS PER',
        subject: apiData.field9 || '',
        typeOfCover: apiData.perDesc || "ICC 'A'",
        origin: apiData.fromDesc || '',
        email: apiData.field4 || '',
        mobilePhone: apiData.field5 || '',
        policyNo: apiData.policyNo,
        conveyance: apiData.field2 || '',
        tinNo: apiData.field7 || '',
        destination: apiData.toDesc || '',
        packagingType: apiData.field7 || '',
        proformaInvNo: apiData.formMno || '',
        containerized: apiData.field8 === 'Yes',
        interestInsured: apiData.interestDesc || '',
        natureOfGoods: apiData.field3 || '',
        paymentType: apiData.field10 || 'Credit Note',
        terms: apiData.field9 || '',
        loading: '100%',
        currencyType: apiData.field10 || '',
        sumInsured: apiData.insuredValue?.toString() || '0.0',
        clausesType: apiData.field9 || '',
        rate: apiData.rate?.toString() || '0.0',
        conditionsClauses: apiData.remarks || '',
        lendingTitle: apiData.field101 || '',
        legendTitle: apiData.field102 || '',
        date: apiData.transDate,
        lendingAddress: apiData.field103 || ''
      });
    
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      } else if (err.response?.status === 409) {
        // Handle conflict error specifically
        setError('Conflict error: This may be due to duplicate data or invalid references. Please check your entries.');
        console.error('Conflict details:', err.response?.data);
      } else if (err.response?.status === 400) {
        // Show validation errors
        const validationErrors = err.response?.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else {
          setError(err.response?.data?.title || 'Invalid request data');
        }
      } else {
        setError(err.response?.data?.message || 'Failed to create certificate');
      }
    }
  }

  useEffect(() => {
    if (viewMode && certId) {
      fetchCertificateData();
    }
  }, [viewMode, certId]);

  const handleChange = (e) => {
    if (viewMode) return;
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewMode) return;

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

       // Check if user object exists and has the required properties
    if (!user) {
      setError('User not authenticated. Please login again.');
      setLoading(false);
      return;
    }

        // Use actual user IDs instead of test IDs
      const brokerId = user.brokerId;
      const clientId = user.clientId;

  // Check if IDs exist and are valid GUIDs
    if (!brokerId || !clientId) {
      setError('User account missing required information. Please contact administrator.');
      setLoading(false);
      return;
    }

    if (!isValidGuid(brokerId) || !isValidGuid(clientId)) {
      setError('Invalid user IDs. Please contact administrator.');
      setLoading(false);
      return;
    }

      const apiPayload = {
        certNo: formData.certificateNo === 'AUTO' ? '' : formData.certificateNo,
        brokerId: brokerId, 
        clientId: clientId, 
        insCompanyId: user.insCompanyId || insCompanyId, // Valid GUID
        insuredName: formData.insuredName,
        transDate: today,
        policyNo: formData.policyNo,
        perDesc: formData.typeOfCover,
        fromDesc: formData.origin,
        toDesc: formData.destination,
        interestDesc: formData.interestInsured,
        rate: parseFloat(formData.rate) || 0,
        insuredValue: parseFloat(formData.sumInsured) || 0,
        grossPrenium: (parseFloat(formData.sumInsured) * (parseFloat(formData.rate)/100)) || 0,
        formMno: formData.proformaInvNo,
        submitDate: today,
        remarks: formData.conditionsClauses,
        field1: formData.vesselName,
        field2: formData.conveyance,
        field3: formData.natureOfGoods,
        field4: formData.email,
        field5: formData.mobilePhone,
        field6: formData.address,
        field7: formData.tinNo,
        field8: formData.containerized ? 'Yes' : 'No',
        field9: formData.terms,
        field10: formData.currencyType,
        field101: formData.lendingTitle,
        field102: formData.legendTitle,
        field103: formData.lendingAddress,
        a1: 0,
        a2: 0,
        a3: 0,
        a4: 0,
        a5: 0,
        tag: "certificate",
        field104: "",
        field105: "",
        field106: "",
        field107: "",
        field108: "",
        field109: ""
      };

      await axios.post(`${API_BASE_URL}/Certificates`, apiPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

       console.log('Certificate created successfully:', response.data);

      const redirectPath = getCertificatesPath();
      navigate(redirectPath, {
        state: { success: 'Certificate created successfully!' }
      });
     } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        // navigate('/login');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid request data');
      }  // Show detailed error message from server
      const errorMessage = err.response?.data || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to create certificate';
      console.error('Full error details:', err.response?.data);
      setError(`Server error: ${JSON.stringify(errorMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  const getCertificatesPath = () => {
    switch(userRole) {
      case 'broker': return '/brokers-dashboard/certificates';
      case 'client': return '/client-dashboard/certificates';
      default: return '/';
    }
  };

  const renderField = (label, name, type = 'text', options = null) => {
    if (viewMode) {
      return (
        <div className="flex items-center mb-3">
          <span className="w-48 font-medium text-gray-700">{label}:</span>
          <span className="text-gray-900">{formData[name] || 'N/A'}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center mb-3">
        <label className="w-48 font-medium text-gray-700">{label}:</label>
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <input
            type="checkbox"
            name={name}
            checked={formData[name]}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        ) : type === 'radio' ? (
          <div className="flex space-x-4">
            {options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={!viewMode && name === 'insuredName'}
          />
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Marine Certificate {viewMode ? 'Details' : 'Setup'}
      </h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {viewMode ? (
        <div className="space-y-6">
          {/* Certificate Details Section */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Certificate Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Certificate No:</span>
                <span className="text-gray-900 font-semibold">{formData.certificateNo}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Insured Name:</span>
                <span className="text-gray-900">{formData.insuredName}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Address:</span>
                <span className="text-gray-900">{formData.address}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Transaction Date:</span>
                <span className="text-gray-900">{formData.transactionDate}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Vessel Name:</span>
                <span className="text-gray-900">{formData.vesselName}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Type of Cover:</span>
                <span className="text-gray-900">{formData.typeOfCover}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Voyage From:</span>
                <span className="text-gray-900">{formData.voyageFrom}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Origin:</span>
                <span className="text-gray-900">{formData.origin}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Contact Information Section */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">E-mail Address:</span>
                <span className="text-gray-900">{formData.email}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Mobile Phone No:</span>
                <span className="text-gray-900">{formData.mobilePhone}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Policy No:</span>
                <span className="text-gray-900">{formData.policyNo}</span>
              </div>
            </div>
          </div>

          {/* ... Continue with all other sections in view mode ... */}

          <div className="flex justify-end mt-8">
            <Link
              to={getCertificatesPath()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Certificate Details Section */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Certificate Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <span className="w-48 font-medium text-gray-700">Certificate No:</span>
                <span className="text-gray-900 font-semibold">{formData.certificateNo}</span>
              </div>
              
              {renderField('Insured Name', 'insuredName')}
              {renderField('Address', 'address')}
              {renderField('Transaction Date', 'transactionDate', 'date')}
              {renderField('Vessel Name', 'vesselName')}
              {renderField('Type of Cover', 'typeOfCover')}
              {renderField('Voyage From', 'voyageFrom')}
              {renderField('Origin', 'origin')}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Contact Information Section */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('E-mail Address', 'email', 'email')}
              {renderField('Mobile Phone No', 'mobilePhone', 'tel')}
              {renderField('Policy No', 'policyNo')}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Shipping Information */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Conveyance', 'conveyance')}
              {renderField('TIN NO', 'tinNo')}
              {renderField('Destination', 'destination')}
              {renderField('Packaging Type', 'packagingType')}
              {renderField('PROFORMA INV.NO', 'proformaInvNo')}
              {renderField('Containerized', 'containerized', 'checkbox')}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Insurance Information */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Insurance Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Interest Insured', 'interestInsured')}
              {renderField('Nature of Cargo', 'natureOfGoods', 'select', [
                { value: '', label: 'Select' },
                { value: 'General', label: 'General' },
                { value: 'Perishable', label: 'Perishable' },
                { value: 'Hazardous', label: 'Hazardous' }
              ])}
              {renderField('Terms', 'terms')}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Payment Information */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">PAYMENT TYPE:</h3>
                {renderField('', 'paymentType', 'radio', [
                  { value: 'Credit Note', label: 'Credit Note' },
                  { value: 'CAF', label: 'CAF' },
                  { value: 'Cash', label: 'Cash' }
                ])}
              </div>

              <div className="flex items-center">
                <label className="w-48 font-medium text-gray-700">LOADING:</label>
                <span className="mr-4 text-gray-900">{formData.loading}</span>
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 transition-colors"
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
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Create Policy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Lending Information */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Lending Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Lending Title', 'lendingTitle')}
              {renderField('Legend Title', 'legendTitle')}
              {renderField('Date', 'date')}
              {renderField('Address', 'lendingAddress')}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Conditions/Clauses */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Conditions/Clauses</h2>
            {renderField('', 'conditionsClauses', 'textarea')}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Link
              to={getCertificatesPath()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateNewCertificate;