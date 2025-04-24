import React, { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import AuthForm from "@/components/AuthForm";
import OtpVerification from "@/components/OtpVerification";
import LinkedinForm from "@/components/LinkedinForm";
import ConnectionList from "@/components/ConnectionList";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import PurposeSelection from "@/components/PurposeSelection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<{
    email?: string;
    phoneNumber?: string;
    linkedinUrl?: string;
    name?: string;
    purpose?: string;
  }>({});
  const [activeOption, setActiveOption] = useState<string>("network");
  const [skipName, setSkipName] = useState<string>("Aryan");
  const handleAuthSubmit = (data: { email?: string; phoneNumber?: string }) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleOtpSuccess = () => {
    setCurrentStep(3);
  };

  const handleLinkedinSubmit = (linkedinUrl: string, name: string) => {
    setUserData((prev) => {
      const updatedData = { ...prev, linkedinUrl, name: name.trim() }; // Trim and set the name
      console.log('Updated User Data:', updatedData); // Print user data here
      return updatedData;
    });
    setCurrentStep(4);
  };

  const handlePurposeSubmit = (purpose: string) => {
    setUserData((prev) => ({ ...prev, purpose }));
    setCurrentStep(5);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setUserData({});
  };

  const handleSkipToRecommendations = () => {
    if (skipName.trim()) {
      setUserData((prev) => ({ ...prev, name: skipName }));
      setCurrentStep(5);
    }
  };

  const handleSelectOption = (option: string) => {
  setActiveOption(option);
    if (option === "network") {
      // If we're selecting the network option and we have LinkedIn data, show connections
      if (userData.linkedinUrl && userData.purpose) {
        setCurrentStep(5);
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
        return (
          <div className="space-y-6">
            <AuthForm onNext={handleAuthSubmit} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or skip to recommendations
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  value={skipName}
                  onChange={(e) => setSkipName(e.target.value)}
                  placeholder="Enter your name to skip steps"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleSkipToRecommendations} 
                className="w-full gap-2"
                disabled={!skipName.trim()}
              >
                Skip to Recommendations
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
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
            onNext={handleLinkedinSubmit} // Pass handleLinkedinSubmit to capture LinkedIn URL and name
          />
        );
      case 4:
        return (
          <PurposeSelection 
            onBack={() => setCurrentStep(3)} 
            onNext={handlePurposeSubmit} 
            name={userData.name || ''}
            linkedinUrl={userData.linkedinUrl || ''} 
          />
        );
      case 5:
      
        return (
          <ConnectionList
            onRestart={handleRestart}
            name={userData.name || ''} // Pass the name to ConnectionList
            user={undefined}          />
        );
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
            {activeOption === "network" && currentStep < 5 && (
              <StepIndicator totalSteps={4} currentStep={currentStep} />
            )}
            {renderStep()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
