/**
 * ===================================================================
 * SUNSET DRIFT MASTERS - 3D CAR RACING ENGINE
 * Complete 3D Arcade Racing with Three.js
 * Features: Drift Master Car, Golden Sunset Atmosphere, 5 NPC Racers,
 * Floating Power-up Item Boxes (Rocket, Nitro, Oil, Shield),
 * Real-time Minimap Radar, Speedometer, Drifting & Web Audio API
 * ===================================================================
 */

// -------------------------------------------------------------
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// -------------------------------------------------------------
class RacingAudio {
  constructor() {
    this.ctx = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.startEngineSound();
  }

  startEngineSound() {
    if (!this.ctx || this.engineOsc) return;
    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();

    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime);
    this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    // Low-pass filter for deeper engine rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    this.engineOsc.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc.start();
  }

  updateEngine(speedRatio) {
    if (!this.engineOsc || !this.enabled) return;
    // Modulate pitch from 60Hz (idle) to 320Hz (top speed)
    const freq = 60 + speedRatio * 260;
    this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
  }

  playScreech() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  playNitro() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  playItemPickup() {
    if (!this.ctx || !this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.06 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.16);
    });
  }

  playRocketLaunch() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  playExplosion() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.41);
  }

  playCountdown(isFinal = false) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = isFinal ? 880 : 440;
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (isFinal ? 0.6 : 0.25));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + (isFinal ? 0.61 : 0.26));
  }
}

// -------------------------------------------------------------
// 2. POWER-UP ITEM TYPES
// -------------------------------------------------------------
const POWER_ITEMS = {
  ROCKET: { id: 'rocket', name: 'ROKET PENGEJAR', icon: 'fa-solid fa-rocket', color: '#ef4444' },
  NITRO: { id: 'nitro', name: 'MEGA NITRO BOOST', icon: 'fa-solid fa-bolt', color: '#f59e0b' },
  OIL: { id: 'oil', name: 'TUMPAHAN OLI', icon: 'fa-solid fa-oil-well', color: '#8b5cf6' },
  SHIELD: { id: 'shield', name: 'PERISAI ENERGI', icon: 'fa-solid fa-shield-halved', color: '#06b6d4' }
};

// -------------------------------------------------------------
// 3. MAIN RACING GAME CLASS
// -------------------------------------------------------------
class RacingGame {
  constructor() {
    this.audio = new RacingAudio();

    // Three.js Core
    this.canvas = document.getElementById('racingCanvas');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 2000);

    // Game States
    this.state = 'START'; // 'START' | 'COUNTDOWN' | 'RACING' | 'FINISHED'
    this.totalLaps = 3;
    this.raceTimer = 0;
    this.lapTimer = 0;
    this.bestLapTime = Infinity;

    // Track Spline & Circuit
    this.trackSpline = null;
    this.trackLength = 0;
    this.trackWaypoints = [];
    this.trackWidth = 24;

    // Cars (Player + 5 NPC Racers)
    this.player = null;
    this.racers = [];

    // Entities (Items, Rockets, Oil Puddles, Particles)
    this.itemBoxes = [];
    this.activeRockets = [];
    this.activeOils = [];
    this.skidParticles = [];

    // Inputs
    this.keys = {};

    // Camera Mode (0: Chase Close, 1: Chase Far, 2: Bonnet / Hood)
    this.cameraMode = 0;

    // Initialize Subsystems
    this.initSunsetEnvironment();
    this.buildGrandPrixTrack();
    this.initCars();
    this.initPowerUpBoxes();
    this.initEventListeners();

