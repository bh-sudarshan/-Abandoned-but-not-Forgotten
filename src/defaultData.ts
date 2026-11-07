import type { AbandonedObjectItem, VehicleItem } from './firebase';

export const DEFAULT_ABANDONED_OBJECTS: AbandonedObjectItem[] = [
  {
    id: 'moon_viper_cache',
    name: 'VIPER ICE CACHE (NOBILE)',
    targetBody: 'MOON',
    body: 'MOON (NOBILE CRATER PSR)',
    dates: 'NASA VIPER POLAR CAMPAIGN',
    discovery: 'TRIDENT 1-meter rotary drill confirmed subsurface water ice regolith crystals (12% by mass) in eternal polar shadow.',
    status: 'GROUND ZERO DRILL CACHE',
    points: 100,
    imageUrl: '/src/assets/images/apollo_lunar_lander_1790266420172.jpg'
  },
  {
    id: 'moon_apollo_11',
    name: 'APOLLO 11 EAGLE STAGE',
    targetBody: 'MOON',
    body: 'MOON (SEA OF TRANQUILITY)',
    dates: 'JUL 16 - JUL 24, 1969',
    discovery: '"The Eagle has landed." First human lunar landing; retrieved 21.5 kg ancient basalt rocks and deployed laser retroreflectors.',
    status: 'FIRST CREWED LUNAR BASE',
    points: 100,
    imageUrl: '/src/assets/images/apollo_lunar_lander_1790266420172.jpg'
  },
  {
    id: 'moon_lcross',
    name: 'LCROSS POLAR IMPACTOR',
    targetBody: 'MOON',
    body: 'MOON (CABEUS CRATER)',
    dates: 'OCT 9, 2009',
    discovery: 'Centaur 9,000 km/h kinetic impact excavated 155 kg pure water ice and hydroxyl volatiles in permanently shadowed cold trap.',
    status: 'POLAR IMPACT RECOVERY',
    points: 100
  },
  {
    id: 'moon_apollo_15_lrv',
    name: 'APOLLO 15 LUNAR ROVER',
    targetBody: 'MOON',
    body: 'MOON (HADLEY-APENNINE)',
    dates: 'JUL 26 - AUG 7, 1971',
    discovery: 'First crewed electric LRV traverse. Traveled 27.8 km across lunar rilles to recover the 4.1-billion-year Genesis Rock.',
    status: 'PARKED ON LUNAR SURFACE',
    points: 100,
    imageUrl: '/src/assets/images/apollo_lunar_rover_1790266455104.jpg'
  },
  {
    id: 'moon_surveyor_3',
    name: 'SURVEYOR 3 LANDER',
    targetBody: 'MOON',
    body: 'MOON (OCEAN OF STORMS)',
    dates: 'APR 17, 1967 - MAY 4, 1967',
    discovery: 'Demonstrated automated soft lunar landing. Inspected 2.5 years later by Apollo 12 astronauts who retrieved its camera.',
    status: 'ASTRONAUT RENDEZVOUS SITE',
    points: 100
  },
  {
    id: 'moon_lunar_prospector',
    name: 'LUNAR PROSPECTOR',
    targetBody: 'MOON',
    body: 'MOON (POLAR CRATERS)',
    dates: 'JAN 7, 1998 - JUL 31, 1999',
    discovery: 'Neutron spectrometer identified massive hydrogen deposits at both lunar poles, confirming deep shadowed ice reservoirs.',
    status: 'POLAR ICE MAPPING ARCHIVE',
    points: 100
  },
  {
    id: 'moon_apollo_17',
    name: 'APOLLO 17 CHALLENGER',
    targetBody: 'MOON',
    body: 'MOON (TAURUS-LITTROW)',
    dates: 'DEC 11 - DEC 14, 1972',
    discovery: 'Geologist Harrison Schmitt uncovered orange volcanic pyroclastic glass beads formed in deep lunar fire fountain eruptions.',
    status: 'LAST CREWED EXPEDITION',
    points: 100
  },
  {
    id: 'mars_opportunity',
    name: 'OPPORTUNITY (MER-B)',
    targetBody: 'MARS',
    body: 'MARS (MERIDIANI PLANUM)',
    dates: 'JUL 7, 2003 - FEB 13, 2019',
    discovery: 'Found hematite spherules ("blueberries") proving sustained liquid water. Traveled 45.16 km over 5,352 sols.',
    status: 'DORMANT / MISSION COMPLETE',
    points: 100,
    imageUrl: '/src/assets/images/mars_opportunity_rover_1790266438304.jpg'
  },
  {
    id: 'mars_sojourner',
    name: 'SOJOURNER (PATHFINDER)',
    targetBody: 'MARS',
    body: 'MARS (ARES VALLIS)',
    dates: 'DEC 4, 1996 - SEP 27, 1997',
    discovery: 'First wheeled rover on Mars (10.5 kg). Analyzed volcanic basalt rocks "Barnacle Bill" and "Yogi" using APXS.',
    status: 'HISTORIC RETIRED PIONEER',
    points: 100
  },
  {
    id: 'mars_spirit',
    name: 'SPIRIT (MER-A)',
    targetBody: 'MARS',
    body: 'MARS (GUSEV CRATER)',
    dates: 'JUN 10, 2003 - MAY 25, 2011',
    discovery: 'Stuck wheel churned bright soil revealing 90% pure silica: proof of ancient hydrothermal volcanic hot springs.',
    status: 'PERMANENT RESEARCH STATION',
    points: 100
  },
  {
    id: 'mars_viking_1',
    name: 'VIKING 1 LANDER',
    targetBody: 'MARS',
    body: 'MARS (CHRYSE PLANITIA)',
    dates: 'AUG 20, 1975 - NOV 11, 1982',
    discovery: 'First successful Mars landing. Sent back first surface panoramas and tested soil for organic metabolism.',
    status: 'HISTORIC NATIONAL LANDMARK',
    points: 100,
    imageUrl: '/src/assets/images/viking_mars_lander_1790266472522.jpg'
  },
  {
    id: 'mars_phoenix',
    name: 'PHOENIX MARS LANDER',
    targetBody: 'MARS',
    body: 'MARS (VASTITAS BOREALIS)',
    dates: 'AUG 4, 2007 - NOV 10, 2008',
    discovery: 'Robotic trenching confirmed water ice permafrost inches below arctic soil; detected perchlorate salts.',
    status: 'PERMAFROST PRESERVED',
    points: 100
  },
  {
    id: 'mars_curiosity',
    name: 'CURIOSITY ROVER (MSL)',
    targetBody: 'MARS',
    body: 'MARS (GALE CRATER)',
    dates: 'NOV 26, 2011 - ACTIVE',
    discovery: 'Uncovered ancient mudstones containing carbon compounds, sulfur, and nitrogen from a 3.5-billion-year-old freshwater lake.',
    status: 'ROVER TRAVERSING MOUNT SHARP',
    points: 100
  },
  {
    id: 'mars_viking_2',
    name: 'VIKING 2 LANDER',
    targetBody: 'MARS',
    body: 'MARS (UTOPIA PLANITIA)',
    dates: 'SEP 9, 1975 - APR 11, 1980',
    discovery: 'Captured clear images of winter water-frost clinging to jagged Martian rocks and recorded tectonic seismology.',
    status: 'DECOMMISSIONED STATION',
    points: 100
  }
];

