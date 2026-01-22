import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await auth.verifySession();
        if (user) {
          setAuthenticated(true);
        } else {
          setLocation('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setLocation('/login');
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-lg">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
