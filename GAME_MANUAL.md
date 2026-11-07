# Abandoned but not Forgotten: Complete Game & Technical Documentation

> **Game Title**: Abandoned but not Forgotten  
> **Genre**: Retro 1990s LCD Nokia / Game Boy Open-World 2D Exploration & Recovery  
> **Platform**: Web (Full Desktop & Responsive Viewport)  
> **Engine**: Pure HTML5 Canvas 2D + Vanilla JavaScript Game Engine + React 19 Companion System + Firebase Firestore & Auth  

---

## 1. Game Concept & Narrative Overview

**Abandoned but not Forgotten** is an homage to classic 1990s monochrome handhelds (Nokia 3310, Game Boy dot-matrix LCD), reimagining the iconic "Snake" mechanic as an **infinite open-world planetary expedition**.

Instead of being trapped inside a tiny box eating fruit, the player commands an authentic planetary exploration rover across an **infinite 2D Cartesian surface**. Scattered across the harsh, cratered terrain of the **Moon** and **Mars** are real historical space exploration missions that were completed, retired, or left behind.

As the rover traverses the terrain:
- You scan scientific volatile probes, collecting drill cores and building an articulated **sample trailer train** behind the chassis.
- You track and recover **abandoned historical space artifacts** (such as the Apollo 11 Lunar Module stage, the Apollo 15 Lunar Roving Vehicle, Opportunity MER-B, Surveyor 3, and LCROSS impact sites).
- You avoid dangerous boulder ejecta fields, rocky crater rims, and collisions with your own growing trailer convoy.
- You document and preserve humanity's greatest scientific achievements into a persistent cloud-synced **Deep Space Telemetry Registry**.

---

## 2. Gameplay Mechanics & Features

### 2.1 The Two Planetary Destinations: Moon vs. Mars

Before launching a run, players select their target expedition body. Each destination features unique visual color palettes, physics, terrain characteristics, and discovery pools:

#### 🌕 The Moon (South Pole / Nobile Crater)
- **Aesthetic**: Classic 4-shade Game Boy monochrome LCD green palette (`#0F380F`, `#306230`, `#8BAC0F`, `#9BBC0F`).
- **Geological Setting**: The permanently shadowed regions (PSR) of Nobile Crater at the Lunar South Pole.
- **Scientific Target**: Detection of subsurface water ice volatiles (PPM reading) using the Neutron Spectrometer System (NSS) and TRIDENT drills.
- **Hazards**: High-contrast ejecta rock fields and sharp impact crater rim boulders.
- **Recoverable Relics**:
  - *VIPER Ice Cache (Nobile Crater)*
  - *Apollo 11 Eagle Descent Stage (Sea of Tranquility)*
  - *Apollo 15 Lunar Roving Vehicle (Hadley-Apennine)*
  - *Surveyor 3 Soft Lander (Ocean of Storms)*
  - *LCROSS Kinetic Impactor (Cabeus Crater)*
  - *Lunar Prospector (Shoemaker Crater)*

#### 🔴 Mars (Jezero River Delta / Gale Crater)
- **Aesthetic**: Amber-sepia Martian LCD palette (`#221206`, `#5a3814`, `#9a7329`, `#cfb36e`).
- **Geological Setting**: Ancient river paleochannels and delta clays inside Jezero and Gale craters.
- **Scientific Target**: Organic biosignature sediment scans, clay mineral hydrations, and atmospheric dust radiation.
- **Hazards**: Basalt volcanic rock ridges, sand dunes, and bedrock outcrops.
- **Recoverable Relics**:
  - *Opportunity MER-B (Meridiani Planum - 45.16 km marathon record)*
  - *Sojourner Micro-Rover (Ares Vallis - Mars Pathfinder, 1997)*
  - *Spirit MER-A (Gusev Crater)*
  - *Phoenix Polar Lander (Vastitas Borealis)*
  - *InSight Seismic Observatory (Elysium Planitia)*
  - *Viking 1 Lander (Chryse Planitia - historic 1976 landing)*

#### 🔒 Planetary Lock Rule
Once a run starts, the rover is deployed to that planetary surface. To maintain narrative immersion, surface switching is locked during active exploration. To switch planets, the pilot aborts or returns to the Home Screen (`ESC` key or Home button) and chooses a new destination.

---

### 2.2 The NASA Rover Fleet (Hangar Selection)

