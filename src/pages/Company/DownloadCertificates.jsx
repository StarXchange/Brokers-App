// src/pages/DownloadCertificates.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DownloadCertificates = () => {
  const [showCalendar1, setShowCalendar1] = useState(false);
  const [showCalendar2, setShowCalendar2] = useState(false);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mx-auto relative">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Download Certificates</h2>
      
      <div className="space-y-6">
        {/* Certificates List */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">CERTIFICATES</h3>
          <ul className="space-y-2">
            <li className="p-2 bg-gray-50 rounded border border-gray-200">
              STACO-MARINE
            </li>
          </ul>
        </div>

        {/* Transaction Dates */}
        <div className="space-y-4">
          <div className="relative">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Transaction Date1:</h3>
            <div 
              className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowCalendar1(true);
                setShowCalendar2(false);
              }}
            >
              {formatDate(date1) || 'Select date'}
            </div>
            {showCalendar1 && (
              <div className="absolute z-10 mt-1 bg-white shadow-lg rounded border border-gray-200">
                <Calendar
                  onChange={(date) => {
                    setDate1(date);
                    setShowCalendar1(false);
                  }}
                  value={date1}
                  onClickOutside={() => setShowCalendar1(false)}
                />
              </div>
            )}
          </div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Transaction Date2:</h3>
            <div 
              className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowCalendar2(true);
                setShowCalendar1(false);
              }}
            >
              {formatDate(date2) || 'Select date'}
            </div>
            {showCalendar2 && (
              <div className="absolute z-10 mt-1 bg-white shadow-lg rounded border border-gray-200">
                <Calendar
                  onChange={(date) => {
                    setDate2(date);
                    setShowCalendar2(false);
                  }}
                  value={date2}
                  onClickOutside={() => setShowCalendar2(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Link 
            to="/company-dashboard/certificates" 
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Go Back
          </Link>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            disabled={!date1 || !date2}
          >
            DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadCertificates;