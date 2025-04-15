
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Navigation, HelpCircle, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeOption: string;
  onSelectOption: (option: string) => void;
}

const AppSidebar = ({ activeOption, onSelectOption }: SidebarProps) => {
  const navigate = useNavigate();

  const handleOptionClick = (option: string) => {
    onSelectOption(option);
    navigate('/');
  };

  const menuItems = [
    {
      title: "AI Navigation",
      id: "navigation",
      icon: Navigation,
    },
    {
      title: "AI Helpdesk",
      id: "helpdesk",
      icon: HelpCircle,
    },
    {
      title: "AI Network Recommendation",
      id: "network",
      icon: Users,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AI Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeOption === item.id} 
                    onClick={() => handleOptionClick(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
