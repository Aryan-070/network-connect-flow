
import React, { useState, useRef } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

import SessionList from "@/components/SessionList";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import AudioRecorder from "@/components/AudioRecorder";

const SessionPage = () => {
  const [activeOption, setActiveOption] = useState<string>("session");
  const [transcription, setTranscription] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [sessions, setSessions] = useState<{id: string, text: string, summary: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  const handleComplete = () => {
    if (transcription.trim()) {
      // For now just generate a simple summary - in a real implementation this would call an AI service
      const summary = `Summary of: ${transcription.substring(0, 50)}...`;
      const newSession = {
        id: Date.now().toString(),
        text: transcription,
        summary: summary,
      };
      
      setSessions(prev => [...prev, newSession]);
      setTranscription("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically send the file to a transcription service
      // For demo purposes, we'll just simulate a transcription after a delay
      setTranscription("Processing audio file: " + file.name);
      
      setTimeout(() => {
        setTranscription(`Transcription of ${file.name}: This is a simulated transcription of the uploaded audio file. In a real implementation, this would contain the actual transcribed text from the audio file.`);
      }, 2000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar 
          activeOption={activeOption} 
          onSelectOption={setActiveOption}
        />
        <SidebarInset className="bg-gradient-to-b from-background to-muted/20 py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold">AI Summary Session</h1>
              <div></div>
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Record or Upload Audio</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <AudioRecorder 
                    isRecording={isRecording}
                    setIsRecording={setIsRecording} 
                    userId={""}                  />
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">or</span>
                  </div>
                  <Button variant="outline" onClick={triggerFileUpload} className="flex gap-2">
                    <Upload size={16} />
                    Upload Audio
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              
              {transcription && (
                <div className="bg-card rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Current Transcription</h2>
                  <div className="bg-muted/40 p-4 rounded-md min-h-32 max-h-60 overflow-y-auto">
                    <p className="whitespace-pre-wrap">{transcription}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleComplete} disabled={!transcription.trim()}>
                      Complete Session
                    </Button>
                  </div>
                </div>
              )}
{/*               
              {sessions.length > 0 && (
                <SessionList sessions={sessions} />
              )} */}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SessionPage;