Pressing `[R]` or clicking the Hangar button opens the **NASA Rover Fleet Hangar Modal**, featuring interactive 2D pixel-art blueprints, historical dossiers, specs, and custom pixel-art chassis silhouettes:

1. **VIPER (Volatiles Investigating Polar Exploration Rover)**:
   - *Destination*: Moon (Nobile Crater)
   - *Specs*: 430 kg | 0.72 km/h | Solar + 50Ah Batteries
   - *Special Feature*: First rover with high-beam LED crater headlights for eternal darkness.
2. **Curiosity (Mars Science Laboratory)**:
   - *Destination*: Mars (Gale Crater)
   - *Specs*: 899 kg | 0.14 km/h | MMRTG Nuclear Plutonium-238 Generator
   - *Special Feature*: ChemCam laser and internal analytical chemistry laboratory.
3. **Perseverance & Ingenuity**:
   - *Destination*: Mars (Jezero Delta)
   - *Specs*: 1,025 kg | 0.16 km/h | MMRTG Nuclear Power
   - *Special Feature*: Carries hermetic sample cache tubes and the Ingenuity scout helicopter.
4. **Opportunity (MER-B)**:
   - *Destination*: Mars (Meridiani Planum)
   - *Specs*: 185 kg | 0.18 km/h | Dual Gull-Wing Solar Arrays
   - *Special Feature*: Traveled 45.16 km over 5,352 Martian sols (the solar marathon record).
5. **Sojourner (Mars Pathfinder)**:
   - *Destination*: Mars (Ares Vallis)
   - *Specs*: 11.5 kg | 0.04 km/h | 16W Solar Roof + D-Cell Battery
   - *Special Feature*: The historic pioneer—the first wheeled vehicle to drive on another planet (1997).
6. **Apollo Lunar Roving Vehicle (LRV)**:
   - *Destination*: Moon (Hadley Rille)
   - *Specs*: 210 kg | 18.0 km/h (lunar speed record) | Dual 36V Silver-Zinc Batteries
   - *Special Feature*: Crewed electric dune buggy driven by Apollo 15, 16, and 17 astronauts.

---

### 2.3 Exploration, Scoring & The Sample Trailer "Snake"

- **Grid Coordinates**: The rover navigates on a continuous $20\text{px} \times 20\text{px}$ world grid with fractional sub-tick interpolation for butter-smooth movement.
- **Dynamic Camera Tracking**: Smooth linear interpolation (`lerp`) camera tracks the rover continuously, providing an expansive GTA-style free-roaming experience.
- **Scientific Probes (+25 Points & Tail Growth)**:
  - Three active volatile scientific probes are spawned within proximity of the rover.
  - Scanning a probe records sample telemetry and appends a new articulated trailer compartment to the back of the rover.
- **Historical Mission Targets (+100 Points & Modal Telemetry Card)**:
  - An abandoned historic artifact is located in the region.
  - An edge-screen **Radar Waypoint Chevron** rotates and tracks the target across 360 degrees, with an indicator showing the exact distance in meters.
  - When the rover reaches the artifact, time pauses, a radio telemetry sound plays, and an authentic **Telemetry Dossier Card** opens detailing the discovery, mission dates, launch status, and historical achievements.
- **Player 2 Co-Op Escort Drone (`[2]` Key)**:
  - Players can deploy or recall an autonomous escort drone (inspired by Ingenuity).
  - The drone flies ahead in the rover's field of view, detecting terrain hazards and pulsing radio pings toward distant abandoned targets.
- **Engine Speed Gear (`[T]` / `[1]` Key)**:
  - Cycles rover driving speed: **1X (Survey)** $\rightarrow$ **2X (Expedition)** $\rightarrow$ **FAST (Sprint)**.

---

### 2.4 How Details & Historical Data Can Be Viewed

1. **In-Game Mission Dossier**: Upon colliding with an abandoned target in the field, an authentic retro modal appears on screen with mission photos, launch year, mission lifespan, key scientific discoveries, and operational status.
2. **Mission Dashboard (`TopNav` -> User Profile)**:
   - Displays total distance traversed, highest score, total missions recovered, and pilot rank (from *Novice Rover Pilot* up to *Deep Space Fleet Admiral*).
   - Shows the **Discovered Artifacts Gallery**: every artifact recovered during your runs is permanently cataloged in your private museum. Clicking an artifact opens the high-resolution **Artifact Detail Modal** with mission imagery and full narrative history.
