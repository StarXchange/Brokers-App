import React, { useState, useEffect } from 'react';

const Services = () => {
  const [currentService, setCurrentService] = useState(0);
  
  // Content configuration for each service type
  const services = [
    {
      id: 'broker',
      pageTitle: "Brokers Services",
      vision: "To empower brokers with seamless digital tools for client onboarding and commission management.",
      mission: "To provide intuitive broker tools backed by reliable tech support and fast claim resolution",
      coreValues: ["Transparency", "Speed", "Broker Empowerment", "Professionalism"],
      bgColor: "bg-blue-600",
    },
    {
      id: 'insured-client',
      pageTitle: "Client Services",
      vision: "To provide a secure, personalized insurance experience for every client.",
      mission: "To deliver flexible and responsive insurance services using cutting-edge digital platforms.",
      coreValues: ["Customer Focus", "Trust", "Simplicity", "Responsiveness"],
      bgColor: "bg-blue-600",
    },
    {
      id: 'company',
      pageTitle: "Company Services",
      vision: "To enhance corporate insurance management through analytics, security, and seamless coordination.",
      mission: "To partner with insurance companies to improve service delivery, data handling, and reporting.",
      coreValues: ["Innovation", "Security", "Collaboration", "Excellence"],
      bgColor: "bg-blue-600",
    }
  ];

  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % services.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [services.length]);

  const service = services[currentService];

  return (
    <div className={`${service.bgColor} text-white rounded-lg p-6 shadow-lg transition-all duration-500`}>
      <h2 className="text-2xl font-bold mb-4">{service.pageTitle}</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Our Vision</h3>
        <p className="text-white/90">{service.vision}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Our Mission Statement</h3>
        <p className="text-white/90">{service.mission}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Our Core Values</h3>
        <ul className="list-disc list-inside space-y-1">
          {service.coreValues.map((value, index) => (
            <li key={index} className="text-white/90">{value}</li>
          ))}
        </ul>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentService ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setCurrentService(index)}
            aria-label={`Show ${services[index].pageTitle}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;