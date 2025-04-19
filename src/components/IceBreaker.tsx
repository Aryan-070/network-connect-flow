import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, Sparkles } from "lucide-react";
import type { User } from './UserCard';
import React, { useEffect, useState } from "react";

interface IceBreakingOptionsProps {
  user: User;
  name: string;
  onSelect: (message: string) => void;
  selected: string;
}

const IceBreakingOptions = ({ user, onSelect, selected, name}: IceBreakingOptionsProps) => {
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [options, setOptions] = useState<string[]>([]); 
    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          setLoading(true); // Set loading to true before fetching data
          // console.log("Fetching Ice Breaking Messages...");
          console.log("User Name:", user.name); 
          console.log("Selected Name:", name);
          // Fetch data from the backend
          const response = await fetch(
            `http://127.0.0.1:5000/icebreaking_recommendation?networking_name=${user.name}&name=${name}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch Ice Breaking Messages");
          }

          const data = await response.json(); // Parse JSON response
          if (Array.isArray(data)) {
            // Extract the 'message' field from each object
            const messages = data.map((item: { message: string }) => item.message);
            setOptions(messages); // Update options with extracted messages
          } else {
            throw new Error("Invalid response format from server.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
            setError(err.message);
          } else {
            console.error("An unexpected error occurred:", err);
            setError(
              "An unexpected error occurred while fetching recommendations."
            );
          }
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };

      fetchRecommendations();
    }, [name, user.name]); // Add dependencies to ensure the effect runs when these values change

  
  const handleCardClick = (option: string) => {
    onSelect(option);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Ice Breaking Messages</h3>
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading recommendations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <RadioGroup
          value={selected}
          onValueChange={onSelect}
          className="grid gap-4"
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(option)}
              className={`
                relative group cursor-pointer rounded-xl border p-4 
                transition-all duration-300 ease-in-out
                hover:border-primary hover:shadow-lg hover:-translate-y-1
                ${selected === option ? 'border-primary bg-primary/5 shadow-md' : 'hover:bg-accent'}
              `}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`option-${index}`} 
                  className={`
                    flex-1 cursor-pointer text-base leading-relaxed
                    transition-colors duration-200
                    ${selected === option ? 'text-primary font-medium' : 'text-foreground'}
                  `}
                >
                  {option}
                </Label>
              </div>
              
              {selected === option && (
                <div className="absolute -right-1 -top-1 h-3 w-3">
                  <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></div>
                  <div className="relative inline-flex h-3 w-3 rounded-full bg-primary"></div>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};
export default IceBreakingOptions;