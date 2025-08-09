import React from 'react';
import Login from './Login';
import Services from './Services';
import { motion } from 'framer-motion';

const LoginPageWithServices = ({ userType }) => {
  // Dynamic content based on user type
  const userTypeConfig = {
    'broker': {
      loginTitle: 'Broker Login',
      serviceTitle: 'Broker Services',
    //   bgColor: 'bg-blue-800' // Blue for brokers
    },
    'insured-client': {
      loginTitle: 'Client Login',
      serviceTitle: 'Client Services',
    //   bgColor: 'bg-green-800' // Green for clients
    },
    'company': {
      loginTitle: 'Company Login',
      serviceTitle: 'Company Portal',
    //   bgColor: 'bg-purple-800' // Purple for companies
    }
  };

  const config = userTypeConfig[userType] || userTypeConfig['broker'];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Side: Login */}
      <motion.div
        className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {config.loginTitle}
          </h2>
          <Login userType={userType} />
        </div>
      </motion.div>

      {/* Right Side: Services */}
      <motion.div
        className={`w-full md:w-1/2 ${config.bgColor} text-white`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="max-w-md p-8">
            <h2 className="text-2xl font-bold mb-6">{config.serviceTitle}</h2>
            <Services userType={userType} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPageWithServices;