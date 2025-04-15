
import React, { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import AuthForm from "@/components/AuthForm";
import OtpVerification from "@/components/OtpVerification";
import LinkedinForm from "@/components/LinkedinForm";
import ConnectionList from "@/components/ConnectionList";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<{
    email?: string;
    phoneNumber?: string;
    linkedinUrl?: string;
  }>({});
  const [activeOption, setActiveOption] = useState<string>("network");

  const handleAuthSubmit = (data: { email?: string; phoneNumber?: string }) => {
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
    setUserData({});
  };

  const handleSelectOption = (option: string) => {
    setActiveOption(option);
    if (option === "network") {
      // If we're selecting the network option and we have LinkedIn data, show connections
      if (userData.linkedinUrl) {
        setCurrentStep(4);
      } else {
        // If we don't have LinkedIn data yet, start the flow
        setCurrentStep(1);
      }
    } else {
      // For other options, we could reset or handle differently if needed
      setCurrentStep(1);
    }
  };

  const renderStep = () => {
    // Only show content if active option is "network"
    if (activeOption !== "network") {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">{`AI ${activeOption.charAt(0).toUpperCase() + activeOption.slice(1)}`}</h2>
          <p className="text-muted-foreground">This feature is coming soon.</p>
        </div>
      );
    }

    // If active option is "network", show the regular flow
    switch (currentStep) {
      case 1:
        return <AuthForm onNext={handleAuthSubmit} />;
      case 2:
        return (
          <OtpVerification
            phoneNumber={userData.phoneNumber || ''}
            email={userData.email}
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar 
          activeOption={activeOption} 
          onSelectOption={handleSelectOption}
        />
        <SidebarInset className="bg-gradient-to-b from-background to-muted/20 py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger className="md:hidden" />
              <div></div>
            </div>
            {activeOption === "network" && currentStep < 4 && (
              <StepIndicator totalSteps={3} currentStep={currentStep} />
            )}
            {renderStep()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