3. **Galactic Leaderboard (`TopNav` -> Rankings)**:
   - Live global rankings showing top pilots across Moon expeditions, Mars expeditions, and combined recovery scores.
4. **NASA Rover Hangar (`[R]` Key)**:
   - Complete technical breakdowns of rover chassis dimensions, power systems, instruments, scientific records, and operational status.
5. **Admin Flight Control Panel (`TopNav` -> Admin)**:
   - Dedicated dashboard for administrators to view, add, edit, or seed authentic NASA vehicles and historical artifacts directly in the Firestore database.

---

## 3. Controls Reference

| Action | Primary Key | Secondary / Alternative |
|---|---|---|
| **Steer Rover** | `W`, `A`, `S`, `D` | `↑`, `←`, `↓`, `→` / Screen Click |
| **Abort / Return to Home** | `Escape` | `[HOME]` Top Bar Button |
| **Launch Expedition** | `Space` | `Enter` / Button Click |
| **Pause / Resume** | `P` | `[PAUSE]` Top Bar Button |
| **Deploy / Dock P2 Drone** | `2` | `[2P]` Top Bar Button |
| **Open Rover Hangar** | `R` | `[FLEET]` Top Bar Button |
| **Select Planetary Surface** | `Tab` *(Home Screen)* | `🌕 MOON` / `🔴 MARS` Buttons |
| **Cycle Engine Speed** | `T` | `1` / `[SPEED]` Top Bar Button |
| **Toggle Audio Mute** | `M` | `[AUDIO]` Top Bar Button |
| **Toggle Fullscreen** | `F` | `[FULL]` Top Bar Button |
| **Open Help & Key Guide** | `H` | `?` / `[HELP]` Top Bar Button |

---

## 4. Technical Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER RUNTIME VIEWPORT                        │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               HTML5 Fullscreen Canvas (2D Context)             │   │
│   │   • Infinite Procedural Chunk Manager                          │   │
│   │   • Sub-pixel Linear Interpolation (lerp) Smooth Camera        │   │
│   │   • Pixel-Art Silhouette & Chassis Procedural Sprites          │   │
│   │   • Web Audio API Synthesized Retro Sound Generator            │   │
│   │   • Directional Radar Vector Chevron Math                      │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                   │                                    │
│                     Custom DOM Events ('nasa:*')                       │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 React 19 & Tailwind CSS v4 UI                  │   │
│   │   • TopNav Profile & Companion Status Toolbar                  │   │
│   │   • Mission Dashboard (Player Profile & Discovered Relics)     │   │
│   │   • Global Leaderboard (Moon / Mars / Combined)                │   │
│   │   • Pilot Settings (Display Name, Callsign, Rover Default)     │   │
│   │   • Admin Flight Control Panel (CRUD Vehicles & Artifacts)     │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                   │                                    │
│                     Firebase JS SDK v12.19.0                           │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 Cloud Infrastructure & Database                │   │
│   │   • Firebase Authentication (Google OAuth Popup)               │   │
│   │   • Cloud Firestore NoSQL Database (Offline Persistence)       │   │
│   │   • Granular Security Rules (firestore.rules)                  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Frontend Coding Stack

1. **Vite 8 & TypeScript**:
   - Modern, ultra-fast bundling using Vite 8 with ECMAScript module resolution.
   - Strict TypeScript configuration (`tsconfig.json`) ensuring type safety across data models.
2. **Vanilla JS Canvas 2D Engine (`game.js`)**:
   - Designed without bulky 3rd-party game engines to maximize raw frame rates (consistent 60 FPS) and maintain full pixel control.
   - Custom `requestAnimationFrame` loop with delta timing and fractional tick accumulation.
   - **Chunk-Based Spatial Partitioning**: The infinite world is divided into $30\times 30$ coordinate chunks. Obstacle boulder clusters are generated deterministically via seeded coordinate hashing, ensuring infinite world boundaries without memory leaks.
   - **Sub-Tick Motion Interpolation**: Renders continuous rover movement between discrete discrete grid ticks ($t = \Delta / tickInterval$) to prevent visual stutter.
   - **360° Radar Angle Math**: Calculates vector angles from the rover head to off-screen artifacts using `Math.atan2(dy, dx)` and clamps the chevron indicator to the viewport boundaries.
