/**
 * Abandoned but not Forgotten - Retro 1990s Nokia-inspired Open-World 2D Exploration Game
 * Pure HTML5 Canvas, Vanilla JavaScript (ES6+), Web Audio API
 * 
 * Features:
 * - Infinite planetary surface exploration with smooth GTA-style camera tracking
 * - 6 Authentic NASA Moon & Mars Rovers (VIPER, Curiosity, Perseverance, Opportunity, Sojourner, Apollo LRV)
 * - Vehicle-specific custom pixel-art chassis, wheels, instruments, and animations
 * - Interactive NASA Rover Fleet Hangar with authentic historical dossiers & blueprints
 * - Procedural geological hazard boulder clusters across infinite planetary coordinates
 * - Off-screen Radar Compass & Directional Waypoint Chevron targeting NASA missions
 * - Dynamic Moon & Mars LCD sector themes and scientific telemetry
 */

// --- 1. DUAL PLANETARY PALETTES ---
const PALETTES = {
  MOON: {
    darkest: '#0F380F',
    dark: '#306230',
    light: '#8BAC0F',
    lightest: '#9BBC0F',
    glow: 'rgba(15, 56, 15, 0.35)',
    location: 'MOON [NOBILE]',
    siteName: 'MOON: NOBILE POLAR CRATER',
    specs: 'GRAV: 1.62 m/s² | TEMP: -180°C<br>DETECTION: WATER ICE VOLATILES<br>HAZARDS: EJECTA BOULDER CLUSTERS',
    sysTag: 'SYS: LUNAR EXPLORATION',
    startSite: 'TARGET: MOON (SOUTH POLE)',
    basePpm: 320
  },
  MARS: {
    darkest: '#221206',
    dark: '#5a3814',
    light: '#9a7329',
    lightest: '#cfb36e',
    glow: 'rgba(34, 18, 6, 0.35)',
    location: 'MARS [JEZERO]',
    siteName: 'MARS: JEZERO RIVER DELTA',
    specs: 'GRAV: 3.72 m/s² | TEMP: -63°C<br>DETECTION: SEDIMENT CLAY MINERALS<br>HAZARDS: BASALT RIDGES & DUNES',
    sysTag: 'SYS: MARTIAN EXPEDITION',
    startSite: 'TARGET: MARS (JEZERO DELTA)',
    basePpm: 45
  }
};

// --- 2. NASA ROVER FLEET ROSTER ---
const NASA_ROVERS = [
  {
    id: 'VIPER',
    name: 'VIPER',
    fullName: 'NASA VIPER (POLAR ROVER)',
    destination: 'MOON',
    tag: 'SYS: POLAR WATER ICE PROSPECTOR',
    brand: 'NASA VIPER-3310',
    type: 'POLAR WATER ICE PROSPECTOR',
    site: 'MOON [NOBILE CRATER]',
    siteName: 'MOON: NOBILE POLAR CRATER',
    massSpeed: '430 KG | 0.72 KM/H',
    power: 'SOLAR + 50AH BATTERIES',
    payload: 'TRIDENT 1M DRILL, NSS, HEADLIGHTS',
    record: 'FIRST ROVER WITH CRATER HEADLIGHTS',
    status: 'ACTIVE / 2025',
    telemetryKey: 'ICE',
    basePpm: 320,
    accent: 'HEADLIGHTS'
  },
  {
    id: 'CURIOSITY',
    name: 'CURIOSITY',
    fullName: 'CURIOSITY (MARS SCIENCE LAB)',
    destination: 'MARS',
    tag: 'SYS: NUCLEAR ASTROBIOLOGY LAB',
    brand: 'NASA CURIOSITY-MSL',
    type: 'HEAVY NUCLEAR ASTROBIOLOGY LAB',
    site: 'MARS [GALE CRATER]',
    siteName: 'MARS: GALE CRATER & MT. SHARP',
    massSpeed: '899 KG | 0.14 KM/H',
    power: 'MMRTG (PLUTONIUM-238 / 110W)',
    payload: 'CHEMCAM LASER, SAM LAB, MASTCAM',
    record: '4,000+ SOLS; PROVED ANCIENT LAKES',
    status: 'ACTIVE / 2012-PRES',
    telemetryKey: 'RAD',
    basePpm: 185,
    accent: 'LASER'
  },
  {
    id: 'PERSEVERANCE',
    name: 'PERSEVERANCE',
    fullName: 'PERSEVERANCE & INGENUITY',
    destination: 'MARS',
    tag: 'SYS: SAMPLE CACHING & DRONE',
    brand: 'NASA PERSEVERANCE-2020',
    type: 'SAMPLE CACHER & DRONE CARRIER',
    site: 'MARS [JEZERO DELTA]',
    siteName: 'MARS: JEZERO LAKEBED DELTA',
    massSpeed: '1,025 KG | 0.16 KM/H',
    power: 'MMRTG NUCLEAR GENERATOR',
    payload: 'SUPERCAM, PIXL, SHERLOC, MOXIE',
    record: '24+ CACHED CORES; INGENUITY SCOUT',
    status: 'ACTIVE / 2021-PRES',
    telemetryKey: 'TUBE',
    basePpm: 24,
    accent: 'INGENUITY'
  },
  {
    id: 'OPPORTUNITY',
    name: 'OPPORTUNITY',
    fullName: 'OPPORTUNITY (MER-B ROVER)',
    destination: 'MARS',
    tag: 'SYS: MARATHON ROVER (MER)',
    brand: 'NASA OPPORTUNITY-MER',
    type: 'LONG-DURATION SOLAR ROVER',
    site: 'MARS [MERIDIANI]',
    siteName: 'MARS: MERIDIANI PLANUM',
    massSpeed: '185 KG | 0.18 KM/H',
    power: 'DUAL GULL-WING SOLAR PANELS',
    payload: 'PANCAM, MÖSSBAUER, ROCK RAT',
    record: '45.16 KM MARATHON RECORD (5,352 SOLS)',
    status: 'MISSION COMPLETE',
    telemetryKey: 'SOL',
    basePpm: 535,
    accent: 'WINGS'
  },
  {
    id: 'SOJOURNER',
    name: 'SOJOURNER',
    fullName: 'SOJOURNER (MARS PATHFINDER)',
    destination: 'MARS',
    tag: 'SYS: PIONEER MICROROVER',
    brand: 'NASA SOJOURNER-1997',
    type: 'FIRST WHEELED MARS MICROROVER',
    site: 'MARS [ARES VALLIS]',
    siteName: 'MARS: ARES VALLIS PLAINS',
    massSpeed: '11.5 KG | 0.04 KM/H',
    power: '16W SOLAR ROOF + D-CELL BATTERY',
    payload: 'APXS SPECTROMETER, LASER EYES',
    record: 'HISTORIC 1ST WHEELS ON ANOTHER PLANET',
    status: 'HISTORIC PIONEER (1997)',
    telemetryKey: 'APXS',
    basePpm: 97,
    accent: 'MICRO'
  },
  {
    id: 'LRV',
    name: 'APOLLO LRV',
    fullName: 'APOLLO LUNAR ROVING VEHICLE',
    destination: 'MOON',
    tag: 'SYS: CREWED LUNAR BUGGY',
    brand: 'NASA APOLLO LRV-15',
    type: 'CREWED ELECTRIC LUNAR ROVER',
    site: 'MOON [HADLEY RILLE]',
    siteName: 'MOON: HADLEY-APENNINE VALLEY',
    massSpeed: '210 KG | 18.0 KM/H (RECORD)',
    power: 'DUAL 36V SILVER-ZINC BATTERIES',
    payload: 'PARABOLIC DISH, TV CAM, RACKS',
    record: 'FASTEST EXTRATERRESTRIAL VEHICLE',
    status: 'DEPLOYED ON MOON (1971)',
    telemetryKey: 'SPD',
    basePpm: 14,
    accent: 'DISH'
  }
];

// --- 3. NASA MISSIONS DATABASE ---
const ABANDONED_MISSIONS = [
  {
    name: 'VIPER ICE CACHE (NOBILE)',
    targetBody: 'MOON',
    body: 'MOON (NOBILE CRATER PSR)',
    dates: 'NASA VIPER POLAR CAMPAIGN',
    discovery: 'TRIDENT 1-meter rotary drill confirmed subsurface water ice regolith crystals (12% by mass) in eternal polar shadow.',
    status: 'GROUND ZERO DRILL CACHE',
    points: 100
  },
  {
    name: 'APOLLO 11 EAGLE STAGE',
    targetBody: 'MOON',
    body: 'MOON (SEA OF TRANQUILITY)',
    dates: 'JUL 16 - JUL 24, 1969',
    discovery: '"The Eagle has landed." First human lunar landing; retrieved 21.5 kg ancient basalt rocks and deployed laser retroreflectors.',
    status: 'FIRST CREWED LUNAR BASE',
    points: 100
  },
  {
    name: 'LCROSS POLAR IMPACTOR',
    targetBody: 'MOON',
    body: 'MOON (CABEUS CRATER)',
    dates: 'OCT 9, 2009',
    discovery: 'Centaur 9,000 km/h kinetic impact excavated 155 kg pure water ice and hydroxyl volatiles in permanently shadowed cold trap.',
    status: 'POLAR IMPACT RECOVERY',
    points: 100
  },
  {
    name: 'APOLLO 15 LUNAR ROVER',
    targetBody: 'MOON',
    body: 'MOON (HADLEY-APENNINE)',
    dates: 'JUL 26 - AUG 7, 1971',
    discovery: 'First crewed electric LRV traverse. Traveled 27.8 km across lunar rilles to recover the 4.1-billion-year Genesis Rock.',
    status: 'PARKED ON LUNAR SURFACE',
    points: 100
  },
  {
    name: 'SURVEYOR 3 LANDER',
    targetBody: 'MOON',
    body: 'MOON (OCEAN OF STORMS)',
    dates: 'APR 17, 1967 - MAY 4, 1967',
    discovery: 'Demonstrated automated soft lunar landing. Inspected 2.5 years later by Apollo 12 astronauts who retrieved its camera.',
    status: 'ASTRONAUT RENDEZVOUS SITE',
    points: 100
  },
  {
    name: 'LUNAR PROSPECTOR',
    targetBody: 'MOON',
    body: 'MOON (POLAR CRATERS)',
    dates: 'JAN 7, 1998 - JUL 31, 1999',
    discovery: 'Neutron spectrometer identified massive hydrogen deposits at both lunar poles, confirming deep shadowed ice reservoirs.',
    status: 'POLAR ICE MAPPING ARCHIVE',
    points: 100
  },
  {
    name: 'APOLLO 17 CHALLENGER',
    targetBody: 'MOON',
    body: 'MOON (TAURUS-LITTROW)',
    dates: 'DEC 11 - DEC 14, 1972',
    discovery: 'Geologist Harrison Schmitt uncovered orange volcanic pyroclastic glass beads formed in deep lunar fire fountain eruptions.',
    status: 'LAST CREWED EXPEDITION',
    points: 100
  },
  {
    name: 'OPPORTUNITY (MER-B)',
    targetBody: 'MARS',
    body: 'MARS (MERIDIANI PLANUM)',
    dates: 'JUL 7, 2003 - FEB 13, 2019',
    discovery: 'Found hematite spherules ("blueberries") proving sustained liquid water. Traveled 45.16 km over 5,352 sols.',
    status: 'DORMANT / MISSION COMPLETE',
    points: 100
  },
  {
    name: 'SOJOURNER (PATHFINDER)',
    targetBody: 'MARS',
    body: 'MARS (ARES VALLIS)',
    dates: 'DEC 4, 1996 - SEP 27, 1997',
    discovery: 'First wheeled rover on Mars (10.5 kg). Analyzed volcanic basalt rocks "Barnacle Bill" and "Yogi" using APXS.',
    status: 'HISTORIC RETIRED PIONEER',
    points: 100
  },
  {
    name: 'SPIRIT (MER-A)',
    targetBody: 'MARS',
    body: 'MARS (GUSEV CRATER)',
    dates: 'JUN 10, 2003 - MAY 25, 2011',
    discovery: 'Stuck wheel churned bright soil revealing 90% pure silica: proof of ancient hydrothermal volcanic hot springs.',
    status: 'PERMANENT RESEARCH STATION',
    points: 100
  },
  {
    name: 'VIKING 1 LANDER',
    targetBody: 'MARS',
    body: 'MARS (CHRYSE PLANITIA)',
    dates: 'AUG 20, 1975 - NOV 11, 1982',
    discovery: 'First successful Mars landing. Sent back first surface panoramas and tested soil for organic metabolism.',
    status: 'HISTORIC NATIONAL LANDMARK',
    points: 100
  },
  {
    name: 'PHOENIX MARS LANDER',
    targetBody: 'MARS',
    body: 'MARS (VASTITAS BOREALIS)',
    dates: 'AUG 4, 2007 - NOV 10, 2008',
    discovery: 'Robotic trenching confirmed water ice permafrost inches below arctic soil; detected perchlorate salts.',
    status: 'PERMAFROST PRESERVED',
    points: 100
  },
  {
    name: 'CURIOSITY ROVER (MSL)',
    targetBody: 'MARS',
    body: 'MARS (GALE CRATER)',
    dates: 'NOV 26, 2011 - ACTIVE',
    discovery: 'Uncovered ancient mudstones containing carbon compounds, sulfur, and nitrogen from a 3.5-billion-year-old freshwater lake.',
    status: 'ROVER TRAVERSING MOUNT SHARP',
    points: 100
  },
  {
    name: 'VIKING 2 LANDER',
    targetBody: 'MARS',
    body: 'MARS (UTOPIA PLANITIA)',
    dates: 'SEP 9, 1975 - APR 11, 1980',
    discovery: 'Captured clear images of winter water-frost clinging to jagged Martian rocks and recorded tectonic seismology.',
    status: 'DECOMMISSIONED STATION',
    points: 100
  }
];

