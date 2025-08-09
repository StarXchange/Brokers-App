import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "broker",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLoginEndpoints = {
    insurance: "http://gibsbrokersapi.newgibsonline.com/api/InsCompanies/login",
    client: "http://gibsbrokersapi.newgibsonline.com/api/InsuredClients/login",
    broker: "http://gibsbrokersapi.newgibsonline.com/api/Brokers/login",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint = roleLoginEndpoints[formData.role];
      console.log("endpoint", endpoint)
      const response = await axios.post(endpoint, {
        username: formData.username,
        password: formData.password,
      });
    //   console.log("")

      console.log("response", response)

      localStorage.setItem("token", response.data.token || "");
      localStorage.setItem("role", formData.role);

      // Navigate based on role
      if (formData.role === "broker") navigate("/brokers-dashboard");
      else if (formData.role === "client") navigate("/clients-dashboard");
      else if (formData.role === "company") navigate("/company-dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <a href="#" className="flex items-center space-x-2">
        <span className="text-3xl font-extrabold text-blue-700">🛡️</span>
        <span className="text-xl font-bold text-gray-800">Insurance Portal</span>
      </a>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Sign in to your account</h1>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="broker">Broker</option>
              <option value="client">Insured Client</option>
              <option value="insurance">Insurance Company</option>
            </select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Need help with your account? <a href="#" className="text-blue-600 hover:underline">Contact support</a>
        </p>

        {/* <div className="mt-8 text-sm">
          <ul className="list-disc list-inside space-y-2 text-blue-600">
            <li><Link to="/brokers" className="underline hover:text-blue-800">Brokers</Link></li>
            <li><Link to="/insuredclients" className="underline hover:text-blue-800">Insured Clients</Link></li>
            <li><Link to="/companies" className="underline hover:text-blue-800">Insurance Companies</Link></li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
