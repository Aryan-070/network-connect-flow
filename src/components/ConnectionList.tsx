
import React from 'react';
import { User } from './UserCard';
import UserCard from './UserCard';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ConnectionListProps {
  onRestart: () => void;
}

const ConnectionList = ({ onRestart }: ConnectionListProps) => {
  // This would come from an API in a real app
  const recommendedUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'Tech Innovations Inc.',
      profileMatchPercentage: 85,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Software Engineer',
      company: 'Growth Solutions',
      profileMatchPercentage: 72,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      linkedinUrl: 'https://linkedin.com/in/michaelchen'
    },
    {
      id: '3',
      name: 'Jessica Williams',
      role: 'Marketing Director',
      company: 'Brand Partners',
      profileMatchPercentage: 63,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      linkedinUrl: 'https://linkedin.com/in/jessicawilliams'
    },
    {
      id: '4',
      name: 'David Garcia',
      role: 'Data Scientist',
      company: 'Analytics Pro',
      profileMatchPercentage: 55,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      linkedinUrl: 'https://linkedin.com/in/davidgarcia'
    },
    {
      id: '5',
      name: 'Emily Zhang',
      role: 'UX Designer',
      company: 'Creative Solutions',
      profileMatchPercentage: 78,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      linkedinUrl: 'https://linkedin.com/in/emilyzhang'
    },
    {
      id: '6',
      name: 'Robert Taylor',
      role: 'CTO',
      company: 'Future Tech',
      profileMatchPercentage: 45,
      avatarUrl: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0',
      linkedinUrl: 'https://linkedin.com/in/roberttaylor'
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Recommended Connections</h1>
        <p className="text-muted-foreground">
          Based on your LinkedIn profile and industry
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline"
          onClick={onRestart}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ConnectionList;