3. **Web Audio API (`SoundFX` class in `game.js`)**:
   - Zero external audio files or MP3 network dependencies.
   - Generates authentic 8-bit chiptune square, triangle, and noise waves dynamically using `OscillatorNode`, `GainNode`, and frequency sweeps:
     - *Drive Motor Hum*: Low-frequency pitched square wave.
     - *Probe NSS Scan*: High-frequency arpeggio chirp.
     - *Artifact Rendezvous*: Dual resonant chord progression.
     - *Hazard Impact*: Low white noise burst with rapid decay envelope.
4. **React 19 & Lucide Icons**:
   - Modern React component tree mounted at `#companion-root` overlaying the canvas.
   - Handles account authentication, profile management, leaderboards, artifact inspect modals, and administrative tools.
5. **Tailwind CSS v4 & Retro Styling**:
   - Custom CSS variables for LCD light/dark green and Martian sepia themes.
   - Dot-matrix scanline shaders and CRT vignette overlays implemented via CSS pseudo-elements (`::before` / `::after`).
   - Monospace typography utilizing the authentic `'Press Start 2P'` Google Font.

---

### 4.2 Backend & Data Persistence (Firebase Firestore)

The game is connected to Google Cloud Firebase Firestore database (`ai-studio-nasaspacesnake-0a813487-c3b5-41c7-a4c9-d46393b3a1ac`).

#### Data Collections Schema (`firebase-blueprint.json`):

1. **`users/{userId}`**:
   - `displayName`, `email`, `photoURL`, `callsign`, `preferredSurface`, `preferredRover`
   - `highScoreMoon`, `highScoreMars`, `totalExplorationTimeSeconds`, `totalObjectsFound`
   - `role`: `'admin'` or `'player'`
2. **`users/{userId}/discoveries/{objectId}`**:
   - Stores each artifact discovered by the user with timestamp, coordinates, and score at recovery.
3. **`leaderboard/{entryDoc}`**:
   - Fast denormalized query index for top scores categorized by `MOON`, `MARS`, or `GLOBAL`.
4. **`vehicles/{vehicleId}`**:
   - Master catalog of playable planetary rovers. Can be updated dynamically by admins.
5. **`abandoned_objects/{objectId}`**:
   - Master catalog of historical NASA spacecraft, landers, impact sites, and drill caches.

#### Firestore Security Rules (`firestore.rules`):
- **User Privacy**: Users can only read and write their own profile and subcollection discovery logs.
- **Leaderboard Integrity**: Publicly readable, write-restricted to authenticated owners.
- **Admin RBAC**: Vehicle and master catalog write operations are restricted to users with `role == 'admin'` in their profile document.

---

## 5. Summary of Key Files

| File | Purpose |
|---|---|
| `index.html` | HTML5 entry point containing viewport canvas, retro HUD, modal overlays, and meta tags. |
| `game.js` | Core 2D canvas game engine: chunk generator, camera, vehicle physics, audio synth, and radar math. |
| `styles.css` | Retro LCD monochrome green & Mars sepia color variables, modal boxes, and scanline shaders. |
| `src/App.tsx` | React 19 companion wrapper bridging canvas DOM events (`nasa:*`) to Firebase user state. |
| `src/firebase.ts` | Firebase initialization, Google OAuth authentication flow, and Firestore CRUD service functions. |
| `src/defaultData.ts`| Fallback database containing historical NASA rovers and abandoned relic dossiers. |
| `src/components/TopNav.tsx` | Top floating toolbar showing login state, user rank, and modal triggers. |
| `src/components/DashboardModal.tsx` | Player mission dossier displaying stats, rank badge, and discovered artifacts gallery. |
| `src/components/LeaderboardModal.tsx`| Global rankings filterable by Moon, Mars, and Combined scores. |
| `src/components/AdminPanelModal.tsx` | Administrative interface for flight controllers to manage vehicles and artifact catalogs. |
| `src/components/ArtifactDetailModal.tsx`| Modal displaying deep-space artifact photographs, historical context, and discovery details. |
| `src/components/SettingsModal.tsx` | Player preferences: callsign, default starting vehicle, and audio settings. |
| `firebase-blueprint.json` | Formal Firestore database schema definitions and indexing rules. |
| `firestore.rules` | Security rules enforcing role-based access control (RBAC) and user document privacy. |
