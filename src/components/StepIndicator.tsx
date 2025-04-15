
import React from 'react';
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const StepIndicator = ({ totalSteps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-6 w-full">
      <div className="w-full max-w-xs flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={cn(
                  "h-1 flex-1", 
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
            <div 
              className={cn(
                "rounded-full flex items-center justify-center w-8 h-8 font-medium text-sm",
                index + 1 === currentStep ? "bg-primary text-white" : 
                index + 1 < currentStep ? "bg-primary/80 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
