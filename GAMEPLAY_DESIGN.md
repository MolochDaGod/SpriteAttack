# Grudge 2D Heroes - Gameplay Design Document

## Vision Statement

Create an engaging tactical RPG experience that leverages the rich sprite animation system to deliver satisfying, strategic combat with visual flair and deep character progression.

---

## Core Gameplay Loop

```
Recruit Heroes → Equip & Customize → Battle Enemies → Earn Rewards → Upgrade Equipment → Repeat
```

### Loop Duration: 5-10 minutes per battle
- Quick, snappy tactical encounters
- Meaningful progression per session
- Addictive "one more battle" feel

---

## Battle System Design

### Grid-Based Tactical Combat

**Arena**: 8x6 tile grid (side-view perspective)

```
[Player Side]          [Enemy Side]
╔═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╗
║ ░ ║ ░ ║ ░ ║ ▓ ║ ▓ ║ ░ ║ ░ ║ ░ ║
╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣
║ ░ ║ P ║ P ║ ▓ ║ ▓ ║ E ║ E ║ ░ ║
╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣
║ ░ ║ P ║ P ║ ▓ ║ ▓ ║ E ║ E ║ ░ ║
╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣
║ ░ ║ ░ ║ ░ ║ ▓ ║ ▓ ║ ░ ║ ░ ║ ░ ║
╚═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╝
```

- **P** = Player units
- **E** = Enemy units
- **░** = Open tiles
- **▓** = Terrain/obstacles

### Turn Order System

**Speed-Based Initiative**:
1. Calculate speed stat for all units
2. Sort by descending speed
3. Display turn order on side panel
4. Active unit highlighted with selection glow

**Turn Structure**:
- **Move Phase**: Move up to `movement` tiles
- **Action Phase**: Attack, Cast, Heal, or Wait
- **End Turn**: Next unit activates

### Combat Mechanics

#### Attack Resolution

```typescript
// Basic damage formula
baseDamage = attacker.damage * equipmentTierMultiplier
damageReduction = defender.defense * armorTierMultiplier
criticalHit = random() < attacker.combatFactors.criticalChance
blocked = random() < defender.combatFactors.blockChance

if (blocked) {
  finalDamage = baseDamage * (1 - defender.combatFactors.blockFactor)
  // Trigger "block" animation
} else if (criticalHit) {
  finalDamage = baseDamage * attacker.combatFactors.criticalFactor
  // Show "CRIT!" text
} else {
  finalDamage = max(1, baseDamage - damageReduction)
}

// Play hurt animation on defender
defender.hp -= finalDamage
```

#### Range & Line of Sight

**Melee Range** (1 tile):
- Knights, Swordsmen, Orcs
- Must be adjacent to target

**Spear Range** (2 tiles):
- Lancers, Orc Riders
- Can attack from 1-2 tiles

**Ranged** (3-5 tiles):
- Archers, Wizards
- Requires line of sight
- Blocked by units/terrain

**Magic** (3-4 tiles):
- Wizards, Priests
- Can arc over obstacles
- AOE spells affect adjacent tiles

---

## Character Progression

### Leveling System

**XP Sources**:
- Dealing damage: 1 XP per damage
- Killing blow: 50 XP
- Battle victory: 100 XP
- Survival bonus: 25 XP per unit alive

**Level Curve**:
```
Level 1 → 2: 100 XP
Level 2 → 3: 200 XP
Level 3 → 4: 350 XP
...
Level (N) → (N+1): 100 * N * 1.5 XP
```

**Per-Level Bonuses**:
- +5% HP
- +5% Damage
- +5% Defense
- +1 Speed (every 3 levels)

### Equipment Tiers

**Tier Progression** (T0 → T8):
- **Drop Rates**: Tier matches battle difficulty
- **Crafting**: Combine 3x lower tier → 1x higher tier
- **Enhancement**: +5% stats per tier

**Tier Multipliers**:
| Tier | Damage | Defense | Special |
|------|--------|---------|---------|
| T0 | 1.0x | 1.0x | - |
| T1 | 1.1x | 1.1x | - |
| T2 | 1.2x | 1.2x | +1 range (ranged) |
| T3 | 1.35x | 1.3x | +5% crit chance |
| T4 | 1.5x | 1.4x | +10% crit chance |
| T5 | 1.7x | 1.5x | +15% crit chance |
| T6 | 2.0x | 1.7x | Set bonus (if 3+ pieces) |
| T7 | 2.5x | 2.0x | Set bonus + proc effect |
| T8 | 3.0x | 2.5x | Legendary proc effect |

---

