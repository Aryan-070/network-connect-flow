import React from 'react';
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export interface Session {
  id: string;
  name: string;
  match_score: number;
  reasoning: string;
  imageUrl: string;
}

interface SessionListProps {
  sessions: Session[]; // Accept sessions as a prop
  onRestart: () => void;
}

const SessionList = ({ sessions, onRestart }: SessionListProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Recommended Sessions</h1>
        <p className="text-muted-foreground">
          Based on your interests and professional goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video relative">
              <img
                src={session.imageUrl}
                alt={session.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                {session.match_score}% Match
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg leading-tight mb-2">{session.name}</h3>
              <CardDescription className="line-clamp-2">
                {session.reasoning}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Register for Session
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={onRestart} className="gap-2">
          Explore More Sessions
        </Button>
      </div>
    </div>
  );
};

export default SessionList;