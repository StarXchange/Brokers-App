// src/pages/brokers/BrokersDashboard.jsx
import { Outlet, Link } from 'react-router-dom';

const BrokersDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/brokers-dashboard/certificates" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Certificates
              </Link>
            </li>
            <li>
              <Link 
                to="credit-note" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Credit Note
              </Link>
            </li>
            <li>
              <Link 
                to="client" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Client
              </Link>
            </li>
            <li>
              <Link 
                to="download-certificates" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Download Certificates
              </Link>
            </li>
            <li>
              <Link 
                to="view-document" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                View Document
              </Link>
            </li>
            <li>
              <Link 
                to="change-password" 
                className="block font-semibold text-lg p-2 hover:bg-blue-50 rounded"
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link 
                to="/logout" 
                className="block font-semibold text-lg p-2 text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Marine Certificates</h1>
            
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BrokersDashboard;