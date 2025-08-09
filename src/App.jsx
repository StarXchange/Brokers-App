import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import GenericLoginPage from "./components/GenericLoginPage";
import CompanyDashboard from "./pages/Company/CompanyDashboard";
import AgentsBrokers from "./pages/Company/AgentsBrokers";
import Certificates from "./pages/Company/Certificates";
import ChangePassword from "./pages/Company/ChangePassword";
import DownloadCertificates from "./pages/Company/DownloadCertificates";
import AddBroker from "./pages/Company/AddBroker";
import CertificateDetails from "./pages/Company/CertificateDetails";
import EditBroker from "./pages/Company/EditBroker";
import BrokersDashboard from "./pages/Broker/BrokersDashboard";
import BrokerCertificate from "./pages/Broker/BrokersCertificate";
import CreateNewCertificate from "./pages/Broker/CreateNewCertificate";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route index element={<GenericLoginPage userType="broker" />} />
            <Route path="/brokers" element={<GenericLoginPage userType="broker" />} />
            <Route path="/insured-clients" element={<GenericLoginPage userType="insured-client" />} />
            <Route path="/company" element={<GenericLoginPage userType="company" />} />
            
            {/* Company Dashboard with nested routes */}
            <Route path="/company-dashboard" element={<CompanyDashboard />}>
              <Route index element={<Certificates />} /> {/* Default view */}
              <Route path="certificates" element={<Certificates />} />
              <Route path="agents-brokers" element={<AgentsBrokers />} />
              <Route path="download-certificates" element={<DownloadCertificates />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="add-broker" element={<AddBroker />} />
              <Route path="certificates/:certNo" element={<CertificateDetails />} />
              <Route path="agents-brokers/edit/:brokerId" element={<EditBroker />} />
            </Route>
             {/* Brokers Dashboard with nested routes */}
          <Route path="/brokers-dashboard/certificates" element={<BrokersDashboard />}>
          <Route index element={<BrokerCertificate />} />
          <Route path="certificate" element={<BrokerCertificate />} />
          <Route path="create-certificate/new" element={<CreateNewCertificate />} />
          <Route 
  path="/brokers-dashboard/certificates/:brokerId/:year/:month/:certId" 
  element={<CreateNewCertificate viewMode={true} />} 
/>
          </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}