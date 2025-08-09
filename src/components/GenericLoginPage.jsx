// src/components/GenericLoginPage.jsx
import Hero from "./Hero";
import LoginPageWithServices from "./LoginWithServices";

export default function GenericLoginPage({ userType }) {
  return (
    <div className="p-6">
      <Hero />
      <LoginPageWithServices userType={userType} />
    </div>
  );
}