    // Start Animation Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  // -----------------------------------------------------------
  // GOLDEN SUNSET ENVIRONMENT & LIGHTING
  // -----------------------------------------------------------
  initSunsetEnvironment() {
    // Golden Sunset Sky Gradient
    this.scene.background = new THREE.Color(0x160d24); // Deep violet sky
    this.scene.fog = new THREE.FogExp2(0x883070, 0.0018); // Sunset purple fog

    // Ambient Lighting (Warm Sunset Tint)
    const ambientLight = new THREE.AmbientLight(0xffa255, 0.65);
    this.scene.add(ambientLight);

    // Sunset Sun Light (Low Angle, Long Golden Shadows)
    this.sunLight = new THREE.DirectionalLight(0xff7e29, 1.4);
    this.sunLight.position.set(400, 120, -500);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 1500;
    const d = 300;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // Glowing Golden Sunset Sun Sphere
    const sunGeo = new THREE.SphereGeometry(75, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(800, 180, -1200);
    this.scene.add(sunMesh);

    // Distant Mountain Ridges
    const mtnGeo = new THREE.ConeGeometry(180, 220, 5);
    const mtnMat = new THREE.MeshLambertMaterial({ color: 0x221330 });
    for (let i = 0; i < 18; i++) {
      const mtn = new THREE.Mesh(mtnGeo, mtnMat);
      const angle = (i / 18) * Math.PI * 2;
      mtn.position.set(Math.cos(angle) * 1100, 60, Math.sin(angle) * 1100);
      mtn.scale.set(1 + Math.random() * 0.8, 1 + Math.random() * 0.6, 1 + Math.random() * 0.8);
      this.scene.add(mtn);
    }

    // Ground Terrain (Dark Purple-Brown Earth)
    const groundGeo = new THREE.PlaneGeometry(3000, 3000);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x1f1424 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  // -----------------------------------------------------------
  // GRAND PRIX CIRCUIT SPLINE & ROAD GEOMETRY
  // -----------------------------------------------------------
  buildGrandPrixTrack() {
    // 16 Control Points forming an expansive Grand Prix circuit
    const points = [
      new THREE.Vector3(0, 0, 0),        // Start / Finish Straight
      new THREE.Vector3(0, 0, 180),
      new THREE.Vector3(60, 0, 320),      // Turn 1
      new THREE.Vector3(180, 0, 420),     // Sweeping curve
      new THREE.Vector3(340, 0, 400),
      new THREE.Vector3(450, 0, 280),     // Turn 2
      new THREE.Vector3(420, 0, 120),     // Chicane entry
      new THREE.Vector3(300, 0, 40),
      new THREE.Vector3(360, 0, -120),    // S-Curve
      new THREE.Vector3(440, 0, -280),
      new THREE.Vector3(360, 0, -420),    // Hairpin Entry
      new THREE.Vector3(180, 0, -480),    // Hairpin Apex (Drift Zone!)
      new THREE.Vector3(20, 0, -420),     // Hairpin Exit
      new THREE.Vector3(-120, 0, -320),   // Back Straight
      new THREE.Vector3(-140, 0, -160),
      new THREE.Vector3(-80, 0, -60)      // Final Corner
    ];

    this.trackSpline = new THREE.CatmullRomCurve3(points, true, 'centripetal');
    this.trackLength = this.trackSpline.getLength();

    // Sample 250 points for Waypoint navigation & collision
    this.trackWaypoints = this.trackSpline.getSpacedPoints(250);

    // Generate 3D Road Mesh
    const segments = 350;
    const roadGeo = new THREE.BufferGeometry();
    const positions = [];
    const uvs = [];
    const indices = [];

    const halfW = this.trackWidth / 2;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pt = this.trackSpline.getPointAt(t);
      const tangent = this.trackSpline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Left and right edges of road
      const left = pt.clone().add(normal.clone().multiplyScalar(halfW));
      const right = pt.clone().add(normal.clone().multiplyScalar(-halfW));

      positions.push(left.x, left.y + 0.05, left.z);
      positions.push(right.x, right.y + 0.05, right.z);

      uvs.push(0, i * 4);
      uvs.push(1, i * 4);

      if (i < segments) {
        const row1 = i * 2;
        const row2 = (i + 1) * 2;
        indices.push(row1, row1 + 1, row2);
        indices.push(row1 + 1, row2 + 1, row2);
      }
    }

    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    // Procedural Asphalt Texture
    const roadTex = this.createAsphaltTexture();
    roadTex.wrapS = THREE.RepeatWrapping;
    roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(1, 60);

    const roadMat = new THREE.MeshLambertMaterial({ map: roadTex });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.receiveShadow = true;
    this.scene.add(roadMesh);

    // Red & White Corner Curbs along track edges
    this.buildTrackCurbs();

    // Start / Finish Line Banner Arch
    this.buildFinishArch();

    // Track Scenery: Streetlights with warm lanterns & Palm trees
    this.buildTrackScenery();
  }

  createAsphaltTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Dark grey asphalt
    ctx.fillStyle = '#222226';
    ctx.fillRect(0, 0, 128, 128);

    // Noise pebbles
    ctx.fillStyle = '#2d2d33';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
    }

    // Center Dashed White Lines
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(62, 10, 4, 35);
    ctx.fillRect(62, 75, 4, 35);

    // Edge Solid White Lines
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(4, 0, 3, 128);
    ctx.fillRect(121, 0, 3, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }

  buildTrackCurbs() {
    // Red & White alternating curbs on edges
    const curbSegments = 160;
    const curbGeo = new THREE.BoxGeometry(1.8, 0.4, 4);

    for (let i = 0; i < curbSegments; i += 2) {
      const t = i / curbSegments;
      const pt = this.trackSpline.getPointAt(t);
      const tangent = this.trackSpline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const isRed = (Math.floor(i / 2) % 2 === 0);
      const curbMat = new THREE.MeshLambertMaterial({ color: isRed ? 0xef4444 : 0xffffff });

      // Outer Left Curb
      const leftCurb = new THREE.Mesh(curbGeo, curbMat);
      leftCurb.position.copy(pt).add(normal.clone().multiplyScalar(this.trackWidth / 2 + 1));
      leftCurb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.scene.add(leftCurb);

      // Outer Right Curb
      const rightCurb = new THREE.Mesh(curbGeo, curbMat);
      rightCurb.position.copy(pt).add(normal.clone().multiplyScalar(-this.trackWidth / 2 - 1));
      rightCurb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.scene.add(rightCurb);
    }
  }

