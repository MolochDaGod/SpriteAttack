import { useState } from "react";
import { walletApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface WalletData {
  grudgeId: string;
  solanaAddress: string;
  publicKey: string;
  privateKey?: string;
}

export function WalletExample() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newWallet = await walletApi.createWallet();
      setWallet(newWallet);
      
      // In a real app, save the privateKey securely
      // For demo purposes, we're just showing it
      console.log("Wallet created:", newWallet);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to create wallet: ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Grudge Wallet System</CardTitle>
          <CardDescription>
            Server-side Solana wallet with Grudge ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!wallet ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Create a new Grudge wallet to get started. Your Grudge ID will be your Solana address prefixed with "GRD".
              </p>
              <Button 
                onClick={createNewWallet} 
                disabled={loading}
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div>
                  <label className="text-sm font-medium">Grudge ID</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                    {wallet.grudgeId}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Solana Address</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                    {wallet.solanaAddress}
                  </p>
                </div>

                {wallet.privateKey && (
                  <div>
                    <label className="text-sm font-medium text-destructive">
                      Private Key (⚠️ Keep Secret)
                    </label>
                    <p className="text-xs text-muted-foreground mb-1">
                      Never share this with anyone!
                    </p>
                    <p className="text-sm font-mono bg-destructive/10 p-2 rounded break-all">
                      {wallet.privateKey}
                    </p>
                  </div>
                )}
              </div>

              <Alert>
                <AlertDescription className="text-xs">
                  <strong>Development Mode:</strong> In production, private keys should NEVER be sent to the client. 
                  They should be stored encrypted in your database.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={createNewWallet} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Another Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
