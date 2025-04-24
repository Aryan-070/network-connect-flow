
import React, { useState, useRef } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import AudioRecorder from "@/components/AudioRecorder";
import AiHelpdesk from "@/components/AiHelpdesk";

const HelpDeskPage = () => {
  const [activeOption, setActiveOption] = useState<string>("helpdesk");

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
              <h1 className="text-2xl font-bold">AI HelpDesk</h1>
              <div></div>
            </div>
                  <AiHelpdesk />
                
            </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default HelpDeskPage;