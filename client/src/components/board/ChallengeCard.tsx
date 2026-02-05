import { Challenge } from '@/types/battle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Swords, Star, Trophy, Clock } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept: (challengeId: string) => void;
}

const factionColors: Record<string, string> = {
  crusade: 'bg-yellow-500',
  fabled: 'bg-blue-500',
  legion: 'bg-red-500',
  worge: 'bg-green-500',
  demon: 'bg-purple-500'
};

const difficultyStars = (difficulty: number) => {
  return Array.from({ length: difficulty }, (_, i) => (
    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
  ));
};

const compositionLabel = (composition: string) => {
  const labels: Record<string, string> = {
    '3v2': '3 vs 2 (Easy)',
    '3v3': '3 vs 3 (Normal)',
    '3v4': '3 vs 4 (Hard)',
    '3v1-miniboss': '3 vs 1 Mini-Boss',
    '3v1-boss': '3 vs 1 BOSS'
  };
  return labels[composition] || composition;
};

export function ChallengeCard({ challenge, onAccept }: ChallengeCardProps) {
  const timeRemaining = Math.max(0, challenge.expiresAt.getTime() - Date.now());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Swords className="w-5 h-5" />
              {challenge.title}
            </CardTitle>
            <CardDescription className="mt-1">{challenge.description}</CardDescription>
          </div>
          <div className="flex gap-1">
            {difficultyStars(challenge.difficulty)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className={factionColors[challenge.faction]}>
            {challenge.faction.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            {compositionLabel(challenge.composition)}
          </Badge>
          <Badge variant="secondary">
            {challenge.type.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{challenge.rewards.gux} Gux</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span>{challenge.rewards.exp} XP</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            Expires in {hoursRemaining}h {minutesRemaining}m
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onAccept(challenge.id)}
          disabled={challenge.completed}
        >
          {challenge.completed ? 'Completed' : 'Accept Challenge'}
        </Button>
      </CardFooter>
    </Card>
  );
}
