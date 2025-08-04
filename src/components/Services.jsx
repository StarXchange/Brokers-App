import React from 'react';
import {useLocation} from "react-router-dom"

const Services = () => {
    const location = useLocation();

    //default data 
    let pageTitle = "";
    let vision ="";
    let mission = "";
    let coreValues = [];

    //set content based on current path
    if (location.pathname === "/brokers") {
        pageTitle = "Brokers Services";
        vision = "To empower brokers with seamless digital tools for client onboarding and commission management.";
        mission = "To provide intuitive broker tools backed by reliable tech support and fast claim resolution";
        coreValues = ["Transparency", "Speed", "Broker Empowerment","Professionalism"]
    } else if (location.pathname === "/insuredclients") {
        pageTitle = "Insured Client Services";
        vision = "To provide a secure, personalized insurance experience for every client.";
        mission = "To deliver flexible and responsive insurance services using cutting-edge digital platforms.";
        coreValues = ["Customer Focus", "Trust", "Simplicity", "Responsiveness"];
      } else if (location.pathname === "/companies") {
        pageTitle = "Company Services";
        vision = "To enhance corporate insurance management through analytics, security, and seamless coordination.";
        mission = "To partner with insurance companies to improve service delivery, data handling, and reporting.";
        coreValues = ["Innovation", "Security", "Collaboration", "Excellence"];
      }
  return (
    <div className=" text-white bg-blue-800 flex flex-col justify-center px-30">
      <h2 className="text-3xl font-bold mb-6">{pageTitle}</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Our Vision
        </h3>
        <p>{vision}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
        Our Mission Statement
        </h3>
        <p>{mission}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Our Core Values</h3>
        <ul className="list-disc list-inside space-y-1">
          {coreValues.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Services;
