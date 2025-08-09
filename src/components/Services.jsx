import React from 'react';

const Services = ({ userType }) => {
  // Content configuration based on userType
  const contentConfig = {
    'broker': {
      pageTitle: "Brokers Services",
      vision: "To empower brokers with seamless digital tools for client onboarding and commission management.",
      mission: "To provide intuitive broker tools backed by reliable tech support and fast claim resolution",
      coreValues: ["Transparency", "Speed", "Broker Empowerment", "Professionalism"],
     bgColor: "bg-blue-800",
    },
    'insured-client': {
      pageTitle: "Insured Client Services",
      vision: "To provide a secure, personalized insurance experience for every client.",
      mission: "To deliver flexible and responsive insurance services using cutting-edge digital platforms.",
      coreValues: ["Customer Focus", "Trust", "Simplicity", "Responsiveness"],
      bgColor: "bg-blue-800",
    },
    'company': {
      pageTitle: "Company Services",
      vision: "To enhance corporate insurance management through analytics, security, and seamless coordination.",
      mission: "To partner with insurance companies to improve service delivery, data handling, and reporting.",
      coreValues: ["Innovation", "Security", "Collaboration", "Excellence"],
      bgColor: "bg-blue-800",
    }
  };

  const config = contentConfig[userType] || contentConfig['broker'];

  return (
    <div className={`${config.bgColor} rounded-lg p-6 shadow-lg`}>
      <h2 className="text-3xl font-bold mb-6">{config.pageTitle}</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
        <p className="text-white/90">{config.vision}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Our Mission Statement</h3>
        <p className="text-white/90">{config.mission}</p>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">Our Core Values</h3>
        <ul className="list-disc list-inside space-y-2">
          {config.coreValues.map((value, index) => (
            <li key={index} className="text-white/90">{value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Services;