import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CreateNewCertificate = ({ viewMode = false, userRole = 'broker' }) => {
  const { brokerId, year, month, certId } = useParams();
  const navigate = useNavigate();


  console.log('Component props:', { viewMode, userRole });
  console.log('URL params:', { brokerId, year, month, certId });



  const [formData, setFormData] = useState({
    certificateNo: viewMode ? '' : 'AUTO',
    insuredName: '',
    address: '',
    transactionDate: '12 Aug, 2025',
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

  const fetchCertificateData = async () => {
    setLoading(true);
    try {
      const mockData = {
        certificateNo: certId,
        insuredName: `Insured ${certId}`,
        address: '123 Main St',
        transactionDate: `${year}/${month}/01`,
        vesselName: 'AMY APPROVED STEAMER(S) AS PER',
        subject: 'Marine Cargo',
        typeOfCover: "ICC 'A'",
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
        rate: '0.75',
        conditionsClauses: 'Standard clauses apply',
        lendingTitle: 'Main Lender',
        legendTitle: 'Certificate Legend',
        date: '12 Aug, 2025',
        lendingAddress: '456 Finance St, London'
      };
      setFormData(mockData);
      
      // Real API call would be:
      // const endpoint = userRole === 'broker' 
      //   ? `/api/brokers/certificates/${certId}`
      //   : `/api/clients/certificates/${certId}`;
      // const response = await axios.get(endpoint);
      // setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      const redirectPath = getCertificatesPath();
      navigate(redirectPath, {
        state: { success: 'Certificate created successfully!' }
      });
      
      // Real API call would be:
      // const endpoint = userRole === 'broker'
      //   ? '/api/brokers/certificates'
      //   : '/api/clients/certificates';
      // await axios.post(endpoint, formData);
      // navigate(redirectPath, {...});
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create certificate');
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

              <div className="flex items-center">
                <label className="w-48 font-medium text-gray-700">Rate:</label>
                <span className="mr-4 text-gray-900">{formData.rate}</span>
                <button
                  type="button"
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Compute
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