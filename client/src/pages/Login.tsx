import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Swords } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has auth token from URL callback
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      auth.handleCallback(token);
      // Clear token from URL
      window.history.replaceState({}, '', window.location.pathname);
      // Redirect to battle board
      setLocation('/battle-board');
      return;
    }

    // Check existing session
    const checkSession = async () => {
      try {
        const user = await auth.verifySession();
        if (user) {
          setLocation('/battle-board');
        }
      } catch (err) {
        setError('Failed to verify session');
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [setLocation]);

  const handleLogin = async () => {
    try {
      await auth.login(); // Redirects to grudgewarlords.com
    } catch (err) {
      setError('Failed to initiate login');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Swords className="w-16 h-16 text-blue-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Grudge RPG Sprite Attack</CardTitle>
          <CardDescription>
            Epic turn-based battles with 24 heroes across 5 factions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 text-center text-sm text-muted-foreground">
            <p>
              This game uses <strong>Grudge Warlords</strong> unified authentication system.
            </p>
            <p>
              You'll be redirected to <strong>grudgewarlords.com</strong> to log in or create an account.
            </p>
          </div>

          <Button 
            onClick={handleLogin}
            size="lg"
            className="w-full gap-2"
          >
            <Shield className="w-5 h-5" />
            Login with Grudge Warlords
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            <p>New to Grudge? An account will be created automatically.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
