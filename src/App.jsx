import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import GenericLoginPage from "./components/GenericLoginPage";
import CompanyDashboard from "./pages/Company/CompanyDashboard";
import AgentsBrokers from "./pages/Company/AgentsBrokers";
import Certificates from "./pages/Company/Certificates";
import ChangePassword from "./shared/ChangePassword";
import DownloadCertificates from "./pages/Company/DownloadCertificates";
import AddBroker from "./pages/Company/AddBroker";
import CertificateDetails from "./pages/Company/CertificateDetails";
import EditBroker from "./pages/Company/EditBroker";
import BrokersDashboard from "./pages/Broker/BrokersDashboard";
import BrokerCertificate from "./pages/Broker/BrokersCertificate";
import CreateNewCertificate from "./shared/CreateNewCertificate";
import ClientList from "./pages/Broker/ClientList";
import AddClient from "./pages/Broker/AddClient";
import ViewDocuments from "./pages/Broker/ViewDocuments";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewProfile from "./pages/Broker/ViewProfile";
import CreditNotes from "./pages/Broker/CreditNotes";
import ClientDashboard from "./pages/Client/ClientDashboard";
import AddProposal from "./pages/Client/AddProposal";
import BusinessProposals from "./pages/Client/BusinessProposals";
import MakePayment from "./pages/Client/MakePayment";
import ClientCertificate from "./pages/Client/ClientCertificate";
import CreateMotorPolicy from "./shared/CreateMotorPolicy";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOverview from "./pages/Admin/AdminOverview";

