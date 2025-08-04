import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Brokers from "./pages/Brokers";
import InsuredClients from "./pages/InsuredClients";
import Companies from "./pages/Companies";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/brokers" element={<Brokers />} />
            <Route path="/insuredclients" element={<InsuredClients />} />
            <Route path="/companies" element={<Companies />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