export const DEFAULT_VEHICLES: VehicleItem[] = [
  {
    id: 'VIPER',
    name: 'VIPER',
    fullName: 'NASA VIPER (POLAR ROVER)',
    destination: 'MOON',
    type: 'POLAR WATER ICE PROSPECTOR',
    site: 'MOON [NOBILE CRATER]',
    massSpeed: '430 KG | 0.72 KM/H',
    power: 'SOLAR + 50AH BATTERIES',
    payload: 'TRIDENT 1M DRILL, NSS, HEADLIGHTS',
    record: 'FIRST ROVER WITH CRATER HEADLIGHTS',
    status: 'ACTIVE / 2025',
    telemetryKey: 'ICE',
    accent: 'HEADLIGHTS',
    isAvailable: true
  },
  {
    id: 'CURIOSITY',
    name: 'CURIOSITY',
    fullName: 'CURIOSITY (MARS SCIENCE LAB)',
    destination: 'MARS',
    type: 'HEAVY NUCLEAR ASTROBIOLOGY LAB',
    site: 'MARS [GALE CRATER]',
    massSpeed: '899 KG | 0.14 KM/H',
    power: 'MMRTG (PLUTONIUM-238 / 110W)',
    payload: 'CHEMCAM LASER, SAM LAB, MASTCAM',
    record: '4,000+ SOLS; PROVED ANCIENT LAKES',
    status: 'ACTIVE / 2012-PRES',
    telemetryKey: 'RAD',
    accent: 'LASER',
    isAvailable: true
  },
  {
    id: 'PERSEVERANCE',
    name: 'PERSEVERANCE',
    fullName: 'PERSEVERANCE & INGENUITY',
    destination: 'MARS',
    type: 'SAMPLE CACHER & DRONE CARRIER',
    site: 'MARS [JEZERO DELTA]',
    massSpeed: '1,025 KG | 0.16 KM/H',
    power: 'MMRTG NUCLEAR GENERATOR',
    payload: 'SUPERCAM, PIXL, SHERLOC, MOXIE',
    record: '24+ CACHED CORES; INGENUITY SCOUT',
    status: 'ACTIVE / 2021-PRES',
    telemetryKey: 'TUBE',
    accent: 'INGENUITY',
    isAvailable: true
  },
  {
    id: 'OPPORTUNITY',
    name: 'OPPORTUNITY',
    fullName: 'OPPORTUNITY (MER-B ROVER)',
    destination: 'MARS',
    type: 'LONG-DURATION SOLAR ROVER',
    site: 'MARS [MERIDIANI]',
    massSpeed: '185 KG | 0.18 KM/H',
    power: 'DUAL GULL-WING SOLAR PANELS',
    payload: 'PANCAM, MÖSSBAUER, ROCK RAT',
    record: '45.16 KM MARATHON RECORD (5,352 SOLS)',
    status: 'MISSION COMPLETE',
    telemetryKey: 'SOL',
    accent: 'WINGS',
    isAvailable: true
  },
  {
    id: 'SOJOURNER',
    name: 'SOJOURNER',
    fullName: 'SOJOURNER (MARS PATHFINDER)',
    destination: 'MARS',
    type: 'FIRST WHEELED MARS MICROROVER',
    site: 'MARS [ARES VALLIS]',
    massSpeed: '11.5 KG | 0.04 KM/H',
    power: '16W SOLAR ROOF + D-CELL BATTERY',
    payload: 'APXS SPECTROMETER, LASER EYES',
    record: 'HISTORIC 1ST WHEELS ON ANOTHER PLANET',
    status: 'HISTORIC PIONEER (1997)',
    telemetryKey: 'APXS',
    accent: 'MICRO',
    isAvailable: true
  },
  {
    id: 'LRV',
    name: 'APOLLO LRV',
    fullName: 'APOLLO LUNAR ROVING VEHICLE',
    destination: 'MOON',
    type: 'CREWED ELECTRIC LUNAR ROVER',
    site: 'MOON [HADLEY RILLE]',
    massSpeed: '210 KG | 18.0 KM/H (RECORD)',
    power: 'DUAL 36V SILVER-ZINC BATTERIES',
    payload: 'PARABOLIC DISH, TV CAM, RACKS',
    record: 'FASTEST EXTRATERRESTRIAL VEHICLE',
    status: 'DEPLOYED ON MOON (1971)',
    telemetryKey: 'SPD',
    accent: 'DISH',
    isAvailable: true
  }
];
