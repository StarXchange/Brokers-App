import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CreateNewCertificate = ({ viewMode = false }) => {
  const { brokerId, year, month, certId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    certificateNo: viewMode ? '' : 'AUTO',
    insuredName: '',
    address: '',
    transactionDate: '08 Aug, 2025',
    subject: '',
    typeOfCover: '',
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
    rate: '0.0'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (viewMode && certId) {
      fetchCertificateData();
    }
  }, [viewMode, certId]);

  const fetchCertificateData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData = {
        certificateNo: certId,
        insuredName: `Insured ${certId}`,
        address: '123 Main St',
        transactionDate: `${year}/${month}/01`,
        subject: 'Marine Cargo',
        typeOfCover: 'All Risks',
        origin: 'Lagos',
        email: `insured${certId}@example.com`,
        mobilePhone: '08012345678',
        policyNo: `POL-${certId}`,
        conveyance: 'MV Ocean Star',
        tinNo: `TIN-${certId}`,
        destination: 'London',
        packagingType: 'Containerized',
        proformaInvNo: `INV-${certId}`,
        containerized: true,
        interestInsured: 'Full Value',
        natureOfGoods: 'Electronics',
        paymentType: 'Credit Note',
        terms: 'CIF',
        loading: '100%',
        currencyType: 'USD',
        sumInsured: '50000.00',
        clausesType: 'Institute Cargo Clauses A',
        rate: '0.75'
      };
      setFormData(mockData);
      
      // Real API call would be:
      // const response = await axios.get(
      //   `/api/certificates/${brokerId}/${year}/${month}/${certId}`
      // );
      // setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

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

      /* 
    BACKEND INTEGRATION (COMMENTED OUT FOR NOW)
    try {
      const response = await axios.post('/api/brokers/certificates', formData);
      navigate('/brokers-dashboard/certificates', {
        state: { success: 'Certificate created successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create certificate');
    } finally {
      setLoading(false);
    }
    */

    try {
      // Mock success for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/brokers-dashboard/certificates', {
        state: { success: 'Certificate created successfully!' }
      });
      
      // Real API call would be:
      // await axios.post('/api/certificates', formData);
      // navigate(...);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create certificate');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, name, type = 'text', options = null) => {
    return (
      <div className="flex items-center">
        <label className="w-48 font-medium">{label}:</label>
        {viewMode ? (
          <span className="flex-1">
            {type === 'checkbox' 
              ? formData[name] ? 'Yes' : 'No'
              : formData[name] || 'N/A'}
          </span>
        ) : type === 'select' ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <input
            type="checkbox"
            name={name}
            checked={formData[name]}
            onChange={handleChange}
            className="h-4 w-4"
          />
        ) : type === 'radio' ? (
          <div className="flex space-x-4">
            {options?.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            required={!viewMode && name === 'insuredName'}
          />
        )}
      </div>
    );
  };

  if (viewMode && loading) return <div className="p-6">Loading certificate details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">
        {viewMode ? 'Certificate Details' : 'Certificate Setup'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Certificate Details Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Certificate Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <label className="w-48 font-medium">Certificate No</label>
              {viewMode ? (
                <span>{formData.certificateNo}</span>
              ) : (
                <span>{formData.certificateNo}</span>
              )}
            </div>
            
            {renderField('Insured Name', 'insuredName')}
            {renderField('Address', 'address')}
            {renderField('Transaction Date', 'transactionDate')}
            {renderField('Subject', 'subject')}
            {renderField('Type of Cover', 'typeOfCover')}
            {renderField('Origin', 'origin')}
          </div>
          
          {/* Contact Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {renderField('E-mail Addr', 'email', 'email')}
            {renderField('Mobile Phone No', 'mobilePhone', 'tel')}
            {renderField('Policy No', 'policyNo')}
            {renderField('Conveyance', 'conveyance')}
            {renderField('TIN NO', 'tinNo')}
            {renderField('Destination', 'destination')}
          </div>
          
          {/* Shipping Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {renderField('Packaging Type', 'packagingType')}
            {renderField('PROFORMA INV.NO', 'proformaInvNo')}
          </div>
          
          {/* Insurance Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              {renderField('Containerized', 'containerized', 'checkbox')}
            </div>
            
            <div className="space-y-4">
              {renderField('Interest Insured', 'interestInsured')}
              
              {renderField('Nature of Goods', 'natureOfGoods', 'select', [
                { value: '', label: 'Select' },
                { value: 'General', label: 'General' },
                { value: 'Perishable', label: 'Perishable' },
                { value: 'Hazardous', label: 'Hazardous' }
              ])}
              
              <div>
                <h3 className="font-medium mb-1">PAYMENT TYPE:</h3>
                {renderField('', 'paymentType', 'radio', [
                  { value: 'Credit Note', label: 'Credit Note' },
                  { value: 'Cash', label: 'Cash' }
                ])}
              </div>
              
              {renderField('Terms', 'terms')}
              {renderField('LOADING', 'loading')}
              
              <div>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Calc
                </button>
              </div>
              
              {renderField('Currency Types', 'currencyType', 'select', [
                { value: '', label: 'Select' },
                { value: 'NGN', label: 'NGN' },
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' }
              ])}
              
              {renderField('Sum Insured', 'sumInsured', 'number')}
              
              {renderField('Clauses Type', 'clausesType', 'select', [
                { value: '', label: 'Select' },
                { value: 'Standard', label: 'Standard' },
                { value: 'Extended', label: 'Extended' },
                { value: 'Special', label: 'Special' }
              ])}
              
              {renderField('Rate', 'rate', 'number')}
              
              <div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Compute
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/brokers-dashboard/certificates"
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {viewMode ? 'Go Back' : 'Cancel'}
          </Link>
          
          {!viewMode && (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateNewCertificate;