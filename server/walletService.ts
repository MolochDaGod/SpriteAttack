import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export interface GrudgeWallet {
  grudgeId: string; // SOL address prefixed with GRD
  solanaAddress: string;
  privateKey: string; // Base58 encoded - MUST BE STORED SECURELY
  publicKey: string; // Base58 encoded
}

/**
 * Generate a server-side Solana wallet with Grudge ID
 * Grudge ID format: GRD{solanaAddress}
 */
export function createGrudgeWallet(): GrudgeWallet {
  // Generate new Solana keypair
  const keypair = Keypair.generate();
  
  const solanaAddress = keypair.publicKey.toBase58();
  const grudgeId = `GRD${solanaAddress}`;
  
  return {
    grudgeId,
    solanaAddress,
    privateKey: bs58.encode(keypair.secretKey),
    publicKey: solanaAddress,
  };
}

/**
 * Import a wallet from private key
 */
export function importGrudgeWallet(privateKeyBase58: string): GrudgeWallet {
  const secretKey = bs58.decode(privateKeyBase58);
  const keypair = Keypair.fromSecretKey(secretKey);
  
  const solanaAddress = keypair.publicKey.toBase58();
  const grudgeId = `GRD${solanaAddress}`;
  
  return {
    grudgeId,
    solanaAddress,
    privateKey: privateKeyBase58,
    publicKey: solanaAddress,
  };
}

/**
 * Get public wallet info from Grudge ID
 */
export function getWalletFromGrudgeId(grudgeId: string): { solanaAddress: string } | null {
  if (!grudgeId.startsWith("GRD")) {
    return null;
  }
  
  const solanaAddress = grudgeId.substring(3);
  return { solanaAddress };
}

/**
 * Validate Grudge ID format
 */
export function isValidGrudgeId(grudgeId: string): boolean {
  if (!grudgeId.startsWith("GRD")) {
    return false;
  }
  
  const solanaAddress = grudgeId.substring(3);
  
  // Basic validation: Solana addresses are base58 strings of 32-44 characters
  return solanaAddress.length >= 32 && solanaAddress.length <= 44;
}
