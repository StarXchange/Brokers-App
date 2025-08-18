import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login({ userType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);



  // const roleLoginEndpoints = {
  //   insurance: "http://gibsbrokersapi.newgibsonline.com/api/InsCompanies/login",
  //   client: "http://gibsbrokersapi.newgibsonline.com/api/InsuredClients/login",
  //   broker: "http://gibsbrokersapi.newgibsonline.com/api/Brokers/login",
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const result = await login ({
      username: formData.username,
      password: formData.password,
    })
    if (result.success) {
  if (result.user.isAdmin) {
    navigate('/admin-dashboard');
  } else {
    // Map user types to their correct dashboard paths
    const dashboardPaths = {
      broker: '/brokers-dashboard',
      client: '/client-dashboard',  // or '/clients-dashboard' if plural
      company: '/company-dashboard' // or '/companies-dashboard' if plural
    };
    
    const dashboardPath = userType 
      ? dashboardPaths[userType] || '/dashboard'
      : '/dashboard';
      
    navigate(dashboardPath);
  }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  //   try {
  //     // const endpoint = roleLoginEndpoints[formData.role];
  //     // console.log("endpoint", endpoint)
  //     // const response = await axios.post(endpoint, {
  //     const response = await axios.post(
  //       "http://gibsbrokersapi.newgibsonline.com/api/Users/login", // Replace with dynamic endpoint if needed
  //       {
  //       username: formData.username,
  //       password: formData.password,
  //     });
  //   //   console.log("")

  //     console.log("response", response)

  //     localStorage.setItem("token", response.data.token || "");
  //     localStorage.setItem("role", JSON.stringify(response.data.user));

  //     // Navigate based on role
  //     // if (formData.role === "broker") navigate("/brokers-dashboard");
  //     // else if (formData.role === "client") navigate("/clients-dashboard");
  //     // else if (formData.role === "company") navigate("/company-dashboard");
  //     navigate('/admin-dashboard');

  //     // Optionally, you can handle successful login actions here
  //     // e.g., show a success message, redirect, etc.
  //   } catch (err) {
  //     setError("Login failed. Please check your credentials.", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    Password
  </label>
  <div className="relative mt-1">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      id="password"
      value={formData.password}
      onChange={handleInputChange}
      placeholder="••••••••"
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
      required
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 flex items-center pr-3"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  </div>
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
