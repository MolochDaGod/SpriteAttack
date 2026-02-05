# Grudge 2D Heroes - Tactical RPG Sprite System

A browser-based tactical RPG featuring 21 animated character sprites with a tiered equipment system and strategic turn-based combat.

## 🎮 Features

- **21 Character Archetypes** - Knights, Wizards, Orcs, Skeletons, and more
- **9-Tier Equipment System** (T0-T8) - From Rusty to Divine
- **PixiJS Animation Engine** - Smooth sprite-based combat
- **3 Factions** - Crusade, Fabled, Legion
- **Turn-Based Tactical Combat** - Grid-based strategic gameplay
- **React + TypeScript** - Modern web stack

## 📚 Documentation

- **[SPRITE_SYSTEM_DOCS.md](./SPRITE_SYSTEM_DOCS.md)** - Complete technical documentation
- **[CHARACTER_REFERENCE.md](./CHARACTER_REFERENCE.md)** - Tactical gameplay guide
- **[GAMEPLAY_DESIGN.md](./GAMEPLAY_DESIGN.md)** - Game design document

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5000` (or your configured port)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

This project is configured for one-click Vercel deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MolochDaGod/SpriteAttack)

**Manual Deployment:**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Follow the prompts to link your GitHub repository

**Configuration:**
- Build Command: `vite build`
- Output Directory: `dist/public`
- Install Command: `npm install`

### Environment Variables

Create a `.env` file for local development:

```env
NODE_ENV=development
# Add your environment variables here
```

For production, set these in your Vercel project settings.

## 🔐 Authentication

This game integrates with **grudgewarlords.com** as the main authentication server.

### How It Works:

1. **Login**: User clicks login → Redirects to `grudgewarlords.com/login`
2. **Auth**: User authenticates on grudgewarlords.com
3. **Callback**: User returns to Sprite Attack with auth token
4. **Session**: Token stored in localStorage and used for API calls

### Usage:

```typescript
import { auth } from '@/lib/auth';

// Login
await auth.login(); // Redirects to grudgewarlords.com

// Check session
const user = await auth.verifySession();
if (user) {
  console.log('Logged in as:', user.username);
}

// Logout
await auth.logout();
```

### Architecture:

```
grudgewarlords.com          (Main Auth Server)
    ├── User Login/Register
    ├── OAuth Provider
    └── Session Management
          |
          v
sprite-attack.vercel.app   (This Game)
    ├── Frontend (React)
    ├── API Routes (/api/*)
    └── Auth Integration
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Rendering**: PixiJS (2D sprites), Three.js (3D models)
- **Styling**: Tailwind CSS, Shadcn/UI
- **Backend**: Express.js (optional for API)
- **Animation**: Framer Motion
- **State**: TanStack Query

## 📦 Project Structure

```
Grudge-RPG-Sprite-Attack/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Utility libraries
│   │   ├── renderer/     # PixiJS sprite animator
│   │   └── pages/        # Route pages
│   └── public/           # Static assets
├── server/               # Express backend (optional)
├── shared/              # Shared types/schemas
├── dist/                # Build output
└── attached_assets/     # Large binary assets (gitignored)
```

## 🎨 Sprite System

The sprite system includes:

- **Base Animations**: Idle, Walk, Death, Hurt
- **Combat Animations**: Attack 1-3, Block, Heal
- **Effect Layers**: VFX compositing
- **Projectiles**: Arrow/spell effects
- **Faction Tints**: Procedural color variations

See [SPRITE_SYSTEM_DOCS.md](./SPRITE_SYSTEM_DOCS.md) for full details.

## 🎯 Game Modes

1. **Campaign Mode** - 50+ battles across 5 chapters
2. **Arena Mode** - Endless wave survival
3. **PvP Battles** - Player vs Player (coming soon)
4. **Raid Bosses** - Co-op boss fights (coming soon)

## 🔧 Development

### Build Commands

```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run start        # Run production build
npm run check        # TypeScript type checking
```

### Adding New Characters

1. Add sprite sheets to appropriate folder
2. Register in `client/src/lib/spriteManifest.ts`
3. Configure animations and frame counts
4. Test in `/admin-sprites` page

See the [Asset Pipeline](./SPRITE_SYSTEM_DOCS.md#asset-pipeline) section for details.

## 🐛 Known Issues

- Large asset files not included in repository (use local `attached_assets/`)
- Backend API routes need serverless function conversion for Vercel
- Some Three.js 3D features may require WebGL2 support

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📧 Contact

- GitHub: [@MolochDaGod](https://github.com/MolochDaGod)
- Repository: [SpriteAttack](https://github.com/MolochDaGod/SpriteAttack)

## 🙏 Credits

- **Sprite Assets**: Grudge RPG 2D Asset Pack
- **Rendering**: PixiJS v8.15.0
- **Documentation**: Warp AI Agent Mode

---

**Last Updated**: January 2026  
**Version**: 1.0.0

Made with ⚔️ for tactical RPG fans
