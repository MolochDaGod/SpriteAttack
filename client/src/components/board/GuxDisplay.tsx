import { Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GuxDisplayProps {
  amount: number;
}

export function GuxDisplay({ amount }: GuxDisplayProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50">
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <div>
          <div className="text-sm text-muted-foreground">Your Balance</div>
          <div className="text-2xl font-bold text-yellow-500">{amount.toLocaleString()} Gux</div>
        </div>
      </div>
    </Card>
  );
}
