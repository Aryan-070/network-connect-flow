import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Linkedin } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  role: string;
  type: string;
  company: string;
  profileMatchPercentage: number;
  avatarUrl: string;
  linkedinUrl: string;
  summary: string;
}

interface UserCardProps {
  user: User;
  name: string; // Add `name` as a separate prop
}

// Predefined set of light gradient color combinations
const gradients = [
  "from-pink-100 to-pink-200",
  "from-blue-100 to-blue-200",
  "from-green-100 to-green-200",
  "from-yellow-100 to-yellow-200",
  "from-purple-100 to-purple-200",
  "from-teal-100 to-teal-200",
  "from-orange-100 to-orange-200",
];

const UserCard = ({ user, name }: UserCardProps) => {
  const navigate = useNavigate();
  // Generate a random gradient based on the user's ID
  const gradient = gradients[parseInt(user.id, 10) % gradients.length];
  const handleViewProfile = () => {
    navigate('/profile', { state: { user, name,gradient } });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {/* Apply the random gradient */}
      <div className={`aspect-[5/2] bg-gradient-to-r ${gradient}`} />
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
            <p className="text-sm text-red-500 font-bold">Source : <span className="capitalize">{user.type}</span></p>
            <p className="text-sm text-muted-foreground">{user.company}</p>
          </div>
        </div>
      </CardContent>
      <CardDescription className="px-6 pb-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Profile Match:</strong> {user.profileMatchPercentage} match
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Why this person is a match:</strong> <span className="capitalize">{user.summary}</span>
        </p>
      </CardDescription>
      <CardFooter className="flex justify-between p-6 pt-2">
        <Button variant="outline" size="sm" className="flex-1 mr-2" onClick={handleViewProfile}>
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
