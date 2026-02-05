# Troubleshooting Guide

## Browser Console Errors

### Puter API Errors (401/400)
```
api.puter.com/whoami:1 Failed to load resource: the server responded with a status of 401
WebSocket connection to 'wss://api.puter.com/socket.io/...' failed
```

**Cause**: Puter.js script is commented out in `client/index.html`, but browser extensions or cached code may still try to connect.

**Solution**:
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard reload the page (Ctrl+Shift+R)
3. Disable browser extensions that might inject code
4. These errors are harmless if you're not using Puter features

### JSON Parse Errors (installHook.js)
```
Failed to fetch Overdrive tracks: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
Failed to fetch leaderboard: ...
Failed to fetch MMO sprites: ...
```

**Cause**: Code is trying to fetch from endpoints that don't exist, receiving HTML instead of JSON.

**Solutions**:

1. **Clear Browser Cache**: Old code might be cached
   ```
   Ctrl+Shift+Del (Chrome/Edge)
   Cmd+Shift+Del (Mac)
   ```

2. **Disable React DevTools**: The `installHook.js` filename suggests React DevTools might be making these requests
   - Temporarily disable the React DevTools extension
   - Reload the page

3. **Check for Old Service Workers**:
   ```javascript
   // In browser console:
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(r => r.unregister());
   });
   ```

4. **Use the New API Utility**: Always use the `apiFetch` wrapper from `@/lib/api`:
   ```typescript
   import { apiFetch } from '@/lib/api';
   
   // This will catch HTML responses before JSON.parse
   const data = await apiFetch('/api/endpoint');
   ```

### WebSocket Errors
```
WebSocket connection to 'wss://api.puter.com/socket.io/...' failed
```

**Cause**: Puter integration is disabled

**Solution**: These are expected when Puter is disabled. They're harmless warnings, not errors.

## Making Puter Optional

Puter is already optional! The script is commented out:

```html
<!-- client/index.html -->
<!-- Puter.js disabled for now - enable when needed for cloud features -->
<!-- <script src="https://js.puter.com/v2/"></script> -->
```

To enable Puter features:
1. Uncomment the script tag
2. Implement Puter authentication in your app
3. Add error handling for when Puter is unavailable

## Best Practices for API Calls

### ✅ DO: Use the API Utility
```typescript
import { walletApi, gameApi, apiFetch } from '@/lib/api';

// Type-safe, error-handled
const wallet = await walletApi.createWallet();

// Custom endpoint
const data = await apiFetch('/api/custom');
```

### ❌ DON'T: Use Raw Fetch
```typescript
// This can fail with HTML responses
const res = await fetch('/api/endpoint');
const data = await res.json(); // Error if HTML returned!
```

### ✅ DO: Use Safe Fetch for Optional Data
```typescript
import { safeFetch, walletApi } from '@/lib/api';

// Returns null on error, doesn't throw
const wallet = await safeFetch(() => walletApi.createWallet());

if (wallet) {
  console.log('Success:', wallet.grudgeId);
} else {
  console.log('Failed gracefully');
}
```

## Development Server

### Start the Server
```bash
npm run dev
```

### Common Issues

**Port Already in Use**:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change port in server/index.ts
const port = parseInt(process.env.PORT || "5001", 10);
```

**TypeScript Errors**:
```bash
npm run check
```

**Missing Dependencies**:
```bash
npm install
```

## Testing the Wallet System

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:5000`

3. You should see the Wallet Example page

4. Click "Create Wallet" to test the system

5. Check Network tab in DevTools to see API calls

## Expected Behavior

✅ **Working**:
- Wallet creation returns Grudge ID
- Grudge ID format: `GRD{solanaAddress}`
- API calls return JSON
- Errors are caught and displayed nicely

❌ **Not Working** (needs fixing):
- If you see HTML in API responses
- If private keys aren't generated
- If Grudge IDs don't have "GRD" prefix

## Need Help?

1. Check browser console for specific errors
2. Check server console (terminal running `npm run dev`)
3. Verify endpoints exist in `server/routes.ts`
4. Test with curl:
   ```bash
   curl -X POST http://localhost:5000/api/wallet/create
   ```
