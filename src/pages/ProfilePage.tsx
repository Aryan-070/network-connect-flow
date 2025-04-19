import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Mail,
    MessageSquare,
    MessageCircle,
    Share2,
    Send
} from "lucide-react";
import type { User } from '@/components/UserCard';
import IceBreakingOptions from '@/components/IceBreaker';

const ProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showIceBreakers, setShowIceBreakers] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState('');

    // Fetch data from the state passed via navigate
    const { user, name, gradient } = location.state || {};

    if (!user || !name || !gradient) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
                <Button onClick={() => navigate('/')}>Go Back</Button>
            </div>
        );
    }

    const handleShareEmail = () => {
        if (selectedMessage) {
            window.location.href = `mailto:?subject=Let's Connect&body=${encodeURIComponent(selectedMessage)}`;
        }
    };

    const handleShareWhatsApp = () => {
        if (selectedMessage) {
            window.open(`https://wa.me/?text=${encodeURIComponent(selectedMessage)}`, '_blank');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-6"
            >
                Back
            </Button>

            <Card className="max-w-2xl mx-auto">
                {/* Use the gradient passed via state */}
                <div className={`aspect-[3/1] bg-gradient-to-r ${gradient}`} />
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="relative -mt-12">
                            <div className="h-24 w-24 rounded-full border-4 border-background bg-background overflow-hidden">
                                <img
                                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">{user.role}</p>
                            <p className="text-muted-foreground">{user.company}</p>
                        </div>
                    </div>

                    {!showIceBreakers ? (
                        <Button
                            className="w-full mt-6"
                            onClick={() => setShowIceBreakers(true)}
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Show Ice Breaking Conversation
                        </Button>
                    ) : (
                        <div className="mt-6 space-y-4">
                            <IceBreakingOptions
                                user={user}
                                onSelect={setSelectedMessage}
                                selected={selectedMessage}
                                name={name} // Pass the name as networking_name
                            />

                            {selectedMessage && (
                                <div className="flex gap-2 mt-4">
                                    <Button onClick={handleShareEmail} variant="outline" className="flex-1">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send via Email
                                    </Button>
                                    <Button onClick={handleShareWhatsApp} variant="outline" className="flex-1">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Send via WhatsApp
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;