import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Challenge } from '@/types/battle';
import { generateChallengeBoard, refreshExpiredChallenges } from '@/lib/challenges/challengeGenerator';
import { ChallengeCard } from '@/components/board/ChallengeCard';
import { GuxDisplay } from '@/components/board/GuxDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sword } from 'lucide-react';

const STORAGE_KEY = 'battle-board-data';

interface BoardData {
  challenges: Challenge[];
  guxBalance: number;
  lastRefresh: string;
}

function loadBoardData(): BoardData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    // Convert date strings back to Date objects
    data.challenges = data.challenges.map((c: any) => ({
      ...c,
      expiresAt: new Date(c.expiresAt)
    }));
    return data;
  }
  
  return {
    challenges: generateChallengeBoard(8),
    guxBalance: 500, // Starting balance
    lastRefresh: new Date().toISOString()
  };
}

function saveBoardData(data: BoardData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function BattleBoard() {
  const [, setLocation] = useLocation();
  const [boardData, setBoardData] = useState<BoardData>(loadBoardData);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    saveBoardData(boardData);
  }, [boardData]);

  useEffect(() => {
    // Auto-refresh expired challenges every minute
    const interval = setInterval(() => {
      setBoardData(prev => {
        const refreshed = refreshExpiredChallenges(prev.challenges);
        if (JSON.stringify(refreshed) !== JSON.stringify(prev.challenges)) {
          return { ...prev, challenges: refreshed, lastRefresh: new Date().toISOString() };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptChallenge = (challengeId: string) => {
    const challenge = boardData.challenges.find(c => c.id === challengeId);
    if (challenge) {
      // Store selected challenge for battle arena
      localStorage.setItem('active-challenge', JSON.stringify(challenge));
      setLocation('/battle-arena');
    }
  };

  const handleManualRefresh = () => {
    setBoardData({
      challenges: generateChallengeBoard(8),
      guxBalance: boardData.guxBalance,
      lastRefresh: new Date().toISOString()
    });
  };

  const filteredChallenges = boardData.challenges.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'easy') return c.difficulty <= 2;
    if (filter === 'hard') return c.difficulty >= 4;
    if (filter.startsWith('faction-')) {
      const faction = filter.replace('faction-', '');
      return c.faction === faction;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sword className="w-10 h-10" />
              Battle Board
            </h1>
            <p className="text-slate-400 mt-2">
              Choose your challenge and prove your strength
            </p>
          </div>
          <Button 
            onClick={handleManualRefresh}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Board
          </Button>
        </div>

        {/* Gux Display */}
        <GuxDisplay amount={boardData.guxBalance} />

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Challenges
          </Button>
          <Button
            variant={filter === 'easy' ? 'default' : 'outline'}
            onClick={() => setFilter('easy')}
          >
            Easy (★★)
          </Button>
          <Button
            variant={filter === 'hard' ? 'default' : 'outline'}
            onClick={() => setFilter('hard')}
          >
            Hard (★★★★+)
          </Button>
          <div className="border-l border-slate-600 mx-2" />
          {['crusade', 'fabled', 'legion', 'worge', 'demon'].map(faction => (
            <Button
              key={faction}
              variant={filter === `faction-${faction}` ? 'default' : 'outline'}
              onClick={() => setFilter(`faction-${faction}`)}
              className="capitalize"
            >
              {faction}
            </Button>
          ))}
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onAccept={handleAcceptChallenge}
            />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No challenges match your filters. Try selecting different options.
          </div>
        )}
      </div>
    </div>
  );
}