const ACTIVE_PROBES = [
  {
    name: 'POLAR RELAY BEACON',
    targetBody: 'MOON',
    observation: 'High-gain X-band DSN link synchronized at 256 kbps from lunar crater rim.',
    points: 25
  },
  {
    name: 'LRO SATELLITE LINK',
    targetBody: 'MOON',
    observation: 'Laser Altimeter downlink: Sub-meter 3D terrain profile of crater shadows.',
    points: 25
  },
  {
    name: 'ARTEMIS CAPSTONE',
    targetBody: 'MOON',
    observation: 'Near-Rectilinear Halo Orbit (NRHO) verification complete; Gateway communications green.',
    points: 25
  },
  {
    name: 'PERSEVERANCE SCOUT',
    targetBody: 'MARS',
    observation: 'Hermetic sample core #24 cached in Jezero delta sediment for return.',
    points: 25
  },
  {
    name: 'INGENUITY COPTER',
    targetBody: 'MARS',
    observation: 'Autonomous aerial flight verified: Scouting forward delta corridor.',
    points: 25
  },
  {
    name: 'INSIGHT SEISMIC',
    targetBody: 'MARS',
    observation: 'SEIS recorded magnitude 4.2 marsquake; confirmed molten core boundary.',
    points: 25
  }
];

// --- 4. RETRO AUDIO SYNTHESIZER ---
class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('nasa_snake_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('nasa_snake_muted', this.muted ? 'true' : 'false');
    return !this.muted;
  }

  playTone(freq, type, duration, gainStart = 0.1, gainEnd = 0.001) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.0001), this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio policy restrictions
    }
  }

  playTick() {
    if (this.muted) return;
    this.playTone(180, 'square', 0.02, 0.02, 0.001);
  }

  playCollect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.08, 0.08, 0.001);
      }, idx * 45);
    });
  }

  playObservation() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(659.25, 'sine', 0.12, 0.07, 0.001);
    setTimeout(() => {
      this.playTone(880, 'sine', 0.15, 0.07, 0.001);
    }, 70);
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playMissionAlert() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.15, 0.09, 0.001);
      }, i * 65);
    });
  }

  playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const tones = [392, 369.99, 349.23, 311.13];
    tones.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.22, 0.1, 0.001);
      }, idx * 110);
    });
  }

  playSectorSwitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(330, 'triangle', 0.08, 0.08, 0.001);
    setTimeout(() => {
      this.playTone(493.88, 'triangle', 0.12, 0.08, 0.001);
    }, 60);
    setTimeout(() => {
      this.playTone(659.25, 'triangle', 0.18, 0.08, 0.001);
    }, 120);
  }

  playClick() {
    if (this.muted) return;
    this.playTone(320, 'square', 0.02, 0.04, 0.001);
  }

  playP2Activate() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(587.33, 'triangle', 0.08, 0.08, 0.001); // D5
    setTimeout(() => {
      this.playTone(880, 'triangle', 0.12, 0.09, 0.001); // A5
    }, 70);
    setTimeout(() => {
      this.playTone(1174.66, 'sine', 0.20, 0.10, 0.001); // D6
    }, 140);
  }

  playP2Dock() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(880, 'triangle', 0.06, 0.07, 0.001);
    setTimeout(() => {
      this.playTone(440, 'sine', 0.12, 0.08, 0.001);
    }, 70);
  }

  playRoverSelect() {
    if (this.muted) return;
    this.playTone(440, 'triangle', 0.04, 0.06, 0.001);
    setTimeout(() => {
      this.playTone(660, 'triangle', 0.06, 0.06, 0.001);
    }, 40);
  }
}

// --- 5. MAIN GAME ENGINE ---
class NASASpaceSnakeGame {
  constructor() {
    // Dynamic Fullscreen Canvas View Dimensions
    this.viewWidth = window.innerWidth || 800;
    this.viewHeight = window.innerHeight || 600;
    this.CANVAS_SIZE = Math.min(this.viewWidth, this.viewHeight);
    this.CELL_SIZE = 16; // 16px per grid unit
    this.CHUNK_SIZE = 16; // 16x16 grid units per chunk

    // Active surface site: 'MOON' or 'MARS'
    this.surfaceSite = 'MOON';

    // Rover Fleet Setup
    this.rovers = NASA_ROVERS;
    this.selectedRoverIndex = 0; // VIPER by default
    this.selectedRover = this.rovers[0];
    this.hangarPreviewIndex = 0;

    // Active palette
    this.COLORS = {
      darkest: PALETTES.MOON.darkest,
      dark: PALETTES.MOON.dark,
      light: PALETTES.MOON.light,
      lightest: PALETTES.MOON.lightest
    };

    // DOM Elements
    this.shell = document.getElementById('handheld-shell') || document.querySelector('.desktop-game-container');
    this.viewport = document.getElementById('lcd-screen-viewport') || document.querySelector('.desktop-viewport');
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.hudScore = document.getElementById('hud-score');
    this.hudHiScore = document.getElementById('hud-hiscore');
    this.hudLives = document.getElementById('hud-lives');
    this.obsTicker = document.getElementById('observation-ticker');

    // Sub-HUD Science Telemetry
    this.subLocation = document.getElementById('sub-location');
    this.subCoords = document.getElementById('sub-coords');
    this.subNss = document.getElementById('sub-nss');

    // Overlays
    this.overlayStart = document.getElementById('overlay-start');
    this.overlayMission = document.getElementById('overlay-mission');
    this.overlayGameOver = document.getElementById('overlay-gameover');
    this.overlayPause = document.getElementById('overlay-pause');
    this.overlaySector = document.getElementById('overlay-sector');
    this.overlayHangar = document.getElementById('overlay-hangar');

    // Register instance globally for React App integration
    window.NASA_GAME = this;

    // Modal Display Tags
    this.sectorTargetDisplay = document.getElementById('sector-target-display');
    this.sectorSpecsDisplay = document.getElementById('sector-specs-display');
    this.startSiteLabel = document.getElementById('start-site-label');
    this.startRoverBadge = document.getElementById('start-rover-badge');
    this.modelNumberTag = document.getElementById('model-number-tag');
    this.deviceBranding = document.getElementById('device-branding');

    // Hangar Modal Elements
    this.hangarRoverName = document.getElementById('hangar-rover-name');
    this.hangarCounter = document.getElementById('hangar-counter');
    this.hangarPillsList = document.getElementById('hangar-pills-list');
    this.hangarCanvas = document.getElementById('hangar-preview-canvas');
    this.hangarCtx = this.hangarCanvas ? this.hangarCanvas.getContext('2d') : null;
    this.hangarPlanetTag = document.getElementById('hangar-planet-tag');
    this.hangarStatusTag = document.getElementById('hangar-status-tag');
    this.specType = document.getElementById('spec-type');
    this.specMassSpeed = document.getElementById('spec-mass-speed');
    this.specPower = document.getElementById('spec-power');
    this.specPayload = document.getElementById('spec-payload');
    this.specRecord = document.getElementById('spec-record');

    // Hardware Buttons
    this.btnStart = document.getElementById('btn-start-game');
    this.btnResumeMission = document.getElementById('btn-resume-mission');
    this.btnRestart = document.getElementById('btn-restart-game');
    this.btnResumePause = document.getElementById('btn-resume-pause');
    this.btnConfirmSector = document.getElementById('btn-confirm-sector');
    this.btnSoftPause = document.getElementById('btn-soft-pause');
    this.btnSoftHangar = document.getElementById('btn-soft-hangar');
    this.btnSoftSurface = document.getElementById('btn-soft-surface');
    this.btnSoftSound = document.getElementById('btn-soft-sound');
    this.btnSpeed = document.getElementById('btn-pill-speed');
    this.btnReset = document.getElementById('btn-pill-reset');

    // Abort / Return to Home Buttons & Direct Planet Pickers
    this.btnQuitHome = document.getElementById('btn-quit-home');
    this.btnAbortToHome = document.getElementById('btn-abort-to-home');
    this.btnGameoverToHome = document.getElementById('btn-gameover-to-home');
    this.btnPickMoon = document.getElementById('btn-pick-moon');
    this.btnPickMars = document.getElementById('btn-pick-mars');

    // Hangar Buttons
    this.btnHangarDeploy = document.getElementById('btn-hangar-deploy');
    this.btnHangarClose = document.getElementById('btn-hangar-close');
    this.btnHangarPrev = document.getElementById('btn-hangar-prev');
    this.btnHangarNext = document.getElementById('btn-hangar-next');
    this.btnOpenHangarStart = document.getElementById('btn-open-hangar-start');
    this.btnOpenHangarPause = document.getElementById('btn-open-hangar-pause');

    // D-Pad
    this.btnDpadUp = document.getElementById('btn-dpad-up');
    this.btnDpadDown = document.getElementById('btn-dpad-down');
    this.btnDpadLeft = document.getElementById('btn-dpad-left');
    this.btnDpadRight = document.getElementById('btn-dpad-right');

    // Audio Engine
    this.audio = new RetroAudioEngine();

    // Game States: 'START', 'RUNNING', 'MISSION_MODAL', 'SECTOR_MODAL', 'HANGAR_MODAL', 'PAUSED', 'GAMEOVER'
    this.state = 'START';
    this.prevPreModalState = 'START';
    this.lives = 5;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('nasa_snake_hiscore') || '0', 10);
    this.missionsRecovered = 0;
    this.dataScansLogged = 0;
    this.maxExplorationDistance = 0;

    // Movement & Speed
    this.speedTier = 1; // 0: Slow (165ms), 1: Normal (120ms), 2: Fast (85ms)
    this.tickIntervals = [165, 120, 85];
    this.lastTickTime = 0;

    // Infinite World Coordinates
    this.roverHead = { x: 0, y: 0 };
    this.prevRoverHead = { x: 0, y: 0 };
    this.direction = { x: 1, y: 0 };
    this.inputQueue = [];
    this.tail = [];
    this.tailGrowthPending = 0;

    // Smooth Camera (GTA Style)
    this.camera = { x: 0, y: 0 };

    // Procedural Infinite Obstacles Cache: Map<`${cx},${cy}`, rocks[]>
    this.chunkCache = new Map();

    // Active Mission Targets & Probes
    this.currentMissionTarget = null;
    this.activeProbes = [];
    this.missionPool = [];
    this.activeProbePool = [];

    // Telemetry variables
    this.currentIcePpm = this.selectedRover.basePpm;
    this.headingStr = 'E';
    this.roverAnimTick = 0;
    this.gameStartTime = 0;

    // Visual FX
    this.tracks = []; // World coordinates { x, y, alpha }
    this.particles = [];
    this.invulnerableTicks = 0;
    this.tickerTimeout = null;

    // Player 2 Co-Op Drone System
    this.player2Active = false;
    this.player2Drone = null;
    this.btnPlayer2 = document.getElementById('btn-player-2');
    this.btnPlayer2Pill = document.getElementById('btn-player-2-pill');
    this.p2SubLabel = document.getElementById('p2-sub-label');
    this.subP2 = document.getElementById('sub-p2');

