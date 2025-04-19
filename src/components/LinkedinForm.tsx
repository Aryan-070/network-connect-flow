import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin } from "lucide-react";

interface LinkedinFormProps {
  onBack: () => void;
  onNext: (linkedinUrl: string, name: string) => void;
}

const LinkedinForm = ({ onBack, onNext }: LinkedinFormProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/in/rajat-khaitan-61542368/');
  const [name, setName] = useState('Rajat');
  const [error, setError] = useState('');

  const validateLinkedinUrl = (url: string) => {
    const regex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!linkedinUrl.trim()) {
      setError('Please enter your LinkedIn URL');
      return;
    }

    if (!validateLinkedinUrl(linkedinUrl)) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }
    onNext(linkedinUrl, name);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          Connect Your LinkedIn
        </CardTitle>
        <CardDescription className="text-center">
          Add your LinkedIn profile to find relevant connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your Name"
                className="pl-10"
                value={name}
                onChange={(e) => {
                  setName(e.target.value); // Update the name state
                  if (error) setError('');
                }}
              />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                className="pl-10"
                value={linkedinUrl}
                onChange={(e) => {
                  setLinkedinUrl(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <div className="pt-2 space-y-2">
            <Button type="submit" className="w-full">
              Find Connections
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
      <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
        <p>We'll use your profile to suggest relevant connections</p>
        <p>Example: https://www.linkedin.com/in/johndoe</p>
      </CardFooter>
    </Card>
  );
};

export default LinkedinForm;
