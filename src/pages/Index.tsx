
import React, { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import AuthForm from "@/components/AuthForm";
import OtpVerification from "@/components/OtpVerification";
import LinkedinForm from "@/components/LinkedinForm";
import ConnectionList from "@/components/ConnectionList";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    email: "",
    phoneNumber: "",
    linkedinUrl: "",
  });

  const handleAuthSubmit = (data: { email: string; phoneNumber: string }) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleOtpSuccess = () => {
    setCurrentStep(3);
  };

  const handleLinkedinSubmit = (linkedinUrl: string) => {
    setUserData((prev) => ({ ...prev, linkedinUrl }));
    setCurrentStep(4);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setUserData({
      email: "",
      phoneNumber: "",
      linkedinUrl: "",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AuthForm onNext={handleAuthSubmit} />;
      case 2:
        return (
          <OtpVerification
            phoneNumber={userData.phoneNumber}
            onBack={() => setCurrentStep(1)}
            onNext={handleOtpSuccess}
          />
        );
      case 3:
        return (
          <LinkedinForm
            onBack={() => setCurrentStep(2)}
            onNext={handleLinkedinSubmit}
          />
        );
      case 4:
        return <ConnectionList onRestart={handleRestart} />;
      default:
        return <AuthForm onNext={handleAuthSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {currentStep < 4 && (
          <StepIndicator totalSteps={3} currentStep={currentStep} />
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;