    // Apply initial setup
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (this.state !== 'RUNNING') {
        this.renderInitialCanvas();
      }
    });

    this.applySurfaceTheme();
    this.applyRoverBranding();
    this.initControls();
    this.updateHUD();
    this.renderInitialCanvas();

    // Start 60fps rendering frame loop
    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  resizeCanvas() {
    this.viewWidth = window.innerWidth || 800;
    this.viewHeight = window.innerHeight || 600;
    if (this.canvas) {
      this.canvas.width = this.viewWidth;
      this.canvas.height = this.viewHeight;
    }
    this.CANVAS_SIZE = Math.min(this.viewWidth, this.viewHeight);
  }

  applySurfaceTheme() {
    const p = PALETTES[this.surfaceSite];
    this.COLORS = {
      darkest: p.darkest,
      dark: p.dark,
      light: p.light,
      lightest: p.lightest
    };

    if (this.shell) this.shell.setAttribute('data-surface', this.surfaceSite);
    if (this.viewport) this.viewport.setAttribute('data-surface', this.surfaceSite);
    if (this.btnSoftSurface) {
      this.btnSoftSurface.setAttribute('title', `Active Surface: ${this.surfaceSite} (Toggle: TAB)`);
    }
    const siteShortLabel = document.getElementById('site-short-label');
    if (siteShortLabel) {
      siteShortLabel.textContent = this.surfaceSite;
    }
    if (this.startSiteLabel) this.startSiteLabel.textContent = `TARGET: ${this.surfaceSite} (${this.surfaceSite === 'MOON' ? 'SOUTH POLE' : 'JEZERO DELTA'})`;
    if (typeof this.updateSurfacePickButtons === 'function') {
      this.updateSurfacePickButtons();
    }
    this.chunkCache.clear(); // Re-seed terrain boulders for chosen planetary geology
  }

  applyRoverBranding() {
    const r = this.selectedRover;
    if (this.modelNumberTag) this.modelNumberTag.textContent = r.tag;
    if (this.btnSoftHangar) {
      this.btnSoftHangar.setAttribute('title', `NASA Hangar [${r.name}] (Key: R)`);
    }
    const currentRoverShort = document.getElementById('current-rover-short');
    if (currentRoverShort) {
      currentRoverShort.textContent = r.name.substring(0, 6);
    }
    if (this.startRoverBadge) this.startRoverBadge.textContent = `ACTIVE ROVER: ${r.fullName}`;
    if (this.btnOpenHangarStart) this.btnOpenHangarStart.textContent = `CHOOSE ROVER: [${r.name}]`;

    // Dynamic shell header banner badge
    if (this.deviceBranding) {
      const code = r.id === 'VIPER' ? '3310' : (r.id === 'CURIOSITY' ? 'MSL' : (r.id === 'PERSEVERANCE' ? 'M2020' : (r.id === 'OPPORTUNITY' ? 'MER' : (r.id === 'SOJOURNER' ? '1997' : 'LRV'))));
      this.deviceBranding.innerHTML = `
        <div class="console-vent-strip" aria-hidden="true">
          <span class="vent-line"></span>
          <span class="vent-line"></span>
          <span class="vent-line"></span>
        </div>
        <div class="brand-title">
          <span class="brand-badge">NASA</span> ${r.name}-${code}
        </div>
        <div class="power-led-indicator" title="System Power Status">
          <span class="led-dot"></span>
          <span class="model-number" id="model-number-tag">${r.tag}</span>
        </div>
      `;
    }
  }

  // --- CONTROLS SETUP ---
  initControls() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));

    this.btnStart.addEventListener('click', () => this.startNewRun());
    this.btnResumeMission.addEventListener('click', () => this.closeMissionModal());
    this.btnRestart.addEventListener('click', () => this.startNewRun());
    this.btnResumePause.addEventListener('click', () => this.togglePause());

    // Abort / Quit to Home Screen Listeners
    if (this.btnQuitHome) {
      this.btnQuitHome.addEventListener('click', () => {
        this.quitToHomeScreen();
      });
    }

    if (this.btnAbortToHome) {
      this.btnAbortToHome.addEventListener('click', () => {
        this.quitToHomeScreen();
      });
    }

    if (this.btnGameoverToHome) {
      this.btnGameoverToHome.addEventListener('click', () => {
        this.quitToHomeScreen();
      });
    }

    // Direct Planetary Body Selection on Home Screen
    if (this.btnPickMoon) {
      this.btnPickMoon.addEventListener('click', () => {
        this.setSurfaceSite('MOON');
      });
    }

    if (this.btnPickMars) {
      this.btnPickMars.addEventListener('click', () => {
        this.setSurfaceSite('MARS');
      });
    }

    if (this.btnConfirmSector) {
      this.btnConfirmSector.addEventListener('click', () => this.closeSectorModal());
    }

    this.btnSoftPause.addEventListener('click', () => {
      this.audio.playClick();
      this.togglePause();
    });

    if (this.btnSoftHangar) {
      this.btnSoftHangar.addEventListener('click', () => {
        this.audio.playClick();
        this.openHangarModal();
      });
    }

    if (this.btnOpenHangarStart) {
      this.btnOpenHangarStart.addEventListener('click', () => {
        this.audio.playClick();
        this.openHangarModal();
      });
    }

    if (this.btnOpenHangarPause) {
      this.btnOpenHangarPause.addEventListener('click', () => {
        this.audio.playClick();
        this.openHangarModal();
      });
    }

    this.btnSoftSurface.addEventListener('click', () => {
      this.audio.playClick();
      this.toggleSurface();
    });

    if (this.btnSoftSound) {
      this.btnSoftSound.addEventListener('click', () => {
        this.audio.toggleMute();
        this.updateSoundButtonUI();
        this.audio.playClick();
      });
      this.updateSoundButtonUI();
    }

    if (this.btnSpeed) {
      this.btnSpeed.addEventListener('click', () => {
        this.audio.playClick();
        this.cycleSpeed();
      });
    }

    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => {
        this.audio.playClick();
        this.startNewRun();
      });
    }

    // Console Dual Shoulder Triggers & Bumpers (L1, L2, R1, R2)
    const btnShoulderL1 = document.getElementById('btn-shoulder-l1') || document.getElementById('btn-shoulder-l');
    const btnShoulderL2 = document.getElementById('btn-shoulder-l2');
    const btnShoulderR1 = document.getElementById('btn-shoulder-r1') || document.getElementById('btn-shoulder-r');
    const btnShoulderR2 = document.getElementById('btn-shoulder-r2');

    if (btnShoulderL1) {
      btnShoulderL1.addEventListener('click', () => {
        this.audio.playClick();
        this.togglePause();
      });
    }

    if (btnShoulderL2) {
      btnShoulderL2.addEventListener('click', () => {
        this.audio.playClick();
        this.toggleSurface();
      });
    }

    if (btnShoulderR1) {
      btnShoulderR1.addEventListener('click', () => {
        const isSoundOn = this.audio.toggleMute();
        this.btnSoftSound.textContent = isSoundOn ? 'SND: ON' : 'SND: OFF';
        this.audio.playClick();
      });
    }

    if (btnShoulderR2) {
      btnShoulderR2.addEventListener('click', () => {
        this.audio.playClick();
        this.cycleSpeed();
      });
    }

    // G90 Volume Rocker Controls
    const btnVolUp = document.getElementById('btn-vol-up');
    const btnVolDown = document.getElementById('btn-vol-down');
    if (btnVolUp) {
      btnVolUp.addEventListener('click', () => {
        if (this.audio.muted) this.audio.toggleMute();
        this.btnSoftSound.textContent = 'SND: ON';
        this.audio.playClick();
      });
    }
    if (btnVolDown) {
      btnVolDown.addEventListener('click', () => {
        this.audio.playClick();
        if (!this.audio.muted) {
          this.audio.toggleMute();
          this.btnSoftSound.textContent = 'SND: OFF';
        }
      });
    }

    // Hardware START button on Right Wing
    const btnStartHardware = document.getElementById('btn-start-hardware');
    if (btnStartHardware) {
      btnStartHardware.addEventListener('click', () => {
        this.audio.playClick();
        if (this.state === 'START' || this.state === 'GAMEOVER') {
          this.startNewRun();
        } else if (this.state === 'MISSION_MODAL') {
          this.closeMissionModal();
        } else if (this.state === 'SECTOR_MODAL') {
          this.closeSectorModal();
        } else if (this.state === 'HANGAR_MODAL') {
          this.deployHangarRover();
        } else if (this.state === 'PAUSED') {
          this.togglePause();
        }
      });
    }

    // Hardware PLAYER 2 Buttons on Right Wing (Header button & System Pill button)
    if (this.btnPlayer2) {
      this.btnPlayer2.addEventListener('click', () => {
        this.togglePlayer2();
      });
    }
    if (this.btnPlayer2Pill) {
      this.btnPlayer2Pill.addEventListener('click', () => {
        this.togglePlayer2();
      });
    }

    // Interactive G90 3D Analog Thumbsticks (Left & Right)
    const setupAnalogThumbstick = (housingId, thumbId) => {
      const housing = document.getElementById(housingId);
      const thumb = document.getElementById(thumbId);
      if (!housing || !thumb) return;

      let isDragging = false;
      const MAX_RADIUS = 15;

      const handlePointerDown = (e) => {
        isDragging = true;
        this.audio.init();
        housing.setPointerCapture?.(e.pointerId);
        updateStick(e);
      };

      const handlePointerMove = (e) => {
        if (!isDragging) return;
        updateStick(e);
      };

      const handlePointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        thumb.style.transform = 'translate(0px, 0px)';
      };

      const updateStick = (e) => {
        const rect = housing.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rawDx = e.clientX - centerX;
        const rawDy = e.clientY - centerY;
        const dist = Math.hypot(rawDx, rawDy);

        let clampedX = rawDx;
        let clampedY = rawDy;
        if (dist > MAX_RADIUS) {
          clampedX = (rawDx / dist) * MAX_RADIUS;
          clampedY = (rawDy / dist) * MAX_RADIUS;
        }

        thumb.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

        // Steer if dragged past threshold
        if (dist > 7) {
          if (Math.abs(clampedX) > Math.abs(clampedY)) {
            this.setDirection(clampedX > 0 ? 1 : -1, 0);
          } else {
            this.setDirection(0, clampedY > 0 ? 1 : -1);
          }
        }
      };

      housing.addEventListener('pointerdown', handlePointerDown);
      housing.addEventListener('pointermove', handlePointerMove);
      housing.addEventListener('pointerup', handlePointerUp);
      housing.addEventListener('pointercancel', handlePointerUp);
    };

    setupAnalogThumbstick('left-stick-housing', 'left-stick-thumb');
    setupAnalogThumbstick('right-stick-housing', 'right-stick-thumb');

    // Console ABXY Action Diamond Cluster
    const btnActionA = document.getElementById('btn-action-a');
    const btnActionB = document.getElementById('btn-action-b');
    const btnActionX = document.getElementById('btn-action-x');
    const btnActionY = document.getElementById('btn-action-y');

    if (btnActionA) {
      btnActionA.addEventListener('click', () => {
        this.audio.playClick();
        if (this.state === 'START' || this.state === 'GAMEOVER') {
          this.startNewRun();
        } else if (this.state === 'MISSION_MODAL') {
          this.closeMissionModal();
        } else if (this.state === 'SECTOR_MODAL') {
          this.closeSectorModal();
        } else if (this.state === 'HANGAR_MODAL') {
          this.deployHangarRover();
        } else if (this.state === 'PAUSED') {
          this.togglePause();
        } else if (this.state === 'RUNNING') {
          this.setDirection(1, 0); // Steer Right / Forward
        }
      });
    }

    if (btnActionB) {
      btnActionB.addEventListener('click', () => {
        this.audio.playClick();
        if (this.state === 'HANGAR_MODAL') {
          this.closeHangarModal();
        } else if (this.state === 'MISSION_MODAL') {
          this.closeMissionModal();
        } else if (this.state === 'SECTOR_MODAL') {
          this.closeSectorModal();
        } else {
          this.togglePause();
        }
      });
    }

    if (btnActionX) {
      btnActionX.addEventListener('click', () => {
        this.audio.playClick();
        if (this.state === 'HANGAR_MODAL') {
          this.closeHangarModal();
        } else {
          this.openHangarModal();
        }
      });
    }

    if (btnActionY) {
      btnActionY.addEventListener('click', () => {
        this.audio.playClick();
        this.cycleSpeed();
      });
    }

    // Hangar Modal Actions
    if (this.btnHangarPrev) {
      this.btnHangarPrev.addEventListener('click', () => this.navigateHangar(-1));
    }
    if (this.btnHangarNext) {
      this.btnHangarNext.addEventListener('click', () => this.navigateHangar(1));
    }
    if (this.btnHangarDeploy) {
      this.btnHangarDeploy.addEventListener('click', () => this.deployHangarRover());
    }
    if (this.btnHangarClose) {
      this.btnHangarClose.addEventListener('click', () => this.closeHangarModal());
    }

    // Quick Switcher Pills inside Hangar
    if (this.hangarPillsList) {
      this.hangarPillsList.querySelectorAll('.hangar-pill').forEach((pill) => {
        pill.addEventListener('click', (e) => {
          const roverKey = e.currentTarget.getAttribute('data-rover');
          const idx = this.rovers.findIndex(r => r.id === roverKey);
          if (idx !== -1) {
            this.hangarPreviewIndex = idx;
            this.updateHangarModalCard();
            this.audio.playClick();
          }
        });
      });
    }

    // D-Pad handlers (safe for handheld or desktop)
    const setupDpad = (btn, dirX, dirY) => {
      if (!btn) return;
      const handleDir = (e) => {
        e.preventDefault();
        this.audio.init();
        this.setDirection(dirX, dirY);
      };
      btn.addEventListener('pointerdown', handleDir);
    };

    setupDpad(this.btnDpadUp, 0, -1);
    setupDpad(this.btnDpadDown, 0, 1);
    setupDpad(this.btnDpadLeft, -1, 0);
    setupDpad(this.btnDpadRight, 1, 0);

    // Desktop Mouse Click & Tap Steering on Canvas
    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => {
        this.audio.init();
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const dx = clickX - this.viewWidth / 2;
        const dy = clickY - this.viewHeight / 2;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.setDirection(dx > 0 ? 1 : -1, 0);
        } else {
          this.setDirection(0, dy > 0 ? 1 : -1);
        }
      });
    }

    // Fullscreen Toggle Button
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        this.audio.playClick();
        this.toggleFullscreen();
      });
    }

    // Help Dialog Buttons
    const btnControlsHelp = document.getElementById('btn-controls-help');
    const overlayHelp = document.getElementById('overlay-help');
    const btnCloseHelp = document.getElementById('btn-close-help');
    if (btnControlsHelp && overlayHelp) {
      btnControlsHelp.addEventListener('click', () => {
        this.audio.playClick();
        overlayHelp.classList.remove('hidden');
      });
    }
    if (btnCloseHelp && overlayHelp) {
      btnCloseHelp.addEventListener('click', () => {
        this.audio.playClick();
        overlayHelp.classList.add('hidden');
      });
    }

    // Touch swiping on canvas
    let touchStartX = 0;
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      this.audio.init();
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) > 20) {
          if (absX > absY) {
            this.setDirection(deltaX > 0 ? 1 : -1, 0);
          } else {
            this.setDirection(0, deltaY > 0 ? 1 : -1);
          }
        }
      }
    }, { passive: true });
  }

  updateSoundButtonUI() {
    if (!this.btnSoftSound) return;
    if (this.audio.muted) {
      this.btnSoftSound.classList.add('sound-muted');
      this.btnSoftSound.setAttribute('title', 'Sound: Muted (Toggle: M)');
    } else {
      this.btnSoftSound.classList.remove('sound-muted');
      this.btnSoftSound.setAttribute('title', 'Sound: Active (Toggle: M)');
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  handleKeyDown(e) {
    // Prevent interfering with React modals or input controls
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
      return;
    }
    if (window.IS_REACT_MODAL_OPEN) {
      if (e.key === 'Escape' && window.CLOSE_REACT_MODAL) {
        window.CLOSE_REACT_MODAL();
      }
      return;
    }

    this.audio.init();

    // Hangar Navigation Keys
    if (this.state === 'HANGAR_MODAL') {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.navigateHangar(-1);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        this.navigateHangar(1);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.deployHangarRover();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeHangarModal();
        return;
      }
    }

    // Help Modal Dismissal
    const overlayHelp = document.getElementById('overlay-help');
    if (overlayHelp && !overlayHelp.classList.contains('hidden')) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        overlayHelp.classList.add('hidden');
        return;
      }
    }

    // Escape Key: Abort to Home / Close Active In-game Modals
    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.state === 'HANGAR_MODAL') {
        this.closeHangarModal();
        return;
      }
      if (this.state === 'SECTOR_MODAL') {
        this.closeSectorModal();
        return;
      }
      if (this.state === 'MISSION_MODAL') {
        this.closeMissionModal();
        return;
      }
      if (this.state === 'PAUSED' || this.state === 'GAMEOVER') {
        this.quitToHomeScreen();
        return;
      }
      if (this.state === 'RUNNING') {
        this.togglePause();
        return;
      }
    }

    // Space/Enter to resume modals or unpause
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      if (this.state === 'SECTOR_MODAL') {
        e.preventDefault();
        this.closeSectorModal();
        return;
      }
      if (this.state === 'MISSION_MODAL') {
        e.preventDefault();
        this.closeMissionModal();
        return;
      }
      if (this.state === 'PAUSED') {
        e.preventDefault();
        this.togglePause();
        return;
      }
      if (this.state === 'START' || this.state === 'GAMEOVER') {
        e.preventDefault();
        this.startNewRun();
        return;
      }
    }

    // Toggle Rover Hangar key (R)
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      if (this.state === 'HANGAR_MODAL') {
        this.closeHangarModal();
      } else {
        this.openHangarModal();
      }
      return;
    }

    // Toggle pause key (P)
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      this.togglePause();
      return;
    }

    // Toggle mute key (M)
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      this.audio.toggleMute();
      this.updateSoundButtonUI();
      return;
    }

    // Toggle Player 2 key (2)
    if (e.key === '2') {
      e.preventDefault();
      this.togglePlayer2();
      return;
    }

    // Toggle Surface (Tab) - Locked mid-game
    if (e.key === 'Tab') {
      e.preventDefault();
      this.toggleSurface();
      return;
    }

    // Cycle Speed (T or 1)
    if (e.key === 't' || e.key === 'T' || e.key === '1') {
      e.preventDefault();
      this.cycleSpeed();
      return;
    }

    // Toggle Fullscreen (F)
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      this.toggleFullscreen();
      return;
    }

    // Toggle Help (H or ?)
    if (e.key === 'h' || e.key === 'H' || e.key === '?') {
      e.preventDefault();
      if (overlayHelp) {
        overlayHelp.classList.toggle('hidden');
      }
      return;
    }

    // Directional control
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        this.setDirection(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        this.setDirection(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        this.setDirection(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        this.setDirection(1, 0);
        break;
    }
  }

  setDirection(dx, dy) {
    if (this.state !== 'RUNNING') {
      if (this.state === 'START' || this.state === 'GAMEOVER') {
        this.startNewRun();
      }
      return;
    }

    const lastDir = this.inputQueue.length > 0 
      ? this.inputQueue[this.inputQueue.length - 1] 
      : this.direction;

    // Prevent immediate reverse
    if (dx !== 0 && lastDir.x === -dx) return;
    if (dy !== 0 && lastDir.y === -dy) return;
    if (dx === lastDir.x && dy === lastDir.y) return;

    if (this.inputQueue.length < 2) {
      this.inputQueue.push({ x: dx, y: dy });
    }
  }

  // --- HANGAR ROVER FLEET MODAL ---
  openHangarModal() {
    this.prevPreModalState = this.state;
    this.state = 'HANGAR_MODAL';
    this.hangarPreviewIndex = this.selectedRoverIndex;
    this.updateHangarModalCard();

    if (this.overlayStart) this.overlayStart.classList.add('hidden');
    if (this.overlayPause) this.overlayPause.classList.add('hidden');
    if (this.overlayHangar) this.overlayHangar.classList.remove('hidden');
    this.drawHangarRoverPreview();
  }

  closeHangarModal() {
    if (this.state !== 'HANGAR_MODAL') return;
    this.audio.playClick();
    if (this.overlayHangar) this.overlayHangar.classList.add('hidden');

    if (this.prevPreModalState === 'PAUSED') {
      this.state = 'PAUSED';
      if (this.overlayPause) this.overlayPause.classList.remove('hidden');
    } else if (this.prevPreModalState === 'RUNNING') {
      this.state = 'RUNNING';
      this.lastTickTime = performance.now();
    } else {
      this.state = 'START';
      if (this.overlayStart) this.overlayStart.classList.remove('hidden');
    }
  }

  navigateHangar(direction) {
    this.hangarPreviewIndex = (this.hangarPreviewIndex + direction + this.rovers.length) % this.rovers.length;
    this.updateHangarModalCard();
    this.audio.playClick();
  }

  updateHangarModalCard() {
    const rover = this.rovers[this.hangarPreviewIndex];
    if (this.hangarRoverName) this.hangarRoverName.textContent = rover.fullName;
    if (this.hangarCounter) this.hangarCounter.textContent = `${this.hangarPreviewIndex + 1}/${this.rovers.length}`;
    if (this.hangarPlanetTag) this.hangarPlanetTag.textContent = `${rover.destination} [${rover.site.split('[')[1].replace(']', '')}]`;
    if (this.hangarStatusTag) this.hangarStatusTag.textContent = rover.status;

    if (this.specType) this.specType.textContent = rover.type;
    if (this.specMassSpeed) this.specMassSpeed.textContent = rover.massSpeed;
    if (this.specPower) this.specPower.textContent = rover.power;
    if (this.specPayload) this.specPayload.textContent = rover.payload;
    if (this.specRecord) this.specRecord.textContent = rover.record;

    // Update pill active states
    if (this.hangarPillsList) {
      this.hangarPillsList.querySelectorAll('.hangar-pill').forEach((pill) => {
        if (pill.getAttribute('data-rover') === rover.id) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }

    this.drawHangarRoverPreview();
  }

  deployHangarRover() {
    this.selectedRoverIndex = this.hangarPreviewIndex;
    this.selectedRover = this.rovers[this.selectedRoverIndex];
    this.audio.playRoverSelect();

    // Re-align destination planetary surface if rover belongs to other world
    if (this.selectedRover.destination !== this.surfaceSite) {
      this.surfaceSite = this.selectedRover.destination;
      this.applySurfaceTheme();
    }

    this.applyRoverBranding();
    this.closeHangarModal();

    // Show brief observation banner
    this.obsTicker.textContent = `[FLEET DEPLOYED] ${this.selectedRover.fullName} ONLINE`;
    this.obsTicker.classList.add('active');
    if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
    this.tickerTimeout = setTimeout(() => {
      this.obsTicker.classList.remove('active');
    }, 3200);
  }

  drawHangarRoverPreview() {
    if (!this.hangarCtx || !this.hangarCanvas) return;
    const ctx = this.hangarCtx;
    const w = this.hangarCanvas.width;
    const h = this.hangarCanvas.height;
    const rover = this.rovers[this.hangarPreviewIndex];

    // Clear preview canvas
    ctx.fillStyle = this.COLORS.lightest;
    ctx.fillRect(0, 0, w, h);

    // Decorative grid ticks
    ctx.strokeStyle = 'rgba(15, 56, 15, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 10; x < w; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 10; y < h; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Render enlarged blueprint of the rover
    ctx.save();
    ctx.translate(w / 2, h / 2);
    this.drawVehicleChassis(ctx, rover.id, { x: 1, y: 0 }, 1.5, true);
    ctx.restore();

    // Blueprint frame corners
    ctx.strokeStyle = this.COLORS.dark;
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, w - 2, h - 2);
  }

  // --- PROCEDURAL INFINITE WORLD & GEOLOGY ---
  getChunkObstacles(cx, cy) {
    const key = `${cx},${cy}`;
    if (this.chunkCache.has(key)) {
      return this.chunkCache.get(key);
    }

    const rocks = [];
    const startGridX = cx * this.CHUNK_SIZE;
    const startGridY = cy * this.CHUNK_SIZE;

    // Deterministic pseudo-random seed
    const chunkSeed = Math.abs(Math.sin(cx * 374761393 + cy * 668265263 + (this.surfaceSite === 'MOON' ? 1337 : 8941)) * 100000);
    const rand = chunkSeed - Math.floor(chunkSeed);

    // 40% of chunks contain a geological boulder hazard cluster
    const isOrigin = cx === 0 && cy === 0;
    if (rand > 0.60 || isOrigin) {
      const numClusters = isOrigin ? 2 : (rand > 0.88 ? 2 : 1);

      for (let c = 0; c < numClusters; c++) {
        const cSeed1 = (chunkSeed * (c + 1) * 17.31) % 1;
        const cSeed2 = (chunkSeed * (c + 2) * 29.73) % 1;

        const centLocalX = Math.floor(cSeed1 * 10) + 3;
        const centLocalY = Math.floor(cSeed2 * 10) + 3;
        const centX = startGridX + centLocalX;
        const centY = startGridY + centLocalY;

        // Keep safe buffer from starting origin (0, 0)
        if (Math.hypot(centX, centY) < 6) continue;

        rocks.push({ x: centX, y: centY, isCentroid: true });

        // Satellite rocks around centroid
        const numSats = Math.floor(((chunkSeed * 7.1 + c) % 1) * 3) + 2;
        const offsets = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
          { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
        ];

        for (let s = 0; s < numSats; s++) {
          const offIdx = Math.floor(((chunkSeed * (s + 3) * 11.17) % 1) * offsets.length);
          const off = offsets[offIdx];
          const rx = centX + off.dx;
          const ry = centY + off.dy;

          if (Math.hypot(rx, ry) >= 6 && !rocks.some(r => r.x === rx && r.y === ry)) {
            rocks.push({ x: rx, y: ry, isCentroid: false });
          }
        }
      }
    }

    // Cache management (LRU cleanup)
    if (this.chunkCache.size > 300) {
      const keysToDelete = Array.from(this.chunkCache.keys()).slice(0, 100);
      keysToDelete.forEach(k => this.chunkCache.delete(k));
    }

    this.chunkCache.set(key, rocks);
    return rocks;
  }

  isObstacleAt(gx, gy) {
    const cx = Math.floor(gx / this.CHUNK_SIZE);
    const cy = Math.floor(gy / this.CHUNK_SIZE);
    const chunkRocks = this.getChunkObstacles(cx, cy);
    return chunkRocks.some(r => r.x === gx && r.y === gy);
  }

  // --- GAMEPLAY LIFECYCLE ---
  startNewRun() {
    this.audio.init();
    this.audio.playCollect();

    this.lives = 5;
    this.score = 0;
    this.missionsRecovered = 0;
    this.dataScansLogged = 0;
    this.maxExplorationDistance = 0;
    this.gameStartTime = Date.now();

    // Reset Rover in infinite plane
    this.roverHead = { x: 0, y: 0 };
    this.prevRoverHead = { x: 0, y: 0 };
    this.direction = { x: 1, y: 0 };
    this.inputQueue = [];
    this.tail = [
      { x: -1, y: 0 },
      { x: -2, y: 0 }
    ];
    this.tailGrowthPending = 0;
    this.tracks = [];
    this.particles = [];
    this.invulnerableTicks = 0;

    // Reset Camera
    this.camera.x = -this.CANVAS_SIZE / 2;
    this.camera.y = -this.CANVAS_SIZE / 2;

    // Prepare mission target pool
    this.resetMissionPool();
    this.spawnNextMissionTarget();

    // Prepare active telemetry probes
    this.resetActiveProbePool();
    this.activeProbes = [];
    for (let i = 0; i < 3; i++) {
      this.spawnActiveProbe();
    }

    // Hide overlays
    this.overlayStart.classList.add('hidden');
    this.overlayMission.classList.add('hidden');
    this.overlayGameOver.classList.add('hidden');
    this.overlayPause.classList.add('hidden');
    if (this.overlaySector) this.overlaySector.classList.add('hidden');
    if (this.overlayHangar) this.overlayHangar.classList.add('hidden');
    this.obsTicker.classList.remove('active');

    this.state = 'RUNNING';
    this.lastTickTime = performance.now();
    this.updateHUD();
  }

  resetMissionPool() {
    const list = window.ABANDONED_MISSIONS_DYNAMIC && window.ABANDONED_MISSIONS_DYNAMIC.length > 0
      ? window.ABANDONED_MISSIONS_DYNAMIC
      : ABANDONED_MISSIONS;
    const bodyMissions = list.filter(m => m.targetBody === this.surfaceSite);
    const otherMissions = list.filter(m => m.targetBody !== this.surfaceSite);
    this.missionPool = this.shuffleArray([...bodyMissions, ...otherMissions]);
  }

  resetActiveProbePool() {
    const bodyProbes = ACTIVE_PROBES.filter(p => p.targetBody === this.surfaceSite);
    const otherProbes = ACTIVE_PROBES.filter(p => p.targetBody !== this.surfaceSite);
    this.activeProbePool = this.shuffleArray([...bodyProbes, ...otherProbes]);
  }

  spawnNextMissionTarget() {
    if (this.missionPool.length === 0) {
      this.resetMissionPool();
    }
    const missionData = this.missionPool.pop();

    // In an infinite world, spawn target ~20 to 35 cells away in an interesting direction
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.floor(Math.random() * 15) + 20;
    let targetX = this.roverHead.x + Math.round(Math.cos(angle) * dist);
    let targetY = this.roverHead.y + Math.round(Math.sin(angle) * dist);

    // Make sure it doesn't collide with an obstacle
    while (this.isObstacleAt(targetX, targetY)) {
      targetX++;
    }

    this.currentMissionTarget = {
      ...missionData,
      x: targetX,
      y: targetY
    };
  }

  spawnActiveProbe() {
    if (this.activeProbePool.length === 0) {
      this.resetActiveProbePool();
    }
    const probeInfo = this.activeProbePool.pop();

    // Spawn 15 to 40 cells away from rover
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.floor(Math.random() * 25) + 15;
    let px = this.roverHead.x + Math.round(Math.cos(angle) * dist);
    let py = this.roverHead.y + Math.round(Math.sin(angle) * dist);

    while (this.isObstacleAt(px, py)) {
      py++;
    }

    this.activeProbes.push({
      ...probeInfo,
      x: px,
      y: py,
      pulsePhase: Math.random() * 6.28
    });
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --- MAIN LOOP ---
  gameLoop(currentTime) {
    const tickDelta = currentTime - this.lastTickTime;
    const interval = this.tickIntervals[this.speedTier];

    if (this.state === 'RUNNING') {
      if (tickDelta >= interval) {
        this.lastTickTime = currentTime;
        this.tick();
      }
    }

    // Render continuous visuals at 60fps
    this.render(currentTime);

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  // --- GRID UPDATE TICK ---
  tick() {
    this.roverAnimTick++;

    if (this.inputQueue.length > 0) {
      this.direction = this.inputQueue.shift();
    }

    const dirMap = { '1,0': 'E', '-1,0': 'W', '0,1': 'S', '0,-1': 'N' };
    this.headingStr = dirMap[`${this.direction.x},${this.direction.y}`] || 'E';

    this.prevRoverHead = { ...this.roverHead };
    const nextX = this.roverHead.x + this.direction.x;
    const nextY = this.roverHead.y + this.direction.y;

    // Track exploration distance
    const distMeters = Math.round(Math.hypot(nextX, nextY) * 10);
    if (distMeters > this.maxExplorationDistance) {
      this.maxExplorationDistance = distMeters;
    }

    // Scientific Telemetry calculation based on vehicle instruments
    if (this.currentMissionTarget) {
      const dTarget = Math.hypot(nextX - this.currentMissionTarget.x, nextY - this.currentMissionTarget.y);
      const proximity = Math.max(0, 1 - (dTarget / 25));

      if (this.selectedRover.id === 'VIPER') {
        this.currentIcePpm = Math.floor(320 + proximity * 1850 + Math.random() * 20);
        if (proximity > 0.85 && this.roverAnimTick % 4 === 0) {
          this.audio.playTone(980, 'sine', 0.03, 0.02);
        }
      } else if (this.selectedRover.id === 'CURIOSITY') {
        this.currentIcePpm = Math.floor(185 + proximity * 340 + Math.random() * 15);
      } else if (this.selectedRover.id === 'LRV') {
        this.currentIcePpm = Math.floor(12 + Math.random() * 6);
      } else {
        this.currentIcePpm = Math.floor(this.selectedRover.basePpm + proximity * 520 + Math.random() * 15);
      }
    }

    // Update Sub-HUD Telemetry
    if (this.subLocation) {
      this.subLocation.textContent = `${this.selectedRover.name} [${this.headingStr}]`;
    }
    if (this.subCoords) {
      const sx = (nextX >= 0 ? '+' : '') + nextX;
      const sy = (nextY >= 0 ? '+' : '') + nextY;
      this.subCoords.textContent = `X:${sx} Y:${sy}`;
    }
    if (this.subNss) {
      const unit = this.surfaceSite === 'MOON' ? 'PPM' : 'U';
      this.subNss.textContent = `${this.selectedRover.telemetryKey}: ${this.currentIcePpm.toString().padStart(4, '0')} ${unit}`;
    }

    // NO BOUNDARY CRASH - INFINITE MOVING SPACE!
    // Collision check 1: Geological Boulder Cluster Hazard
    if (this.isObstacleAt(nextX, nextY)) {
      this.handleCrash('GEOLOGICAL BOULDER HAZARD');
      return;
    }

    // Collision check 2: Trailer Train (Snake Body)
    const hitTail = this.tail.some((seg, idx) => {
      if (idx === this.tail.length - 1 && this.tailGrowthPending === 0) return false;
      return seg.x === nextX && seg.y === nextY;
    });

    if (hitTail && this.invulnerableTicks <= 0) {
      this.handleCrash('TRAILER TRAIN CRUSH');
      return;
    }

    // Record wheel track
    this.tracks.push({
      x: this.roverHead.x,
      y: this.roverHead.y,
      alpha: 1.0
    });
    if (this.tracks.length > 60) {
      this.tracks.shift();
    }

    // Update trailer segments
    this.tail.unshift({ x: this.roverHead.x, y: this.roverHead.y });
    if (this.tailGrowthPending > 0) {
      this.tailGrowthPending--;
    } else {
      this.tail.pop();
    }

    this.roverHead = { x: nextX, y: nextY };
    this.audio.playTick();

    if (this.invulnerableTicks > 0) {
      this.invulnerableTicks--;
    }

    // Check Probe Observation
    const activeHitIndex = this.activeProbes.findIndex(p => p.x === nextX && p.y === nextY);
    if (activeHitIndex !== -1) {
      const probe = this.activeProbes[activeHitIndex];
      this.logObservation(probe);
      this.activeProbes.splice(activeHitIndex, 1);
      this.spawnActiveProbe();
    }

    // Check Player 2 Drone Observation
    if (this.player2Active && this.player2Drone) {
      const droneGridX = Math.round(this.player2Drone.x / this.CELL_SIZE);
      const droneGridY = Math.round(this.player2Drone.y / this.CELL_SIZE);
      const p2HitIndex = this.activeProbes.findIndex(p => Math.hypot(p.x - droneGridX, p.y - droneGridY) <= 1.8);
      if (p2HitIndex !== -1) {
        const p2Probe = this.activeProbes[p2HitIndex];
        this.score += p2Probe.points;
        this.dataScansLogged++;
        this.updateHUD();
        this.audio.playObservation();
        this.obsTicker.textContent = `[P2 DRONE SCAN] ${p2Probe.name}: ${p2Probe.observation}`;
        this.obsTicker.classList.add('active');
        if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
        this.tickerTimeout = setTimeout(() => {
          this.obsTicker.classList.remove('active');
        }, 3800);
        this.activeProbes.splice(p2HitIndex, 1);
        this.spawnActiveProbe();
      }
    }

    // Check Mission Equipment Recovery
    if (this.currentMissionTarget && nextX === this.currentMissionTarget.x && nextY === this.currentMissionTarget.y) {
      this.collectAbandonedMission(this.currentMissionTarget);
    }
  }

  logObservation(probe) {
    this.score += probe.points;
    this.dataScansLogged++;
    this.updateHUD();
    this.audio.playObservation();

    this.obsTicker.textContent = `[${probe.name}] ${probe.observation}`;
    this.obsTicker.classList.add('active');

    if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
    this.tickerTimeout = setTimeout(() => {
      this.obsTicker.classList.remove('active');
    }, 3800);
  }

  collectAbandonedMission(mission) {
    this.score += mission.points;
    this.missionsRecovered++;
    this.tailGrowthPending += 1;
    this.updateHUD();

    // Dispatch event for Firebase persistence in React
    try {
      window.dispatchEvent(new CustomEvent('nasa:mission_collected', {
        detail: {
          mission: { ...mission },
          surface: this.surfaceSite,
          rover: this.selectedRover ? this.selectedRover.name : 'VIPER',
          coords: `X:${this.roverHead.x >= 0 ? '+' : ''}${this.roverHead.x} Y:${this.roverHead.y >= 0 ? '+' : ''}${this.roverHead.y}`
        }
      }));
    } catch (e) {
      console.warn("Event dispatch failed", e);
    }

    this.state = 'MISSION_MODAL';
    this.audio.playMissionAlert();

    document.getElementById('mission-title').textContent = mission.name;
    document.getElementById('mission-body').textContent = mission.body;
    document.getElementById('mission-dates').textContent = mission.dates;
    document.getElementById('mission-discovery').textContent = mission.discovery;
    document.getElementById('mission-status').textContent = mission.status;
    document.getElementById('mission-type-tag').textContent = `+${mission.points} PTS`;

    this.overlayMission.classList.remove('hidden');
    this.spawnNextMissionTarget();
  }

  closeMissionModal() {
    if (this.state !== 'MISSION_MODAL') return;
    this.overlayMission.classList.add('hidden');
    this.state = 'RUNNING';
    this.lastTickTime = performance.now();
    this.audio.playClick();
  }

  handleCrash(reason = 'COLLISION') {
    this.audio.playCrash();
    this.lives--;
    this.updateHUD();

    // Particle explosion
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: (this.roverHead.x + 0.5) * this.CELL_SIZE,
        y: (this.roverHead.y + 0.5) * this.CELL_SIZE,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1.0
      });
    }

    if (this.lives <= 0) {
      this.triggerGameOver(reason);
    } else {
      this.respawnRover();
    }
  }

  respawnRover() {
    // Back up 3 spaces safely
    const safeX = this.roverHead.x - this.direction.x * 2;
    const safeY = this.roverHead.y - this.direction.y * 2;
    this.roverHead = { x: safeX, y: safeY };
    this.prevRoverHead = { x: safeX, y: safeY };
    this.inputQueue = [];
    this.invulnerableTicks = 14;

    this.tail = this.tail.map((_, i) => ({
      x: safeX - this.direction.x * (i + 1),
      y: safeY - this.direction.y * (i + 1)
    }));

    this.flashLCD();
  }

  flashLCD() {
    const orig = this.canvas.style.backgroundColor;
    this.canvas.style.backgroundColor = this.COLORS.dark;
    setTimeout(() => {
      this.canvas.style.backgroundColor = orig;
    }, 80);
  }

  triggerGameOver(reason) {
    this.state = 'GAMEOVER';
    this.audio.playGameOver();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('nasa_snake_hiscore', this.highScore.toString());
    }
    this.updateHUD();

    // Dispatch game over event for Firebase high-score persistence
    try {
      window.dispatchEvent(new CustomEvent('nasa:game_over', {
        detail: {
          score: this.score,
          surface: this.surfaceSite,
          missions: this.missionsRecovered,
          rover: this.selectedRover ? this.selectedRover.name : 'VIPER'
        }
      }));
    } catch (e) {
      console.warn("Game over event failed", e);
    }

    const duration = Math.floor((Date.now() - this.gameStartTime) / 1000);
    const mins = Math.floor(duration / 60).toString().padStart(2, '0');
    const secs = (duration % 60).toString().padStart(2, '0');

    document.getElementById('gameover-heading').textContent = `${this.selectedRover.name} OFFLINE`;
    document.getElementById('gov-score').textContent = this.score.toString().padStart(5, '0');
    document.getElementById('gov-missions').textContent = this.missionsRecovered.toString();
    document.getElementById('gov-scans').textContent = this.dataScansLogged.toString();
    const govDist = document.getElementById('gov-dist');
    if (govDist) govDist.textContent = `${this.maxExplorationDistance} METERS`;
    document.getElementById('gov-time').textContent = `${mins}:${secs}`;

    this.overlayGameOver.classList.remove('hidden');
  }

  togglePause() {
    if (this.state === 'RUNNING') {
      this.state = 'PAUSED';
      this.overlayPause.classList.remove('hidden');
    } else if (this.state === 'PAUSED') {
      this.state = 'RUNNING';
      this.overlayPause.classList.add('hidden');
      this.lastTickTime = performance.now();
    }
    this.updateHUD();
  }

  // Quits the active expedition cleanly and returns to the Home / Mission Briefing screen
  quitToHomeScreen() {
    this.audio.playClick();
    this.state = 'START';
    this.lives = 5;
    this.score = 0;
    this.missionsRecovered = 0;
    this.dataScansLogged = 0;
    this.maxExplorationDistance = 0;
    this.roverHead = { x: 0, y: 0 };
    this.prevRoverHead = { x: 0, y: 0 };
    this.direction = { x: 1, y: 0 };
    this.inputQueue = [];
    this.tail = [
      { x: -1, y: 0 },
      { x: -2, y: 0 }
    ];
    this.tailGrowthPending = 0;
    this.tracks = [];
    this.particles = [];
    this.activeProbes = [];
    this.currentMissionTarget = null;

    if (this.overlayMission) this.overlayMission.classList.add('hidden');
    if (this.overlayGameOver) this.overlayGameOver.classList.add('hidden');
    if (this.overlayPause) this.overlayPause.classList.add('hidden');
    if (this.overlaySector) this.overlaySector.classList.add('hidden');
    if (this.overlayHangar) this.overlayHangar.classList.add('hidden');
    if (this.overlayStart) this.overlayStart.classList.remove('hidden');

    this.obsTicker.textContent = `[MISSION BRIEFING] READY FOR LAUNCH`;
    this.obsTicker.classList.remove('active');
    if (this.tickerTimeout) clearTimeout(this.tickerTimeout);

    this.updateSurfacePickButtons();
    this.updateHUD();
    this.renderInitialCanvas();
  }

  // Direct selection of expedition planetary body
  setSurfaceSite(site) {
    if (this.state === 'RUNNING' || this.state === 'PAUSED' || this.state === 'MISSION_MODAL') {
      this.audio.playObstacleHit();
      this.obsTicker.textContent = `[SECTOR LOCKED] SURFACE IS FIXED TO ${this.surfaceSite}. ABORT EXPEDITION TO SWITCH BODY.`;
      this.obsTicker.classList.add('active');
      if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
      this.tickerTimeout = setTimeout(() => {
        this.obsTicker.classList.remove('active');
      }, 3500);
      return;
    }

    if (this.surfaceSite === site) return;
    this.surfaceSite = site;
    this.applySurfaceTheme();
    this.audio.playSectorSwitch();
    this.updateSurfacePickButtons();
  }

  updateSurfacePickButtons() {
    if (this.btnPickMoon) {
      this.btnPickMoon.classList.toggle('active', this.surfaceSite === 'MOON');
    }
    if (this.btnPickMars) {
      this.btnPickMars.classList.toggle('active', this.surfaceSite === 'MARS');
    }
    const siteShortLabel = document.getElementById('site-short-label');
    if (siteShortLabel) {
      siteShortLabel.textContent = this.surfaceSite;
    }
    if (this.startSiteLabel) {
      this.startSiteLabel.textContent = `${this.surfaceSite} (${this.surfaceSite === 'MOON' ? 'SOUTH POLE' : 'JEZERO DELTA'})`;
    }
  }

  // Toggle surface: Strictly locked once the game starts!
  toggleSurface() {
    if (this.state === 'RUNNING' || this.state === 'PAUSED' || this.state === 'MISSION_MODAL') {
      this.audio.playObstacleHit();
      this.obsTicker.textContent = `[SECTOR LOCKED] SURFACE IS FIXED TO ${this.surfaceSite}. ABORT EXPEDITION TO SWITCH BODY.`;
      this.obsTicker.classList.add('active');
      if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
      this.tickerTimeout = setTimeout(() => {
        this.obsTicker.classList.remove('active');
      }, 3500);
      return;
    }

    this.surfaceSite = this.surfaceSite === 'MARS' ? 'MOON' : 'MARS';
    this.applySurfaceTheme();
    this.audio.playSectorSwitch();
    this.updateSurfacePickButtons();

    if (this.state === 'START') {
      this.showSectorBriefing();
    }
  }

  showSectorBriefing() {
    const p = PALETTES[this.surfaceSite];
    if (this.sectorTargetDisplay) this.sectorTargetDisplay.textContent = p.siteName;
    if (this.sectorSpecsDisplay) this.sectorSpecsDisplay.innerHTML = p.specs;

    this.prevPreModalState = this.state;
    this.state = 'SECTOR_MODAL';

    if (this.overlayStart) this.overlayStart.classList.add('hidden');
    if (this.overlayPause) this.overlayPause.classList.add('hidden');
    if (this.overlaySector) this.overlaySector.classList.remove('hidden');
  }

  closeSectorModal() {
    if (this.state !== 'SECTOR_MODAL') return;
    this.audio.playClick();
    if (this.overlaySector) this.overlaySector.classList.add('hidden');

    if (this.prevPreModalState === 'PAUSED') {
      this.state = 'PAUSED';
      if (this.overlayPause) this.overlayPause.classList.remove('hidden');
    } else {
      this.state = 'START';
      if (this.overlayStart) this.overlayStart.classList.remove('hidden');
    }
  }

  cycleSpeed() {
    this.speedTier = (this.speedTier + 1) % 3;
    const names = ['SLOW', 'NORMAL', 'FAST'];
    const speedSub = document.getElementById('speed-sub-label');
    if (speedSub) {
      speedSub.textContent = names[this.speedTier];
    }
    if (this.btnSpeed) {
      this.btnSpeed.setAttribute('title', `Cycle Speed: ${names[this.speedTier]}`);
    }
  }

  updateHUD() {
    this.hudScore.textContent = this.score.toString().padStart(5, '0');
    this.hudHiScore.textContent = this.highScore.toString().padStart(5, '0');

    this.hudLives.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const pip = document.createElement('span');
      pip.className = i < this.lives ? 'life-pip' : 'life-pip lost';
      this.hudLives.appendChild(pip);
    }

    if (this.btnSoftSurface) {
      const isLocked = this.state === 'RUNNING' || this.state === 'PAUSED';
      if (isLocked) {
        this.btnSoftSurface.classList.add('surface-locked');
        this.btnSoftSurface.setAttribute('title', `[LOCKED] Expedition surface is fixed to ${this.surfaceSite}. Abort run to switch.`);
      } else {
        this.btnSoftSurface.classList.remove('surface-locked');
        this.btnSoftSurface.setAttribute('title', `Selected Body: ${this.surfaceSite} (Toggle at Home: TAB)`);
      }
    }
  }

  // --- RENDERING ROUTINES ---
  renderInitialCanvas() {
    this.ctx.fillStyle = this.COLORS.lightest;
    this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);
  }

  render(currentTime = performance.now()) {
    const ctx = this.ctx;
    const cSize = this.CELL_SIZE;
    const interval = this.tickIntervals[this.speedTier];

    // Smooth movement interpolation between ticks
    const tickProgress = this.state === 'RUNNING'
      ? Math.min(1, Math.max(0, (currentTime - this.lastTickTime) / interval))
      : 1;

    const renderRoverX = (this.prevRoverHead.x + (this.roverHead.x - this.prevRoverHead.x) * tickProgress) * cSize;
    const renderRoverY = (this.prevRoverHead.y + (this.roverHead.y - this.prevRoverHead.y) * tickProgress) * cSize;

    // Smooth GTA-style camera tracking centered on the rover in fullscreen viewport
    const targetCamX = renderRoverX + cSize / 2 - this.viewWidth / 2;
    const targetCamY = renderRoverY + cSize / 2 - this.viewHeight / 2;

    this.camera.x += (targetCamX - this.camera.x) * 0.22;
    this.camera.y += (targetCamY - this.camera.y) * 0.22;

    // Clear background with lightest LCD green
    ctx.fillStyle = this.COLORS.lightest;
    ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

    // --- WORLD SPACE RENDERING (SCROLLING VIEWPORT) ---
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 1. Procedural Infinite Planetary Surface Features (Craters, Dunes, Regolith)
    this.drawInfiniteTerrain(ctx);

    // 2. Fading Grouser Wheel Tracks
    this.drawTracks(ctx, cSize);

    // 3. Geological Hazard Boulder Clusters
    this.drawVisibleObstacles(ctx, cSize);

    // 4. Active NASA Exploration Probes
    this.drawActiveProbes(ctx, cSize);

    // 5. Active NASA Mission Target Equipment
    if (this.currentMissionTarget) {
      this.drawMissionTarget(ctx, this.currentMissionTarget, cSize);
    }

    // 6. Articulated Science Trailer Train
    this.drawTail(ctx, cSize);

    // 7. Active NASA Rover Vehicle Head (Custom silhouette for chosen vehicle)
    if (this.invulnerableTicks % 2 === 0) {
      this.drawRoverHead(ctx, renderRoverX, renderRoverY, this.direction, cSize);
    }

    // 7.5 Player 2 Escort Drone (NASA Ingenuity / VIPER Scout Helicopter)
    if (this.player2Active && this.player2Drone) {
      this.drawPlayer2Drone(ctx, renderRoverX, renderRoverY, cSize, currentTime);
    }

    // 8. Impact Particles
    this.drawParticles(ctx);

    ctx.restore();

    // --- SCREEN SPACE HUD & RETICLE OVERLAYS ---
    this.drawScreenReticle(ctx);
    this.drawRadarCompass(ctx);
  }

  drawInfiniteTerrain(ctx) {
    const chunkPx = this.CHUNK_SIZE * this.CELL_SIZE; // 256px
    const minChunkX = Math.floor((this.camera.x - 32) / chunkPx);
    const maxChunkX = Math.ceil((this.camera.x + this.viewWidth + 32) / chunkPx);
    const minChunkY = Math.floor((this.camera.y - 32) / chunkPx);
    const maxChunkY = Math.ceil((this.camera.y + this.viewHeight + 32) / chunkPx);

    for (let cx = minChunkX; cx <= maxChunkX; cx++) {
      for (let cy = minChunkY; cy <= maxChunkY; cy++) {
        const originX = cx * chunkPx;
        const originY = cy * chunkPx;

        // Deterministic features per chunk
        const hash = Math.abs(Math.sin(cx * 12.9898 + cy * 78.233 + 42) * 43758.5453);
        const featType = Math.floor((hash % 1) * 3);

        if (this.surfaceSite === 'MOON') {
          // Lunar Polar Crater Basins & Permanently Shadowed Cold Traps
          if (featType === 0) {
            const craterX = originX + 128;
            const craterY = originY + 128;
            const r = 54;

            // Outer ejecta rim
            ctx.strokeStyle = this.COLORS.light;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(craterX, craterY, r, 0, Math.PI * 2);
            ctx.stroke();

            // Shadowed floor (PSR)
            ctx.fillStyle = this.COLORS.dark;
            ctx.beginPath();
            ctx.arc(craterX + 4, craterY + 4, r * 0.72, 0, Math.PI * 2);
            ctx.fill();

            // Core shadow
            ctx.fillStyle = this.COLORS.darkest;
            ctx.beginPath();
            ctx.arc(craterX + 7, craterY + 7, r * 0.42, 0, Math.PI * 2);
            ctx.fill();

            // Twinkling water ice crystals
            const blink = Math.sin(performance.now() * 0.006 + cx) > 0;
            ctx.fillStyle = blink ? this.COLORS.lightest : this.COLORS.light;
            ctx.fillRect(craterX + 5, craterY + 5, 2, 2);
            ctx.fillRect(craterX + 11, craterY + 9, 2, 2);
          } else if (featType === 1) {
            // Micro impact clusters
            const mc1 = { x: originX + 60, y: originY + 80, r: 8 };
            const mc2 = { x: originX + 180, y: originY + 170, r: 12 };
            [mc1, mc2].forEach(mc => {
              ctx.strokeStyle = this.COLORS.dark;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(mc.x, mc.y, mc.r, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = this.COLORS.dark;
              ctx.beginPath();
              ctx.arc(mc.x + 1, mc.y + 1, mc.r * 0.5, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // Regolith dust specks
          ctx.fillStyle = 'rgba(48, 98, 48, 0.18)';
          ctx.fillRect(originX + 40, originY + 30, 2, 2);
          ctx.fillRect(originX + 160, originY + 90, 2, 2);
          ctx.fillRect(originX + 210, originY + 220, 2, 2);

        } else {
          // Martian Jezero River Delta & Barchan Sand Dunes
          if (featType === 0) {
            // Sedimentary delta terrace arcs
            ctx.strokeStyle = 'rgba(139, 172, 15, 0.45)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(originX + 30, originY + 230, 90, -Math.PI * 0.45, -Math.PI * 0.05);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(originX + 30, originY + 230, 120, -Math.PI * 0.45, -Math.PI * 0.05);
            ctx.stroke();
          } else if (featType === 1) {
            // Windblown dune ripple crests
            ctx.strokeStyle = this.COLORS.light;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 5; i++) {
              const bx = originX + 40 + i * 36;
              const by = originY + 110 + (i % 2 === 0 ? 6 : -6);
              ctx.beginPath();
              ctx.arc(bx, by, 18, Math.PI * 0.8, Math.PI * 1.8);
              ctx.stroke();
            }
          }

          // Iron oxide sand specks
          ctx.fillStyle = 'rgba(90, 56, 20, 0.25)';
          ctx.fillRect(originX + 80, originY + 50, 2, 2);
          ctx.fillRect(originX + 190, originY + 140, 2, 2);
        }
      }
    }
  }

  drawTracks(ctx, cSize) {
    this.tracks.forEach((tr, i) => {
      const alpha = (i / this.tracks.length) * 0.55;
      ctx.fillStyle = this.surfaceSite === 'MOON'
        ? `rgba(15, 56, 15, ${alpha})`
        : `rgba(34, 18, 6, ${alpha})`;

      const px = tr.x * cSize;
      const py = tr.y * cSize;
      // Twin wheel grouser indentations
      ctx.fillRect(px + 2, py + 2, 3, 2);
      ctx.fillRect(px + 11, py + 2, 3, 2);
      ctx.fillRect(px + 2, py + 12, 3, 2);
      ctx.fillRect(px + 11, py + 12, 3, 2);
    });
  }

  drawVisibleObstacles(ctx, cSize) {
    const chunkPx = this.CHUNK_SIZE * cSize;
    const minChunkX = Math.floor((this.camera.x - 32) / chunkPx);
    const maxChunkX = Math.ceil((this.camera.x + this.viewWidth + 32) / chunkPx);
    const minChunkY = Math.floor((this.camera.y - 32) / chunkPx);
    const maxChunkY = Math.ceil((this.camera.y + this.viewHeight + 32) / chunkPx);

    for (let cx = minChunkX; cx <= maxChunkX; cx++) {
      for (let cy = minChunkY; cy <= maxChunkY; cy++) {
        const rocks = this.getChunkObstacles(cx, cy);
        rocks.forEach(rock => {
          const px = rock.x * cSize;
          const py = rock.y * cSize;

          // Shadow
          ctx.fillStyle = 'rgba(15, 56, 15, 0.28)';
          ctx.fillRect(px + 4, py + 11, 10, 4);

          // Boulder body
          ctx.fillStyle = this.COLORS.darkest;
          ctx.fillRect(px + 2, py + 3, 12, 10);

          // Top highlight
          ctx.fillStyle = this.COLORS.light;
          ctx.fillRect(px + 4, py + 2, 7, 3);

          // Center crevice
          ctx.fillStyle = this.COLORS.dark;
          ctx.fillRect(px + 6, py + 6, 3, 2);
        });
      }
    }
  }

  drawActiveProbes(ctx, cSize) {
    const time = performance.now() * 0.003;

    this.activeProbes.forEach(probe => {
      const cx = (probe.x + 0.5) * cSize;
      const cy = (probe.y + 0.5) * cSize;

      // Radar pulse ring
      const pulseRadius = ((time + probe.pulsePhase) % 1) * (cSize * 1.6);
      ctx.strokeStyle = this.COLORS.dark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Probe silhouette
      const px = probe.x * cSize;
      const py = probe.y * cSize;

      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(cx - 1, py + 1, 2, 6);
      ctx.fillRect(cx - 4, py + 1, 8, 2);
      ctx.fillRect(px + 4, py + 6, 8, 6);

      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(px + 1, py + 8, 3, 3);
      ctx.fillRect(px + 12, py + 8, 3, 3);

      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(px + 3, py + 12, 2, 3);
      ctx.fillRect(px + 11, py + 12, 2, 3);
    });
  }

  drawMissionTarget(ctx, mission, cSize) {
    const px = mission.x * cSize;
    const py = mission.y * cSize;
    const blink = Math.floor(performance.now() / 250) % 2 === 0;

    // Solar wings & Core
    ctx.fillStyle = this.COLORS.dark;
    ctx.fillRect(px + 1, py + 4, 14, 2);
    ctx.fillRect(px + 2, py + 6, 12, 4);

    ctx.fillStyle = this.COLORS.darkest;
    ctx.fillRect(px + 4, py + 5, 8, 6);
    ctx.fillRect(px + 7, py + 1, 2, 5);
    ctx.fillRect(px + 6, py + 1, 4, 2);

    // Blinking beacon
    if (blink) {
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(px + 7, py, 2, 2);
    }

    ctx.fillRect(px + 2, py + 10, 3, 4);
    ctx.fillRect(px + 11, py + 10, 3, 4);
  }

  // --- VEHICLE-SPECIFIC RENDERING ENGINE ---
  drawRoverHead(ctx, worldX, worldY, dir, cSize) {
    ctx.save();
    ctx.translate(worldX + cSize / 2, worldY + cSize / 2);

    // Match driving direction
    let angle = 0;
    if (dir.x === 1) angle = 0;
    else if (dir.x === -1) angle = Math.PI;
    else if (dir.y === 1) angle = Math.PI / 2;
    else if (dir.y === -1) angle = -Math.PI / 2;

    ctx.rotate(angle);

    this.drawVehicleChassis(ctx, this.selectedRover.id, dir, 1.0, false);
    ctx.restore();
  }

  drawVehicleChassis(ctx, roverId, dir, scale = 1.0, isHangar = false) {
    ctx.save();
    ctx.scale(scale, scale);

    if (roverId === 'VIPER') {
      // 1. VIPER (Volatiles Investigating Polar Exploration Rover)
      // Headlights Beam
      ctx.fillStyle = 'rgba(139, 172, 15, 0.28)';
      ctx.beginPath();
      ctx.moveTo(8, -4);
      ctx.lineTo(isHangar ? 40 : 54, -28);
      ctx.lineTo(isHangar ? 40 : 54, 28);
      ctx.lineTo(8, 4);
      ctx.closePath();
      ctx.fill();

      // Box chassis & solar radiators
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-6, -5, 12, 10);
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(-5, -4, 9, 8);
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(-4, -3, 2, 6);
      ctx.fillRect(-1, -3, 2, 6);

      // 4 Cleated Wheels
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(2, -8, 5, 3);
      ctx.fillRect(2, 5, 5, 3);
      ctx.fillRect(-7, -8, 5, 3);
      ctx.fillRect(-7, 5, 5, 3);

      // Stereo Periscope Mast & NSS Bumper
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(4, -2, 4, 4);
      ctx.fillStyle = this.COLORS.lightest;
      ctx.fillRect(7, -2, 2, 1);
      ctx.fillRect(7, 1, 2, 1);

      // TRIDENT drill rig (rear)
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-6, -2, 3, 4);
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(-5, -1, 1, 2);

    } else if (roverId === 'CURIOSITY') {
      // 2. CURIOSITY (MSL Heavy Nuclear Rover)
      // 6 Wheels (Rocker-Bogie 3 per side)
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(3, -9, 4, 3);
      ctx.fillRect(-2, -9, 4, 3);
      ctx.fillRect(-7, -9, 4, 3);
      ctx.fillRect(3, 6, 4, 3);
      ctx.fillRect(-2, 6, 4, 3);
      ctx.fillRect(-7, 6, 4, 3);

      // Main Deck
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(-4, -4, 8, 8);

      // Rear MMRTG Nuclear Generator (Cylinder with Cooling Fins)
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-8, -3, 4, 6);
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(-9, -2, 2, 4);

      // ChemCam Laser Turret & Targeting Optic
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(3, -2, 4, 4);
      ctx.fillStyle = this.COLORS.lightest;
      ctx.fillRect(6, -1, 2, 2);

      // Occasional ChemCam Laser Pulse
      const laserTick = Math.sin(performance.now() * 0.008) > 0.85;
      if (laserTick && !isHangar) {
        ctx.strokeStyle = this.COLORS.lightest;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(44, 0);
        ctx.stroke();
      }

    } else if (roverId === 'PERSEVERANCE') {
      // 3. PERSEVERANCE (Mars 2020 Astrobiology & Drone Carrier)
      // 6 Rocker-Bogie Wheels
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(3, -9, 4, 3);
      ctx.fillRect(-2, -9, 4, 3);
      ctx.fillRect(-7, -9, 4, 3);
      ctx.fillRect(3, 6, 4, 3);
      ctx.fillRect(-2, 6, 4, 3);
      ctx.fillRect(-7, 6, 4, 3);

      // Chassis body
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(-4, -4, 8, 8);

      // SuperCam Mast
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(3, -3, 4, 6);
      ctx.fillStyle = this.COLORS.lightest;
      ctx.fillRect(6, -2, 2, 2);
      ctx.fillRect(6, 1, 2, 2);

      // Sample Caching Carousel (rear tubes)
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(-5, -2, 3, 4);

      // Ingenuity Drone Companion (Flying alongside!)
      if (!isHangar) {
        const droneAngle = (performance.now() * 0.04) % (Math.PI * 2);
        ctx.save();
        ctx.translate(-2, -18);
        ctx.fillStyle = this.COLORS.darkest;
        ctx.fillRect(-2, -2, 4, 4);
        // Spinning rotor blades
        ctx.strokeStyle = this.COLORS.dark;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-7 * Math.cos(droneAngle), -7 * Math.sin(droneAngle));
        ctx.lineTo(7 * Math.cos(droneAngle), 7 * Math.sin(droneAngle));
        ctx.stroke();
        ctx.restore();
      }

    } else if (roverId === 'OPPORTUNITY') {
      // 4. OPPORTUNITY (Long-Duration Solar Wings)
      // Wide Triangular Bat-Wing Solar Arrays
      ctx.fillStyle = this.COLORS.dark;
      ctx.beginPath();
      ctx.moveTo(-6, -3);
      ctx.lineTo(-2, -12);
      ctx.lineTo(4, -3);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-6, 3);
      ctx.lineTo(-2, 12);
      ctx.lineTo(4, 3);
      ctx.closePath();
      ctx.fill();

      // Main Rover Core
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-6, -4, 12, 8);
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(-4, -2, 8, 4);

      // 6 Wheels
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(2, -6, 4, 2);
      ctx.fillRect(-2, -6, 4, 2);
      ctx.fillRect(-6, -6, 4, 2);
      ctx.fillRect(2, 4, 4, 2);
      ctx.fillRect(-2, 4, 4, 2);
      ctx.fillRect(-6, 4, 4, 2);

      // Slender Panoramic Mast
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(3, -1, 3, 2);
      ctx.fillStyle = this.COLORS.lightest;
      ctx.fillRect(5, -1, 2, 2);

    } else if (roverId === 'SOJOURNER') {
      // 5. SOJOURNER (First Wheeled Mars Microrover)
      // Small Compact Chassis
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-4, -4, 9, 8);

      // Golden Solar Roof Panel
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(-3, -3, 7, 6);
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(-2, -2, 5, 4);

      // 6 Small Spiked Wheels
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(2, -6, 3, 2);
      ctx.fillRect(-1, -6, 3, 2);
      ctx.fillRect(-4, -6, 3, 2);
      ctx.fillRect(2, 4, 3, 2);
      ctx.fillRect(-1, 4, 3, 2);
      ctx.fillRect(-4, 4, 3, 2);

      // Front Laser Eyes
      ctx.fillStyle = this.COLORS.lightest;
      ctx.fillRect(4, -2, 2, 1);
      ctx.fillRect(4, 1, 2, 1);

    } else if (roverId === 'LRV') {
      // 6. APOLLO LRV (Crewed Lunar Roving Vehicle / "Moon Buggy")
      // Open Tubular Spaceframe Chassis
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(-7, -5, 14, 10);
      ctx.fillStyle = this.COLORS.lightest;
      ctx.fillRect(-5, -4, 10, 8);

      // Dual Astronaut Bucket Seats
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(-2, -3, 4, 3);
      ctx.fillRect(-2, 1, 4, 3);

      // 4 Zinc Wire-Mesh Wheels with Titanium Chevrons
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(3, -8, 5, 3);
      ctx.fillRect(3, 5, 5, 3);
      ctx.fillRect(-7, -8, 5, 3);
      ctx.fillRect(-7, 5, 5, 3);
      ctx.fillStyle = this.COLORS.light;
      ctx.fillRect(4, -7, 3, 1);
      ctx.fillRect(4, 6, 3, 1);
      ctx.fillRect(-6, -7, 3, 1);
      ctx.fillRect(-6, 6, 3, 1);

      // Parabolic Umbrella High-Gain Antenna (front right)
      ctx.strokeStyle = this.COLORS.darkest;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(6, -2, 5, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(5, -1, 3, 2);
    }

    ctx.restore();
  }

  drawTail(ctx, cSize) {
    this.tail.forEach((seg, index) => {
      const px = seg.x * cSize;
      const py = seg.y * cSize;

      // Module hitch
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(px + 2, py + 7, 12, 2);

      // Main Trailer Body
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(px + 3, py + 3, 10, 10);

      // Specialized Payload Sleds
      const podType = index % 5;
      ctx.fillStyle = this.COLORS.dark;
      ctx.fillRect(px + 4, py + 4, 8, 8);

      if (podType === 0) {
        // TRIDENT Drill Rig
        ctx.fillStyle = this.COLORS.lightest;
        ctx.fillRect(px + 7, py + 3, 2, 8);
        ctx.fillStyle = this.COLORS.darkest;
        ctx.fillRect(px + 7, py + 10, 2, 2);
      } else if (podType === 1) {
        // NIRVSS Infrared Spectrometer
        ctx.fillStyle = this.COLORS.light;
        ctx.fillRect(px + 5, py + 5, 6, 3);
        ctx.fillStyle = this.COLORS.lightest;
        ctx.fillRect(px + 6, py + 6, 4, 1);
      } else if (podType === 2) {
        // Quadrupole Mass Spectrometer
        ctx.fillStyle = this.COLORS.lightest;
        ctx.fillRect(px + 5, py + 5, 4, 4);
        ctx.fillStyle = this.COLORS.darkest;
        ctx.fillRect(px + 6, py + 6, 2, 2);
      } else if (podType === 3) {
        // Cryogenic Sample Vault
        ctx.fillStyle = this.COLORS.light;
        ctx.fillRect(px + 6, py + 4, 4, 6);
        ctx.fillStyle = this.COLORS.lightest;
        ctx.fillRect(px + 7, py + 7, 2, 2);
      } else {
        // High-Gain Polar Dish Sled
        ctx.fillStyle = this.COLORS.lightest;
        ctx.fillRect(px + 5, py + 4, 6, 4);
        ctx.fillStyle = this.COLORS.darkest;
        ctx.fillRect(px + 7, py + 5, 2, 2);
      }

      // Cleated Bogie Wheels
      ctx.fillStyle = this.COLORS.darkest;
      ctx.fillRect(px + 1, py + 4, 2, 3);
      ctx.fillRect(px + 1, py + 9, 2, 3);
      ctx.fillRect(px + 13, py + 4, 2, 3);
      ctx.fillRect(px + 13, py + 9, 2, 3);
    });
  }

  drawParticles(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.life > 0.5 ? this.COLORS.darkest : this.COLORS.dark;
      ctx.fillRect(p.x, p.y, 3, 3);
    }
  }

  drawScreenReticle(ctx) {
    const w = this.viewWidth;
    const h = this.viewHeight;

    // Viewport Border Frame
    ctx.strokeStyle = this.COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Corner crosshairs
    const corners = [
      { x: 10, y: 10, dx: 1, dy: 1 },
      { x: w - 10, y: 10, dx: -1, dy: 1 },
      { x: 10, y: h - 10, dx: 1, dy: -1 },
      { x: w - 10, y: h - 10, dx: -1, dy: -1 }
    ];

    ctx.strokeStyle = this.COLORS.dark;
    ctx.lineWidth = 1;
    corners.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x + c.dx * 8, c.y);
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x, c.y + c.dy * 8);
      ctx.stroke();
    });
  }

  // --- RADAR COMPASS & OFF-SCREEN WAYPOINT CHEVRON (GTA STYLE) ---
  drawRadarCompass(ctx) {
    if (!this.currentMissionTarget) return;

    const w = this.viewWidth;
    const h = this.viewHeight;
    const tgt = this.currentMissionTarget;
    const tgtWorldX = (tgt.x + 0.5) * this.CELL_SIZE;
    const tgtWorldY = (tgt.y + 0.5) * this.CELL_SIZE;

    // Target position in screen coordinates
    const screenX = tgtWorldX - this.camera.x;
    const screenY = tgtWorldY - this.camera.y;

    const dX = tgt.x - this.roverHead.x;
    const dY = tgt.y - this.roverHead.y;
    const distMeters = Math.round(Math.hypot(dX, dY) * 10);

    // Check if target is inside current screen bounds
    const inScreen = screenX >= 24 && screenX <= (w - 24) &&
                     screenY >= 56 && screenY <= (h - 24);

    if (!inScreen) {
      // Draw off-screen directional waypoint chevron pinned to the screen border
      const centerScreenX = w / 2;
      const centerScreenY = h / 2;
      const angle = Math.atan2(tgtWorldY - (this.roverHead.y * this.CELL_SIZE), tgtWorldX - (this.roverHead.x * this.CELL_SIZE));

      const margin = 32;
      const clampX = Math.max(margin, Math.min(w - margin, centerScreenX + Math.cos(angle) * (w / 2 - margin)));
      const clampY = Math.max(margin + 28, Math.min(h - margin, centerScreenY + Math.sin(angle) * (h / 2 - margin)));

      ctx.save();
      ctx.translate(clampX, clampY);
      ctx.rotate(angle);

      // Blinking arrow chevron
      const blink = Math.floor(performance.now() / 200) % 2 === 0;
      ctx.fillStyle = blink ? this.COLORS.darkest : this.COLORS.dark;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-6, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Distance tag pinned near chevron
      ctx.fillStyle = this.COLORS.darkest;
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      const textX = Math.max(48, Math.min(w - 48, clampX));
      const textY = clampY > h - 35 ? clampY - 12 : clampY + 14;
      ctx.fillText(`${distMeters}m`, textX, textY);
    }
  }

  // --- PLAYER 2 CO-OP ESCORT DRONE SYSTEM ---
  togglePlayer2() {
    this.audio.init();
    this.player2Active = !this.player2Active;

    if (this.player2Active) {
      this.audio.playP2Activate();
      this.player2Drone = {
        x: (this.roverHead.x - 2) * this.CELL_SIZE,
        y: (this.roverHead.y - 2) * this.CELL_SIZE,
        orbitAngle: 0,
        rotorAngle: 0
      };

      if (this.btnPlayer2) this.btnPlayer2.classList.add('p2-active');
      if (this.btnPlayer2Pill) this.btnPlayer2Pill.classList.add('p2-active');
      if (this.p2SubLabel) this.p2SubLabel.textContent = '2P: ACTIVE';
      if (this.subP2) this.subP2.textContent = '2P: INGENUITY';

      this.obsTicker.textContent = `[PLAYER 2 ONLINE] NASA INGENUITY ESCORT DRONE DEPLOYED`;
      this.obsTicker.classList.add('active');
      if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
      this.tickerTimeout = setTimeout(() => {
        this.obsTicker.classList.remove('active');
      }, 3800);
    } else {
      this.audio.playP2Dock();
      this.player2Drone = null;

      if (this.btnPlayer2) this.btnPlayer2.classList.remove('p2-active');
      if (this.btnPlayer2Pill) this.btnPlayer2Pill.classList.remove('p2-active');
      if (this.p2SubLabel) this.p2SubLabel.textContent = '2P: OFF';
      if (this.subP2) this.subP2.textContent = '2P: STANDBY';

      this.obsTicker.textContent = `[PLAYER 2 DOCKED] ESCORT DRONE RETURNED TO CHASSIS`;
      this.obsTicker.classList.add('active');
      if (this.tickerTimeout) clearTimeout(this.tickerTimeout);
      this.tickerTimeout = setTimeout(() => {
        this.obsTicker.classList.remove('active');
      }, 3000);
    }
  }

  drawPlayer2Drone(ctx, renderRoverX, renderRoverY, cSize, currentTime) {
    if (!this.player2Drone) return;

    // Smooth drone flight physics following rover
    this.player2Drone.orbitAngle += 0.035;
    const targetX = renderRoverX + Math.cos(this.player2Drone.orbitAngle) * (cSize * 2.5);
    const targetY = renderRoverY + Math.sin(this.player2Drone.orbitAngle) * (cSize * 1.8) - 16;

    this.player2Drone.x += (targetX - this.player2Drone.x) * 0.12;
    this.player2Drone.y += (targetY - this.player2Drone.y) * 0.12;
    this.player2Drone.rotorAngle += 0.9;

    const dx = this.player2Drone.x;
    const dy = this.player2Drone.y;

    ctx.save();

    // 1. Ground Shadow with hover elevation
    ctx.fillStyle = 'rgba(15, 56, 15, 0.4)';
    ctx.beginPath();
    ctx.ellipse(dx, dy + 20, 9, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Drone Carbon-Fiber Landing Skids & Struts
    ctx.strokeStyle = this.COLORS.darkest;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Left skid
    ctx.moveTo(dx - 9, dy + 8);
    ctx.lineTo(dx - 5, dy + 2);
    ctx.lineTo(dx - 3, dy - 2);
    // Right skid
    ctx.moveTo(dx + 9, dy + 8);
    ctx.lineTo(dx + 5, dy + 2);
    ctx.lineTo(dx + 3, dy - 2);
    ctx.stroke();

    // Horizontal skid bars
    ctx.beginPath();
    ctx.moveTo(dx - 11, dy + 8);
    ctx.lineTo(dx - 4, dy + 8);
    ctx.moveTo(dx + 4, dy + 8);
    ctx.lineTo(dx + 11, dy + 8);
    ctx.stroke();

    // 3. Avionics Core Cube (Golden multi-layer insulation)
    ctx.fillStyle = this.COLORS.dark;
    ctx.fillRect(dx - 6, dy - 6, 12, 10);
    ctx.fillStyle = this.COLORS.light;
    ctx.fillRect(dx - 4, dy - 4, 8, 7);
    ctx.fillStyle = this.COLORS.darkest;
    ctx.fillRect(dx - 1, dy - 1, 3, 3); // Downward horizon sensor lens

    // 4. Rotor Mast & Top Solar Panel
    ctx.strokeStyle = this.COLORS.darkest;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dx, dy - 6);
    ctx.lineTo(dx, dy - 16);
    ctx.stroke();

    // Top solar array
    ctx.fillStyle = this.COLORS.dark;
    ctx.fillRect(dx - 7, dy - 17, 14, 2);

    // 5. Dual Counter-Rotating Carbon Rotor Blades
    const bladeW = 18;
    const rCos1 = Math.cos(this.player2Drone.rotorAngle);
    const rSin1 = Math.sin(this.player2Drone.rotorAngle);

    // Lower rotor
    ctx.strokeStyle = this.COLORS.darkest;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(dx - bladeW * rCos1, (dy - 10) - bladeW * rSin1 * 0.28);
    ctx.lineTo(dx + bladeW * rCos1, (dy - 10) + bladeW * rSin1 * 0.28);
    ctx.stroke();

    // Upper rotor (counter-rotating)
    const rCos2 = Math.cos(-this.player2Drone.rotorAngle);
    const rSin2 = Math.sin(-this.player2Drone.rotorAngle);
    ctx.beginPath();
    ctx.moveTo(dx - bladeW * rCos2, (dy - 14) - bladeW * rSin2 * 0.28);
    ctx.lineTo(dx + bladeW * rCos2, (dy - 14) + bladeW * rSin2 * 0.28);
    ctx.stroke();

    // 6. Navigation LED (Blinking Cyan / Green)
    const ledBlink = Math.sin(currentTime * 0.012) > 0;
    ctx.fillStyle = ledBlink ? '#00e5ff' : this.COLORS.light;
    ctx.beginPath();
    ctx.arc(dx, dy - 18, 2, 0, Math.PI * 2);
    ctx.fill();

    // 7. Callsign Banner: "2P"
    ctx.fillStyle = this.COLORS.darkest;
    ctx.fillRect(dx - 8, dy - 27, 16, 7);
    ctx.fillStyle = '#00e5ff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('2P', dx, dy - 21);

    ctx.restore();
  }
}

// Instantiate game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new NASASpaceSnakeGame();
});
