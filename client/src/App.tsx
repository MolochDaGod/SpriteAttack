import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import BattleBoard from "@/pages/BattleBoard";
import BattleArena from "@/pages/BattleArena";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      
      {/* Protected routes */}
      <Route path="/battle-board">
        <ProtectedRoute>
          <BattleBoard />
        </ProtectedRoute>
      </Route>
      <Route path="/battle-arena">
        <ProtectedRoute>
          <BattleArena />
        </ProtectedRoute>
      </Route>
      
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
