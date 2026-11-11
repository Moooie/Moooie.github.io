/**
 * ===================================================================
 * MINECRAFT WEB EDITION - GAME ENGINE
 * 3D Voxel Engine with Three.js
 * Features: Mining, Wood Chopping, WASD Movement, Collision,
 * 2 Weapons (Sword & Bow), 3x3/2x2 Crafting, Inventory, Mobs, Sounds
 * ===================================================================
 */

// -------------------------------------------------------------
// 1. PROCEDURAL PIXELATED TEXTURE GENERATOR
// -------------------------------------------------------------
class TextureGenerator {
  static createBlockCanvas(renderFunc) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    renderFunc(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  // Grass Top (Green with pixel noise)
  static grassTop() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#5b8c32';
      ctx.fillRect(0, 0, 16, 16);
      const shades = ['#4f7a2b', '#6ba13b', '#486f26', '#72aa3e'];
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() < 0.35) {
            ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    });
  }

  // Dirt
  static dirt() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#866043';
      ctx.fillRect(0, 0, 16, 16);
      const shades = ['#734f35', '#986d4e', '#60412b', '#7c5539'];
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() < 0.4) {
            ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    });
  }

  // Grass Side (Dirt with green grass fringe)
  static grassSide() {
    return this.createBlockCanvas((ctx) => {
      // Dirt base
      ctx.fillStyle = '#866043';
      ctx.fillRect(0, 0, 16, 16);
      const shades = ['#734f35', '#986d4e', '#60412b'];
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() < 0.35) {
            ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      // Grass top overhang
      ctx.fillStyle = '#5b8c32';
      ctx.fillRect(0, 0, 16, 3);
      for (let x = 0; x < 16; x++) {
        const drop = Math.floor(Math.random() * 3) + 1;
        ctx.fillRect(x, 3, 1, drop);
      }
    });
  }

  // Stone
  static stone() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#7a7a7a';
      ctx.fillRect(0, 0, 16, 16);
      const shades = ['#696969', '#8a8a8a', '#5f5f5f', '#969696'];
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() < 0.35) {
            ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    });
  }

  // Oak Log Side (Tree bark)
  static oakLogSide() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#6b5130';
      ctx.fillRect(0, 0, 16, 16);
      // Vertical bark grain
      for (let x = 0; x < 16; x += 2) {
        ctx.fillStyle = (x % 4 === 0) ? '#543f25' : '#7d603a';
        ctx.fillRect(x, 0, 1, 16);
      }
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = '#42321c';
        ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 2);
      }
    });
  }

  // Oak Log Top (Tree rings)
  static oakLogTop() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#a68958';
      ctx.fillRect(0, 0, 16, 16);
      // Ring
      ctx.strokeStyle = '#82653a';
      ctx.lineWidth = 1;
      ctx.strokeRect(3, 3, 10, 10);
      ctx.strokeRect(6, 6, 4, 4);
      // Outer bark edge
      ctx.strokeStyle = '#543f25';
      ctx.strokeRect(0, 0, 16, 16);
    });
  }

  // Oak Leaves (Foliage)
  static oakLeaves() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#3a6e26';
      ctx.fillRect(0, 0, 16, 16);
      const shades = ['#2e581e', '#4c8a32', '#244517', '#5ca23d'];
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() < 0.4) {
            ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    });
  }

  // Wooden Planks
  static oakPlanks() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#b8945f';
      ctx.fillRect(0, 0, 16, 16);
      // Horizontal wood planks
      ctx.fillStyle = '#8f6f3e';
      ctx.fillRect(0, 3, 16, 1);
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
      // Vertical seam lines
      ctx.fillRect(5, 0, 1, 3);
      ctx.fillRect(11, 4, 1, 3);
      ctx.fillRect(3, 8, 1, 3);
      ctx.fillRect(13, 12, 1, 3);
    });
  }

  // Crafting Table Top
  static craftingTableTop() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#b8945f';
      ctx.fillRect(0, 0, 16, 16);
      ctx.strokeStyle = '#6a4d25';
      ctx.lineWidth = 1;
      ctx.strokeRect(1, 1, 14, 14);
      // 3x3 grid lines
      ctx.beginPath();
      ctx.moveTo(5, 1); ctx.lineTo(5, 15);
      ctx.moveTo(10, 1); ctx.lineTo(10, 15);
      ctx.moveTo(1, 5); ctx.lineTo(15, 5);
      ctx.moveTo(1, 10); ctx.lineTo(15, 10);
      ctx.stroke();
    });
  }

  // Crafting Table Side
  static craftingTableSide() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#9e7947';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#6b4f2c';
      ctx.fillRect(0, 0, 16, 2);
      ctx.fillRect(0, 14, 16, 2);
      // Draw tools outline on side
      ctx.fillStyle = '#374151';
      ctx.fillRect(4, 5, 2, 7); // Saw
      ctx.fillRect(10, 6, 2, 5); // Shears
    });
  }

  // Cobblestone
  static cobblestone() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#6e6e6e';
      ctx.fillRect(0, 0, 16, 16);
      ctx.strokeStyle = '#3d3d3d';
      ctx.lineWidth = 1;
      ctx.strokeRect(1, 1, 6, 4);
      ctx.strokeRect(8, 2, 7, 5);
      ctx.strokeRect(2, 7, 7, 4);
      ctx.strokeRect(10, 8, 5, 5);
      ctx.strokeRect(3, 12, 8, 3);
    });
  }

  // Coal Ore
  static coalOre() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#7a7a7a';
      ctx.fillRect(0, 0, 16, 16);
      // Coal flecks
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(3, 3, 3, 2);
      ctx.fillRect(9, 4, 4, 3);
      ctx.fillRect(4, 9, 3, 3);
      ctx.fillRect(11, 10, 3, 2);
    });
  }

  // Iron Ore
  static ironOre() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#7a7a7a';
      ctx.fillRect(0, 0, 16, 16);
      // Tan Iron specks
      ctx.fillStyle = '#d8af93';
      ctx.fillRect(3, 4, 3, 2);
      ctx.fillRect(10, 3, 3, 3);
      ctx.fillRect(5, 9, 4, 3);
      ctx.fillRect(11, 11, 3, 2);
    });
  }

  // Diamond Ore
  static diamondOre() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#7a7a7a';
      ctx.fillRect(0, 0, 16, 16);
      // Cyan Diamond crystals
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(4, 3, 2, 2);
      ctx.fillRect(10, 4, 3, 2);
      ctx.fillRect(5, 9, 3, 3);
      ctx.fillRect(11, 10, 2, 3);
    });
  }

  // Bedrock
  static bedrock() {
    return this.createBlockCanvas((ctx) => {
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#111111';
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          if (Math.random() < 0.45) ctx.fillRect(x, y, 1, 1);
        }
      }
    });
  }
}

// -------------------------------------------------------------
// 2. SOUND SYNTHESIZER (WEB AUDIO API)
// -------------------------------------------------------------
class MinecraftAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playDig(type = 'dirt') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const freq = type === 'stone' ? 240 : type === 'wood' ? 180 : 120;
    osc.type = type === 'stone' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq + Math.random() * 40, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playBreak() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playPlace() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSwordSlash() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  playBowShoot() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playHit() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playPop() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.setValueAtTime(900, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }
}

// -------------------------------------------------------------
// 3. BLOCK TYPES & MATERIAL DEFINITIONS
// -------------------------------------------------------------
const BLOCKS = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  OAK_LOG: 4,
  OAK_LEAVES: 5,
  OAK_PLANKS: 6,
  CRAFTING_TABLE: 7,
  COBBLESTONE: 8,
  COAL_ORE: 9,
  IRON_ORE: 10,
  DIAMOND_ORE: 11,
  BEDROCK: 12
};