## Visual Feedback Systems

### Animation-Driven Combat

**Attack Sequences**:
1. Attacker plays attack animation
2. At **hit frame** (varies by character):
   - Spawn effect layer (slash, fireball, etc.)
   - Projectile travels (if ranged)
   - Defender plays hurt animation
   - Damage number floats up
3. Return to idle after animation completes

**Hit Frame Timing**:
```typescript
const hitFrames = {
  knight: { attack01: 3, attack02: 5, attack03: 6 },
  archer: { attack01: 5, attack02: 7 },  // Arrow release
  wizard: { attack01: 3, attack02: 4 },  // Spell cast
  // ...
};
```

### Damage Numbers

**Floating Text**:
- Normal Hit: White, medium size
- Critical Hit: **Yellow, large, "CRIT!"**
- Blocked: Gray, small, "BLOCKED"
- Miss: Red, "MISS"
- Healing: Green, "+" prefix

**Animation**:
- Float upward 50px over 1 second
- Fade out after 0.5s
- Slight horizontal shake on crits

### Visual Effects

**Hit Sparks** (PixiJS Particles):
```typescript
{
  lifetime: 0.3,
  maxParticles: 15,
  speed: { min: 50, max: 150 },
  startColor: '#ff6600',
  endColor: '#ff0000',
  startScale: 1.0,
  endScale: 0.1
}
```

**Tier Glow Aura**:
- T3+: Pulsing glow around unit
- T6+: Rotating particle orbit
- T8: Continuous sparkle trail

---

## Game Modes

### 1. Campaign Mode

**Structure**: 50+ battles across 5 chapters

**Chapter Themes**:
1. **Crusade Trials** - Learn basics vs. human soldiers
2. **Fabled Forest** - Face elves and wizards
3. **Legion Invasion** - Fight orc hordes
4. **Undead Crypts** - Battle skeletons and undead
5. **Final Confrontation** - Mixed faction bosses

**Progression**:
- Unlock new character types
- Earn gold for equipment
- Boss battles every 10 missions

### 2. Arena Mode

**Endless Survival**:
- Wave-based enemies
- Increasing difficulty
- Leaderboards
- Unlock rare equipment drops

**Wave Composition**:
- Wave 1-5: Basic units
- Wave 6-10: +Elite units
- Wave 11-15: +Ranged units
- Wave 16+: +Bosses

### 3. PvP Battles

**Team vs Team**:
- Player builds 4-unit squad
- Enemy player's squad (AI-controlled)
- Best 2 out of 3 rounds
- Ranked matchmaking

### 4. Raid Boss Mode

**Co-op Boss Fights**:
- 2-4 players vs. massive boss
- Boss has unique mechanics
- Rare T6-T8 drops

**Boss Examples**:
- **Orc Warlord** (Elite Orc + Orc Riders)
- **Lich King** (Greatsword Skeleton boss)
- **Dragon** (New unique sprite)

---

## Monetization & Rewards

### Free-to-Play Friendly

**Earn via Gameplay**:
- Gold from battles
- Equipment drops
- Daily login rewards
- Achievement unlocks

**Premium Options** (Optional):
- Cosmetic skins (recolors)
- Battle pass (seasonal)
- Skip crafting timers
- **Never pay-to-win**

---

## Social Features

### Guild System

**Form Guilds**:
- Guild wars (PvP tournaments)
- Shared resources
- Guild raid bosses
- Chat integration

### Daily Challenges

**Rotating Objectives**:
- "Win 3 battles with only Knights"
- "Deal 1000 damage with Archers"
- "Win without losing a unit"

**Rewards**: Gold, XP boost, equipment boxes

---

## Content Roadmap

### Phase 1: Core Launch (Current)
- 21 character types
- 8x6 tactical grid
- Campaign mode (20 battles)
- Equipment T0-T4

### Phase 2: Expansion (Month 2)
- Arena mode
- Equipment T5-T8
- 5 new characters
- Guild system

### Phase 3: Endgame (Month 4)
- Raid bosses
- PvP ranked
- Seasonal events
- Legendary weapons

### Phase 4: Meta Expansion (Month 6+)
- New faction (Neutral?)
- Flying units
- Weather effects
- Map editor

---

## Fun Gameplay Mechanics

### Combo System

**Attack Chains**:
- Swordsman Attack 2 (15 frames) = 3-hit combo
- Each hit: 33% / 33% / 34% damage split
- Visual: Slash effects stack

**Synergies**:
- Knight blocks → Templar gets +50% crit chance (holy fury)
- Archer shoots → Wizard casts fire → **Flaming Arrow** combo
- Priest heals → All adjacent allies get +10% damage buff

