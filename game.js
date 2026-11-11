/**
 * ===================================================================
 * STICKMAN: SHADOW RECKONING - GAME ENGINE
 * Complete 2D Action Platformer with Story, Attributes, 2 Weapons,
 * Dash/Stamina, Enemies, Buildings & Obstacles.
 * ===================================================================
 */

// -------------------------------------------------------------
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// -------------------------------------------------------------
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSwordSlash() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  playBowShoot() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playArrowHit() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playDash() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(650, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playJump() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  playHitHurt() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.19);
  }

  playCoin() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playVictory() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.12);
      osc.stop(this.ctx.currentTime + i * 0.12 + 0.36);
    });
  }
}

// -------------------------------------------------------------
// 2. STORY NARRATIVE DEFINITIONS
// -------------------------------------------------------------
const storyChapters = {
  1: {
    speaker: "Ksatria Stickman",
    role: "Pemberontak Kerajaan",
    text: "Desa kelahiranku telah dibakar oleh Pasukan Bayangan. Gerbang Benteng depan dijaga ketat oleh prajurit bersenjata. Bagaimana rencana penyusupan kita?",
    choices: [
      {
        text: "Serang Gerbang Depan Secara Terbuka!",
        tag: "+Bonus 100 EXP & Pertarungan Sengit",
        effect: (game) => {
          game.player.exp += 100;
          game.showFloatingText(game.player.x, game.player.y - 40, "+100 EXP!", "#22d3ee");
        }
      },
      {
        text: "Menyusup Diam-Diam Melalui Atap Rumah & Menara",
        tag: "+1 Poin Atribut & Serangan Senyap",
        effect: (game) => {
          game.player.statPoints += 1;
          game.updateHud();
          game.showFloatingText(game.player.x, game.player.y - 40, "+1 Poin Atribut!", "#f59e0b");
        }
      }
    ]
  },
  2: {
    speaker: "Pengintai Rahasia",
    role: "Mata-mata Sekutu",
    text: "Ksatria! Kamu berhasil mencapai Tembok Benteng. Di sini banyak menara pengawas, jebakan duri, dan prajurit berprisai berat. Pilihlah taktik terbaikmu:",
    choices: [
      {
        text: "Gunakan Taktik Panah Jarak Jauh dari Puncak Menara",
        tag: "+Bonus 50 Gold & Tambah Kecepatan Panah",
        effect: (game) => {
          game.player.coins += 50;
          game.player.attributes.bow += 1;
          game.updateHud();
          game.showFloatingText(game.player.x, game.player.y - 40, "Panah Ditingkatkan!", "#38bdf8");
        }
      },
      {
        text: "Terobos Pertahanan dengan Tebasan Pedang Jarak Dekat",
        tag: "+Bonus 30 Darah Maksimum (HP)",
        effect: (game) => {
          game.player.maxHp += 30;
          game.player.hp = game.player.maxHp;
          game.updateHud();
          game.showFloatingText(game.player.x, game.player.y - 40, "+30 Max HP!", "#ef4444");
        }
      }
    ]
  },
  3: {
    speaker: "Jenderal Bayangan Kurawa",
    role: "Panglima Tertinggi Pasukan Kegelapan",
    text: "Hahaha! Kau berani menginjakkan kaki di Ruang Tahta ini, Stickman kecil? Seluruh kerajaan kini berada dalam kendali bayanganku!",
    choices: [
      {
        text: "\"Bebaskan rakyat kerajaan sekarang juga, atau rasakan pedangku!\"",
        tag: "+Buff Damage Serangan Pedang (+15 DMG)",
        effect: (game) => {
          game.player.attributes.sword += 2;
          game.showFloatingText(game.player.x, game.player.y - 40, "Pedang Berapi Aktif!", "#f59e0b");
        }
      },
      {
        text: "\"Aku akan memutus rantai kegelapanmu dari jarak jauh!\"",
        tag: "+Buff Stamina Penuh & Kecepatan Lari",
        effect: (game) => {
          game.player.attributes.agility += 2;
          game.player.stamina = game.player.maxStamina;
          game.showFloatingText(game.player.x, game.player.y - 40, "Kecepatan Bertambah!", "#10b981");
        }
      }
    ]
  }
};

