# Grudge Wallet System

## Overview
Server-side Solana wallet generation with Grudge ID system. Each wallet has a unique Grudge ID that prefixes the Solana address with "GRD".

## Grudge ID Format
```
GRD{solanaAddress}
```
Example: `GRDAbC123...xyz` where `AbC123...xyz` is the Solana public key address.

## API Endpoints

### Create New Wallet
**POST** `/api/wallet/create`

Creates a new server-side Solana wallet and returns the Grudge ID.

**Response:**
```json
{
  "success": true,
  "grudgeId": "GRDAbC123...xyz",
  "solanaAddress": "AbC123...xyz",
  "publicKey": "AbC123...xyz",
  "privateKey": "base58EncodedPrivateKey"
}
```

⚠️ **Security Warning**: In production, NEVER send the `privateKey` to the client. Store it securely in your database encrypted.

### Get Wallet by Grudge ID
**GET** `/api/wallet/:grudgeId`

Retrieves public wallet information for a given Grudge ID.

**Response:**
```json
{
  "success": true,
  "grudgeId": "GRDAbC123...xyz",
  "solanaAddress": "AbC123...xyz"
}
```

## Usage Examples

### Client-Side (TypeScript/React)

```typescript
import { walletApi } from '@/lib/api';

// Create a new wallet
const wallet = await walletApi.createWallet();
console.log('Your Grudge ID:', wallet.grudgeId);

// Get wallet info
const walletInfo = await walletApi.getWallet('GRDAbC123...xyz');
console.log('Solana Address:', walletInfo.solanaAddress);
```

### Using the Safe Fetch Wrapper

```typescript
import { safeFetch, walletApi } from '@/lib/api';

// Safely fetch - returns null on error instead of throwing
const wallet = await safeFetch(() => walletApi.createWallet());

if (wallet) {
  console.log('Wallet created:', wallet.grudgeId);
} else {
  console.log('Failed to create wallet');
}
```

## Error Handling

The API utility (`client/src/lib/api.ts`) includes:

1. **JSON validation**: Ensures responses are JSON, not HTML
2. **Proper error messages**: Returns meaningful errors instead of parse failures
3. **Type safety**: Full TypeScript support with interfaces
4. **Safe fetch helper**: Optional non-throwing variant

### Error Prevention

The errors you were seeing:
- `Failed to fetch Overdrive tracks`
- `Failed to fetch leaderboard`
- `Failed to fetch MMO sprites/animations`

These occurred because:
1. Browser extensions or cached code tried to fetch from non-existent endpoints
2. The endpoints returned HTML (404 page) instead of JSON
3. JSON.parse() failed on the HTML response

**Solution**: Use the new `apiFetch` wrapper which validates content-type before parsing.

## Puter Integration (Optional)

Puter.js is currently **disabled** in `client/index.html`. It's commented out to make it optional, not required.

To enable Puter for cloud features:
```html
<!-- Uncomment this line in client/index.html -->
<script src="https://js.puter.com/v2/"></script>
```

The app works without Puter. Enable it only when you need cloud storage features.

## Security Best Practices

### In Development
- Private keys are returned to client for testing
- Store in localStorage or session storage temporarily

### In Production
1. **NEVER** send private keys to the client
2. Store private keys encrypted in your database
3. Use environment variables for encryption keys
4. Implement user authentication before wallet creation
5. Add rate limiting to wallet creation endpoint
6. Log all wallet operations for audit

### Database Schema (Recommended)

```sql
CREATE TABLE grudge_wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  grudge_id VARCHAR(100) UNIQUE NOT NULL,
  solana_address VARCHAR(100) NOT NULL,
  encrypted_private_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Next Steps

1. Add database integration for wallet storage
2. Implement user authentication
3. Add wallet balance checking via Solana RPC
4. Implement token transfers
5. Add transaction history
6. Implement wallet recovery mechanism

## Dependencies

```json
{
  "@solana/web3.js": "Latest",
  "bs58": "Latest"
}
```

Install with:
```bash
npm install @solana/web3.js bs58
```
