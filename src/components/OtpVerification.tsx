import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";

interface OtpVerificationProps {
  phoneNumber?: string;
  email?: string;
  onBack: () => void;
  onNext: () => void;
}

const OtpVerification = ({ phoneNumber, email, onBack, onNext }: OtpVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.charAt(0);
    setOtp(newOtp);
    
    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 4) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      if (pastedData.length < 4 && pastedData.length > 0 && inputRefs[pastedData.length].current) {
        inputRefs[pastedData.length].current?.focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }
    
    if (enteredOtp === "1234") {
      onNext();
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '']);
    setError('');
  };

  const handleBackClick = () => {
    if (onBack) onBack();
  };

  const getMaskedContact = () => {
    if (phoneNumber) {
      return `${phoneNumber.substring(0, 3)}*****${phoneNumber.substring(phoneNumber.length - 2)}`;
    }
    if (email) {
      const [username, domain] = email.split('@');
      return `${username.substring(0, 2)}****@${domain}`;
    }
    return '';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Verify Your {phoneNumber ? 'Phone' : 'Email'}
        </CardTitle>
        <CardDescription className="text-center">
          We sent a code to {getMaskedContact()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={inputRefs[index]}
                className="w-14 h-14 text-center text-2xl"
                maxLength={1}
              />
            ))}
          </div>
          
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
          
          <div className="space-y-2">
            <Button type="button" onClick={handleVerify} className="w-full">
              Verify & Continue
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              onClick={handleBackClick}
            >
              Go Back
            </Button>
          </div>
          
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in {timer} seconds
              </p>
            ) : (
              <Button 
                type="button"
                variant="ghost" 
                className="p-0 h-auto text-primary"
                onClick={handleResend}
              >
                Resend Code
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        For this demo, use code "1234"
      </CardFooter>
    </Card>
  );
};

export default OtpVerification;
