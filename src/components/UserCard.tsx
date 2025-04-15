
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Linkedin } from "lucide-react";

export interface User {
  id: string;
  name: string;
  role: string;
  company: string;
  mutualConnections: number;
  avatarUrl: string;
  linkedinUrl: string;
}

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[5/2] bg-gradient-to-r from-primary/10 to-primary/5" />
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative -mt-12">
            <div className="h-20 w-20 rounded-full border-4 border-background bg-background overflow-hidden">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg leading-tight">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <p className="text-sm text-muted-foreground">{user.company}</p>
          </div>
        </div>
      </CardContent>
      <CardDescription className="px-6 pb-2">
        <span className="text-sm text-muted-foreground">
          {user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}
        </span>
      </CardDescription>
      <CardFooter className="flex justify-between p-6 pt-2">
        <Button variant="outline" size="sm" className="flex-1 mr-2">
          <Linkedin className="mr-1 h-4 w-4" />
          View
        </Button>
        <Button size="sm" className="flex-1">
          <UserPlus className="mr-1 h-4 w-4" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
