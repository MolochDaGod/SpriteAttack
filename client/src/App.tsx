import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { WalletExample } from "@/components/WalletExample";
import BattleBoard from "@/pages/BattleBoard";
import BattleArena from "@/pages/BattleArena";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={WalletExample} />
      <Route path="/battle-board" component={BattleBoard} />
      <Route path="/battle-arena" component={BattleArena} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
