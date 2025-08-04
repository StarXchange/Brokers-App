import React from 'react';
import Login from './Login';
import Services from './Services';
import { motion } from 'framer-motion';

const LoginPageWithServices = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Side: Login */}
      <motion.div
        className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Login />
      </motion.div>

      {/* Right Side: Services */}
      <motion.div
        className="w-full md:w-1/2 bg-blue-800 text-white"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Services />
      </motion.div>
    </div>
  );
};

export default LoginPageWithServices;