const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter =
    location.pathname.startsWith("/company-dashboard") ||
    location.pathname.startsWith("/brokers-dashboard") ||
    location.pathname.startsWith("/client-dashboard") ||
    location.pathname.startsWith("/admin-dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <NavBar />}
      <main className="flex-grow">
        <Routes>
          <Route index element={<GenericLoginPage userType="broker" />} />
          <Route
            path="/brokers"
            element={<GenericLoginPage userType="broker" />}
          />
          <Route
            path="/insured-clients"
            element={<GenericLoginPage userType="client" />}
          />
          <Route
            path="/company"
            element={<GenericLoginPage userType="company" />}
          />
          <Route
            path="/admin"
            element={<GenericLoginPage userType="admin" />}
          />

          {/* Company Dashboard */}
          <Route path="/company-dashboard" element={<CompanyDashboard />}>
            <Route index element={<Certificates />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="agents-brokers" element={<AgentsBrokers />} />
            <Route
              path="download-certificates"
              element={<DownloadCertificates />}
            />
            <Route
              path="change-password"
              element={<ChangePassword userType="company" />}
            />
            <Route path="add-broker" element={<AddBroker />} />
            <Route
              path="certificates/:certNo"
              element={<CertificateDetails />}
            />
            <Route
              path="agents-brokers/edit/:brokerId"
              element={<EditBroker />}
            />
          </Route>

          {/* Brokers Dashboard - FIXED ROUTING */}
          <Route path="/brokers-dashboard" element={<BrokersDashboard />}>
            <Route index element={<BrokerCertificate />} />

            {/* Main certificates list view */}
            <Route path="certificates" element={<BrokerCertificate />} />

            {/* Create new certificate */}
            <Route
              path="certificates/create/marine"
              element={<CreateNewCertificate userRole="broker" />}
            />
            <Route
              path="certificates/create/motor"
              element={<CreateMotorPolicy userRole="broker" />}
            />

            {/* View existing certificate - FIXED PATH */}
            <Route
              path="certificates/view/:certId"
              element={
                <CreateNewCertificate viewMode={true} userRole="broker" />
              }
            />

            {/* Edit existing certificate */}
            <Route
              path="certificates/edit/:certId"
              element={<CreateNewCertificate userRole="broker" />}
            />

            <Route path="view-documents" element={<ViewDocuments />} />
            <Route
              path="download-certificates"
              element={
                <DownloadCertificates userType="broker" userId="BROKER-123" />
              }
            />
            <Route path="view-profile" element={<ViewProfile />} />
            <Route path="credit-notes" element={<CreditNotes />} />
            <Route
              path="change-password"
              element={<ChangePassword userType="broker" />}
            />
            <Route path="client-management" element={<ClientList />} />
            <Route
              path="client-management/add-client"
              element={<AddClient />}
            />
          </Route>

          {/* Client Dashboard */}
          <Route path="/client-dashboard" element={<ClientDashboard />}>
            <Route index element={<BusinessProposals />} />
            <Route path="add-proposal" element={<AddProposal />} />
            <Route path="make-payment" element={<MakePayment />} />
            <Route path="client-certificate" element={<ClientCertificate />} />
            <Route
              path="change-password"
              element={<ChangePassword userType="client" />}
            />

            {/* Create new certificate */}
            <Route
              path="certificates/create/marine"
              element={<CreateNewCertificate userRole="client" />}
            />
            <Route
              path="certificates/create/motor"
              element={<CreateMotorPolicy userRole="client" />}
            />
            <Route
              path="certificates/create/compulsory"
              element={<CreateNewCertificate userRole="client" />}
            />

            {/* Certificate Routes for Client */}
            <Route
              path="certificates/create"
              element={<CreateNewCertificate userRole="client" />}
            />
            <Route
              path="certificates/view/:certId"
              element={
                <CreateNewCertificate viewMode={true} userRole="client" />
              }
            />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />

            {/* Company Routes */}
            <Route path="company/certificates" element={<Certificates />} />
            <Route path="company/agents-brokers" element={<AgentsBrokers />} />
            <Route
              path="company/download-certificates"
              element={<DownloadCertificates />}
            />
            <Route path="company/add-broker" element={<AddBroker />} />
            <Route
              path="company/certificates/:certNo"
              element={<CertificateDetails />}
            />
            <Route
              path="company/agents-brokers/edit/:brokerId"
              element={<EditBroker />}
            />

            {/* Broker Routes */}
            <Route path="broker/certificates" element={<BrokerCertificate />} />
            <Route
              path="broker/certificates/create/marine"
              element={<CreateNewCertificate userRole="broker" />}
            />
            <Route
              path="broker/certificates/create/motor"
              element={<CreateMotorPolicy userRole="broker" />}
            />
            <Route
              path="broker/certificates/view/:certId"
              element={
                <CreateNewCertificate viewMode={true} userRole="broker" />
              }
            />
            <Route
              path="broker/certificates/edit/:certId"
              element={<CreateNewCertificate userRole="broker" />}
            />
            <Route path="broker/view-documents" element={<ViewDocuments />} />
            <Route
              path="broker/download-certificates"
              element={
                <DownloadCertificates userType="broker" userId="BROKER-123" />
              }
            />
            <Route path="broker/view-profile" element={<ViewProfile />} />
            <Route path="broker/credit-notes" element={<CreditNotes />} />
            <Route path="broker/client-management" element={<ClientList />} />
            <Route
              path="broker/client-management/add-client"
              element={<AddClient />}
            />

            {/* Client Routes */}
            <Route
              path="client/business-proposals"
              element={<BusinessProposals />}
            />
            <Route path="client/add-proposal" element={<AddProposal />} />
            <Route path="client/make-payment" element={<MakePayment />} />
            <Route
              path="client/client-certificate"
              element={<ClientCertificate />}
            />
            <Route
              path="client/certificates/create/marine"
              element={<CreateNewCertificate userRole="client" />}
            />
            <Route
              path="client/certificates/create/motor"
              element={<CreateMotorPolicy userRole="client" />}
            />
            <Route
              path="client/certificates/create/compulsory"
              element={<CreateNewCertificate userRole="client" />}
            />
            <Route
              path="client/certificates/create"
              element={<CreateNewCertificate userRole="client" />}
            />
            <Route
              path="client/certificates/view/:certId"
              element={
                <CreateNewCertificate viewMode={true} userRole="client" />
              }
            />

            {/* Shared Routes */}
            <Route
              path="change-password"
              element={<ChangePassword userType="admin" />}
            />
          </Route>
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
