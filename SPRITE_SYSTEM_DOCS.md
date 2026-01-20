# Grudge 2D Heroes - Sprite System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Character Sprite System](#character-sprite-system)
3. [Animation System](#animation-system)
4. [Equipment & Customization](#equipment--customization)
5. [Combat Visual Effects](#combat-visual-effects)
6. [Integration Guide](#integration-guide)
7. [Performance Optimization](#performance-optimization)
8. [Asset Pipeline](#asset-pipeline)

---

## System Overview

The Grudge 2D Heroes sprite system is a comprehensive modular character rendering framework built for tactical RPG gameplay. It combines:

- **21 Character Archetypes** with unique animations
- **Tiered Equipment System** (9 tiers: T0-T8)
- **Split Effect Layers** for combat VFX
- **Projectile System** for ranged attacks
- **Faction-based Color Tinting**
- **PixiJS-powered Rendering** with state machine animations

### Key Features

✅ **Modular Design**: Base sprites, effects, and projectiles separated for composition  
✅ **Procedural Tinting**: Faction colors applied via hue-rotate filters  
✅ **Equipment Visualization**: Weapon and armor tier badges with glow effects  
✅ **State Machine**: Smooth transitions between idle, walk, attack, death, etc.  
✅ **Performance Optimized**: Texture atlases, frame pools, and GPU acceleration  

---

## Character Sprite System

### Available Characters

The system includes 21 fully animated character archetypes:

#### **Melee Warriors** (7)
- `knight` - Heavy armor, sword & shield
- `knight-templar` - Dual-wielding holy warrior
- `soldier` - Standard infantry
- `swordsman` - Agile duelist
- `lancer` - Polearm specialist
- `armored-axeman` - Heavy axe wielder
- `greatsword-skeleton` - Undead greatsword master

#### **Ranged Units** (3)
- `archer` - Standard bow user
- `skeleton-archer` - Undead archer

#### **Magic Casters** (2)
- `wizard` - Arcane mage
- `priest` - Holy healer

#### **Monsters & Beasts** (5)
- `orc` - Basic orc warrior
- `armored-orc` - Heavy orc
- `elite-orc` - Advanced orc
- `werewolf` - Beast form
- `werebear` - Tank beast
- `orc-rider` - Mounted unit

#### **Undead** (3)
- `skeleton` - Basic undead
- `armored-skeleton` - Heavy undead
- `greatsword-skeleton` - Elite undead

#### **Special** (1)
- `slime` - Blob enemy

### Sprite Data Structure

```typescript
interface CharacterSprite {
  id: string;                           // Unique identifier (e.g., "knight")
  name: string;                         // Display name
  folder: string;                       // Base sprite folder path
  effectsFolder?: string;               // VFX folder path (optional)
  projectileFolder?: string;            // Projectile folder (for ranged)
  animations: Record<string, SpriteAnimation>;
}

interface SpriteAnimation {
  name: string;                         // Display name
  fileName: string;                     // Sprite sheet filename
  frames: number;                       // Frame count
  frameWidth: number;                   // Frame width (default: 100px)
  frameHeight: number;                  // Frame height (default: 100px)
  loop: boolean;                        // Loop animation?
  isEffect?: boolean;                   // Is this a VFX layer?
  isProjectile?: boolean;               // Is this a projectile?
}
```

### Animation Types

Each character has standardized animations:

#### **Base Animations** (Required)
- `idle` - Standing still (looping)
- `walk` - Movement (looping)
- `death` - Death sequence (one-shot)
- `hurt` - Hit reaction (one-shot)

#### **Combat Animations** (Varies by character)
- `attack01` - Primary attack
- `attack02` - Secondary attack
- `attack03` - Special attack (some characters)
- `block` - Defensive stance (knights/warriors)
- `heal` - Healing cast (priest only)

#### **Effect Layers** (Separated for compositing)
- `attack01_effect` - VFX for attack 1
- `attack02_effect` - VFX for attack 2
- `attack03_effect` - VFX for attack 3
- `heal_effect` - Healing VFX

#### **Projectiles** (Ranged units)
- `arrow` - Arrow projectile (archer)

### File Structure

```
attached_assets/
└── GrudgeRPGAssets2d/          (when added)
    ├── Archer/
    │   ├── Archer/
    │   │   ├── Archer-Idle.png         (6 frames)
    │   │   ├── Archer-Walk.png         (8 frames)
    │   │   ├── Archer-Attack01.png     (9 frames)
    │   │   └── ...
    │   ├── Archer(Split Effects)/
    │   │   ├── Archer-Attack01_Effect.png
    │   │   └── ...
    │   └── Arrow(projectile)/
    │       └── Arrow02(100x100).png
    ├── Knight/
    │   ├── Knight/
    │   └── Knight(Split Effects)/
    └── ...
```

---

## Animation System

### PixiJS Animator

The `SpriteAnimator` class handles frame-based animation:

```typescript
class SpriteAnimator {
  // Core Methods
  play(animationName: string, force?: boolean): void
  stop(): void
  setPosition(x: number, y: number): void
  setScale(scale: number): void
  setTint(color: number): void
  setAlpha(alpha: number): void
  destroy(): void
  
  // Getters
  getContainer(): PIXI.Container
  getCurrentAnimation(): string
}
```

**Usage Example:**
```typescript
import { createAnimatorFromSpritesheet } from '@/renderer/SpriteAnimator';

const animator = await createAnimatorFromSpritesheet(
  '/sprites/characters/Knight/Knight/Knight-Idle.png',
  100,  // frameWidth
  100,  // frameHeight
  {
    idle: { frames: [0,1,2,3,4,5], frameRate: 8, loop: true },
    attack: { frames: [0,1,2,3,4,5,6], frameRate: 12, loop: false }
  },
  'idle',  // default animation
  (animName) => console.log(`${animName} completed`)
);

animator.play('attack');
```

### Animation State Machine

The `AnimationStateMachine` ensures smooth transitions:

```typescript
type AnimationState = 
  | "idle" 
  | "walk" 
  | "attack" 
  | "cast" 
  | "shoot" 
  | "heal" 
  | "block" 
  | "hit" 
  | "death";

const stateMachine = new AnimationStateMachine(animator);

// Interruptible states: idle, walk
stateMachine.transition('attack');  // Queue if busy

// Auto-returns to idle after non-looping animations
```

**State Transition Rules:**
- `idle` / `walk` → Can be interrupted immediately
- Combat actions → Must complete before transitioning
- Queued states execute after current animation finishes

---

## Equipment & Customization

### Tiered Equipment System

**9 Tiers (T0 - T8):**

| Tier | Name | Color | Glow | Example |
|------|------|-------|------|---------|
| T0 | Rusty | Gray | None | Rusty Sword |
| T1 | Copper | Amber | Faint | Copper Blade |
| T2 | Iron | Silver | Subtle | Iron Greatsword |
| T3 | Steel | Blue | Moderate | Steel Longsword |
| T4 | Mithril | Purple | Strong | Mithril Rapier |
| T5 | Adamantine | Orange | Intense | Adamantine Edge |
| T6 | Orichalcum | Gold | Radiant | Orichalcum Saber |
| T7 | Starmetal | Cyan | Brilliant | Starmetal Blade |
| T8 | Divine | White | Celestial | Divine Excalibur |

### Weapon Types

```typescript
type WeaponType = 
  | "sword"     // Balanced melee
  | "axe"       // Heavy melee
  | "dagger"    // Fast melee
  | "hammer"    // Crushing melee
  | "bow"       // Standard ranged
  | "crossbow"  // Heavy ranged
  | "gun"       // Advanced ranged
  | "staff"     // Magic focus
  | "tome";     // Spellbook
```

### Armor Types

```typescript
type ArmorType = 
  | "plate"     // Heavy (warriors)
  | "leather"   // Medium (rangers, rogues)
  | "cloth";    // Light (mages)
```

### Class Default Equipment

```typescript
const classDefaults = {
  warrior: { weapon: "sword", armor: "plate" },
  ranger:  { weapon: "bow",   armor: "leather" },
  mage:    { weapon: "staff", armor: "cloth" },
  worge:   { weapon: "dagger", armor: "leather" }
};
```

### Visual Equipment Display

The `UnitSprite` component renders:

1. **Base Character** - Sprite with faction tint
2. **Tier Badge** - Top-left corner (T3+)
3. **Weapon Icon** - Bottom-right corner with tier glow
4. **Border Glow** - Equipment tier-based outline

```tsx
<UnitSprite 
  unit={heroUnit}
  size="lg"
  showWeapon={true}
  showGlow={true}
  isSelected={true}
/>
```

**Tier Visual Effects:**
- **T0-T1**: Basic icon, no glow
- **T2**: Subtle box-shadow
- **T3+**: Ring border + glow
- **T4+**: Purple gradient background
- **T6+**: Golden gradient + intense glow

---

## Combat Visual Effects

### Effect Layer System

Combat animations use **split effect layers** for compositing:

```typescript
// Main character attack animation
animator.play('attack01');

// Simultaneously play VFX on separate layer
effectAnimator.play('attack01_effect');

// Projectiles (ranged units)
projectileAnimator.play('arrow');
```

**Benefits:**
- **Modularity** - Mix/match character + effects
- **Reusability** - Same effects on different characters
- **Performance** - GPU-composited layers

### Particle Effects

Additional PixiJS particle systems:

```typescript
import { Emitter } from '@pixi/particle-emitter';

// Hit spark effect
const hitEmitter = new Emitter(
  container,
  {
    lifetime: { min: 0.1, max: 0.3 },
    frequency: 0.01,
    emitterLifetime: 0.2,
    maxParticles: 20,
    pos: { x: 0, y: 0 },
    behaviors: [
      {
        type: 'alpha',
        config: { alpha: { start: 1, end: 0 } }
      },
      {
        type: 'scale',
        config: { scale: { start: 1, end: 0.1 } }
      },
      {
        type: 'color',
        config: { color: { start: '#ff6600', end: '#ff0000' } }
      }
    ]
  }
);
```

### Projectile System

Ranged units utilize projectile sprites:

```typescript
// Archer arrow example
{
  id: 'archer',
  projectileFolder: 'Archer/Arrow(projectile)',
  animations: {
    'arrow': projectile('Arrow', 'Arrow02(100x100)', 1)
  }
}

// Usage in combat
fireProjectile({
  sprite: 'arrow',
  startPos: archerPos,
  endPos: targetPos,
  duration: 0.5,
  onHit: () => applyDamage(target)
});
```

---

## Integration Guide

### Step 1: Load Character Sprite

```typescript
import { getCharacterById, getSpriteUrl } from '@/lib/spriteManifest';
import { createAnimatorFromSpritesheet } from '@/renderer/SpriteAnimator';

const character = getCharacterById('knight');
const idleUrl = getSpriteUrl(character, 'idle');

const animator = await createAnimatorFromSpritesheet(
  idleUrl,
  character.animations['idle'].frameWidth,
  character.animations['idle'].frameHeight,
  character.animations,
  'idle'
);
```

### Step 2: Add to Battle Scene

```typescript
// PixiJS renderer setup
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a2e
});

// Add character to scene
const container = animator.getContainer();
container.x = 400;
container.y = 300;
app.stage.addChild(container);
```

### Step 3: Handle Combat

```typescript
// Attack sequence
function performAttack(attacker: SpriteAnimator, target: SpriteAnimator) {
  attacker.play('attack01');
  
  // Wait for hit frame (frame 4 of 9)
  setTimeout(() => {
    target.play('hurt');
    spawnHitEffect(target.getContainer().position);
  }, (4 / 9) * (9 / 12) * 1000);  // 4th frame at 12fps
}
```

### Step 4: Faction Tinting

```typescript
const factionColors = {
  crusade: { hue: 45, saturation: 100 },   // Gold/Yellow
  fabled:  { hue: 270, saturation: 80 },   // Purple
  legion:  { hue: 0, saturation: 70 }      // Red
};

// Apply CSS filter to sprite image
spriteImage.style.filter = `
  hue-rotate(${factionColors.crusade.hue - 200}deg) 
  saturate(${factionColors.crusade.saturation}%)
`;
```

---

## Performance Optimization

### Texture Atlases

Combine multiple sprites into single atlas:

```typescript
// Generate atlas at build time
const atlas = {
  frames: {
    'knight-idle-0': { x: 0, y: 0, w: 100, h: 100 },
    'knight-idle-1': { x: 100, y: 0, w: 100, h: 100 },
    // ...
  },
  meta: {
    image: 'knight-atlas.png',
    size: { w: 1024, h: 1024 }
  }
};
```

### Object Pooling

Reuse sprite instances:

```typescript
class SpritePool {
  private pool: SpriteAnimator[] = [];
  
  acquire(spriteId: string): SpriteAnimator {
    return this.pool.pop() || this.createNew(spriteId);
  }
  
  release(animator: SpriteAnimator): void {
    animator.stop();
    animator.setAlpha(0);
    this.pool.push(animator);
  }
}
```

### GPU Acceleration

Enable hardware acceleration:

```typescript
const app = new PIXI.Application({
  forceCanvas: false,  // Use WebGL
  antialias: true,
  powerPreference: 'high-performance'
});
```

### Culling

Only render visible sprites:

```typescript
function updateVisibility(sprites: SpriteAnimator[], camera: Camera) {
  sprites.forEach(sprite => {
    const pos = sprite.getContainer().position;
    const visible = camera.isInViewport(pos);
    sprite.setAlpha(visible ? 1 : 0);
  });
}
```

---

## Asset Pipeline

### Adding New Characters

1. **Prepare Sprite Sheets**
   - 100x100px frames (standard)
   - Horizontal strip layout
   - Transparent background (PNG)

2. **Organize Files**
   ```
   GrudgeRPGAssets2d/
   └── NewCharacter/
       ├── NewCharacter/
       │   ├── NewCharacter-Idle.png
       │   └── NewCharacter-Walk.png
       └── NewCharacter(Split Effects)/
           └── NewCharacter-Attack_Effect.png
   ```

3. **Register in Manifest**
   ```typescript
   // client/src/lib/spriteManifest.ts
   export const SPRITE_CHARACTERS: CharacterSprite[] = [
     // ...existing characters
     {
       id: 'new-character',
       name: 'New Character',
       folder: 'NewCharacter/NewCharacter',
       effectsFolder: 'NewCharacter/NewCharacter(Split Effects)',
       animations: {
         'idle': anim('Idle', 'NewCharacter-Idle', 6, true),
         'walk': anim('Walk', 'NewCharacter-Walk', 8, true),
         'attack': anim('Attack', 'NewCharacter-Attack', 7),
         'death': anim('Death', 'NewCharacter-Death', 4),
         'hurt': anim('Hurt', 'NewCharacter-Hurt', 4),
         'attack_effect': effect('Attack Effect', 'NewCharacter-Attack_Effect', 7),
       }
     }
   ];
   ```

4. **Test in Admin Panel**
   ```
   Navigate to: /admin-sprites
   Preview animations and verify frame counts
   ```

### Equipment Asset Pipeline

1. **Design Weapon Sprites**
   - 32x32px icon size
   - Consistent style across tiers
   - Save as PNG with transparency

2. **Add to Weapon Sprites**
   ```typescript
   // client/src/lib/spriteData.ts
   export const weaponSprites: Record<WeaponType, Record<number, string>> = {
     sword: {
       0: `/sprites/sword/rusty-sword.png`,
       1: `/sprites/sword/copper-sword.png`,
       // ...
     }
   };
   ```

3. **Configure Tier Properties**
   ```typescript
   export const tierGlowColors: Record<number, string> = {
     0: "rgba(128, 128, 128, 0.3)",  // Gray
     1: "rgba(184, 115, 51, 0.4)",   // Bronze
     // ...
   };
   ```

---

## Advanced Systems

### Dynamic Character Composition

Combine body parts for customization:

```typescript
interface ComposedCharacter {
  base: SpriteAnimator;      // Base body
  head: SpriteAnimator;      // Helmet overlay
  weapon: SpriteAnimator;    // Weapon overlay
  effects: SpriteAnimator;   // VFX layer
}

function composeCharacter(config: CharacterConfig): ComposedCharacter {
  const container = new PIXI.Container();
  
  const base = await loadSprite(config.baseId);
  const head = await loadSprite(config.helmetId);
  const weapon = await loadSprite(config.weaponId);
  
  container.addChild(base.getContainer());
  container.addChild(head.getContainer());
  container.addChild(weapon.getContainer());
  
  return { base, head, weapon, effects: null };
}
```

### Facial Expressions

Add emotion overlays:

```typescript
const expressions = {
  neutral: 0,
  happy: 1,
  angry: 2,
  hurt: 3,
  dead: 4
};

function setExpression(character: SpriteAnimator, expression: keyof typeof expressions) {
  // Swap face texture region
  const faceFrame = expressions[expression];
  // Apply to character head region
}
```

### Skin Variants

Procedural recoloring:

```typescript
function applySkinTone(sprite: PIXI.Sprite, tone: 'fair' | 'tan' | 'dark' | 'green' | 'undead') {
  const toneFilters = {
    fair:   new PIXI.ColorMatrixFilter(),
    tan:    new PIXI.ColorMatrixFilter(),
    dark:   new PIXI.ColorMatrixFilter(),
    green:  new PIXI.ColorMatrixFilter(),  // Orc
    undead: new PIXI.ColorMatrixFilter()   // Skeleton
  };
  
  toneFilters.tan.saturate(1.2);
  toneFilters.dark.brightness(0.7, false);
  toneFilters.green.hue(120, false);
  toneFilters.undead.desaturate();
  
  sprite.filters = [toneFilters[tone]];
}
```

---

## API Reference

### Core Functions

#### `getCharacterById(id: string): CharacterSprite | undefined`
Retrieve character data by ID.

#### `getSpriteUrl(character: CharacterSprite, animationKey: string): string`
Get full URL path for sprite sheet.

#### `getAnimationCategories(character: CharacterSprite)`
Organize animations by type (base, attacks, effects, projectiles).

#### `getAllCharacterIds(): string[]`
List all available character IDs.

#### `getTotalAnimationCount(): number`
Count total animations across all characters.

#### `getTotalFrameCount(): number`
Sum all frames in the system.

### React Components

#### `<UnitSprite>`
Display unit with equipment and effects.

**Props:**
```typescript
interface UnitSpriteProps {
  unit: Unit;
  size?: "sm" | "md" | "lg";
  showWeapon?: boolean;
  showGlow?: boolean;
  isSelected?: boolean;
  className?: string;
}
```

#### `<AnimatedUnitSprite>`
Full animation support with state machine.

**Props:**
```typescript
interface AnimatedUnitSpriteProps extends UnitSpriteProps {
  animation?: AnimationState;
  onAnimationComplete?: (name: string) => void;
}
```

---

## Roadmap

### Planned Features

- [ ] **Dynamic Lighting** - Real-time shadows and highlights
- [ ] **Weather Effects** - Rain, snow, fog overlays
- [ ] **Emote System** - Character reactions and gestures
- [ ] **Mount System** - Cavalry and flying units
- [ ] **Transformation Animations** - Shapeshifting sequences
- [ ] **Costume System** - Seasonal and special outfits
- [ ] **Battle Damage** - Progressive wear on sprites
- [ ] **Combo Sequences** - Multi-hit attack chains

### Technical Debt

- [ ] Migrate to WebGPU for future-proofing
- [ ] Implement LOD system for distant units
- [ ] Add texture compression (KTX2/Basis)
- [ ] Create automated atlas generation pipeline
- [ ] Build unit testing suite for animations

---

## Troubleshooting

### Common Issues

**Q: Sprites not loading**  
A: Check file paths in `spriteManifest.ts` match folder structure. Ensure assets are in `attached_assets/GrudgeRPGAssets2d/`.

**Q: Animations stuttering**  
A: Verify frame rate settings. Standard is 8fps for idle/walk, 12fps for attacks.

**Q: Tinting not working**  
A: Faction tints use CSS filters. Ensure sprite images support hue-rotate (avoid indexed color PNGs).

**Q: Effects not aligned**  
A: Effect layers should match base sprite dimensions. Verify `frameWidth` and `frameHeight` in manifest.

**Q: Memory leaks**  
A: Always call `animator.destroy()` when removing sprites. Use object pooling for frequently spawned units.

---

## Credits & Resources

- **Sprite Assets**: Grudge RPG 2D Asset Pack
- **Rendering**: PixiJS v8.15.0
- **State Management**: Custom AnimationStateMachine
- **Documentation**: Warp AI Agent Mode

**Related Files:**
- `client/src/lib/spriteManifest.ts` - Character definitions
- `client/src/lib/spriteData.ts` - Equipment and tiers
- `client/src/lib/unitSprites.ts` - Unit sprite assignments
- `client/src/renderer/SpriteAnimator.ts` - Animation engine
- `client/src/components/game/UnitSprite.tsx` - React component

---

## License

This sprite system is part of the Grudge 2D Heroes project. All sprites and code are proprietary. For licensing inquiries, contact the development team.

**Last Updated**: January 2026  
**Version**: 1.0.0
