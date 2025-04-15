
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AuthFormProps {
  onNext: (data: { email?: string; phoneNumber?: string }) => void;
}

const AuthForm = ({ onNext }: AuthFormProps) => {
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    
    if (contactMethod === 'email') {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        isValid = false;
      } else {
        setError('');
      }
    } else {
      if (!validatePhone(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number');
        isValid = false;
      } else {
        setError('');
      }
    }
    
    if (isValid) {
      onNext(contactMethod === 'email' ? { email } : { phoneNumber });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect with professionals</CardTitle>
        <CardDescription>Choose how you want to verify your identity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup 
            defaultValue="email" 
            onValueChange={(value: 'email' | 'phone') => setContactMethod(value)}
            className="flex justify-center space-x-4 mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone">Phone</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <div className="relative">
              {contactMethod === 'email' ? (
                <>
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    className="pl-10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </>
              )}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        {contactMethod === 'email' 
          ? "We'll send a verification code to your email" 
          : "We'll send a verification code to your phone"}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
