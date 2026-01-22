import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Challenge } from '@/types/battle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Swords, Trophy, Skull } from 'lucide-react';

export default function BattleArena() {
  const [location, setLocation] = useLocation();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [battleState, setBattleState] = useState<'preparation' | 'fighting' | 'victory' | 'defeat'>('preparation');
  const [heroHp, setHeroHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);

  useEffect(() => {
    const stored = localStorage.getItem('active-challenge');
    if (stored) {
      const challengeData = JSON.parse(stored);
      setChallenge(challengeData);
    } else {
      setLocation('/battle-board');
    }
  }, [setLocation]);

  const startBattle = () => {
    setBattleState('fighting');
    simulateBattle();
  };

  const simulateBattle = () => {
    // Simplified battle simulation
    let heroHealth = 100;
    let enemyHealth = 100;
    
    const interval = setInterval(() => {
      // Random damage exchange
      const heroDamage = Math.floor(Math.random() * 20) + 10;
      const enemyDamage = Math.floor(Math.random() * 15) + 5;
      
      enemyHealth = Math.max(0, enemyHealth - heroDamage);
      heroHealth = Math.max(0, heroHealth - enemyDamage);
      
      setEnemyHp(enemyHealth);
      setHeroHp(heroHealth);
      
      if (enemyHealth <= 0) {
        clearInterval(interval);
        setBattleState('victory');
        handleVictory();
      } else if (heroHealth <= 0) {
        clearInterval(interval);
        setBattleState('defeat');
      }
    }, 1000);
  };

  const handleVictory = () => {
    if (!challenge) return;
    
    // Update board data with rewards
    const boardDataStr = localStorage.getItem('battle-board-data');
    if (boardDataStr) {
      const boardData = JSON.parse(boardDataStr);
      boardData.guxBalance += challenge.rewards.gux;
      
      // Mark challenge as completed
      boardData.challenges = boardData.challenges.map((c: Challenge) => 
        c.id === challenge.id ? { ...c, completed: true } : c
      );
      
      localStorage.setItem('battle-board-data', JSON.stringify(boardData));
    }
  };

  const returnToBoard = () => {
    localStorage.removeItem('active-challenge');
    setLocation('/battle-board');
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={returnToBoard} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Board
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <p className="text-slate-400">{challenge.composition}</p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {battleState === 'preparation' && (
          <Card className="p-8 text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Prepare for Battle!</h2>
              <p className="text-slate-400">{challenge.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-left">
                <div className="text-sm text-slate-400">Enemies</div>
                <div className="text-lg font-semibold">
                  {challenge.enemies.length}x {challenge.enemies[0]?.name}
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm text-slate-400">Rewards</div>
                <div className="text-lg font-semibold text-yellow-500">
                  {challenge.rewards.gux} Gux
                </div>
              </div>
            </div>

            <Button onClick={startBattle} className="gap-2" size="lg">
              <Swords className="w-5 h-5" />
              Start Battle
            </Button>
          </Card>
        )}

        {battleState === 'fighting' && (
          <div className="space-y-8">
            {/* Enemy */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">{challenge.enemies[0]?.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>HP</span>
                    <span>{enemyHp}/100</span>
                  </div>
                  <Progress value={enemyHp} className="h-4" />
                </div>
                <div className="text-6xl">⚔️</div>
              </div>
            </Card>

            {/* Battle Log */}
            <div className="text-center text-lg font-semibold">
              ⚡ Battle in Progress ⚡
            </div>

            {/* Heroes */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Your Heroes</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>HP</span>
                    <span>{heroHp}/100</span>
                  </div>
                  <Progress value={heroHp} className="h-4" />
                </div>
                <div className="text-6xl">🛡️</div>
              </div>
            </Card>
          </div>
        )}

        {battleState === 'victory' && (
          <Card className="p-8 text-center space-y-6 bg-gradient-to-b from-green-900/20 to-slate-800 border-green-500">
            <div className="space-y-2">
              <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
              <h2 className="text-3xl font-bold text-green-400">Victory!</h2>
              <p className="text-slate-300">You have defeated {challenge.enemies[0]?.name}</p>
            </div>

            <div className="space-y-2">
              <div className="text-lg">Rewards Earned:</div>
              <div className="text-2xl font-bold text-yellow-500">
                +{challenge.rewards.gux} Gux
              </div>
              <div className="text-lg text-blue-400">
                +{challenge.rewards.exp} XP
              </div>
            </div>

            <Button onClick={returnToBoard} size="lg">
              Return to Battle Board
            </Button>
          </Card>
        )}

        {battleState === 'defeat' && (
          <Card className="p-8 text-center space-y-6 bg-gradient-to-b from-red-900/20 to-slate-800 border-red-500">
            <div className="space-y-2">
              <Skull className="w-24 h-24 mx-auto text-red-500" />
              <h2 className="text-3xl font-bold text-red-400">Defeat</h2>
              <p className="text-slate-300">Your heroes have fallen...</p>
            </div>

            <Button onClick={returnToBoard} size="lg" variant="outline">
              Return to Battle Board
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