const ITEMS = {
  // Tools & Weapons
  STICK: { id: 'stick', name: 'Stick', isBlock: false, maxStack: 64, icon: '🥢' },
  WOODEN_PICKAXE: { id: 'wooden_pickaxe', name: 'Wooden Pickaxe', isBlock: false, isTool: true, toolType: 'pickaxe', damage: 3, maxStack: 1, icon: '⛏️' },
  WOODEN_SWORD: { id: 'wooden_sword', name: 'Wooden Sword', isBlock: false, isWeapon: true, weaponType: 'sword', damage: 6, maxStack: 1, icon: '🗡️' },
  STONE_PICKAXE: { id: 'stone_pickaxe', name: 'Stone Pickaxe', isBlock: false, isTool: true, toolType: 'pickaxe', damage: 4, maxStack: 1, icon: '⛏️' },
  STONE_SWORD: { id: 'stone_sword', name: 'Stone Sword', isBlock: false, isWeapon: true, weaponType: 'sword', damage: 9, maxStack: 1, icon: '⚔️' },
  BOW: { id: 'bow', name: 'Bow', isBlock: false, isWeapon: true, weaponType: 'bow', damage: 12, maxStack: 1, icon: '🏹' },
  ARROW: { id: 'arrow', name: 'Arrow', isBlock: false, maxStack: 64, icon: '➵' },
  PORKCHOP: { id: 'porkchop', name: 'Raw Porkchop', isBlock: false, isFood: true, hunger: 4, maxStack: 64, icon: '🥩' },
  ROTTEN_FLESH: { id: 'rotten_flesh', name: 'Rotten Flesh', isBlock: false, isFood: true, hunger: 2, maxStack: 64, icon: '🍖' }
};

const BLOCK_INFO = {
  [BLOCKS.GRASS]: { name: 'Grass Block', hardness: 0.6, drop: BLOCKS.DIRT, sound: 'dirt', icon: '🟩' },
  [BLOCKS.DIRT]: { name: 'Dirt', hardness: 0.5, drop: BLOCKS.DIRT, sound: 'dirt', icon: '🟫' },
  [BLOCKS.STONE]: { name: 'Stone', hardness: 1.5, drop: BLOCKS.COBBLESTONE, sound: 'stone', icon: '🪨' },
  [BLOCKS.OAK_LOG]: { name: 'Oak Log', hardness: 1.2, drop: BLOCKS.OAK_LOG, sound: 'wood', icon: '🪵' },
  [BLOCKS.OAK_LEAVES]: { name: 'Oak Leaves', hardness: 0.25, drop: null, sound: 'dirt', icon: '🍃' },
  [BLOCKS.OAK_PLANKS]: { name: 'Oak Planks', hardness: 1.0, drop: BLOCKS.OAK_PLANKS, sound: 'wood', icon: '📦' },
  [BLOCKS.CRAFTING_TABLE]: { name: 'Crafting Table', hardness: 1.2, drop: BLOCKS.CRAFTING_TABLE, sound: 'wood', icon: '🪑' },
  [BLOCKS.COBBLESTONE]: { name: 'Cobblestone', hardness: 1.5, drop: BLOCKS.COBBLESTONE, sound: 'stone', icon: '🧱' },
  [BLOCKS.COAL_ORE]: { name: 'Coal Ore', hardness: 2.0, drop: BLOCKS.COAL_ORE, sound: 'stone', icon: '⬛' },
  [BLOCKS.IRON_ORE]: { name: 'Iron Ore', hardness: 2.5, drop: BLOCKS.IRON_ORE, sound: 'stone', icon: '🟤' },
  [BLOCKS.DIAMOND_ORE]: { name: 'Diamond Ore', hardness: 3.0, drop: BLOCKS.DIAMOND_ORE, sound: 'stone', icon: '💎' },
  [BLOCKS.BEDROCK]: { name: 'Bedrock', hardness: Infinity, drop: null, sound: 'stone', icon: '⚫' }
};

// -------------------------------------------------------------
// 4. CRAFTING RECIPES DATABASE
// -------------------------------------------------------------
const RECIPES = [
  // 1 Log -> 4 Planks
  {
    name: 'Oak Planks (x4)',
    requires: [{ item: 'block_4', count: 1 }],
    result: { id: 'block_6', count: 4, name: 'Oak Planks', isBlock: true, blockId: BLOCKS.OAK_PLANKS, icon: '📦' }
  },
  // 2 Planks -> 4 Sticks
  {
    name: 'Stick (x4)',
    requires: [{ item: 'block_6', count: 2 }],
    result: { id: 'stick', count: 4, ...ITEMS.STICK }
  },
  // 4 Planks -> Crafting Table
  {
    name: 'Crafting Table',
    requires: [{ item: 'block_6', count: 4 }],
    result: { id: 'block_7', count: 1, name: 'Crafting Table', isBlock: true, blockId: BLOCKS.CRAFTING_TABLE, icon: '🪑' }
  },
  // 3 Planks + 2 Sticks -> Wooden Pickaxe
  {
    name: 'Wooden Pickaxe',
    requires: [{ item: 'block_6', count: 3 }, { item: 'stick', count: 2 }],
    result: { ...ITEMS.WOODEN_PICKAXE, count: 1 }
  },
  // 2 Planks + 1 Stick -> Wooden Sword
  {
    name: 'Wooden Sword',
    requires: [{ item: 'block_6', count: 2 }, { item: 'stick', count: 1 }],
    result: { ...ITEMS.WOODEN_SWORD, count: 1 }
  },
  // 3 Sticks + 3 Planks -> Bow
  {
    name: 'Bow',
    requires: [{ item: 'stick', count: 3 }, { item: 'block_6', count: 3 }],
    result: { ...ITEMS.BOW, count: 1 }
  },
  // 1 Stick + 1 Cobblestone -> 4 Arrows
  {
    name: 'Arrow (x4)',
    requires: [{ item: 'stick', count: 1 }, { item: 'block_8', count: 1 }],
    result: { ...ITEMS.ARROW, count: 4 }
  },
  // 3 Cobblestone + 2 Sticks -> Stone Pickaxe
  {
    name: 'Stone Pickaxe',
    requires: [{ item: 'block_8', count: 3 }, { item: 'stick', count: 2 }],
    result: { ...ITEMS.STONE_PICKAXE, count: 1 }
  },
  // 2 Cobblestone + 1 Stick -> Stone Sword
  {
    name: 'Stone Sword',
    requires: [{ item: 'block_8', count: 2 }, { item: 'stick', count: 1 }],
    result: { ...ITEMS.STONE_SWORD, count: 1 }
  }
];

// -------------------------------------------------------------
// 5. MAIN MINECRAFT GAME CLASS
// -------------------------------------------------------------
class MinecraftGame {
  constructor() {
    this.audio = new MinecraftAudio();

    // World Dimensions (32x32 horizontal, 24 height)
    this.WORLD_W = 32;
    this.WORLD_D = 32;
    this.WORLD_H = 24;
    this.world = new Uint8Array(this.WORLD_W * this.WORLD_D * this.WORLD_H);

    // Three.js Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x78a7ff); // Sky blue
    this.scene.fog = new THREE.FogExp2(0x78a7ff, 0.025);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mcCanvas'), antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;

    // Player State
    this.player = {
      x: 16,
      y: 16,
      z: 16,
      vx: 0,
      vy: 0,
      vz: 0,
      width: 0.6,
      height: 1.8,
      yaw: 0,
      pitch: 0,
      isGrounded: false,
      isSneaking: false,
      hp: 20,
      maxHp: 20,
      hunger: 20,
      selectedSlot: 0, // 0 to 8
      hotbar: new Array(9).fill(null),
      inventory: new Array(27).fill(null),
      handBob: 0,
      isAttacking: false,
      attackTimer: 0,
      isDrawingBow: false,
      bowDrawTime: 0
    };

    // Input State
    this.keys = {};
    this.isPointerLocked = false;
    this.isInventoryOpen = false;
    this.isCraftingTableMode = false;

    // Block mining state
    this.miningTarget = null;
    this.miningProgress = 0;
    this.isMining = false;

    // Target highlight outline box
    this.highlightBox = null;

    // First person held tool model
    this.heldItemMesh = null;

    // Entities (Arrows, Mobs)
    this.arrows = [];
    this.mobs = [];

    // Setup All Subsystems
    this.initTexturesAndMaterials();
    this.initLighting();
    this.generateTerrain();
    this.buildWorldMesh();
    this.initHighlightBox();
    this.initFirstPersonHand();
    this.spawnInitialMobs();
    this.initStarterInventory();
    this.initUI();
    this.initEventListeners();

    // Start Game Loop
    this.lastTime = performance.now();
    this.fpsCount = 0;
    this.fpsTimer = 0;
    requestAnimationFrame((t) => this.loop(t));
  }