// -------------------------------------------------------------
// 3. MAIN GAME CLASS
// -------------------------------------------------------------
class StickmanGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new SoundEngine();

    // Virtual canvas resolution
    this.width = 1280;
    this.height = 720;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Game state
    this.isRunning = false;
    this.isPaused = false;
    this.inDialogue = false;
    this.currentChapter = 1;
    this.maxChapters = 3;

    // Camera
    this.camera = { x: 0, y: 0 };

    // Player Data & Attributes
    this.player = {
      x: 100,
      y: 500,
      vx: 0,
      vy: 0,
      width: 24,
      height: 60,
      facing: 1, // 1: right, -1: left
      isGrounded: false,
      isClimbing: false,
      isDashing: false,
      dashTimer: 0,
      dashDuration: 14,
      dashCooldown: 0,
      iFrames: 0,
      hp: 120,
      maxHp: 120,
      stamina: 100,
      maxStamina: 100,
      level: 1,
      exp: 0,
      nextExp: 150,
      coins: 0,
      statPoints: 2,
      activeWeapon: 'sword', // 'sword' | 'bow'
      attackCooldown: 0,
      isAttacking: false,
      attackTimer: 0,
      bowCharge: 0,
      isChargingBow: false,
      walkCycle: 0,
      attributes: {
        vitality: 1,  // +25 Max HP per level
        endurance: 1, // +20 Stamina & faster regen
        sword: 1,     // +8 Melee DMG
        bow: 1,       // +10 Ranged DMG
        agility: 1    // +Movement speed & dash distance
      }
    };

    // Arrays of entities
    this.platforms = [];
    this.buildings = [];
    this.ladders = [];
    this.obstacles = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.exitPortal = null;
    this.boss = null;

    // Inputs
    this.keys = {};
    this.mouse = { x: 0, y: 0, isDown: false, rightDown: false };

    this.initEventListeners();
    this.loadChapter(1);
    this.updateHud();
    this.renderUpgradeModal();

    // Start loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // -----------------------------------------------------------
  // INPUT HANDLING
  // -----------------------------------------------------------
  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.sound.init();
      const code = e.code;
      this.keys[code] = true;

      // Quick weapon toggle with Q
      if (code === 'KeyQ') {
        this.toggleWeapon();
      }
      // Upgrade menu shortcut with C
      if (code === 'KeyC') {
        this.toggleUpgradeModal();
      }
      // Pause shortcut with P or Escape
      if (code === 'KeyP' || code === 'Escape') {
        this.togglePause();
      }
      // Dash shortcut with Shift
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        this.tryDash();
      }
      // Attack shortcut with J (Sword) or K (Bow)
      if (code === 'KeyJ') {
        this.player.activeWeapon = 'sword';
        this.updateHud();
        this.performAttack();
      }
      if (code === 'KeyK') {
        this.player.activeWeapon = 'bow';
        this.updateHud();
        this.performAttack();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse Controls on Canvas
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX + this.camera.x;
      this.mouse.y = (e.clientY - rect.top) * scaleY + this.camera.y;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.sound.init();
      if (this.inDialogue || this.isPaused) return;

      if (e.button === 0) {
        this.mouse.isDown = true;
        this.performAttack();
      } else if (e.button === 2) {
        this.mouse.rightDown = true;
        this.toggleWeapon();
        this.performAttack();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
      this.mouse.rightDown = false;
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // UI Buttons
    document.getElementById('hudWeaponSlot').addEventListener('click', () => this.toggleWeapon());
    document.getElementById('openUpgradeModalBtn').addEventListener('click', () => this.openUpgradeModal());
    document.getElementById('closeUpgradeModalBtn').addEventListener('click', () => this.closeUpgradeModal());
    document.getElementById('closeUpgradeModalBtn2').addEventListener('click', () => this.closeUpgradeModal());
    document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('pauseUpgradeBtn').addEventListener('click', () => {
      this.togglePause();
      this.openUpgradeModal();
    });
    document.getElementById('restartStageBtn').addEventListener('click', () => {
      this.togglePause();
      this.loadChapter(this.currentChapter);
    });
    document.getElementById('retryStageBtn').addEventListener('click', () => {
      document.getElementById('gameOverModal').style.display = 'none';
      this.loadChapter(this.currentChapter);
    });
    document.getElementById('nextStageBtn').addEventListener('click', () => {
      document.getElementById('stageClearModal').style.display = 'none';
      if (this.currentChapter < this.maxChapters) {
        this.loadChapter(this.currentChapter + 1);
      } else {
        alert('Selamat! Anda telah menamatkan seluruh petualangan Stickman: Shadow Reckoning!');
        this.loadChapter(1);
      }
    });

    // Audio button toggle
    const audioBtn = document.getElementById('audioToggleBtn');
    audioBtn.addEventListener('click', () => {
      this.sound.init();
      this.sound.enabled = !this.sound.enabled;
      audioBtn.innerHTML = this.sound.enabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark text-red"></i>';
    });

    // Touch button listeners
    this.setupTouchControls();
  }

  setupTouchControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');
    const btnDash = document.getElementById('btnDash');
    const btnSwitch = document.getElementById('btnSwitch');
    const btnAttack = document.getElementById('btnAttack');

    const bindTouch = (el, onStart, onEnd) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sound.init();
        onStart();
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (onEnd) onEnd();
      });
    };

    bindTouch(btnLeft, () => (this.keys['KeyA'] = true), () => (this.keys['KeyA'] = false));
    bindTouch(btnRight, () => (this.keys['KeyD'] = true), () => (this.keys['KeyD'] = false));
    bindTouch(btnJump, () => (this.keys['KeyW'] = true), () => (this.keys['KeyW'] = false));
    bindTouch(btnDash, () => this.tryDash());
    bindTouch(btnSwitch, () => this.toggleWeapon());
    bindTouch(btnAttack, () => this.performAttack());
  }

  // -----------------------------------------------------------
  // WEAPON & ATTACK ACTIONS
  // -----------------------------------------------------------
  toggleWeapon() {
    this.player.activeWeapon = this.player.activeWeapon === 'sword' ? 'bow' : 'sword';
    this.sound.playSwordSlash();
    this.updateHud();
    this.showFloatingText(
      this.player.x,
      this.player.y - 30,
      this.player.activeWeapon === 'sword' ? 'Pedang Aktif' : 'Panah Aktif',
      '#ffffff'
    );
  }

  performAttack() {
    if (this.player.attackCooldown > 0 || this.inDialogue || this.isPaused) return;

    if (this.player.activeWeapon === 'sword') {
      // Melee Sword Attack
      if (this.player.stamina < 10) {
        this.showFloatingText(this.player.x, this.player.y - 30, 'Stamina Kurang!', '#eab308');
        return;
      }
      this.player.stamina -= 10;
      this.player.isAttacking = true;
      this.player.attackTimer = 14;
      this.player.attackCooldown = 18;
      this.sound.playSwordSlash();

      // Sword hitbox
      const swordReach = 55;
      const swordDamage = 25 + this.player.attributes.sword * 8;
      const attackBox = {
        x: this.player.facing === 1 ? this.player.x : this.player.x - swordReach,
        y: this.player.y - 20,
        width: swordReach,
        height: 60
      };

      // Hit particle
      this.createSlashParticle(this.player.x + this.player.facing * 30, this.player.y, this.player.facing);

      // Check hit on enemies
      this.enemies.forEach((enemy) => {
        if (enemy.hp > 0 && this.checkCollision(attackBox, enemy)) {
          let dmg = swordDamage;
          // Shield guard blocks frontal damage
          if (enemy.type === 'shield' && enemy.facing !== this.player.facing) {
            dmg = Math.floor(dmg * 0.25);
            this.showFloatingText(enemy.x, enemy.y - 20, 'BLOCKED!', '#94a3b8');
            this.sound.playArrowHit();
          } else {
            this.sound.playHitHurt();
            this.createBloodParticles(enemy.x, enemy.y);
            this.showFloatingText(enemy.x, enemy.y - 20, `-${dmg}`, '#ef4444');
          }
          enemy.hp -= dmg;
          enemy.vx = this.player.facing * 6; // Knockback
          enemy.hitFlash = 6;

          if (enemy.hp <= 0) this.onEnemyDefeated(enemy);
        }
      });
    } else {
      // Ranged Bow Attack
      if (this.player.stamina < 15) {
        this.showFloatingText(this.player.x, this.player.y - 30, 'Stamina Kurang!', '#eab308');
        return;
      }
      this.player.stamina -= 15;
      this.player.attackCooldown = 22;
      this.sound.playBowShoot();

      const bowDmg = 35 + this.player.attributes.bow * 10;
      const arrowSpeed = 16 + this.player.attributes.bow * 1.5;

      // Projectile
      this.projectiles.push({
        x: this.player.x + this.player.facing * 20,
        y: this.player.y - 5,
        vx: this.player.facing * arrowSpeed,
        vy: -1.2,
        damage: bowDmg,
        fromPlayer: true,
        stuck: false
      });
    }
  }

  tryDash() {
    if (this.player.dashCooldown > 0 || this.player.isDashing || this.inDialogue) return;

    if (this.player.stamina < 25) {
      this.showFloatingText(this.player.x, this.player.y - 30, 'Stamina Habis!', '#eab308');
      return;
    }

    this.player.stamina -= 25;
    this.player.isDashing = true;
    this.player.dashTimer = this.player.dashDuration;
    this.player.dashCooldown = 35 - this.player.attributes.agility * 2;
    this.player.iFrames = this.player.dashDuration + 2;
    this.sound.playDash();

    // Burst speed in facing direction
    const dashPower = 15 + this.player.attributes.agility * 1.8;
    this.player.vx = this.player.facing * dashPower;

    // Dash trail particles
    this.createDashTrail(this.player.x, this.player.y);
  }

  // -----------------------------------------------------------
  // CHAPTER / LEVEL BUILDER
  // -----------------------------------------------------------
  loadChapter(chapterNum) {
    this.currentChapter = chapterNum;
    this.platforms = [];
    this.buildings = [];
    this.ladders = [];
    this.obstacles = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.boss = null;

    // Reset player position and health
    this.player.x = 80;
    this.player.y = 520;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.hp = this.player.maxHp;
    this.player.stamina = this.player.maxStamina;

    // Base ground across level
    const levelWidth = 3200;
    this.platforms.push({ x: 0, y: 640, width: levelWidth, height: 120, type: 'ground' });

    if (chapterNum === 1) {
      // CHAPTER 1: DESA YANG DITINGGALKAN
      document.getElementById('hudStageTag').textContent = 'CHAPTER 1';
      document.getElementById('hudStageTitle').textContent = 'Desa yang Ditinggalkan';
      document.getElementById('hudStageObjective').innerHTML =
        '<i class="fa-solid fa-crosshairs"></i> Kalahkan penjaga desa & temukan gerbang benteng';

      // Building 1: Rumah Penduduk Kayu
      this.buildings.push({
        x: 350,
        y: 440,
        width: 220,
        height: 200,
        type: 'house',
        name: 'Gubuk Desa'
      });
      // Roof platform
      this.platforms.push({ x: 330, y: 440, width: 260, height: 20, type: 'roof' });
      // Balcony platform
      this.platforms.push({ x: 250, y: 520, width: 90, height: 15, type: 'wood' });

      // Ladder to climb
      this.ladders.push({ x: 575, y: 440, width: 26, height: 200 });

      // Obstacle: Spikes
      this.obstacles.push({ x: 680, y: 620, width: 90, height: 20, type: 'spikes' });

      // Building 2: Menara Pengawas Kayu
      this.buildings.push({
        x: 880,
        y: 300,
        width: 140,
        height: 340,
        type: 'tower',
        name: 'Menara Pengintai'
      });
      this.platforms.push({ x: 860, y: 300, width: 180, height: 20, type: 'roof' });
      this.platforms.push({ x: 880, y: 460, width: 140, height: 16, type: 'wood' });
      this.ladders.push({ x: 890, y: 300, width: 26, height: 340 });

      // Elevated platforms
      this.platforms.push({ x: 1150, y: 480, width: 150, height: 18, type: 'stone' });
      this.platforms.push({ x: 1380, y: 400, width: 160, height: 18, type: 'stone' });

      // Obstacle: Moving Pendulum Blade
      this.obstacles.push({
        x: 1680,
        y: 320,
        width: 30,
        height: 30,
        type: 'pendulum',
        length: 180,
        angle: 0,
        speed: 0.04
      });

      // Building 3: Benteng Depan (End Gate)
      this.buildings.push({
        x: 2100,
        y: 260,
        width: 320,
        height: 380,
        type: 'fortress_gate',
        name: 'Gerbang Tembok Benteng'
      });
      this.platforms.push({ x: 2080, y: 260, width: 360, height: 25, type: 'stone' });

      // Enemies Chapter 1
      this.enemies.push(this.createEnemy('grunt', 500, 420));
      this.enemies.push(this.createEnemy('archer', 940, 280));
      this.enemies.push(this.createEnemy('grunt', 1200, 620));
      this.enemies.push(this.createEnemy('grunt', 1450, 380));
      this.enemies.push(this.createEnemy('shield', 1850, 620));
      this.enemies.push(this.createEnemy('archer', 2200, 240));

      // Exit Portal
      this.exitPortal = { x: 2320, y: 560, width: 50, height: 80 };
    } else if (chapterNum === 2) {
      // CHAPTER 2: TEMBOK BENTENG BAYANGAN
      document.getElementById('hudStageTag').textContent = 'CHAPTER 2';
      document.getElementById('hudStageTitle').textContent = 'Tembok Benteng Bayangan';
      document.getElementById('hudStageObjective').innerHTML =
        '<i class="fa-solid fa-crosshairs"></i> Taklukkan pertahanan menara benteng & jebakan mematikan';

      // Watchtowers & Battlements
      this.buildings.push({ x: 400, y: 240, width: 160, height: 400, type: 'tower', name: 'Menara Barat' });
      this.platforms.push({ x: 380, y: 240, width: 200, height: 20, type: 'stone' });
      this.ladders.push({ x: 410, y: 240, width: 26, height: 400 });

      // Multi-tier walls
      this.platforms.push({ x: 680, y: 460, width: 200, height: 20, type: 'stone' });
      this.platforms.push({ x: 980, y: 360, width: 220, height: 20, type: 'stone' });
      this.platforms.push({ x: 1300, y: 280, width: 240, height: 20, type: 'stone' });

      // Traps
      this.obstacles.push({ x: 620, y: 620, width: 140, height: 20, type: 'spikes' });
      this.obstacles.push({ x: 1100, y: 620, width: 180, height: 20, type: 'spikes' });
      this.obstacles.push({
        x: 1400,
        y: 180,
        width: 30,
        height: 30,
        type: 'pendulum',
        length: 160,
        angle: 0.5,
        speed: 0.05
      });

      // Fortress Main Hall
      this.buildings.push({ x: 1900, y: 200, width: 450, height: 440, type: 'castle', name: 'Kastil Utama' });
      this.platforms.push({ x: 1880, y: 200, width: 490, height: 25, type: 'stone' });

      // Enemies Chapter 2
      this.enemies.push(this.createEnemy('archer', 480, 220));
      this.enemies.push(this.createEnemy('shield', 750, 440));
      this.enemies.push(this.createEnemy('archer', 1050, 340));
      this.enemies.push(this.createEnemy('grunt', 1380, 260));
      this.enemies.push(this.createEnemy('shield', 1700, 620));
      this.enemies.push(this.createEnemy('archer', 2050, 180));
      this.enemies.push(this.createEnemy('shield', 2200, 180));

      this.exitPortal = { x: 2280, y: 560, width: 50, height: 80 };
    } else if (chapterNum === 3) {
      // CHAPTER 3: RUANG TAHTA BOS (JENDERAL BAYANGAN)
      document.getElementById('hudStageTag').textContent = 'CHAPTER 3';
      document.getElementById('hudStageTitle').textContent = 'Ruang Tahta Kegelapan';
      document.getElementById('hudStageObjective').innerHTML =
        '<i class="fa-solid fa-skull"></i> Kalahkan Bos: Jenderal Bayangan Kurawa!';

      // Grand Pillars & Platforms
      this.platforms.push({ x: 300, y: 480, width: 180, height: 20, type: 'stone' });
      this.platforms.push({ x: 1200, y: 480, width: 180, height: 20, type: 'stone' });
      this.platforms.push({ x: 650, y: 380, width: 380, height: 20, type: 'stone' });

      // Boss Throne background building
      this.buildings.push({
        x: 600,
        y: 200,
        width: 480,
        height: 440,
        type: 'throne_room',
        name: 'Tahta Bayangan'
      });

      // Spawn Boss
      this.boss = this.createBoss(850, 600);
      this.enemies.push(this.boss);

      document.getElementById('bossHud').style.display = 'flex';
      document.getElementById('bossName').textContent = 'Jenderal Bayangan Kurawa';
      document.getElementById('bossHpFill').style.width = '100%';
    }

    // Trigger Story Dialogue at start of chapter
    this.triggerStoryDialogue(chapterNum);
  }

  createEnemy(type, x, y) {
    const isShield = type === 'shield';
    const isArcher = type === 'archer';

    return {
      x,
      y,
      vx: 0,
      vy: 0,
      width: 24,
      height: 60,
      type, // 'grunt' | 'archer' | 'shield'
      hp: isShield ? 90 : isArcher ? 45 : 60,
      maxHp: isShield ? 90 : isArcher ? 45 : 60,
      facing: -1,
      attackCooldown: 0,
      patrolStart: x - 100,
      patrolEnd: x + 100,
      hitFlash: 0,
      walkCycle: 0,
      isBoss: false
    };
  }

  createBoss(x, y) {
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      width: 40,
      height: 90,
      type: 'boss',
      hp: 450,
      maxHp: 450,
      facing: -1,
      attackCooldown: 40,
      specialTimer: 180,
      hitFlash: 0,
      walkCycle: 0,
      isBoss: true
    };
  }

  onEnemyDefeated(enemy) {
    // Spawn coins & EXP
    const expGain = enemy.isBoss ? 400 : 35;
    const goldGain = enemy.isBoss ? 150 : 15;

    this.player.exp += expGain;
    this.player.coins += goldGain;
    this.sound.playCoin();

    this.showFloatingText(enemy.x, enemy.y - 30, `+${expGain} EXP`, '#22d3ee');
    this.showFloatingText(enemy.x, enemy.y - 50, `+${goldGain} Gold`, '#f59e0b');

    // Level up check
    while (this.player.exp >= this.player.nextExp) {
      this.player.exp -= this.player.nextExp;
      this.player.level += 1;
      this.player.statPoints += 2;
      this.player.nextExp = Math.floor(this.player.nextExp * 1.4);
      this.player.maxHp += 15;
      this.player.hp = this.player.maxHp;

      this.showFloatingText(this.player.x, this.player.y - 60, 'LEVEL UP!', '#eab308');
      this.sound.playVictory();
    }

    this.updateHud();
    this.renderUpgradeModal();

    // If boss defeated
    if (enemy.isBoss) {
      document.getElementById('bossHud').style.display = 'none';
      setTimeout(() => this.triggerStageClear(), 1000);
    }
  }

  // -----------------------------------------------------------
  // STORY DIALOGUE MODAL
  // -----------------------------------------------------------
  triggerStoryDialogue(chapterNum) {
    const chapterData = storyChapters[chapterNum];
    if (!chapterData) return;

    this.inDialogue = true;
    const overlay = document.getElementById('dialogueOverlay');
    const speakerName = document.getElementById('dialogueSpeakerName');
    const speakerRole = document.getElementById('dialogueSpeakerRole');
    const textEl = document.getElementById('dialogueText');
    const choicesContainer = document.getElementById('dialogueChoicesContainer');

    speakerName.textContent = chapterData.speaker;
    speakerRole.textContent = chapterData.role;
    textEl.textContent = chapterData.text;

    choicesContainer.innerHTML = chapterData.choices
      .map(
        (c, idx) => `
        <button class="dialogue-choice-btn" data-choice-idx="${idx}">
          <span>${c.text}</span>
          <span class="choice-tag">${c.tag}</span>
        </button>
      `
      )
      .join('');

    const btns = choicesContainer.querySelectorAll('.dialogue-choice-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const choiceIdx = parseInt(btn.getAttribute('data-choice-idx'), 10);
        chapterData.choices[choiceIdx].effect(this);
        overlay.style.display = 'none';
        this.inDialogue = false;
        this.updateHud();
      });
    });

    overlay.style.display = 'block';
  }

  // -----------------------------------------------------------
  // STAGE CLEAR & GAME OVER
  // -----------------------------------------------------------
  triggerStageClear() {
    this.sound.playVictory();
    const modal = document.getElementById('stageClearModal');
    document.getElementById('clearedStageName').textContent = `Chapter ${this.currentChapter} Selesai!`;
    document.getElementById('rewardExp').textContent = `+${100 * this.currentChapter} EXP`;
    document.getElementById('rewardGold').textContent = `+${50 * this.currentChapter} Gold`;
    document.getElementById('rewardPoints').textContent = `+2 Poin Atribut`;

    this.player.statPoints += 2;
    this.updateHud();
    this.renderUpgradeModal();
    modal.style.display = 'flex';
  }

  triggerGameOver() {
    this.sound.playHitHurt();
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'flex';
  }

  // -----------------------------------------------------------
  // UPGRADE MODAL & ATTRIBUTE ALLOCATION
  // -----------------------------------------------------------
  openUpgradeModal() {
    this.isPaused = true;
    this.renderUpgradeModal();
    document.getElementById('upgradeModal').style.display = 'flex';
  }

  closeUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'none';
    this.isPaused = false;
  }

  toggleUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal.style.display === 'flex') {
      this.closeUpgradeModal();
    } else {
      this.openUpgradeModal();
    }
  }

  renderUpgradeModal() {
    const { player } = this;
    const modalPoints = document.getElementById('modalStatPoints');
    const modalGold = document.getElementById('modalGold');
    if (modalPoints) modalPoints.textContent = `${player.statPoints} Poin`;
    if (modalGold) modalGold.textContent = `${player.coins} Gold`;

    // Levels and values
    document.getElementById('statHpLevel').textContent = player.attributes.vitality;
    document.getElementById('statHpVal').textContent = `(${player.maxHp} HP)`;

    document.getElementById('statStaminaLevel').textContent = player.attributes.endurance;
    document.getElementById('statStaminaVal').textContent = `(${player.maxStamina} STA)`;

    document.getElementById('statSwordLevel').textContent = player.attributes.sword;
    document.getElementById('statSwordVal').textContent = `(${25 + player.attributes.sword * 8} DMG)`;

    document.getElementById('statBowLevel').textContent = player.attributes.bow;
    document.getElementById('statBowVal').textContent = `(${35 + player.attributes.bow * 10} DMG)`;

    document.getElementById('statAgilityLevel').textContent = player.attributes.agility;
    document.getElementById('statAgilityVal').textContent = `(Speed ${(5 + player.attributes.agility * 0.4).toFixed(1)})`;

    // Enable/disable upgrade buttons
    const btns = document.querySelectorAll('.btn-upgrade');
    btns.forEach((btn) => {
      btn.disabled = player.statPoints <= 0;
      btn.onclick = () => {
        const stat = btn.getAttribute('data-stat');
        this.upgradeAttribute(stat);
      };
    });
  }

  upgradeAttribute(statName) {
    if (this.player.statPoints <= 0) return;

    this.player.statPoints -= 1;
    this.player.attributes[statName] += 1;

    // Apply immediate attribute bonuses
    if (statName === 'vitality') {
      this.player.maxHp += 25;
      this.player.hp += 25;
    } else if (statName === 'endurance') {
      this.player.maxStamina += 20;
      this.player.stamina = this.player.maxStamina;
    }

    this.sound.playCoin();
    this.updateHud();
    this.renderUpgradeModal();
    this.showFloatingText(this.player.x, this.player.y - 40, `${statName.toUpperCase()} UP!`, '#22d3ee');
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    document.getElementById('pauseModal').style.display = this.isPaused ? 'flex' : 'none';
  }

  updateHud() {
    const { player } = this;
    // HP
    const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    document.getElementById('hudHpFill').style.width = `${hpPercent}%`;
    document.getElementById('hudHpText').textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;

    // Stamina
    const staPercent = Math.max(0, Math.min(100, (player.stamina / player.maxStamina) * 100));
    document.getElementById('hudStaminaFill').style.width = `${staPercent}%`;
    document.getElementById('hudStaminaText').textContent = `${Math.ceil(player.stamina)} / ${player.maxStamina}`;

    // Level, Coins, Points
    document.getElementById('hudPlayerLevel').textContent = `Lv. ${player.level}`;
    document.getElementById('hudCoins').textContent = player.coins;

    const pointsBadge = document.getElementById('hudStatPointsBadge');
    pointsBadge.textContent = player.statPoints;
    pointsBadge.classList.toggle('has-points', player.statPoints > 0);

    // Weapon slot
    const weaponName = document.getElementById('hudWeaponName');
    const weaponIcon = document.getElementById('hudWeaponIcon');
    if (player.activeWeapon === 'sword') {
      weaponName.textContent = 'Pedang Bayangan';
      weaponIcon.innerHTML = '<i class="fa-solid fa-khanda"></i>';
    } else {
      weaponName.textContent = 'Busur Elven';
      weaponIcon.innerHTML = '<i class="fa-solid fa-bullseye"></i>';
    }
  }

  // -----------------------------------------------------------
  // MAIN GAME LOOP (UPDATE & RENDER)
  // -----------------------------------------------------------
  gameLoop(currentTime) {
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (!this.isPaused && !this.inDialogue) {
      this.update();
    }

    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update() {
    const { player, keys } = this;

    // 1. Stamina Regeneration
    const regenRate = 0.45 + player.attributes.endurance * 0.1;
    if (player.stamina < player.maxStamina && !player.isDashing) {
      player.stamina = Math.min(player.maxStamina, player.stamina + regenRate);
    }

    // 2. Dash Timer & Cooldowns
    if (player.dashTimer > 0) {
      player.dashTimer--;
      if (player.dashTimer === 0) player.isDashing = false;
    }
    if (player.dashCooldown > 0) player.dashCooldown--;
    if (player.attackCooldown > 0) player.attackCooldown--;
    if (player.attackTimer > 0) player.attackTimer--;
    if (player.iFrames > 0) player.iFrames--;

    // 3. Movement
    const baseSpeed = 5.0 + player.attributes.agility * 0.4;

    if (!player.isDashing) {
      let moveDir = 0;
      if (keys['KeyA'] || keys['ArrowLeft']) {
        moveDir = -1;
        player.facing = -1;
      }
      if (keys['KeyD'] || keys['ArrowRight']) {
        moveDir = 1;
        player.facing = 1;
      }

      player.vx = moveDir * baseSpeed;
      if (moveDir !== 0 && player.isGrounded) {
        player.walkCycle += 0.25;
      }

      // Check ladder climbing
      player.isClimbing = false;
      this.ladders.forEach((ladder) => {
        if (
          player.x + player.width > ladder.x &&
          player.x < ladder.x + ladder.width &&
          player.y + player.height > ladder.y &&
          player.y < ladder.y + ladder.height
        ) {
          if (keys['KeyW'] || keys['ArrowUp']) {
            player.isClimbing = true;
            player.vy = -4.5;
          } else if (keys['KeyS'] || keys['ArrowDown']) {
            player.isClimbing = true;
            player.vy = 4.5;
          }
        }
      });

      // Jump (if grounded and not climbing)
      if ((keys['KeyW'] || keys['ArrowUp'] || keys['Space']) && player.isGrounded && !player.isClimbing) {
        player.vy = -14.5;
        player.isGrounded = false;
        this.sound.playJump();
        this.createJumpDust(player.x, player.y + player.height);
      }

      // Gravity
      if (!player.isClimbing) {
        player.vy += 0.75; // gravity
        if (player.vy > 18) player.vy = 18; // terminal velocity
      }
    }

    // Apply Player Velocity
    player.x += player.vx;
    player.y += player.vy;

    // Platform Collisions
    player.isGrounded = false;
    this.platforms.forEach((plat) => {
      // Top collision (Landing)
      if (
        player.x + player.width > plat.x &&
        player.x < plat.x + plat.width &&
        player.y + player.height >= plat.y &&
        player.y + player.height <= plat.y + 25 &&
        player.vy >= 0
      ) {
        player.y = plat.y - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }
    });

    // Obstacles Collision (Spikes, Pendulums)
    this.obstacles.forEach((obs) => {
      if (obs.type === 'spikes') {
        if (
          player.x + player.width > obs.x &&
          player.x < obs.x + obs.width &&
          player.y + player.height >= obs.y &&
          player.y <= obs.y + obs.height
        ) {
          this.hurtPlayer(25, -player.facing * 5);
        }
      } else if (obs.type === 'pendulum') {
        obs.angle += obs.speed;
        const bladeX = obs.x + Math.sin(obs.angle) * obs.length;
        const bladeY = obs.y + Math.cos(obs.angle) * obs.length;
        const dist = Math.hypot(player.x + player.width / 2 - bladeX, player.y + player.height / 2 - bladeY);
        if (dist < 35) {
          this.hurtPlayer(30, Math.sin(obs.angle) * 8);
        }
      }
    });

    // Exit Portal Trigger (Next Stage)
    if (this.exitPortal) {
      if (
        player.x + player.width > this.exitPortal.x &&
        player.x < this.exitPortal.x + this.exitPortal.width &&
        player.y + player.height > this.exitPortal.y
      ) {
        this.triggerStageClear();
      }
    }

    // Camera follow player with smooth lerp
    const targetCamX = player.x - this.width / 2 + 100;
    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    if (this.camera.x < 0) this.camera.x = 0;

    // 4. Update Enemies AI
    this.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;

      if (enemy.hitFlash > 0) enemy.hitFlash--;
      if (enemy.attackCooldown > 0) enemy.attackCooldown--;

      const distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      const inSight = distToPlayer < 450;

      if (enemy.isBoss) {
        // Boss Logic
        if (player.x < enemy.x) enemy.facing = -1;
        else enemy.facing = 1;

        if (distToPlayer > 80 && distToPlayer < 700) {
          enemy.vx = enemy.facing * 2.8;
          enemy.walkCycle += 0.2;
        } else {
          enemy.vx = 0;
        }

        // Boss Attack
        if (distToPlayer < 120 && enemy.attackCooldown === 0) {
          enemy.attackCooldown = 55;
          this.hurtPlayer(35, enemy.facing * 8);
          this.sound.playSwordSlash();
        }

        // Update Boss HP HUD
        const bossHpBar = document.getElementById('bossHpFill');
        if (bossHpBar) {
          bossHpBar.style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;
        }
      } else if (enemy.type === 'archer') {
        // Archer AI: Stay at distance, shoot arrows
        if (inSight) {
          enemy.facing = player.x < enemy.x ? -1 : 1;
          if (distToPlayer < 200) {
            enemy.vx = -enemy.facing * 2.5; // Back away
          } else {
            enemy.vx = 0;
          }

          if (enemy.attackCooldown === 0 && distToPlayer < 500) {
            enemy.attackCooldown = 85;
            this.sound.playBowShoot();
            this.projectiles.push({
              x: enemy.x + enemy.facing * 20,
              y: enemy.y,
              vx: enemy.facing * 9,
              vy: -1,
              damage: 18,
              fromPlayer: false,
              stuck: false
            });
          }
        }
      } else {
        // Grunt / Shield melee AI
        if (inSight) {
          enemy.facing = player.x < enemy.x ? -1 : 1;
          enemy.vx = enemy.facing * 2.6;
          enemy.walkCycle += 0.2;

          // Attack when close
          if (distToPlayer < 45 && enemy.attackCooldown === 0) {
            enemy.attackCooldown = 60;
            this.hurtPlayer(enemy.type === 'shield' ? 18 : 22, enemy.facing * 5);
            this.sound.playSwordSlash();
          }
        } else {
          // Patrol
          enemy.vx = enemy.facing * 1.5;
          if (enemy.x < enemy.patrolStart) enemy.facing = 1;
          if (enemy.x > enemy.patrolEnd) enemy.facing = -1;
        }
      }

      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
    });

    // 5. Update Projectiles (Arrows)
    this.projectiles.forEach((p, idx) => {
      if (p.stuck) return;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // Arrow gravity

      // Check collision with platforms (Arrow sticks)
      this.platforms.forEach((plat) => {
        if (p.x > plat.x && p.x < plat.x + plat.width && p.y > plat.y && p.y < plat.y + plat.height) {
          p.stuck = true;
          this.sound.playArrowHit();
        }
      });

      // Arrow hits enemies
      if (p.fromPlayer && !p.stuck) {
        this.enemies.forEach((enemy) => {
          if (enemy.hp > 0 && this.checkCollision({ x: p.x - 8, y: p.y - 8, width: 16, height: 16 }, enemy)) {
            p.stuck = true;
            let dmg = p.damage;
            if (enemy.type === 'shield' && enemy.facing !== player.facing) {
              dmg = Math.floor(dmg * 0.2);
              this.showFloatingText(enemy.x, enemy.y - 20, 'BLOCKED!', '#94a3b8');
            } else {
              this.sound.playArrowHit();
              this.createBloodParticles(enemy.x, enemy.y);
              this.showFloatingText(enemy.x, enemy.y - 20, `-${dmg}`, '#22d3ee');
            }
            enemy.hp -= dmg;
            enemy.hitFlash = 6;
            if (enemy.hp <= 0) this.onEnemyDefeated(enemy);
          }
        });
      }

      // Arrow hits player
      if (!p.fromPlayer && !p.stuck) {
        if (this.checkCollision({ x: p.x - 6, y: p.y - 6, width: 12, height: 12 }, player)) {
          p.stuck = true;
          this.hurtPlayer(p.damage, p.vx > 0 ? 4 : -4);
        }
      }
    });

    // Remove old offscreen projectiles
    this.projectiles = this.projectiles.filter((p) => p.x > this.camera.x - 200 && p.x < this.camera.x + this.width + 200);

    // 6. Update Particles & Floating Text
    this.particles.forEach((pt) => pt.update());
    this.particles = this.particles.filter((pt) => pt.life > 0);

    this.floatingTexts.forEach((ft) => ft.update());
    this.floatingTexts = this.floatingTexts.filter((ft) => ft.life > 0);

    this.updateHud();
  }

  hurtPlayer(amount, knockbackX) {
    if (this.player.iFrames > 0) return; // Invulnerable during dash/dodge

    this.player.hp -= amount;
    this.player.iFrames = 25;
    this.player.vx = knockbackX;
    this.player.vy = -4;
    this.sound.playHitHurt();
    this.createBloodParticles(this.player.x, this.player.y);
    this.showFloatingText(this.player.x, this.player.y - 30, `-${amount}`, '#ef4444');

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.triggerGameOver();
    }
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // -----------------------------------------------------------
  // VISUAL EFFECTS & PARTICLES
  // -----------------------------------------------------------
  createBloodParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 3 + 2,
        color: '#dc2626',
        life: 25,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.3;
          this.life--;
        }
      });
    }
  }

  createDashTrail(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + Math.random() * 50,
        vx: -this.player.facing * (Math.random() * 4 + 2),
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 5 + 3,
        color: 'rgba(99, 102, 241, 0.6)',
        life: 18,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life--;
        }
      });
    }
  }

  createJumpDust(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 25,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 2,
        size: Math.random() * 4 + 2,
        color: 'rgba(148, 163, 184, 0.5)',
        life: 16,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life--;
        }
      });
    }
  }

  createSlashParticle(x, y, dir) {
    this.particles.push({
      x,
      y,
      dir,
      radius: 40,
      life: 8,
      update() {
        this.life--;
      },
      render: (ctx, cam) => {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const startA = dir === 1 ? -Math.PI / 3 : (4 * Math.PI) / 3;
        const endA = dir === 1 ? Math.PI / 3 : (2 * Math.PI) / 3;
        ctx.arc(x - cam.x, y - cam.y + 15, 38, startA, endA);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  showFloatingText(x, y, text, color) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      vy: -1.4,
      life: 45,
      update() {
        this.y += this.vy;
        this.life--;
      }
    });
  }

  // -----------------------------------------------------------
  // CANVAS RENDERING
  // -----------------------------------------------------------
  render() {
    const { ctx, camera, width, height } = this;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Parallax Atmospheric Background
    this.renderBackground();

    // 2. Draw Buildings & Structures
    this.renderBuildings();

    // 3. Draw Platforms & Obstacles
    this.renderPlatforms();

    // 4. Draw Ladders
    this.renderLadders();

    // 5. Draw Exit Portal
    if (this.exitPortal) {
      this.renderPortal();
    }

    // 6. Draw Enemies
    this.enemies.forEach((enemy) => {
      if (enemy.hp > 0) this.renderStickman(enemy, false);
    });

    // 7. Draw Player Stickman
    this.renderStickman(this.player, true);

    // 8. Draw Projectiles
    this.renderProjectiles();

    // 9. Draw Particles & Slash Arcs
    this.particles.forEach((pt) => {
      if (pt.render) {
        pt.render(ctx, camera);
      } else {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x - camera.x, pt.y - camera.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 10. Draw Floating Numbers
    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x - camera.x, ft.y - camera.y);
      ctx.restore();
    });
  }

  renderBackground() {
    const { ctx, camera, width, height } = this;

    // Dark moody gradient sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (this.currentChapter === 1) {
      skyGrad.addColorStop(0, '#0a0d18');
      skyGrad.addColorStop(0.7, '#1f132b');
      skyGrad.addColorStop(1, '#3b1820'); // Burning village glow
    } else if (this.currentChapter === 2) {
      skyGrad.addColorStop(0, '#070b14');
      skyGrad.addColorStop(0.7, '#0f172a');
      skyGrad.addColorStop(1, '#1e293b');
    } else {
      skyGrad.addColorStop(0, '#110c1f');
      skyGrad.addColorStop(0.7, '#1e1136');
      skyGrad.addColorStop(1, '#2d144d'); // Imperial purple throne
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Distant mountain silhouettes (Parallax layer 1)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 120) {
      const hillY = 460 + Math.sin((x + camera.x * 0.2) * 0.005) * 80;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(width, height);
    ctx.fill();

    // Moon / Crimson Sun
    ctx.save();
    ctx.fillStyle = this.currentChapter === 3 ? '#a855f7' : '#f59e0b';
    ctx.shadowColor = this.currentChapter === 3 ? 'rgba(168, 85, 247, 0.8)' : 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(950 - camera.x * 0.05, 160, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderBuildings() {
    const { ctx, camera } = this;
    this.buildings.forEach((b) => {
      const rx = b.x - camera.x;
      const ry = b.y - camera.y;

      // Draw Main Structure Walls
      ctx.fillStyle = b.type === 'house' ? '#261b17' : '#1e2638';
      ctx.fillRect(rx, ry, b.width, b.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, b.width, b.height);

      // Windows
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.fillRect(rx + 30, ry + 40, 36, 40);
      ctx.strokeRect(rx + 30, ry + 40, 36, 40);

      if (b.width > 160) {
        ctx.fillRect(rx + b.width - 66, ry + 40, 36, 40);
        ctx.strokeRect(rx + b.width - 66, ry + 40, 36, 40);
      }

      // Wooden beams / Fortress stonework lines
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      for (let y = ry + 60; y < ry + b.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(rx, y);
        ctx.lineTo(rx + b.width, y);
        ctx.stroke();
      }

      // Building Name Sign
      ctx.save();
      ctx.font = '11px "Cinzel", serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(b.name, rx + 15, ry + 22);
      ctx.restore();
    });
  }

  renderPlatforms() {
    const { ctx, camera } = this;
    this.platforms.forEach((p) => {
      const rx = p.x - camera.x;
      const ry = p.y - camera.y;

      if (p.type === 'ground') {
        // Deep stone earth
        const groundGrad = ctx.createLinearGradient(0, ry, 0, ry + p.height);
        groundGrad.addColorStop(0, '#1e293b');
        groundGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(rx, ry, p.width, p.height);

        // Grass/Trim on top
        ctx.fillStyle = this.currentChapter === 1 ? '#451a03' : '#334155';
        ctx.fillRect(rx, ry, p.width, 6);
      } else {
        // Floating platform / roof
        ctx.fillStyle = p.type === 'wood' ? '#3e2723' : '#1e293b';
        ctx.fillRect(rx, ry, p.width, p.height);
        ctx.strokeStyle = p.type === 'wood' ? '#5d4037' : '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry, p.width, p.height);
      }
    });

    // Render Obstacles
    this.obstacles.forEach((obs) => {
      const rx = obs.x - camera.x;
      const ry = obs.y - camera.y;

      if (obs.type === 'spikes') {
        // Draw triangular spikes
        ctx.fillStyle = '#94a3b8';
        const numSpikes = Math.floor(obs.width / 15);
        for (let i = 0; i < numSpikes; i++) {
          ctx.beginPath();
          ctx.moveTo(rx + i * 15, ry + obs.height);
          ctx.lineTo(rx + i * 15 + 7.5, ry);
          ctx.lineTo(rx + (i + 1) * 15, ry + obs.height);
          ctx.fill();
        }
      } else if (obs.type === 'pendulum') {
        const bladeX = obs.x + Math.sin(obs.angle) * obs.length;
        const bladeY = obs.y + Math.cos(obs.angle) * obs.length;

        // Chain
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(obs.x - camera.x, obs.y - camera.y);
        ctx.lineTo(bladeX - camera.x, bladeY - camera.y);
        ctx.stroke();

        // Rotating Blade
        ctx.save();
        ctx.translate(bladeX - camera.x, bladeY - camera.y);
        ctx.rotate(obs.angle * 4);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, -28, 8, 56);
        ctx.fillRect(-28, -4, 56, 8);
        ctx.restore();
      }
    });
  }

  renderLadders() {
    const { ctx, camera } = this;
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;

    this.ladders.forEach((lad) => {
      const rx = lad.x - camera.x;
      const ry = lad.y - camera.y;

      // Two side rails
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx, ry + lad.height);
      ctx.moveTo(rx + lad.width, ry);
      ctx.lineTo(rx + lad.width, ry + lad.height);
      ctx.stroke();

      // Rungs
      for (let y = ry + 15; y < ry + lad.height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(rx, y);
        ctx.lineTo(rx + lad.width, y);
        ctx.stroke();
      }
    });
  }

  renderPortal() {
    const { ctx, camera, exitPortal } = this;
    const rx = exitPortal.x - camera.x;
    const ry = exitPortal.y - camera.y;

    ctx.save();
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 25;
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(rx, ry, exitPortal.width, exitPortal.height);

    ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.fillRect(rx, ry, exitPortal.width, exitPortal.height);

    ctx.font = 'bold 12px "Plus Jakarta Sans"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('GERBANG', rx - 6, ry - 10);
    ctx.restore();
  }

  // -----------------------------------------------------------
  // PROCEDURAL STICKMAN ANIMATION & RENDERING
  // -----------------------------------------------------------
  renderStickman(char, isPlayer) {
    const { ctx, camera } = this;
    const rx = char.x - camera.x + char.width / 2;
    const ry = char.y - camera.y + 15;
    const facing = char.facing;

    ctx.save();

    // Hit Flash
    if (char.hitFlash && char.hitFlash > 0) {
      ctx.filter = 'brightness(2.5)';
    }

    // Shadow Aura for Boss
    if (char.isBoss) {
      ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
      ctx.shadowBlur = 20;
    }

    // Color definitions
    let strokeColor = '#ffffff'; // Player white
    if (!isPlayer) {
      if (char.type === 'grunt') strokeColor = '#f87171'; // Red grunt
      if (char.type === 'archer') strokeColor = '#38bdf8'; // Cyan archer
      if (char.type === 'shield') strokeColor = '#eab308'; // Yellow shield
      if (char.type === 'boss') strokeColor = '#c084fc'; // Purple boss
    }

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.lineWidth = char.isBoss ? 4.5 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const headRadius = char.isBoss ? 14 : 9;
    const torsoLength = char.isBoss ? 38 : 24;

    // 1. Head
    ctx.beginPath();
    ctx.arc(rx, ry, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Headband / Ninja Bandana for Player
    if (isPlayer) {
      ctx.strokeStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(rx - headRadius, ry);
      ctx.lineTo(rx + headRadius, ry);
      ctx.stroke();
      // Flowing tail behind head
      ctx.beginPath();
      ctx.moveTo(rx - facing * headRadius, ry);
      ctx.lineTo(rx - facing * (headRadius + 14), ry + 4);
      ctx.stroke();
      ctx.strokeStyle = strokeColor;
    }

    // 2. Torso
    const torsoBottomY = ry + headRadius + torsoLength;
    ctx.beginPath();
    ctx.moveTo(rx, ry + headRadius);
    ctx.lineTo(rx, torsoBottomY);
    ctx.stroke();

    // 3. Legs with walking swing kinematics
    const legSwing = Math.sin(char.walkCycle) * 12;
    const leg1X = rx + (char.vx !== 0 ? legSwing : 5);
    const leg2X = rx - (char.vx !== 0 ? legSwing : 5);
    const footY = ry + headRadius + torsoLength + (char.isBoss ? 32 : 20);

    // Left Leg
    ctx.beginPath();
    ctx.moveTo(rx, torsoBottomY);
    ctx.lineTo(leg1X, footY);
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(rx, torsoBottomY);
    ctx.lineTo(leg2X, footY);
    ctx.stroke();

    // 4. Arms & Weapons
    const shoulderY = ry + headRadius + 6;
    const weapon = isPlayer ? char.activeWeapon : char.type === 'archer' ? 'bow' : 'sword';

    if (weapon === 'sword') {
      // Front Arm holding Sword
      let handX = rx + facing * 18;
      let handY = shoulderY + 8;

      if (char.isAttacking) {
        handX = rx + facing * 26;
        handY = shoulderY - 2;
      }

      ctx.beginPath();
      ctx.moveTo(rx, shoulderY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      // Draw Sword
      ctx.save();
      ctx.strokeStyle = isPlayer ? '#818cf8' : '#f87171';
      ctx.lineWidth = char.isBoss ? 4 : 2.5;
      const swordTipX = handX + facing * (char.isBoss ? 42 : 28);
      const swordTipY = char.isAttacking ? handY + 18 : handY - (char.isBoss ? 35 : 24);

      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(swordTipX, swordTipY);
      ctx.stroke();
      ctx.restore();

      // Shield for Shield Enemy
      if (char.type === 'shield') {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(rx + facing * 14, shoulderY - 8, 8, 38);
        ctx.strokeRect(rx + facing * 14, shoulderY - 8, 8, 38);
      }
    } else {
      // Ranged Bow Holding
      const bowHandX = rx + facing * 18;
      const bowHandY = shoulderY + 4;

      ctx.beginPath();
      ctx.moveTo(rx, shoulderY);
      ctx.lineTo(bowHandX, bowHandY);
      ctx.stroke();

      // Curved Bow Arc
      ctx.save();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(bowHandX + facing * 4, bowHandY, 18, facing === 1 ? -Math.PI / 2 : Math.PI / 2, facing === 1 ? Math.PI / 2 : (3 * Math.PI) / 2);
      ctx.stroke();
      ctx.restore();
    }

    // Health bar above enemy heads
    if (!isPlayer && char.hp < char.maxHp) {
      const barWidth = 36;
      const barHeight = 4;
      const barX = rx - barWidth / 2;
      const barY = ry - headRadius - 12;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(barX, barY, (char.hp / char.maxHp) * barWidth, barHeight);
    }

    ctx.restore();
  }

  renderProjectiles() {
    const { ctx, camera } = this;
    this.projectiles.forEach((p) => {
      const rx = p.x - camera.x;
      const ry = p.y - camera.y;

      ctx.save();
      ctx.strokeStyle = p.fromPlayer ? '#22d3ee' : '#f87171';
      ctx.lineWidth = 2.5;

      const angle = Math.atan2(p.vy, p.vx);
      const arrowLength = 22;

      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - Math.cos(angle) * arrowLength, ry - Math.sin(angle) * arrowLength);
      ctx.stroke();

      // Arrowhead
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// -------------------------------------------------------------
// START GAME ON DOM READY
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new StickmanGame();
});
