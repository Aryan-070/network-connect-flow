import React, { useEffect, useState } from "react";
import UserCard, { User } from "./UserCard";
import SessionList, { Session } from "./SessionList";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import ConnectionToggle from "./ConnectionToggle";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectionListProps {
  onRestart: () => void;
  name: string;
  user: User;
}

const ConnectionList = ({ onRestart, name,user }: ConnectionListProps) => {
  const [activeView, setActiveView] = useState<"networking" | "sessions">(
    "networking"
  );
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [recommendedSessions, setRecommendedSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const [networkRes, sessionRes] = await Promise.all([
          fetch(
            `http://127.0.0.1:5000/networking_recommendations?name=${name}`
          ),
          fetch(
            `http://127.0.0.1:5000/session_recommendations?name=${name}`
          ),
        ]);

        if (!networkRes.ok || !sessionRes.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const [networkData, sessionData] = await Promise.all([
          networkRes.json(),
          sessionRes.json(),
        ]);

        console.log("Network API Response:", networkData);
        console.log("Session API Response:", sessionData);

        // Transform user data
        const transformedUsers = networkData.map(
          (
            user: {
              name: string;
              company: string;
              match_score: string;
              source: string;
              designation: string;
              reasoning: string;
            },
            index: number
          ) => ({
            id: (index + 1).toString(),
            name: user.name,
            role: user.designation,
            company: user.company,
            profileMatchPercentage: user.match_score,
            type: user.source,
            avatarUrl: `https://picsum.photos/seed/user${index + 1}/150/150`,
            linkedinUrl: "https://linkedin.com/in/placeholder",
            summary: user.reasoning,
          })
        );

        // Transform session data
        const transformedSessions = sessionData.map(
          (
            session: { 
              name: string;
              match_score: number;
              reasoning: string
            },
            index: number
          ) => ({
            id: (index + 1).toString(),
            name: session.name,
            match_score: session.match_score,
            reasoning: session.reasoning,
            imageUrl: `https://picsum.photos/seed/user${index + 1}/600/400`
          })
        );

        setRecommendedUsers(transformedUsers);
        setRecommendedSessions(transformedSessions);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message);
        } else {
          console.error("An unexpected error occurred:", err);
          setError(
            "An unexpected error occurred while fetching recommendations"
          );
        }
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchRecommendations();
  }, [name]);

  return (
    <div className="w-full mx-auto">
      <ConnectionToggle activeView={activeView} onViewChange={setActiveView} />

      <AnimatePresence mode="wait">
        {activeView === "networking" ? (
          <motion.div
            key="networking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">
                Recommended Connections
              </h1>
              <p className="text-muted-foreground">
                Based on your LinkedIn profile and industry
              </p>
              <p className="text-muted-foreground">Welcome, {name}!</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedUsers.map((user) => (
                  <UserCard key={user.id} user={user} name={name} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SessionList sessions={recommendedSessions} onRestart={onRestart} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={onRestart} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ConnectionList;