  // -----------------------------------------------------------
  // MATERIALS & TEXTURES
  // -----------------------------------------------------------
  initTexturesAndMaterials() {
    this.textures = {
      grassTop: TextureGenerator.grassTop(),
      grassSide: TextureGenerator.grassSide(),
      dirt: TextureGenerator.dirt(),
      stone: TextureGenerator.stone(),
      oakLogSide: TextureGenerator.oakLogSide(),
      oakLogTop: TextureGenerator.oakLogTop(),
      oakLeaves: TextureGenerator.oakLeaves(),
      oakPlanks: TextureGenerator.oakPlanks(),
      craftingTop: TextureGenerator.craftingTableTop(),
      craftingSide: TextureGenerator.craftingTableSide(),
      cobblestone: TextureGenerator.cobblestone(),
      coalOre: TextureGenerator.coalOre(),
      ironOre: TextureGenerator.ironOre(),
      diamondOre: TextureGenerator.diamondOre(),
      bedrock: TextureGenerator.bedrock()
    };

    // Material library per block
    const m = (tex, transparent = false) =>
      new THREE.MeshLambertMaterial({ map: tex, transparent, alphaTest: transparent ? 0.3 : 0 });

    this.materials = {
      [BLOCKS.GRASS]: [
        m(this.textures.grassSide), // px
        m(this.textures.grassSide), // nx
        m(this.textures.grassTop),  // py (top)
        m(this.textures.dirt),      // ny (bottom)
        m(this.textures.grassSide), // pz
        m(this.textures.grassSide)  // nz
      ],
      [BLOCKS.DIRT]: m(this.textures.dirt),
      [BLOCKS.STONE]: m(this.textures.stone),
      [BLOCKS.OAK_LOG]: [
        m(this.textures.oakLogSide),
        m(this.textures.oakLogSide),
        m(this.textures.oakLogTop),
        m(this.textures.oakLogTop),
        m(this.textures.oakLogSide),
        m(this.textures.oakLogSide)
      ],
      [BLOCKS.OAK_LEAVES]: m(this.textures.oakLeaves, true),
      [BLOCKS.OAK_PLANKS]: m(this.textures.oakPlanks),
      [BLOCKS.CRAFTING_TABLE]: [
        m(this.textures.craftingSide),
        m(this.textures.craftingSide),
        m(this.textures.craftingTop),
        m(this.textures.oakPlanks),
        m(this.textures.craftingSide),
        m(this.textures.craftingSide)
      ],
      [BLOCKS.COBBLESTONE]: m(this.textures.cobblestone),
      [BLOCKS.COAL_ORE]: m(this.textures.coalOre),
      [BLOCKS.IRON_ORE]: m(this.textures.ironOre),
      [BLOCKS.DIAMOND_ORE]: m(this.textures.diamondOre),
      [BLOCKS.BEDROCK]: m(this.textures.bedrock)
    };
  }

  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.sunLight.position.set(40, 80, 50);
    this.scene.add(this.sunLight);

    // Sun & Moon Mesh in sky
    this.dayTime = 0.35; // 0 to 1
    const celestialGroup = new THREE.Group();

    // Pixel Sun
    const sunGeo = new THREE.BoxGeometry(8, 8, 8);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    celestialGroup.add(this.sunMesh);

    // Pixel Moon
    const moonGeo = new THREE.BoxGeometry(6, 6, 6);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    celestialGroup.add(this.moonMesh);

