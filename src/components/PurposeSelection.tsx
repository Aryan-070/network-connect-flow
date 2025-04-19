import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Briefcase, BookOpen, Users, TrendingUp } from "lucide-react";

interface PurposeSelectionProps {
  onBack: () => void;
  onNext: (purpose: string) => void;
  name: string; // Add name as a prop
  linkedinUrl: string; // Add LinkedIn URL as a prop
}

const PurposeSelection = ({ onBack, onNext, name, linkedinUrl }: PurposeSelectionProps) => {
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPurpose) {
      setError('Please select a purpose');
      return;
    }

    try {
      // Pass name, LinkedIn URL, and purpose to the API
      const response = await fetch('http://127.0.0.1:5000/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          linkedin_url: linkedinUrl,
          goal: selectedPurpose
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Response from server:', data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      }
    }

    // Pass the selected purpose to the next step
    onNext(selectedPurpose);
  };

  const purposes = [
    { 
      id: 'investment', 
      label: 'Exploring Investment Opportunities', 
      icon: <TrendingUp className="h-5 w-5 text-primary" />
    },
    { 
      id: 'learning', 
      label: 'Learning & Insights from Experts', 
      icon: <BookOpen className="h-5 w-5 text-primary" /> 
    },
    { 
      id: 'networking', 
      label: 'Networking & Partnerships', 
      icon: <Users className="h-5 w-5 text-primary" /> 
    },
    { 
      id: 'startup', 
      label: 'Showcasing My Startup/Initiative', 
      icon: <Briefcase className="h-5 w-5 text-primary" /> 
    },
    { 
      id: 'policy', 
      label: 'Understanding Policy & Market Trends', 
      icon: <TrendingUp className="h-5 w-5 text-primary" /> 
    },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">What's Your Primary Purpose?</CardTitle>
        <CardDescription className="text-center">
          Help us personalize your connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup 
            value={selectedPurpose} 
            onValueChange={value => {
              setSelectedPurpose(value);
              if (error) setError('');
            }}
          >
            {purposes.map((purpose) => (
              <div key={purpose.id} className="flex items-center space-x-3 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={purpose.id} id={purpose.id} />
                <Label htmlFor={purpose.id} className="flex items-center gap-2 cursor-pointer flex-1">
                  {purpose.icon}
                  {purpose.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="pt-4 space-y-2">
            <Button type="submit" className="w-full">
              Continue
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              onClick={onBack}
            >
              Go Back
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p>This helps us recommend the most relevant connections</p>
      </CardFooter>
    </Card>
  );
};

export default PurposeSelection;