  buildFinishArch() {
    const startPt = this.trackSpline.getPointAt(0);
    const tangent = this.trackSpline.getTangentAt(0).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    const archGroup = new THREE.Group();
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const beamMat = new THREE.MeshLambertMaterial({ color: 0xff7e29 });

    // Left & Right Pillars
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(2, 14, 2), pillarMat);
    p1.position.copy(normal.clone().multiplyScalar(this.trackWidth / 2 + 2));
    p1.position.y = 7;
    archGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(2, 14, 2), pillarMat);
    p2.position.copy(normal.clone().multiplyScalar(-this.trackWidth / 2 - 2));
    p2.position.y = 7;
    archGroup.add(p2);

    // Cross Beam Banner
    const beam = new THREE.Mesh(new THREE.BoxGeometry(this.trackWidth + 6, 2.5, 3), beamMat);
    beam.position.y = 13;
    archGroup.add(beam);

    archGroup.position.copy(startPt);
    archGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    this.scene.add(archGroup);
  }

  buildTrackScenery() {
    // Streetlamps with warm golden glow & trees
    const numLamps = 28;
    const lampMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const lightGlowMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });

    for (let i = 0; i < numLamps; i++) {
      const t = i / numLamps;
      const pt = this.trackSpline.getPointAt(t);
      const tangent = this.trackSpline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Street Lamp on side
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 12, 6), lampMat);
      lamp.position.copy(pt).add(normal.clone().multiplyScalar(this.trackWidth / 2 + 5));
      lamp.position.y = 6;
      this.scene.add(lamp);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), lightGlowMat);
      bulb.position.copy(lamp.position);
      bulb.position.y = 12;
      this.scene.add(bulb);

      // Palm tree
      if (i % 2 === 0) {
        const treeGroup = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.2, 14, 5), new THREE.MeshLambertMaterial({ color: 0x452210 }));
        trunk.position.y = 7;
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(new THREE.ConeGeometry(6, 9, 6), new THREE.MeshLambertMaterial({ color: 0x15803d }));
        foliage.position.y = 15;
        treeGroup.add(foliage);

        treeGroup.position.copy(pt).add(normal.clone().multiplyScalar(-this.trackWidth / 2 - 8));
        this.scene.add(treeGroup);
      }
    }
  }

  // -----------------------------------------------------------
  // CAR CREATION & 3D SPORTS CAR MODELING
  // -----------------------------------------------------------
  createCarMesh(bodyColor, isPlayer = false) {
    const carGroup = new THREE.Group();

    // 1. Aerodynamic Lower Body Chassis
    const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.75, 4.8);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    carGroup.add(body);

    // 2. Cabin & Windshield (Tinted glass)
    const cabinMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const cabinGeo = new THREE.BoxGeometry(2.0, 0.65, 2.5);
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.3, -0.2);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // 3. Rear Racing Spoiler
    const spoilerMat = new THREE.MeshLambertMaterial({ color: isPlayer ? 0x06b6d4 : 0x111111 });
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.1, 0.6), spoilerMat);
    wing.position.set(0, 1.45, -2.1);
    carGroup.add(wing);

    const post1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), spoilerMat);
    post1.position.set(-0.8, 1.2, -2.1);
    carGroup.add(post1);
    const post2 = post1.clone();
    post2.position.x = 0.8;
    carGroup.add(post2);

    // 4. Glowing Headlights & Taillights
    const headLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.1), headLightMat);
    h1.position.set(-0.85, 0.7, 2.41);
    carGroup.add(h1);
    const h2 = h1.clone();
    h2.position.x = 0.85;
    carGroup.add(h2);

    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.1), tailLightMat);
    t1.position.set(-0.8, 0.75, -2.41);
    carGroup.add(t1);
    const t2 = t1.clone();
    t2.position.x = 0.8;
    carGroup.add(t2);

    // 5. 4 Wheels (Rubber tires with metal rims)
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1c1917 });
    const rimMat = new THREE.MeshBasicMaterial({ color: isPlayer ? 0x06b6d4 : 0xcccccc });
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 12);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheels = [];
    const wheelPositions = [
      [-1.25, 0.48, 1.4],   // Front Left
      [1.25, 0.48, 1.4],    // Front Right
      [-1.25, 0.48, -1.4],  // Rear Left
      [1.25, 0.48, -1.4]    // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      wheelGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.37, 8), rimMat);
      rim.rotateZ(Math.PI / 2);
      wheelGroup.add(rim);

      wheelGroup.position.set(pos[0], pos[1], pos[2]);
      carGroup.add(wheelGroup);
      wheels.push(wheelGroup);
    });

    carGroup.userData.wheels = wheels;
    this.scene.add(carGroup);
    return carGroup;
  }

  initCars() {
    this.racers = [];

    // Starting grid offsets (2x3 grid behind start line)
    const gridPositions = [
      { lateral: -4, progressOffset: 0.002 },  // Player (P1)
      { lateral: 4, progressOffset: 0.001 },   // NPC 1 (P2)
      { lateral: -4, progressOffset: -0.006 }, // NPC 2 (P3)
      { lateral: 4, progressOffset: -0.007 },  // NPC 3 (P4)
      { lateral: -4, progressOffset: -0.014 }, // NPC 4 (P5)
      { lateral: 4, progressOffset: -0.015 }   // NPC 5 (P6)
    ];

    // 1. Player: "Drift Master RX-8" (Cyan & Purple)
    const playerMesh = this.createCarMesh(0x6366f1, true);
    this.player = {
      isPlayer: true,
      name: 'Anda (Drift Master)',
      mesh: playerMesh,
      pos: new THREE.Vector3(),
      speed: 0,
      maxSpeed: 62, // ~223 km/h
      nitroMaxSpeed: 78, // ~280 km/h
      accel: 22,
      handling: 2.8,
      driftAngle: 0,
      isDrifting: false,
      driftBoostTimer: 0,
      nitro: 100,
      isNitroActive: false,
      nitroTimer: 0,
      lateralOffset: -4,
      splineProgress: 0.002,
      lap: 1,
      checkpoint: 0,
      heldItem: null,
      hasShield: false,
      spinTimer: 0,
      rank: 1,
      totalDistance: 0
    };
    this.racers.push(this.player);

    // 2. 5 NPC Racers with Distinct Personalities
    const npcConfigs = [
      { name: 'Alex "Viper"', color: 0xdc2626, maxSpeed: 60, handling: 2.6, skill: 'aggressive' },
      { name: 'Kenji "Ronin"', color: 0xf59e0b, maxSpeed: 61, handling: 2.9, skill: 'drifter' },
      { name: 'Elena "Ghost"', color: 0x10b981, maxSpeed: 59, handling: 2.7, skill: 'balanced' },
      { name: 'Marcus "Titan"', color: 0xea580c, maxSpeed: 58, handling: 2.5, skill: 'heavy' },
      { name: 'Dante "Shadow"', color: 0x1e293b, maxSpeed: 61.5, handling: 2.8, skill: 'speedster' }
    ];

    npcConfigs.forEach((cfg, idx) => {
      const npcMesh = this.createCarMesh(cfg.color, false);
      const grid = gridPositions[idx + 1];

      const npc = {
        isPlayer: false,
        name: cfg.name,
        mesh: npcMesh,
        pos: new THREE.Vector3(),
        speed: 0,
        maxSpeed: cfg.maxSpeed,
        handling: cfg.handling,
        accel: 20,
        lateralOffset: grid.lateral,
        targetLateral: grid.lateral,
        splineProgress: (grid.progressOffset + 1) % 1,
        lap: 1,
        checkpoint: 0,
        heldItem: null,
        hasShield: false,
        spinTimer: 0,
        rank: idx + 2,
        totalDistance: 0
      };
      this.racers.push(npc);
    });

    // Position all cars on starting grid
    this.racers.forEach((r) => this.updateCarTransform(r));
  }

  updateCarTransform(r) {
    const t = ((r.splineProgress % 1) + 1) % 1;
    const pt = this.trackSpline.getPointAt(t);
    const tangent = this.trackSpline.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    // Position on track with lateral offset
    r.pos.copy(pt).add(normal.clone().multiplyScalar(r.lateralOffset));
    r.mesh.position.copy(r.pos);

    // Car heading
    let forward = tangent.clone();
    if (r.driftAngle && r.driftAngle !== 0) {
      forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), r.driftAngle);
    }
    r.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), forward);

    // Spin animation if spun out by oil/rocket
    if (r.spinTimer > 0) {
      r.mesh.rotation.y += r.spinTimer * 10;
    }

    // Wheel spin
    if (r.mesh.userData.wheels) {
      const spinSpeed = r.speed * 0.3;
      r.mesh.userData.wheels.forEach((w) => {
        w.children[0].rotation.x += spinSpeed;
      });
    }
  }

  // -----------------------------------------------------------
  // POWER-UP BOXES DI JALANAN (MYSTERY ITEM BOXES)
  // -----------------------------------------------------------
  initPowerUpBoxes() {
    this.itemBoxes = [];
    const boxLocations = [0.08, 0.22, 0.38, 0.55, 0.72, 0.88];
    const boxGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);

    boxLocations.forEach((t) => {
      const pt = this.trackSpline.getPointAt(t);
      const tangent = this.trackSpline.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // 3 item boxes abreast across the track
      [-6, 0, 6].forEach((offset) => {
        const boxMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);

        const innerCube = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 1.4, 1.4),
          new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        boxMesh.add(innerCube);

        const pos = pt.clone().add(normal.clone().multiplyScalar(offset));
        pos.y = 1.6;
        boxMesh.position.copy(pos);
        this.scene.add(boxMesh);

        this.itemBoxes.push({
          mesh: boxMesh,
          pos,
          active: true,
          respawnTimer: 0
        });
      });
    });
  }

  // -----------------------------------------------------------
  // EVENT LISTENERS & USER CONTROLS
  // -----------------------------------------------------------
  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Start game on Enter/Space if on start screen
      if (this.state === 'START' && (e.code === 'Enter' || e.code === 'Space')) {
        this.startCountdown();
      }

      // Use Item Power-up with F or E or Space
      if (this.state === 'RACING' && (e.code === 'KeyF' || e.code === 'KeyE')) {
        this.usePlayerItem();
      }

      // Change Camera with C
      if (e.code === 'KeyC') {
        this.cameraMode = (this.cameraMode + 1) % 3;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Start Button
    document.getElementById('startRaceBtn').addEventListener('click', () => {
      this.startCountdown();
    });

    // Play Again Button
    document.getElementById('playAgainBtn').addEventListener('click', () => {
      document.getElementById('finishOverlay').style.display = 'none';
      this.resetRace();
      this.startCountdown();
    });

    // Audio toggle
    const audioBtn = document.getElementById('audioToggleBtn');
    audioBtn.addEventListener('click', () => {
      this.audio.enabled = !this.audio.enabled;
      audioBtn.innerHTML = this.audio.enabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark text-muted"></i>';
      if (!this.audio.enabled && this.audio.engineGain) {
        this.audio.engineGain.gain.setValueAtTime(0, this.audio.ctx.currentTime);
      }
    });

    // Touch Buttons
    const bindTouch = (id, onStart, onEnd) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onStart();
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (onEnd) onEnd();
      });
    };

    bindTouch('btnSteerLeft', () => (this.keys['KeyA'] = true), () => (this.keys['KeyA'] = false));
    bindTouch('btnSteerRight', () => (this.keys['KeyD'] = true), () => (this.keys['KeyD'] = false));
    bindTouch('btnGas', () => (this.keys['KeyW'] = true), () => (this.keys['KeyW'] = false));
    bindTouch('btnBrake', () => (this.keys['KeyS'] = true), () => (this.keys['KeyS'] = false));
    bindTouch('btnTouchItem', () => this.usePlayerItem());

    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // -----------------------------------------------------------
  // COUNTDOWN & RACE START SEQUENCE
  // -----------------------------------------------------------
  startCountdown() {
    this.audio.init();
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('raceHud').style.display = 'flex';

    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownText = document.getElementById('countdownText');
    countdownOverlay.style.display = 'flex';
    this.state = 'COUNTDOWN';

    let count = 3;
    countdownText.textContent = count;
    this.audio.playCountdown(false);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownText.textContent = count;
        this.audio.playCountdown(false);
      } else if (count === 0) {
        countdownText.textContent = 'GO!';
        countdownText.style.color = '#10b981';
        this.audio.playCountdown(true);
        this.state = 'RACING';
        this.showNotification('GASPOL! BALAPAN DIMULAI!');
      } else {
        countdownOverlay.style.display = 'none';
        clearInterval(interval);
      }
    }, 950);
  }

  showNotification(msg) {
    const banner = document.getElementById('eventBanner');
    banner.textContent = msg;
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 2500);
  }

  // -----------------------------------------------------------
  // MAIN GAME LOOP (TICK & RENDER)
  // -----------------------------------------------------------
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (this.state === 'RACING') {
      this.raceTimer += dt;
      this.lapTimer += dt;
      this.updatePlayer(dt);
      this.updateNPCs(dt);
      this.updateRanking();
      this.updateItemBoxes(dt);
      this.updateProjectiles(dt);
    } else if (this.state === 'START') {
      // Rotate car slowly on showcase pedestal
      if (this.player && this.player.mesh) {
        this.player.mesh.rotation.y += dt * 0.8;
      }
    }

    this.updateCamera();
    this.updateHUD();
    this.drawMinimapRadar();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((t) => this.loop(t));
  }

  // -----------------------------------------------------------
  // PLAYER CAR PHYSICS & DRIFTING
  // -----------------------------------------------------------
  updatePlayer(dt) {
    const p = this.player;

    // 1. Spun-out Recovery from Oil/Rocket
    if (p.spinTimer > 0) {
      p.spinTimer -= dt;
      p.speed = Math.max(0, p.speed - 30 * dt);
      this.updateCarTransform(p);
      return;
    }

    // 2. Gas, Brake & Reverse
    const isGas = this.keys['KeyW'] || this.keys['ArrowUp'];
    const isBrake = this.keys['KeyS'] || this.keys['ArrowDown'];
    const isSteerLeft = this.keys['KeyA'] || this.keys['ArrowLeft'];
    const isSteerRight = this.keys['KeyD'] || this.keys['ArrowRight'];
    const isHandbrake = this.keys['ShiftLeft'] || this.keys['Space'];

    // Top Speed limit (Nitro vs Normal)
    const targetTopSpeed = p.isNitroActive ? p.nitroMaxSpeed : p.maxSpeed;

    if (isGas) {
      p.speed = Math.min(targetTopSpeed, p.speed + p.accel * dt);
    } else if (isBrake) {
      if (p.speed > 0) p.speed = Math.max(0, p.speed - 38 * dt);
      else p.speed = Math.max(-15, p.speed - 15 * dt); // Reverse
    } else {
      // Natural rolling drag
      if (p.speed > 0) p.speed = Math.max(0, p.speed - 12 * dt);
      else if (p.speed < 0) p.speed = Math.min(0, p.speed + 12 * dt);
    }

    // 3. Steering & Drifting
    let steerDir = 0;
    if (isSteerLeft) steerDir = 1;
    if (isSteerRight) steerDir = -1;

    // Drift Mode: triggered when steering and holding Handbrake
    if (isHandbrake && Math.abs(p.speed) > 25 && steerDir !== 0) {
      p.isDrifting = true;
      p.driftAngle = steerDir * 0.38; // Yaw car body into drift
      p.driftBoostTimer += dt;
      p.lateralOffset += steerDir * 22 * dt;
      this.audio.playScreech();

      // Recharge nitro on drift!
      p.nitro = Math.min(100, p.nitro + dt * 15);
    } else {
      // Exiting Drift -> Mini Boost!
      if (p.isDrifting && p.driftBoostTimer > 0.8) {
        p.speed = Math.min(p.maxSpeed + 8, p.speed + 8);
        this.showNotification('DRIFT BOOST!');
        this.audio.playNitro();
      }
      p.isDrifting = false;
      p.driftBoostTimer = 0;
      p.driftAngle = 0;

      // Normal steering lateral shift
      if (Math.abs(p.speed) > 2) {
        p.lateralOffset += steerDir * p.handling * (p.speed / p.maxSpeed) * 14 * dt;
      }
    }

    // Clamp lateral offset within track borders
    const maxOffset = this.trackWidth / 2 - 2;
    if (Math.abs(p.lateralOffset) > maxOffset) {
      p.lateralOffset = Math.sign(p.lateralOffset) * maxOffset;
      p.speed *= 0.96; // Slight scrub against guardrail
    }

    // 4. Nitro Boost Timer
    if (p.isNitroActive) {
      p.nitroTimer -= dt;
      document.getElementById('speedLinesOverlay').classList.add('active');
      if (p.nitroTimer <= 0) {
        p.isNitroActive = false;
        document.getElementById('speedLinesOverlay').classList.remove('active');
      }
    }

    // 5. Advance along track spline
    const progressSpeed = (p.speed / this.trackLength) * dt;
    p.splineProgress += progressSpeed;
    p.totalDistance += p.speed * dt;

    // Lap & Checkpoint Tracking
    if (p.splineProgress >= 1.0) {
      p.splineProgress -= 1.0;
      this.onLapCompleted(p);
    }

    // Engine Audio Pitch
    this.audio.updateEngine(Math.abs(p.speed) / p.maxSpeed);

    // Update 3D car position & orientation
    this.updateCarTransform(p);
  }

  // -----------------------------------------------------------
  // NPC RACERS ARTIFICIAL INTELLIGENCE (AI)
  // -----------------------------------------------------------
  updateNPCs(dt) {
    this.racers.forEach((r) => {
      if (r.isPlayer) return;

      // Spun-out recovery
      if (r.spinTimer > 0) {
        r.spinTimer -= dt;
        r.speed = Math.max(0, r.speed - 30 * dt);
        this.updateCarTransform(r);
        return;
      }

      // Target speed & rubberbanding
      let targetSpeed = r.maxSpeed;

      // Slow down slightly on sharp corners
      const t = r.splineProgress % 1;
      const tangent = this.trackSpline.getTangentAt(t);
      const nextTangent = this.trackSpline.getTangentAt((t + 0.03) % 1);
      const angleChange = tangent.angleTo(nextTangent);
      if (angleChange > 0.15) {
        targetSpeed *= 0.78; // Cornering brake
      }

      // Natural speed adjustment
      if (r.speed < targetSpeed) {
        r.speed = Math.min(targetSpeed, r.speed + r.accel * dt);
      } else {
        r.speed = Math.max(targetSpeed, r.speed - 15 * dt);
      }

      // Smooth lateral steering towards target lane
      r.lateralOffset += (r.targetLateral - r.lateralOffset) * 2.0 * dt;

      // Overtake decision: occasionally switch lanes
      if (Math.random() < 0.005) {
        r.targetLateral = (Math.random() - 0.5) * (this.trackWidth - 8);
      }

      // Advance along spline
      const progressSpeed = (r.speed / this.trackLength) * dt;
      r.splineProgress += progressSpeed;
      r.totalDistance += r.speed * dt;

      if (r.splineProgress >= 1.0) {
        r.splineProgress -= 1.0;
        this.onLapCompleted(r);
      }

      this.updateCarTransform(r);
    });

    // Car-to-Car Bumper Collision Detection
    for (let i = 0; i < this.racers.length; i++) {
      for (let j = i + 1; j < this.racers.length; j++) {
        const c1 = this.racers[i];
        const c2 = this.racers[j];
        const dist = c1.pos.distanceTo(c2.pos);

        if (dist < 3.2) {
          // Push apart laterally
          const push = (3.2 - dist) * 0.5;
          if (c1.lateralOffset < c2.lateralOffset) {
            c1.lateralOffset -= push;
            c2.lateralOffset += push;
          } else {
            c1.lateralOffset += push;
            c2.lateralOffset -= push;
          }
          c1.speed *= 0.94;
          c2.speed *= 0.94;
        }
      }
    }
  }

  // -----------------------------------------------------------
  // LAP & FINISH RACE MANAGEMENT
  // -----------------------------------------------------------
  onLapCompleted(racer) {
    racer.lap += 1;

    if (racer.isPlayer) {
      const lapTimeStr = this.formatTime(this.lapTimer);
      if (this.lapTimer < this.bestLapTime) {
        this.bestLapTime = this.lapTimer;
        document.getElementById('hudBestTime').textContent = lapTimeStr;
      }
      this.lapTimer = 0;

      if (racer.lap <= this.totalLaps) {
        this.showNotification(`LAP ${racer.lap} / ${this.totalLaps}!`);
      } else {
        // Player Finished!
        this.onRaceFinished();
      }
    }
  }

  onRaceFinished() {
    this.state = 'FINISHED';
    this.audio.playCountdown(true);

    const finishOverlay = document.getElementById('finishOverlay');
    const title = document.getElementById('finishTitle');
    const trophy = document.getElementById('podiumTrophy');

    const rank = this.player.rank;
    if (rank === 1) {
      title.textContent = 'JUARA 1 (VICTORY!)';
      trophy.className = 'fa-solid fa-trophy trophy-icon text-gold';
    } else if (rank === 2 || rank === 3) {
      title.textContent = `PODIUM KE-${rank}!`;
      trophy.className = 'fa-solid fa-medal trophy-icon text-gold';
    } else {
      title.textContent = `POSISI KE-${rank}`;
      trophy.className = 'fa-solid fa-flag-checkered trophy-icon text-muted';
    }

    // Populate Leaderboard Table
    const table = document.getElementById('leaderboardTable');
    table.innerHTML = this.racers
      .map(
        (r, i) => `
        <div class="leaderboard-row ${r.isPlayer ? 'player-row' : ''}">
          <span>#${i + 1} ${r.name}</span>
          <span>${this.formatTime(this.raceTimer + i * 2.15)}</span>
        </div>
      `
      )
      .join('');

    finishOverlay.style.display = 'flex';
  }

  resetRace() {
    this.raceTimer = 0;
    this.lapTimer = 0;
    this.bestLapTime = Infinity;
    this.racers.forEach((r, idx) => {
      r.speed = 0;
      r.lap = 1;
      r.totalDistance = 0;
      r.splineProgress = (idx === 0 ? 0.002 : -idx * 0.006 + 1) % 1;
      r.heldItem = null;
      r.spinTimer = 0;
      r.isNitroActive = false;
      this.updateCarTransform(r);
    });
  }

  updateRanking() {
    // Sort racers descending by total distance traveled
    this.racers.sort((a, b) => b.totalDistance - a.totalDistance);

    this.racers.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    // Update HUD
    const rankEl = document.getElementById('hudRank');
    const rankSuffixes = ['ST', 'ND', 'RD', 'TH', 'TH', 'TH'];
    const r = this.player.rank;
    rankEl.innerHTML = `${r}<span class="rank-suffix">${rankSuffixes[r - 1] || 'TH'}</span>`;
  }

  // -----------------------------------------------------------
  // POWER-UP PICKUP & USAGE (ROKET, NITRO, OLI, SHIELD)
  // -----------------------------------------------------------
  updateItemBoxes(dt) {
    this.itemBoxes.forEach((box) => {
      if (!box.active) {
        box.respawnTimer -= dt;
        if (box.respawnTimer <= 0) {
          box.active = true;
          box.mesh.visible = true;
        }
        return;
      }

      // Rotate box
      box.mesh.rotation.x += dt * 1.5;
      box.mesh.rotation.y += dt * 2.0;

      // Check collision with player car
      if (this.player.pos.distanceTo(box.pos) < 3.8) {
        box.active = false;
        box.mesh.visible = false;
        box.respawnTimer = 10; // 10s respawn
        this.grantRandomItem(this.player);
      }
    });
  }

  grantRandomItem(racer) {
    this.audio.playItemPickup();
    const items = Object.values(POWER_ITEMS);
    const chosen = items[Math.floor(Math.random() * items.length)];
    racer.heldItem = chosen;

    if (racer.isPlayer) {
      this.showNotification(`ITEM DIAMBIL: ${chosen.name}!`);
      const slotCard = document.getElementById('itemSlotCard');
      const inner = document.getElementById('itemSlotInner');
      const label = document.getElementById('itemSlotLabel');

      slotCard.classList.add('has-item');
      inner.innerHTML = `<i class="${chosen.icon}" style="color: ${chosen.color};"></i>`;
      label.textContent = `[F/E] ${chosen.name}`;
    }
  }

  usePlayerItem() {
    const p = this.player;
    if (!p.heldItem) return;

    const item = p.heldItem;
    p.heldItem = null;

    // Reset item slot UI
    const slotCard = document.getElementById('itemSlotCard');
    const inner = document.getElementById('itemSlotInner');
    const label = document.getElementById('itemSlotLabel');
    slotCard.classList.remove('has-item');
    inner.innerHTML = '<i class="fa-solid fa-cube text-muted"></i>';
    label.textContent = '[F/E] KOSONG';

    if (item.id === 'nitro') {
      // Mega Nitro Boost!
      p.isNitroActive = true;
      p.nitroTimer = 3.5;
      p.speed = p.nitroMaxSpeed;
      this.audio.playNitro();
      this.showNotification('MEGA NITRO BOOST DIAKTIFKAN!');
    } else if (item.id === 'rocket') {
      // Homing Rocket
      this.launchRocket(p);
      this.showNotification('ROKET PENGEJAR DILUNCURKAN!');
    } else if (item.id === 'oil') {
      // Drop Oil Slick behind
      this.dropOilSlick(p);
      this.showNotification('TUMPAHAN OLI DITEBAR!');
    } else if (item.id === 'shield') {
      // Energy Shield
      p.hasShield = true;
      this.audio.playItemPickup();
      this.showNotification('PERISAI ENERGI AKTIF!');
    }
  }

  launchRocket(launcher) {
    this.audio.playRocketLaunch();

    // Rocket 3D Model
    const rocketMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 2.0, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    rocketMesh.rotateX(Math.PI / 2);
    rocketMesh.position.copy(launcher.pos).add(new THREE.Vector3(0, 1.2, 0));
    this.scene.add(rocketMesh);

    this.activeRockets.push({
      mesh: rocketMesh,
      pos: rocketMesh.position,
      launcher,
      targetProgress: (launcher.splineProgress + 0.08) % 1,
      life: 5.0
    });
  }

  dropOilSlick(dropper) {
    this.audio.playItemPickup();

    const oilMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 0.08, 12),
      new THREE.MeshBasicMaterial({ color: 0x111111 })
    );
    oilMesh.position.copy(dropper.pos);
    oilMesh.position.y = 0.08;
    this.scene.add(oilMesh);

    this.activeOils.push({
      mesh: oilMesh,
      pos: oilMesh.position,
      life: 20.0
    });
  }

  updateProjectiles(dt) {
    // 1. Update Rockets
    this.activeRockets.forEach((rk, idx) => {
      rk.life -= dt;
      // Fly along spline towards targets ahead
      const t = (rk.targetProgress + dt * 0.15) % 1;
      rk.targetProgress = t;
      const targetPt = this.trackSpline.getPointAt(t);
      rk.pos.lerp(targetPt, 0.15);
      rk.pos.y = 1.2;

      // Check hit on any racer (excluding launcher)
      for (const racer of this.racers) {
        if (racer !== rk.launcher && rk.pos.distanceTo(racer.pos) < 4.0) {
          this.audio.playExplosion();
          this.scene.remove(rk.mesh);
          this.activeRockets.splice(idx, 1);

          if (racer.hasShield) {
            racer.hasShield = false;
            if (racer.isPlayer) this.showNotification('PERISAI MENAHAN ROKET!');
          } else {
            racer.spinTimer = 1.5;
            if (racer.isPlayer) this.showNotification('TERKENA ROKET!');
          }
          break;
        }
      }

      if (rk.life <= 0) {
        this.scene.remove(rk.mesh);
        this.activeRockets.splice(idx, 1);
      }
    });

    // 2. Update Oil Slicks
    this.activeOils.forEach((oil) => {
      oil.life -= dt;
      // Check collision with cars
      for (const racer of this.racers) {
        if (racer.pos.distanceTo(oil.pos) < 3.2 && racer.spinTimer <= 0) {
          if (racer.hasShield) {
            racer.hasShield = false;
          } else {
            racer.spinTimer = 1.4;
            this.audio.playScreech();
            if (racer.isPlayer) this.showNotification('TERGELINCIR OLI!');
          }
        }
      }
    });
  }

  // -----------------------------------------------------------
  // THIRD-PERSON CHASE CAMERA
  // -----------------------------------------------------------
  updateCamera() {
    if (!this.player || !this.player.mesh) return;

    const p = this.player;
    const t = p.splineProgress % 1;
    const tangent = this.trackSpline.getTangentAt(t).normalize();

    let camOffset, lookOffset;

    if (this.cameraMode === 0) {
      // Standard Third-Person Chase (Close)
      camOffset = tangent.clone().multiplyScalar(-14).add(new THREE.Vector3(0, 5.5, 0));
      lookOffset = tangent.clone().multiplyScalar(15).add(new THREE.Vector3(0, 1.5, 0));
    } else if (this.cameraMode === 1) {
      // High Far Chase
      camOffset = tangent.clone().multiplyScalar(-24).add(new THREE.Vector3(0, 9.5, 0));
      lookOffset = tangent.clone().multiplyScalar(20).add(new THREE.Vector3(0, 1.8, 0));
    } else {
      // Hood / Bonnet Cam
      camOffset = tangent.clone().multiplyScalar(1.2).add(new THREE.Vector3(0, 1.4, 0));
      lookOffset = tangent.clone().multiplyScalar(25).add(new THREE.Vector3(0, 1.2, 0));
    }

    const targetCamPos = p.pos.clone().add(camOffset);
    this.camera.position.lerp(targetCamPos, 0.12);

    const targetLookAt = p.pos.clone().add(lookOffset);
    this.camera.lookAt(targetLookAt);
  }

  // -----------------------------------------------------------
  // HUD UPDATES & RADAR MINIMAP RENDERING
  // -----------------------------------------------------------
  updateHUD() {
    const p = this.player;

    // Speedometer (KM/H)
    const kmh = Math.round(p.speed * 3.6);
    document.getElementById('hudSpeed').textContent = kmh;

    // Lap Counter
    document.getElementById('hudLap').textContent = Math.min(this.totalLaps, p.lap);

    // Timers
    document.getElementById('hudCurrentTime').textContent = this.formatTime(this.lapTimer);

    // Nitro Bar
    const nitroFill = document.getElementById('nitroBarFill');
    const nitroText = document.getElementById('nitroPercent');
    nitroFill.style.width = `${Math.round(p.nitro)}%`;
    nitroText.textContent = `${Math.round(p.nitro)}%`;
  }

  drawMinimapRadar() {
    const canvas = document.getElementById('minimapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark radar circle
    ctx.fillStyle = 'rgba(22, 13, 36, 0.85)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Track Line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const scale = 0.12;
    const offsetX = w / 2 - 18;
    const offsetY = h / 2 + 5;

    for (let i = 0; i < this.trackWaypoints.length; i++) {
      const pt = this.trackWaypoints[i];
      const x = offsetX + pt.x * scale;
      const y = offsetY + pt.z * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw Racers Blips
    this.racers.forEach((r) => {
      const x = offsetX + r.pos.x * scale;
      const y = offsetY + r.pos.z * scale;

      ctx.beginPath();
      if (r.isPlayer) {
        ctx.fillStyle = '#06b6d4'; // Cyan player dot
        ctx.arc(x, y, 5, 0, Math.PI * 2);
      } else {
        ctx.fillStyle = '#ef4444'; // Red NPC dots
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      }
      ctx.fill();
    });
  }

  formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '00:00.00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
}

// -------------------------------------------------------------
// START GAME ON DOM READY
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  window.racingGame = new RacingGame();
});