    this.celestialGroup = celestialGroup;
    this.scene.add(this.celestialGroup);
  }

  // -----------------------------------------------------------
  // VOXEL WORLD GENERATION
  // -----------------------------------------------------------
  getBlock(x, y, z) {
    if (x < 0 || x >= this.WORLD_W || y < 0 || y >= this.WORLD_H || z < 0 || z >= this.WORLD_D) {
      return BLOCKS.AIR;
    }
    return this.world[x + z * this.WORLD_W + y * this.WORLD_W * this.WORLD_D];
  }

  setBlock(x, y, z, blockId) {
    if (x < 0 || x >= this.WORLD_W || y < 0 || y >= this.WORLD_H || z < 0 || z >= this.WORLD_D) {
      return;
    }
    this.world[x + z * this.WORLD_W + y * this.WORLD_W * this.WORLD_D] = blockId;
    this.buildWorldMesh();
  }

  generateTerrain() {
    // 1. Terrain Heightmap
    for (let x = 0; x < this.WORLD_W; x++) {
      for (let z = 0; z < this.WORLD_D; z++) {
        // Natural rolling hills using sine frequencies
        const n1 = Math.sin(x * 0.18) * Math.cos(z * 0.18) * 3;
        const n2 = Math.sin((x + 10) * 0.08) * Math.sin((z + 10) * 0.08) * 4;
        const height = Math.floor(9 + n1 + n2);

        for (let y = 0; y < this.WORLD_H; y++) {
          if (y === 0) {
            this.world[x + z * this.WORLD_W + y * this.WORLD_W * this.WORLD_D] = BLOCKS.BEDROCK;
          } else if (y < height - 3) {
            // Underground stone with ores
            const r = Math.random();
            let b = BLOCKS.STONE;
            if (r < 0.035) b = BLOCKS.COAL_ORE;
            else if (r < 0.055) b = BLOCKS.IRON_ORE;
            else if (y < 4 && r < 0.065) b = BLOCKS.DIAMOND_ORE;

            this.world[x + z * this.WORLD_W + y * this.WORLD_W * this.WORLD_D] = b;
          } else if (y < height) {
            this.world[x + z * this.WORLD_W + y * this.WORLD_W * this.WORLD_D] = BLOCKS.DIRT;
          } else if (y === height) {
            this.world[x + z * this.WORLD_W + y * this.WORLD_W * this.WORLD_D] = BLOCKS.GRASS;
          }
        }
      }
    }

    // 2. Generate Oak Trees
    for (let i = 0; i < 14; i++) {
      const tx = Math.floor(Math.random() * (this.WORLD_W - 8)) + 4;
      const tz = Math.floor(Math.random() * (this.WORLD_D - 8)) + 4;

      // Find top ground block
      let ty = this.WORLD_H - 1;
      while (ty > 0 && this.getBlock(tx, ty, tz) === BLOCKS.AIR) {
        ty--;
      }

      if (this.getBlock(tx, ty, tz) === BLOCKS.GRASS) {
        this.growTree(tx, ty + 1, tz);
      }
    }

    // Set player starting height atop terrain
    let startY = this.WORLD_H - 1;
    while (startY > 0 && this.getBlock(16, startY, 16) === BLOCKS.AIR) {
      startY--;
    }
    this.player.y = startY + 2.5;
  }

  growTree(x, y, z) {
    const trunkHeight = 4 + Math.floor(Math.random() * 2);

    // Trunk
    for (let h = 0; h < trunkHeight; h++) {
      if (y + h < this.WORLD_H) {
        this.world[x + z * this.WORLD_W + (y + h) * this.WORLD_W * this.WORLD_D] = BLOCKS.OAK_LOG;
      }
    }

    // Leaves Canopy
    const leafBase = y + trunkHeight - 2;
    for (let lx = -2; lx <= 2; lx++) {
      for (let lz = -2; lz <= 2; lz++) {
        for (let ly = 0; ly < 3; ly++) {
          if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && ly === 2) continue; // Round corners
          const wx = x + lx;
          const wy = leafBase + ly;
          const wz = z + lz;

          if (this.getBlock(wx, wy, wz) === BLOCKS.AIR) {
            if (wx >= 0 && wx < this.WORLD_W && wy < this.WORLD_H && wz >= 0 && wz < this.WORLD_D) {
              this.world[wx + wz * this.WORLD_W + wy * this.WORLD_W * this.WORLD_D] = BLOCKS.OAK_LEAVES;
            }
          }
        }
      }
    }
  }

  // Build optimized scene meshes for all non-air blocks with face culling
  buildWorldMesh() {
    if (this.worldGroup) {
      this.scene.remove(this.worldGroup);
    }
    this.worldGroup = new THREE.Group();

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    // Group blocks by type for batched rendering
    const blockMeshes = {};
    for (const bId in this.materials) {
      blockMeshes[bId] = [];
    }

    for (let x = 0; x < this.WORLD_W; x++) {
      for (let y = 0; y < this.WORLD_H; y++) {
        for (let z = 0; z < this.WORLD_D; z++) {
          const block = this.getBlock(x, y, z);
          if (block === BLOCKS.AIR) continue;

          // Simple culling: check if exposed to at least one air neighbor
          const exposed =
            this.getBlock(x + 1, y, z) === BLOCKS.AIR ||
            this.getBlock(x - 1, y, z) === BLOCKS.AIR ||
            this.getBlock(x, y + 1, z) === BLOCKS.AIR ||
            this.getBlock(x, y - 1, z) === BLOCKS.AIR ||
            this.getBlock(x, y, z + 1) === BLOCKS.AIR ||
            this.getBlock(x, y, z - 1) === BLOCKS.AIR;

          if (exposed) {
            const mesh = new THREE.Mesh(boxGeo, this.materials[block]);
            mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
            mesh.userData = { x, y, z, blockId: block };
            this.worldGroup.add(mesh);
          }
        }
      }
    }

    this.scene.add(this.worldGroup);
  }

  // -----------------------------------------------------------
  // HIGHLIGHT OUTLINE BOX & FIRST-PERSON HAND
  // -----------------------------------------------------------
  initHighlightBox() {
    const geo = new THREE.BoxGeometry(1.005, 1.005, 1.005);
    const edges = new THREE.EdgesGeometry(geo);
    this.highlightBox = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    );
    this.highlightBox.visible = false;
    this.scene.add(this.highlightBox);
  }

  initFirstPersonHand() {
    this.handGroup = new THREE.Group();

    // Default Arm (Skin / sleeve)
    const armGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const armMat = new THREE.MeshLambertMaterial({ color: 0x5b8c32 }); // Green sleeve
    this.armMesh = new THREE.Mesh(armGeo, armMat);
    this.armMesh.position.set(0.35, -0.35, -0.6);
    this.armMesh.rotation.set(-0.3, 0.2, -0.1);
    this.handGroup.add(this.armMesh);

    // 3D Sword in hand
    const swordGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.08, 0.7, 0.03);
    const bladeMat = new THREE.MeshLambertMaterial({ color: 0xc6c6c6 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.35;
    swordGroup.add(blade);

    const guardGeo = new THREE.BoxGeometry(0.25, 0.05, 0.05);
    const guardMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
    const guard = new THREE.Mesh(guardGeo, guardMat);
    swordGroup.add(guard);

    swordGroup.position.set(0.3, -0.2, -0.5);
    swordGroup.rotation.set(-0.6, 0.3, -0.2);
    this.swordMesh = swordGroup;
    this.handGroup.add(this.swordMesh);

    // 3D Bow in hand
    const bowGroup = new THREE.Group();
    const bowArcGeo = new THREE.TorusGeometry(0.3, 0.03, 4, 12, Math.PI);
    const bowMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
    const bowArc = new THREE.Mesh(bowArcGeo, bowMat);
    bowGroup.add(bowArc);
    bowGroup.position.set(0.28, -0.25, -0.5);
    bowGroup.rotation.set(0, -Math.PI / 2, 0);
    this.bowMesh = bowGroup;
    this.handGroup.add(this.bowMesh);

    this.camera.add(this.handGroup);
    this.scene.add(this.camera);

    this.updateHeldItemVisual();
  }

  updateHeldItemVisual() {
    const held = this.player.hotbar[this.player.selectedSlot];

    if (!held) {
      this.armMesh.visible = true;
      this.swordMesh.visible = false;
      this.bowMesh.visible = false;
      document.getElementById('heldItemName').textContent = 'Tangan Kosong';
      return;
    }

    document.getElementById('heldItemName').textContent = held.name;

    if (held.weaponType === 'sword') {
      this.armMesh.visible = false;
      this.swordMesh.visible = true;
      this.bowMesh.visible = false;
    } else if (held.weaponType === 'bow') {
      this.armMesh.visible = false;
      this.swordMesh.visible = false;
      this.bowMesh.visible = true;
    } else {
      // General hand / block
      this.armMesh.visible = true;
      this.swordMesh.visible = false;
      this.bowMesh.visible = false;
    }
  }

  // -----------------------------------------------------------
  // MOBS (ZOMBIE & PIG)
  // -----------------------------------------------------------
  spawnInitialMobs() {
    // 2 Zombies & 2 Pigs
    this.spawnMob('zombie', 12, 12);
    this.spawnMob('zombie', 24, 20);
    this.spawnMob('pig', 8, 8);
    this.spawnMob('pig', 20, 10);
  }

  spawnMob(type, x, z) {
    let y = this.WORLD_H - 1;
    while (y > 0 && this.getBlock(x, y, z) === BLOCKS.AIR) {
      y--;
    }
    y += 1;

    const group = new THREE.Group();

    if (type === 'zombie') {
      // Zombie Body Parts
      const headMat = new THREE.MeshLambertMaterial({ color: 0x3d703b });
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0x225577 });
      const legMat = new THREE.MeshLambertMaterial({ color: 0x1f2747 });

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), headMat);
      head.position.y = 1.6;
      group.add(head);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.25), bodyMat);
      body.position.y = 0.95;
      group.add(body);

      // Arms outstretched
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.6), headMat);
      arm.position.set(0.3, 1.1, 0.3);
      group.add(arm);
      const arm2 = arm.clone();
      arm2.position.x = -0.3;
      group.add(arm2);

      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), legMat);
      leg.position.set(0.15, 0.3, 0);
      group.add(leg);
      const leg2 = leg.clone();
      leg2.position.x = -0.15;
      group.add(leg2);
    } else {
      // Pig
      const pigMat = new THREE.MeshLambertMaterial({ color: 0xf4928e });
      const pigBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.9), pigMat);
      pigBody.position.y = 0.5;
      group.add(pigBody);

      const pigHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), pigMat);
      pigHead.position.set(0, 0.7, 0.55);
      group.add(pigHead);

      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 0.15), new THREE.MeshLambertMaterial({ color: 0xdc7571 }));
      snout.position.set(0, 0.65, 0.85);
      group.add(snout);
    }

    group.position.set(x + 0.5, y, z + 0.5);
    this.scene.add(group);

    this.mobs.push({
      type,
      mesh: group,
      x: x + 0.5,
      y,
      z: z + 0.5,
      vx: 0,
      vy: 0,
      vz: 0,
      hp: type === 'zombie' ? 20 : 10,
      maxHp: type === 'zombie' ? 20 : 10,
      attackCooldown: 0,
      changeDirTimer: 0,
      dirX: 0,
      dirZ: 0
    });
  }

  // -----------------------------------------------------------
  // STARTER INVENTORY & RECIPE BOOK
  // -----------------------------------------------------------
  initStarterInventory() {
    // Starter items: Wooden Sword, Bow, 16 Arrows, 4 Oak Logs
    this.player.hotbar[0] = { ...ITEMS.WOODEN_SWORD, count: 1 };
    this.player.hotbar[1] = { ...ITEMS.WOODEN_PICKAXE, count: 1 };
    this.player.hotbar[2] = { ...ITEMS.BOW, count: 1 };
    this.player.hotbar[3] = { ...ITEMS.ARROW, count: 16 };
    this.player.hotbar[4] = { id: 'block_4', name: 'Oak Log', isBlock: true, blockId: BLOCKS.OAK_LOG, count: 8, icon: '🪵' };

    this.updateHotbarUI();
  }

  // -----------------------------------------------------------
  // INPUT & CONTROLS LISTENER
  // -----------------------------------------------------------
  initEventListeners() {
    const blocker = document.getElementById('blocker');
    const playBtn = document.getElementById('playBtn');

    playBtn.addEventListener('click', () => {
      this.audio.init();
      document.body.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === document.body) {
        this.isPointerLocked = true;
        blocker.style.display = 'none';
      } else {
        this.isPointerLocked = false;
        if (!this.isInventoryOpen) {
          blocker.style.display = 'flex';
        }
      }
    });

    // Mouse Move (3D Look Around)
    document.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;

      const sensitivity = 0.0022;
      this.player.yaw -= e.movementX * sensitivity;
      this.player.pitch -= e.movementY * sensitivity;

      // Clamp pitch (-89 to +89 deg)
      const maxPitch = (Math.PI / 2) - 0.02;
      this.player.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.player.pitch));
    });

    // Mouse Down (Left click: Mine/Attack, Right click: Place/Bow)
    window.addEventListener('mousedown', (e) => {
      this.audio.init();
      if (!this.isPointerLocked || this.isInventoryOpen) return;

      if (e.button === 0) {
        // Left click: Mine or Attack
        this.handleLeftClick();
      } else if (e.button === 2) {
        // Right click: Place block or Draw Bow
        this.handleRightClick();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMining = false;
        this.miningProgress = 0;
        document.getElementById('breakProgressContainer').style.display = 'none';
      } else if (e.button === 2) {
        if (this.player.isDrawingBow) {
          this.releaseBowArrow();
        }
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // Keyboard keys
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Hotbar selection with 1-9
      if (e.code.startsWith('Digit')) {
        const num = parseInt(e.code.replace('Digit', ''), 10);
        if (num >= 1 && num <= 9) {
          this.player.selectedSlot = num - 1;
          this.updateHotbarUI();
          this.updateHeldItemVisual();
        }
      }

      // 'E' Key to toggle Inventory
      if (e.code === 'KeyE') {
        this.toggleInventory();
      }

      // 'Q' to drop item
      if (e.code === 'KeyQ') {
        this.dropHeldItem();
      }

      // 'Shift' to sneak
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.player.isSneaking = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.player.isSneaking = false;
      }
    });

    // Mouse Scroll Wheel to change hotbar slot
    window.addEventListener('wheel', (e) => {
      if (this.isInventoryOpen) return;
      if (e.deltaY > 0) {
        this.player.selectedSlot = (this.player.selectedSlot + 1) % 9;
      } else {
        this.player.selectedSlot = (this.player.selectedSlot - 1 + 9) % 9;
      }
      this.updateHotbarUI();
      this.updateHeldItemVisual();
    });

    // Close Inventory Button
    document.getElementById('closeInventoryBtn').addEventListener('click', () => {
      this.toggleInventory(false);
    });

    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // -----------------------------------------------------------
  // ATTACK & MINING (LEFT CLICK)
  // -----------------------------------------------------------
  handleLeftClick() {
    const held = this.player.hotbar[this.player.selectedSlot];

    // Trigger swing animation
    this.player.isAttacking = true;
    this.player.attackTimer = 10;

    // 1. Check if hitting a Mob first
    const hitMob = this.raycastMob();
    if (hitMob) {
      let dmg = 2; // Bare fist
      if (held && held.isWeapon && held.weaponType === 'sword') {
        dmg = held.damage;
        this.audio.playSwordSlash();
      } else {
        this.audio.playHit();
      }

      hitMob.hp -= dmg;
      // Knockback in camera facing direction
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, this.player.yaw, 0));
      hitMob.vx = forward.x * 6;
      hitMob.vz = forward.z * 6;
      hitMob.vy = 3;

      if (hitMob.hp <= 0) {
        this.onMobDefeated(hitMob);
      }
      return;
    }

    // 2. If no mob hit, start mining targeted block
    if (held && held.isWeapon && held.weaponType === 'sword') {
      this.audio.playSwordSlash();
    } else {
      this.isMining = true;
    }
  }

  // -----------------------------------------------------------
  // PLACE BLOCK & BOW SHOOT (RIGHT CLICK)
  // -----------------------------------------------------------
  handleRightClick() {
    const held = this.player.hotbar[this.player.selectedSlot];

    // 1. Bow Handling
    if (held && held.weaponType === 'bow') {
      // Check if player has arrows
      const arrowSlot = this.findItemInInventory('arrow');
      if (arrowSlot) {
        this.player.isDrawingBow = true;
        this.player.bowDrawTime = 0;
      } else {
        alert('Kamu membutuhkan Panah (Arrow) di Inventory untuk menembakkan Bow!');
      }
      return;
    }

    // 2. Eating Food
    if (held && held.isFood) {
      if (this.player.hp < this.player.maxHp || this.player.hunger < 20) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + held.hunger);
        this.player.hunger = Math.min(20, this.player.hunger + held.hunger);
        this.audio.playPop();
        this.consumeHeldItem();
        this.updateHUD();
      }
      return;
    }

    // 3. Crafting Table / Block Placement
    const ray = this.raycastBlock();
    if (!ray) return;

    // Check if right clicking Crafting Table block
    if (ray.blockId === BLOCKS.CRAFTING_TABLE) {
      this.isCraftingTableMode = true;
      this.toggleInventory(true);
      return;
    }

    // Place block from hotbar
    if (held && held.isBlock) {
      const placePos = ray.pos.clone().add(ray.normal);

      // Check collision with player bounding box
      const pMinX = this.player.x - this.player.width / 2;
      const pMaxX = this.player.x + this.player.width / 2;
      const pMinY = this.player.y;
      const pMaxY = this.player.y + this.player.height;
      const pMinZ = this.player.z - this.player.width / 2;
      const pMaxZ = this.player.z + this.player.width / 2;

      const bMinX = placePos.x;
      const bMaxX = placePos.x + 1;
      const bMinY = placePos.y;
      const bMaxY = placePos.y + 1;
      const bMinZ = placePos.z;
      const bMaxZ = placePos.z + 1;

      const collidesWithPlayer =
        pMinX < bMaxX && pMaxX > bMinX &&
        pMinY < bMaxY && pMaxY > bMinY &&
        pMinZ < bMaxZ && pMaxZ > bMinZ;

      if (!collidesWithPlayer) {
        this.setBlock(placePos.x, placePos.y, placePos.z, held.blockId);
        this.audio.playPlace();
        this.consumeHeldItem();
      }
    }
  }

  releaseBowArrow() {
    this.player.isDrawingBow = false;
    const arrowSlot = this.findItemInInventory('arrow');
    if (!arrowSlot) return;

    // Deduct 1 arrow
    arrowSlot.count -= 1;
    if (arrowSlot.count <= 0) {
      if (arrowSlot.isHotbar) this.player.hotbar[arrowSlot.index] = null;
      else this.player.inventory[arrowSlot.index] = null;
    }
    this.updateHotbarUI();

    this.audio.playBowShoot();

    // Spawn 3D arrow projectile
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);

    const arrowGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 5);
    const arrowMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);

    const arrowHeadGeo = new THREE.ConeGeometry(0.06, 0.15, 5);
    const arrowHead = new THREE.Mesh(arrowHeadGeo, new THREE.MeshLambertMaterial({ color: 0xcccccc }));
    arrowHead.position.y = 0.35;
    arrowMesh.add(arrowHead);

    arrowMesh.position.copy(this.camera.position).add(dir.clone().multiplyScalar(0.5));
    arrowMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    this.scene.add(arrowMesh);

    const speed = 28;
    this.arrows.push({
      mesh: arrowMesh,
      velocity: dir.clone().multiplyScalar(speed),
      life: 300,
      stuck: false
    });
  }

  findItemInInventory(itemId) {
    // Check hotbar first
    for (let i = 0; i < 9; i++) {
      if (this.player.hotbar[i] && this.player.hotbar[i].id === itemId) {
        return { item: this.player.hotbar[i], isHotbar: true, index: i };
      }
    }
    // Check main inventory
    for (let i = 0; i < 27; i++) {
      if (this.player.inventory[i] && this.player.inventory[i].id === itemId) {
        return { item: this.player.inventory[i], isHotbar: false, index: i };
      }
    }
    return null;
  }

  consumeHeldItem() {
    const slot = this.player.selectedSlot;
    const item = this.player.hotbar[slot];
    if (!item) return;

    item.count -= 1;
    if (item.count <= 0) {
      this.player.hotbar[slot] = null;
    }
    this.updateHotbarUI();
    this.updateHeldItemVisual();
  }

  dropHeldItem() {
    const slot = this.player.selectedSlot;
    const item = this.player.hotbar[slot];
    if (!item) return;

    this.audio.playPop();
    this.player.hotbar[slot] = null;
    this.updateHotbarUI();
    this.updateHeldItemVisual();
  }

  onMobDefeated(mob) {
    this.audio.playHit();
    this.scene.remove(mob.mesh);
    this.mobs = this.mobs.filter((m) => m !== mob);

    // Drop loot into inventory
    if (mob.type === 'pig') {
      this.addItemToInventory({ ...ITEMS.PORKCHOP, count: 2 });
    } else {
      this.addItemToInventory({ ...ITEMS.ROTTEN_FLESH, count: 1 });
    }
    this.audio.playPop();
  }

  // -----------------------------------------------------------
  // RAYCASTING FOR TARGETED BLOCKS & MOBS
  // -----------------------------------------------------------
  raycastBlock() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const start = this.camera.position.clone();

    // Voxel ray march
    const maxDist = 5.5;
    const step = 0.05;
    let dist = 0;

    while (dist < maxDist) {
      start.add(dir.clone().multiplyScalar(step));
      dist += step;

      const bx = Math.floor(start.x);
      const by = Math.floor(start.y);
      const bz = Math.floor(start.z);

      const block = this.getBlock(bx, by, bz);
      if (block !== BLOCKS.AIR) {
        // Calculate hit normal
        const normal = new THREE.Vector3(0, 0, 0);
        const fracX = start.x - bx;
        const fracY = start.y - by;
        const fracZ = start.z - bz;

        if (fracX < 0.08) normal.x = -1;
        else if (fracX > 0.92) normal.x = 1;
        else if (fracY < 0.08) normal.y = -1;
        else if (fracY > 0.92) normal.y = 1;
        else if (fracZ < 0.08) normal.z = -1;
        else if (fracZ > 0.92) normal.z = 1;

        return {
          pos: new THREE.Vector3(bx, by, bz),
          normal,
          blockId: block,
          info: BLOCK_INFO[block]
        };
      }
    }
    return null;
  }

  raycastMob() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const camPos = this.camera.position;

    for (const mob of this.mobs) {
      const mobPos = new THREE.Vector3(mob.x, mob.y + 0.8, mob.z);
      const toMob = mobPos.clone().sub(camPos);
      const dist = toMob.length();

      if (dist < 4.5) {
        const dot = toMob.normalize().dot(dir);
        if (dot > 0.88) {
          return mob;
        }
      }
    }
    return null;
  }

  // -----------------------------------------------------------
  // INVENTORY & CRAFTING LOGIC
  // -----------------------------------------------------------
  toggleInventory(forceState = null) {
    this.isInventoryOpen = forceState !== null ? forceState : !this.isInventoryOpen;
    const overlay = document.getElementById('inventoryOverlay');

    if (this.isInventoryOpen) {
      document.exitPointerLock();
      overlay.style.display = 'flex';
      this.renderInventoryGUI();
    } else {
      if (this.cursorItem) {
        this.addItemToInventory(this.cursorItem);
        this.cursorItem = null;
      }
      overlay.style.display = 'none';
      this.isCraftingTableMode = false;
      document.body.requestPointerLock();
    }
  }

  renderInventoryGUI() {
    // Window Title
    document.getElementById('windowTitle').textContent = this.isCraftingTableMode
      ? 'Crafting Table (3x3)'
      : 'Inventory & Crafting (2x2)';

    // Render Recipe List on Left
    const recipeList = document.getElementById('recipeListContainer');
    recipeList.innerHTML = RECIPES.map(
      (r, idx) => `
      <div class="recipe-card" data-recipe-idx="${idx}">
        <div>
          <strong>${r.name}</strong>
          <div class="recipe-cost">${r.requires.map((req) => `${req.count}x ${req.item.replace('block_', 'Blok ')}`).join(', ')}</div>
        </div>
        <button class="mc-btn" style="padding: 2px 8px; font-size: 1rem;">Buat</button>
      </div>
    `
    ).join('');

    // Attach recipe click
    const cards = recipeList.querySelectorAll('.recipe-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-recipe-idx'), 10);
        this.craftRecipe(RECIPES[idx]);
      });
    });

    // Render 27 Main Inventory Slots
    const mainInv = document.getElementById('mainInventorySlots');
    mainInv.innerHTML = this.player.inventory
      .map(
        (item, idx) => `
      <div class="inv-slot" data-type="inv" data-idx="${idx}" title="${item ? item.name : ''}">
        ${
          item
            ? `<div class="slot-icon">${item.icon}</div><div class="slot-count">${item.count > 1 ? item.count : ''}</div>`
            : ''
        }
      </div>
    `
      )
      .join('');

    // Render 9 Hotbar Slots inside window
    const hotbarInv = document.getElementById('invHotbarSlots');
    hotbarInv.innerHTML = this.player.hotbar
      .map(
        (item, idx) => `
      <div class="inv-slot" data-type="hotbar" data-idx="${idx}" title="${item ? item.name : ''}">
        ${
          item
            ? `<div class="slot-icon">${item.icon}</div><div class="slot-count">${item.count > 1 ? item.count : ''}</div>`
            : ''
        }
      </div>
    `
      )
      .join('');

    // Attach click events to move items between inventory and hotbar
    const allSlots = document.querySelectorAll('.inv-slot[data-type]');
    allSlots.forEach((slotEl) => {
      slotEl.addEventListener('click', () => {
        const type = slotEl.getAttribute('data-type');
        const idx = parseInt(slotEl.getAttribute('data-idx'), 10);
        this.handleSlotClick(type, idx);
      });
    });

    // Render Crafting Grid (2x2 or 3x3)
    const grid = document.getElementById('craftingGrid');
    const gridSize = this.isCraftingTableMode ? 9 : 4;
    grid.className = this.isCraftingTableMode ? 'crafting-grid grid-3x3' : 'crafting-grid';
    grid.innerHTML = Array.from({ length: gridSize }, (_, i) => `<div class="inv-slot" data-type="craft" data-idx="${i}"></div>`).join('');
  }

  handleSlotClick(type, idx) {
    let targetArray = type === 'hotbar' ? this.player.hotbar : this.player.inventory;
    const currentItem = targetArray[idx];

    if (!this.cursorItem) {
      // Pick up item
      if (currentItem) {
        this.cursorItem = currentItem;
        targetArray[idx] = null;
        this.audio.playPop();
      }
    } else {
      // Place or swap item
      if (!currentItem) {
        targetArray[idx] = this.cursorItem;
        this.cursorItem = null;
        this.audio.playPlace();
      } else if (currentItem.id === this.cursorItem.id) {
        // Stack up
        const max = currentItem.maxStack || 64;
        const canAdd = max - currentItem.count;
        const add = Math.min(canAdd, this.cursorItem.count);
        currentItem.count += add;
        this.cursorItem.count -= add;
        if (this.cursorItem.count <= 0) this.cursorItem = null;
        this.audio.playPlace();
      } else {
        // Swap
        const temp = currentItem;
        targetArray[idx] = this.cursorItem;
        this.cursorItem = temp;
        this.audio.playPop();
      }
    }

    this.renderInventoryGUI();
    this.updateHotbarUI();
    this.updateHeldItemVisual();
  }

  craftRecipe(recipe) {
    // Check if player has required items in inventory or hotbar
    for (const req of recipe.requires) {
      let haveCount = 0;
      // Count in hotbar & inventory
      for (const item of [...this.player.hotbar, ...this.player.inventory]) {
        if (item && item.id === req.item) {
          haveCount += item.count;
        }
      }
      if (haveCount < req.count) {
        alert(`Bahan tidak cukup! Butuh ${req.count}x ${req.item.replace('block_', '')}`);
        return;
      }
    }

    // Deduct items
    for (const req of recipe.requires) {
      let needed = req.count;
      for (let i = 0; i < 9; i++) {
        const item = this.player.hotbar[i];
        if (item && item.id === req.item) {
          const take = Math.min(needed, item.count);
          item.count -= take;
          needed -= take;
          if (item.count <= 0) this.player.hotbar[i] = null;
          if (needed <= 0) break;
        }
      }
      if (needed > 0) {
        for (let i = 0; i < 27; i++) {
          const item = this.player.inventory[i];
          if (item && item.id === req.item) {
            const take = Math.min(needed, item.count);
            item.count -= take;
            needed -= take;
            if (item.count <= 0) this.player.inventory[i] = null;
            if (needed <= 0) break;
          }
        }
      }
    }

    // Add result item
    this.addItemToInventory({ ...recipe.result });
    this.audio.playPop();
    this.renderInventoryGUI();
    this.updateHotbarUI();
    this.updateHeldItemVisual();
  }

  addItemToInventory(newItem) {
    // Try to stack in hotbar
    for (let i = 0; i < 9; i++) {
      const slot = this.player.hotbar[i];
      if (slot && slot.id === newItem.id && slot.count < (slot.maxStack || 64)) {
        slot.count += newItem.count;
        return;
      }
    }
    // Try empty hotbar slot
    for (let i = 0; i < 9; i++) {
      if (!this.player.hotbar[i]) {
        this.player.hotbar[i] = newItem;
        return;
      }
    }
    // Try main inventory
    for (let i = 0; i < 27; i++) {
      const slot = this.player.inventory[i];
      if (slot && slot.id === newItem.id && slot.count < (slot.maxStack || 64)) {
        slot.count += newItem.count;
        return;
      }
    }
    for (let i = 0; i < 27; i++) {
      if (!this.player.inventory[i]) {
        this.player.inventory[i] = newItem;
        return;
      }
    }
  }

  // -----------------------------------------------------------
  // HUD UPDATES (HEARTS, HUNGER, HOTBAR)
  // -----------------------------------------------------------
  initUI() {
    this.updateHUD();
    this.updateHotbarUI();
  }

  updateHUD() {
    // 10 Hearts
    const healthBar = document.getElementById('healthBar');
    const heartsCount = 10;
    const hpPerHeart = 2;
    let heartsHtml = '';
    for (let i = 0; i < heartsCount; i++) {
      const isFull = this.player.hp >= (i + 1) * hpPerHeart;
      heartsHtml += `<span class="heart-icon ${isFull ? 'heart-full' : 'heart-empty'}"></span>`;
    }
    healthBar.innerHTML = heartsHtml;

    // 10 Food
    const foodBar = document.getElementById('foodBar');
    let foodHtml = '';
    for (let i = 0; i < 10; i++) {
      const isFull = this.player.hunger >= (i + 1) * 2;
      foodHtml += `<span class="food-icon ${isFull ? 'food-full' : 'food-empty'}"></span>`;
    }
    foodBar.innerHTML = foodHtml;
  }

  updateHotbarUI() {
    const slotsContainer = document.getElementById('hotbarSlots');
    slotsContainer.innerHTML = this.player.hotbar
      .map(
        (item) => `
      <div class="hotbar-slot">
        ${
          item
            ? `<div class="slot-icon">${item.icon}</div><div class="slot-count">${item.count > 1 ? item.count : ''}</div>`
            : ''
        }
      </div>
    `
      )
      .join('');

    // Selector Box Position
    const selector = document.getElementById('hotbarSelector');
    selector.style.left = `${this.player.selectedSlot * 40 + 2}px`;
  }

  // -----------------------------------------------------------
  // MAIN GAME LOOP (TICK & RENDER)
  // -----------------------------------------------------------
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // FPS Meter
    this.fpsCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1.0) {
      document.getElementById('fpsCounter').textContent = this.fpsCount;
      this.fpsCount = 0;
      this.fpsTimer = 0;
    }

    // Day / Night Cycle Progression
    this.dayTime = (this.dayTime + dt * 0.003) % 1;
    const sunAngle = this.dayTime * Math.PI * 2;
    const sunDist = 120;
    const sunX = Math.cos(sunAngle) * sunDist;
    const sunY = Math.sin(sunAngle) * sunDist;

    if (this.sunMesh && this.moonMesh) {
      this.sunMesh.position.set(this.player.x + sunX, this.player.y + sunY, this.player.z);
      this.moonMesh.position.set(this.player.x - sunX, this.player.y - sunY, this.player.z);
    }
    this.sunLight.position.set(this.player.x + sunX, this.player.y + sunY, this.player.z + 30);

    const timeLabel = document.getElementById('timeText');
    if (sunY > 20) {
      // Day
      this.scene.background.setHex(0x78a7ff);
      this.scene.fog.color.setHex(0x78a7ff);
      this.ambientLight.intensity = 0.7;
      if (timeLabel) timeLabel.textContent = 'Siang Hari';
    } else if (sunY > -15) {
      // Sunset / Sunrise
      this.scene.background.setHex(0xe28d44);
      this.scene.fog.color.setHex(0xe28d44);
      this.ambientLight.intensity = 0.5;
      if (timeLabel) timeLabel.textContent = 'Senja / Fajar';
    } else {
      // Night
      this.scene.background.setHex(0x080c16);
      this.scene.fog.color.setHex(0x080c16);
      this.ambientLight.intensity = 0.25;
      if (timeLabel) timeLabel.textContent = 'Malam Hari (Hati-hati Monster!)';
    }

    if (this.isPointerLocked && !this.isInventoryOpen) {
      this.updatePlayerPhysics(dt);
      this.updateMining(dt);
      this.updateArrows(dt);
      this.updateMobs(dt);
    }

    this.updateCamera();
    this.updateHighlightAndRaycast();
    this.updateHeldItemAnimation(dt);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((t) => this.loop(t));
  }

  // -----------------------------------------------------------
  // PHYSICS & COLLISION DETECTION
  // -----------------------------------------------------------
  updatePlayerPhysics(dt) {
    const { player, keys } = this;

    // Movement Direction relative to camera yaw
    let moveX = 0;
    let moveZ = 0;

    if (keys['KeyW']) moveZ -= 1;
    if (keys['KeyS']) moveZ += 1;
    if (keys['KeyA']) moveX -= 1;
    if (keys['KeyD']) moveX += 1;

    // Normalize
    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
      player.handBob += dt * 10;
    }

    const baseSpeed = player.isSneaking ? 2.2 : 5.0;
    const sinYaw = Math.sin(player.yaw);
    const cosYaw = Math.cos(player.yaw);

    // World velocities
    player.vx = (moveX * cosYaw + moveZ * sinYaw) * baseSpeed;
    player.vz = (-moveX * sinYaw + moveZ * cosYaw) * baseSpeed;

    // Jump
    if (keys['Space'] && player.isGrounded) {
      player.vy = 8.5;
      player.isGrounded = false;
      this.audio.playDig('dirt');
    }

    // Gravity
    player.vy -= 22 * dt;
    if (player.vy < -25) player.vy = -25; // Terminal velocity

    // Integrate with Voxel AABB Collisions
    this.movePlayerWithCollision(player.vx * dt, player.vy * dt, player.vz * dt);

    // Fall out of world safeguard
    if (player.y < -5) {
      player.x = 16;
      player.y = 18;
      player.z = 16;
      player.vy = 0;
    }

    // Update Debug text
    document.getElementById('posText').textContent = `X: ${Math.floor(player.x)}, Y: ${Math.floor(player.y)}, Z: ${Math.floor(player.z)}`;
  }

  movePlayerWithCollision(dx, dy, dz) {
    const p = this.player;
    const halfW = p.width / 2;

    // Y Axis Collision (Vertical)
    p.y += dy;
    let bMinX = Math.floor(p.x - halfW);
    let bMaxX = Math.floor(p.x + halfW);
    let bMinZ = Math.floor(p.z - halfW);
    let bMaxZ = Math.floor(p.z + halfW);

    if (dy < 0) {
      // Falling down
      const footY = Math.floor(p.y);
      p.isGrounded = false;

      for (let x = bMinX; x <= bMaxX; x++) {
        for (let z = bMinZ; z <= bMaxZ; z++) {
          if (this.getBlock(x, footY, z) !== BLOCKS.AIR) {
            p.y = footY + 1;
            p.vy = 0;
            p.isGrounded = true;
            break;
          }
        }
      }
    } else if (dy > 0) {
      // Jumping up into ceiling
      const headY = Math.floor(p.y + p.height);
      for (let x = bMinX; x <= bMaxX; x++) {
        for (let z = bMinZ; z <= bMaxZ; z++) {
          if (this.getBlock(x, headY, z) !== BLOCKS.AIR) {
            p.y = headY - p.height - 0.01;
            p.vy = 0;
            break;
          }
        }
      }
    }

    // X Axis Collision (Horizontal)
    p.x += dx;
    let bMinY = Math.floor(p.y);
    let bMaxY = Math.floor(p.y + p.height - 0.1);
    bMinZ = Math.floor(p.z - halfW);
    bMaxZ = Math.floor(p.z + halfW);

    if (dx > 0) {
      const checkX = Math.floor(p.x + halfW);
      for (let y = bMinY; y <= bMaxY; y++) {
        for (let z = bMinZ; z <= bMaxZ; z++) {
          if (this.getBlock(checkX, y, z) !== BLOCKS.AIR) {
            p.x = checkX - halfW - 0.005;
            break;
          }
        }
      }
    } else if (dx < 0) {
      const checkX = Math.floor(p.x - halfW);
      for (let y = bMinY; y <= bMaxY; y++) {
        for (let z = bMinZ; z <= bMaxZ; z++) {
          if (this.getBlock(checkX, y, z) !== BLOCKS.AIR) {
            p.x = checkX + 1 + halfW + 0.005;
            break;
          }
        }
      }
    }

    // Z Axis Collision (Horizontal)
    p.z += dz;
    bMinX = Math.floor(p.x - halfW);
    bMaxX = Math.floor(p.x + halfW);

    if (dz > 0) {
      const checkZ = Math.floor(p.z + halfW);
      for (let y = bMinY; y <= bMaxY; y++) {
        for (let x = bMinX; x <= bMaxX; x++) {
          if (this.getBlock(x, y, checkZ) !== BLOCKS.AIR) {
            p.z = checkZ - halfW - 0.005;
            break;
          }
        }
      }
    } else if (dz < 0) {
      const checkZ = Math.floor(p.z - halfW);
      for (let y = bMinY; y <= bMaxY; y++) {
        for (let x = bMinX; x <= bMaxX; x++) {
          if (this.getBlock(x, y, checkZ) !== BLOCKS.AIR) {
            p.z = checkZ + 1 + halfW + 0.005;
            break;
          }
        }
      }
    }
  }

  // -----------------------------------------------------------
  // MINING / BLOCK BREAKING LOGIC
  // -----------------------------------------------------------
  updateMining(dt) {
    if (!this.isMining) return;

    const ray = this.raycastBlock();
    if (!ray || ray.blockId === BLOCKS.BEDROCK) {
      this.isMining = false;
      this.miningProgress = 0;
      document.getElementById('breakProgressContainer').style.display = 'none';
      return;
    }

    // Play periodic dig sound
    if (Math.random() < 0.18) {
      this.audio.playDig(ray.info.sound);
    }

    // Calculate mining speed based on tool held
    const held = this.player.hotbar[this.player.selectedSlot];
    let speed = 1.0;
    if (held && held.isTool) {
      if (held.toolType === 'pickaxe' && ray.info.sound === 'stone') speed = 3.5;
    }

    const hardness = ray.info.hardness;
    this.miningProgress += (dt * speed) / hardness;

    const progressBar = document.getElementById('breakProgressBar');
    const container = document.getElementById('breakProgressContainer');
    container.style.display = 'block';
    progressBar.style.width = `${Math.min(100, this.miningProgress * 100)}%`;

    // Block completely broken!
    if (this.miningProgress >= 1.0) {
      this.setBlock(ray.pos.x, ray.pos.y, ray.pos.z, BLOCKS.AIR);
      this.audio.playBreak();

      // Drop item into inventory
      if (ray.info.drop) {
        this.addItemToInventory({
          id: `block_${ray.info.drop}`,
          name: BLOCK_INFO[ray.info.drop].name,
          isBlock: true,
          blockId: ray.info.drop,
          count: 1,
          icon: BLOCK_INFO[ray.info.drop].icon
        });
        this.updateHotbarUI();
        this.updateHeldItemVisual();
      }

      this.isMining = false;
      this.miningProgress = 0;
      container.style.display = 'none';
    }
  }

  // -----------------------------------------------------------
  // ARROW PROJECTILES PHYSICS
  // -----------------------------------------------------------
  updateArrows(dt) {
    this.arrows.forEach((arrow) => {
      if (arrow.stuck) return;

      arrow.mesh.position.add(arrow.velocity.clone().multiplyScalar(dt));
      arrow.velocity.y -= 14 * dt; // Gravity

      // Align arrow rotation to velocity
      arrow.mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        arrow.velocity.clone().normalize()
      );

      // Check collision with blocks
      const bx = Math.floor(arrow.mesh.position.x);
      const by = Math.floor(arrow.mesh.position.y);
      const bz = Math.floor(arrow.mesh.position.z);

      if (this.getBlock(bx, by, bz) !== BLOCKS.AIR) {
        arrow.stuck = true;
        this.audio.playHit();
      }

      // Check collision with mobs
      for (const mob of this.mobs) {
        const dist = arrow.mesh.position.distanceTo(new THREE.Vector3(mob.x, mob.y + 0.8, mob.z));
        if (dist < 0.8) {
          arrow.stuck = true;
          this.audio.playHit();
          mob.hp -= 15;
          mob.vy = 2.5;

          if (mob.hp <= 0) {
            this.onMobDefeated(mob);
          }
          break;
        }
      }
    });
  }

  // -----------------------------------------------------------
  // MOBS WANDER & CHASE AI
  // -----------------------------------------------------------
  updateMobs(dt) {
    this.mobs.forEach((mob) => {
      mob.changeDirTimer -= dt;

      if (mob.type === 'zombie') {
        // Chase player if close
        const distToPlayer = Math.hypot(this.player.x - mob.x, this.player.z - mob.z);
        if (distToPlayer < 12) {
          const dx = this.player.x - mob.x;
          const dz = this.player.z - mob.z;
          const d = Math.hypot(dx, dz);
          mob.dirX = (dx / d) * 2.2;
          mob.dirZ = (dz / d) * 2.2;

          // Attack player if within reach
          if (distToPlayer < 1.3 && mob.attackCooldown <= 0) {
            this.player.hp = Math.max(0, this.player.hp - 3);
            this.audio.playHit();
            this.updateHUD();
            mob.attackCooldown = 1.2;

            if (this.player.hp <= 0) {
              alert('Kamu telah gugur! Memuat ulang di titik awal...');
              this.player.x = 16;
              this.player.y = 18;
              this.player.z = 16;
              this.player.hp = this.player.maxHp;
              this.updateHUD();
            }
          }
        } else if (mob.changeDirTimer <= 0) {
          mob.dirX = (Math.random() - 0.5) * 1.5;
          mob.dirZ = (Math.random() - 0.5) * 1.5;
          mob.changeDirTimer = 3 + Math.random() * 3;
        }
      } else {
        // Pig peaceful wander
        if (mob.changeDirTimer <= 0) {
          mob.dirX = (Math.random() - 0.5) * 1.2;
          mob.dirZ = (Math.random() - 0.5) * 1.2;
          mob.changeDirTimer = 2.5 + Math.random() * 3;
        }
      }

      if (mob.attackCooldown > 0) mob.attackCooldown -= dt;

      // Move mob
      mob.x += mob.dirX * dt;
      mob.z += mob.dirZ * dt;

      // Keep mob on ground
      let groundY = Math.floor(mob.y);
      while (groundY > 0 && this.getBlock(Math.floor(mob.x), groundY, Math.floor(mob.z)) === BLOCKS.AIR) {
        groundY--;
      }
      mob.y = groundY + 1;

      mob.mesh.position.set(mob.x, mob.y, mob.z);
      mob.mesh.rotation.y = Math.atan2(mob.dirX, mob.dirZ);
    });
  }

  // -----------------------------------------------------------
  // CAMERA, HIGHLIGHT RAYCAST & HELD ITEM ANIMATION
  // -----------------------------------------------------------
  updateCamera() {
    this.camera.position.set(this.player.x, this.player.y + 1.62, this.player.z);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.player.yaw;
    this.camera.rotation.x = this.player.pitch;
  }

  updateHighlightAndRaycast() {
    const ray = this.raycastBlock();
    if (ray) {
      this.highlightBox.position.set(ray.pos.x + 0.5, ray.pos.y + 0.5, ray.pos.z + 0.5);
      this.highlightBox.visible = true;
      document.getElementById('targetBlockText').textContent = ray.info.name;
    } else {
      this.highlightBox.visible = false;
      document.getElementById('targetBlockText').textContent = 'Udara';
    }
  }

  updateHeldItemAnimation(dt) {
    if (!this.handGroup) return;

    // Walking bobbing
    const bobY = Math.sin(this.player.handBob) * 0.025;
    const bobX = Math.cos(this.player.handBob * 0.5) * 0.02;

    this.handGroup.position.set(bobX, bobY, 0);

    // Attack Swing Animation
    if (this.player.isAttacking) {
      this.player.attackTimer -= dt * 60;
      const swingRot = Math.sin((10 - this.player.attackTimer) * 0.3) * 0.8;
      this.swordMesh.rotation.x = -0.6 - swingRot;
      this.armMesh.rotation.x = -0.3 - swingRot;

      if (this.player.attackTimer <= 0) {
        this.player.isAttacking = false;
        this.swordMesh.rotation.x = -0.6;
        this.armMesh.rotation.x = -0.3;
      }
    }
  }
}

// -------------------------------------------------------------
// START MINECRAFT ON DOM LOADED
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  window.mc = new MinecraftGame();
});