### Positional Tactics

**Flanking Bonus**:
- Attack from side/behind: +25% damage
- Encourages movement and positioning

**Terrain Advantages**:
- High ground: +10% damage, +1 range
- Cover: +20% block chance
- Hazards: Fire/Poison tiles deal DOT

### Equipment Sets

**T6+ Set Bonuses** (3+ pieces):

**Crusader Set** (Knight):
- 3 pieces: +15% block chance
- 5 pieces: Blocks heal for 5% max HP

**Assassin Set** (Swordsman):
- 3 pieces: +20% crit chance
- 5 pieces: Crits refund movement

**Archmage Set** (Wizard):
- 3 pieces: +25% spell damage
- 5 pieces: Spells hit adjacent tiles

**Warlord Set** (Elite Orc):
- 3 pieces: +30% damage when below 50% HP
- 5 pieces: Rage mode (continuous attacks)

---

## Animation Showcase Moments

### Epic Finishers

**When landing killing blow**:
- Play character's longest attack animation
- Slow-motion effect (50% speed)
- Dramatic camera shake
- Confetti/particle burst
- Victory pose

**Example**:
- Swordsman Attack 2 (15f) as finisher
- Slice through enemy → Enemy explodes into particles
- Swordsman sheathes sword (custom animation)

### Character Intros

**Battle Start**:
- Each unit enters from side
- Unique entry animation per class
- Knight: Sword salute
- Wizard: Staff twirl + sparkles
- Orc: War cry + chest pound

---

## Balancing Framework

### Rock-Paper-Scissors

**Faction Balance**:
- Crusade → Strong vs Legion (holy damage)
- Legion → Strong vs Fabled (savage damage)
- Fabled → Strong vs Crusade (magic damage)

**Class Balance**:
- Tanks → Strong vs Melee, Weak vs Magic
- Mages → Strong vs Tanks, Weak vs Ranged
- Ranged → Strong vs Mages, Weak vs Cavalry
- Cavalry → Strong vs Ranged, Weak vs Spears

### Tier Power Scaling

**Power Budget** (Tier 0 = 100 points):
- T0: 100 pts
- T2: 144 pts (+44%)
- T4: 210 pts (+110%)
- T6: 340 pts (+240%)
- T8: 525 pts (+425%)

---

## Audio Integration

### Sound Effects

**Attack Sounds**:
- Melee: Sword swoosh, impact clang
- Ranged: Bow twang, arrow whistle
- Magic: Arcane whoosh, explosion

**Ambient**:
- Battle music (dynamic layers)
- Victory fanfare
- Defeat stinger

---

## Accessibility Features

- **Speed Controls**: 0.5x, 1x, 2x, 4x battle speed
- **Auto-Battle**: AI plays for grinding
- **Colorblind Mode**: High contrast UI
- **Skip Animations**: Toggle for experienced players

---

## Technical Requirements

### Performance Targets

- **60 FPS** on modern browsers
- **30 FPS** on mobile
- **< 2s** load time per battle
- **< 50MB** total asset size

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## Success Metrics

### KPIs (Key Performance Indicators)

**Engagement**:
- Daily Active Users (DAU)
- Average session length: Target 20+ min
- Battles per session: Target 3+

**Retention**:
- Day 1: 60%+
- Day 7: 35%+
- Day 30: 15%+

**Monetization**:
- ARPPU (Average Revenue Per Paying User): $10-15
- Conversion rate: 2-5%

---

## Community & Content Creation

### Streamer-Friendly Features

- **Battle Replay System**: Share epic moments
- **Custom Tournaments**: Host PvP events
- **Build Showcases**: Export team compositions

### Content Ideas

- "Top 10 Character Builds"
- "Speedrun Challenge: Campaign Any%"
- "Arena Mode World Record"
- "Equipment Crafting Guide"

---

## Closing Thoughts

The Grudge 2D Heroes sprite system provides a solid foundation for a rich tactical RPG experience. By leveraging the detailed animations, tiered equipment system, and faction dynamics, we can create engaging, replayable gameplay that rewards both strategic thinking and player skill.

**Core Pillars**:
1. ✅ **Visual Spectacle** - Every attack looks and feels impactful
2. ✅ **Strategic Depth** - Positioning, combos, and counters matter
3. ✅ **Progression Satisfaction** - Constant unlocks and upgrades
4. ✅ **Accessibility** - Easy to learn, hard to master

Let's make these sprites shine in epic tactical battles! ⚔️🎮

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Document Owner**: Grudge 2D Heroes Dev Team
