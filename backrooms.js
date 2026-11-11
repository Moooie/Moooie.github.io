/**
 * ESCAPE THE BACKROOMS: LIMINAL HORROR CO-OP (3D)
 * Level 0: The Yellow Lobby
 * 
 * Features:
 * - Three.js 3D Procedural Liminal Maze with Damp Yellow Wallpaper & Carpet
 * - Procedural Audio Engine (Web Audio API) for 60Hz Fluorescent Hum, Heartbeat, Breathing, Screeches & Radios
 * - Intelligent Entity AI ("The Bacteria") with Sight, Sound, Chase & Locker Sniffing
 * - Locker & Desk Hiding Mechanics with Breath-Holding (Spacebar)
 * - RPG Attributes (Lungs, Mental, Stealth, Perception) and Skills (Sixth Sense, Ghost Step, Sound Decoy)
 * - Full WebRTC P2P Co-op Multiplayer via PeerJS with Downed/Revive and Walkie-Talkie Voice Chat
 * - Complete Objective Loop: Collect 3 Tapes + Keycard -> Unlock No-Clip Emergency Exit
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL WEB AUDIO SYNTHESIZER
  // =========================================================================
  class BackroomsAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.humGain = null;
      this.humOsc1 = null;
      this.humOsc2 = null;
      this.heartbeatTimer = null;
      this.heartbeatBpm = 65;
      this.isHeartbeatActive = false;
      this.isHoldingBreath = false;
      this.radioStream = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;
      this.masterGain.connect(this.ctx.destination);

      // Low-pass filter for muffled audio when holding breath or low sanity
      this.muffleFilter = this.ctx.createBiquadFilter();
      this.muffleFilter.type = 'lowpass';
      this.muffleFilter.frequency.value = 20000;
      this.muffleFilter.connect(this.masterGain);

      this.startFluorescentHum();
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setMuted(muted) {
      this.isMuted = muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
      }
    }

    setMuffle(muffled, freq = 600) {
      if (!this.ctx || !this.muffleFilter) return;
      const target = muffled ? freq : 20000;
      this.muffleFilter.frequency.cancelScheduledValues(this.ctx.currentTime);
      this.muffleFilter.frequency.exponentialRampToValueAtTime(Math.max(50, target), this.ctx.currentTime + 0.3);
    }

    // 60Hz + 120Hz North American fluorescent lamp electrical buzz
    startFluorescentHum() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.045, now);
      this.humGain.connect(this.muffleFilter);

      // 60Hz base
      this.humOsc1 = this.ctx.createOscillator();
      this.humOsc1.type = 'sawtooth';
      this.humOsc1.frequency.setValueAtTime(60, now);

      // 120Hz harmonic
      this.humOsc2 = this.ctx.createOscillator();
      this.humOsc2.type = 'sine';
      this.humOsc2.frequency.setValueAtTime(120, now);

      // Subtle noise texture
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const humFilter = this.ctx.createBiquadFilter();
      humFilter.type = 'bandpass';
      humFilter.frequency.value = 180;
      humFilter.Q.value = 3.0;

      this.humOsc1.connect(humFilter);
      this.humOsc2.connect(humFilter);
      whiteNoise.connect(humFilter);
      humFilter.connect(this.humGain);

      this.humOsc1.start();
      this.humOsc2.start();
      whiteNoise.start();
    }

    setHumIntensity(multiplier) {
      if (!this.ctx || !this.humGain) return;
      const val = Math.max(0.02, Math.min(0.25, 0.045 * multiplier));
      this.humGain.gain.linearRampToValueAtTime(val, this.ctx.currentTime + 0.1);
    }

    // Dynamic Heartbeat sound: thump-thump
    playHeartbeatThump() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.14);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);

      // Secondary softer bounce
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(70, now2);
        osc2.frequency.exponentialRampToValueAtTime(30, now2 + 0.12);

        gain2.gain.setValueAtTime(0.22, now2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.13);

        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now2);
        osc2.stop(now2 + 0.14);
      }, 180);
    }

    updateHeartbeat(bpm, active = true) {
      this.heartbeatBpm = Math.max(50, Math.min(180, bpm));
      if (!active && this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
        this.isHeartbeatActive = false;
        return;
      }
      if (active && !this.heartbeatTimer) {
        this.isHeartbeatActive = true;
        const interval = (60 / this.heartbeatBpm) * 1000;
        this.playHeartbeatThump();
        this.heartbeatTimer = setInterval(() => {
          this.playHeartbeatThump();
        }, interval);
      } else if (active && this.heartbeatTimer) {
        // Refresh interval if changed significantly
        clearInterval(this.heartbeatTimer);
        const interval = (60 / this.heartbeatBpm) * 1000;
        this.heartbeatTimer = setInterval(() => {
          this.playHeartbeatThump();
        }, interval);
      }
    }

    // Footstep on damp yellow carpet
    playFootstep(isSprint = false, isCrouched = false, isGhost = false) {
      if (!this.ctx || this.isMuted || isGhost) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.value = isCrouched ? 220 : 420;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isSprint ? 90 : 75, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      const vol = isCrouched ? 0.04 : (isSprint ? 0.22 : 0.12);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.muffleFilter);

      osc.start(now);
      osc.stop(now + 0.1);
    }

    // Flashlight switch click
    playFlashlightClick() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.035);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.045);
    }

    // Locker door metal creak
    playLockerCreak(isOpen = true) {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const startF = isOpen ? 320 : 540;
      const endF = isOpen ? 560 : 220;
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.linearRampToValueAtTime(endF, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.muffleFilter);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // Item Pickup Chime
    playPickupChime() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    }

    // Almond Water drink
    playDrinkSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    }

    // Adrenaline Injection
    playInjectSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.32);
    }

    // Entity Screech (Distorted metallic wire horror roar)
    playEntityScreech() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const dist = this.ctx.createWaveShaper();

      // Simple distortion curve
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + 20) * x * 20 * deg) / (Math.PI + 20 * Math.abs(x));
      }
      dist.curve = curve;

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(450, now);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.4);
      osc1.frequency.linearRampToValueAtTime(220, now + 0.85);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(470, now);
      osc2.frequency.linearRampToValueAtTime(910, now + 0.4);
      osc2.frequency.linearRampToValueAtTime(210, now + 0.85);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc1.connect(dist);
      osc2.connect(dist);
      dist.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.95);
      osc2.stop(now + 0.95);
    }

    // Entity Sniffing at locker
    playEntitySniff() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        out[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }

    // Gasp sound when out of breath
    playGaspSound() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(480, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    }

    // Sonar Ping Chime (Skill [V])
    playRadarPing() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    }

    // Sound Decoy Coin Clatter (Skill [X])
    playDecoyClatter() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 1200 + Math.random() * 800;
        const t = now + i * 0.08;
        gain.gain.setValueAtTime(0.25 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.08);
      }
    }

    // Walkie Talkie Radio Beep / Squelch
    playRadioBeep() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(940, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    }

    // Jumpscare loud sting
    playJumpscareSting() {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      // White noise explosion + low drop
      const bufferSize = this.ctx.sampleRate * 0.7;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        out[i] = (Math.random() * 2 - 1) * 0.6;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.7, now);
      nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      noise.connect(nGain);
      nGain.connect(this.masterGain);
      noise.start(now);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      oscGain.gain.setValueAtTime(0.65, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  }

  // =========================================================================
  // 2. PROCEDURAL TEXTURE GENERATOR
  // =========================================================================
  class TextureFactory {
    // Damp Yellow Liminal Wallpaper (mono-yellow with faint vertical stripes & moisture stains)
    static createWallpaperTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Base yellow-tan
      ctx.fillStyle = '#b39546';
      ctx.fillRect(0, 0, 512, 512);

      // Subtle vertical wallpaper stripes
      for (let x = 0; x < 512; x += 16) {
        ctx.fillStyle = x % 32 === 0 ? 'rgba(145, 120, 50, 0.28)' : 'rgba(195, 165, 80, 0.18)';
        ctx.fillRect(x, 0, 8, 512);
      }

      // Moisture stains and dirt spots
      for (let i = 0; i < 40; i++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 512;
        const r = 10 + Math.random() * 45;
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
        grad.addColorStop(0, 'rgba(85, 70, 30, 0.25)');
        grad.addColorStop(1, 'rgba(85, 70, 30, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Film grain noise
      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 16;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }

    // Damp Moldy Mono-Yellow Carpet
    static createCarpetTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#61532c';
      ctx.fillRect(0, 0, 512, 512);

      // Carpet grid seams (tiles)
      ctx.strokeStyle = 'rgba(40, 34, 18, 0.4)';
      ctx.lineWidth = 4;
      for (let x = 0; x <= 512; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y <= 512; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Mold and water puddle discoloration
      for (let i = 0; i < 25; i++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 512;
        const r = 20 + Math.random() * 60;
        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
        grad.addColorStop(0, 'rgba(38, 35, 20, 0.45)');
        grad.addColorStop(1, 'rgba(38, 35, 20, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dense carpet fibers noise
      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }

    // Acoustic Drop-Ceiling Tile with dots
    static createCeilingTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#9e9682';
      ctx.fillRect(0, 0, 512, 512);

      // Metal grid frame
      ctx.strokeStyle = '#5c5647';
      ctx.lineWidth = 6;
      for (let p = 0; p <= 512; p += 128) {
        ctx.strokeRect(p, 0, 0, 512);
        ctx.strokeRect(0, p, 512, 0);
      }

      // Acoustic pits / holes
      ctx.fillStyle = 'rgba(60, 55, 45, 0.4)';
      for (let i = 0; i < 600; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, 2, 2);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }

    // Industrial Metal Locker Texture
    static createLockerTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#4a5568';
      ctx.fillRect(0, 0, 256, 512);

      // Louvers (ventilation slots)
      ctx.fillStyle = '#1a202c';
      for (let y = 50; y < 140; y += 14) {
        ctx.fillRect(40, y, 176, 5);
      }
      for (let y = 360; y < 450; y += 14) {
        ctx.fillRect(40, y, 176, 5);
      }

      // Handle & lock indentation
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(205, 230, 25, 60);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(212, 245, 10, 30);

      // Rivets / border seams
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 4;
      ctx.strokeRect(6, 6, 244, 500);

      return new THREE.CanvasTexture(canvas);
    }

    // Emergency Exit Red Door Texture
    static createExitDoorTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 0, 256, 512);

      // Emergency Exit Sign
      ctx.fillStyle = '#15803d';
      ctx.fillRect(28, 40, 200, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EMERGENCY EXIT', 128, 78);

      // Hazard Stripes
      ctx.fillStyle = '#facc15';
      ctx.fillRect(28, 120, 200, 20);
      ctx.fillStyle = '#000000';
      for (let x = 30; x < 220; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 120);
        ctx.lineTo(x + 15, 140);
        ctx.lineTo(x + 25, 140);
        ctx.lineTo(x + 10, 120);
        ctx.fill();
      }

      // Push bar
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(30, 260, 196, 25);

      return new THREE.CanvasTexture(canvas);
    }
  }

  // =========================================================================
  // 3. MAIN GAME CLASS (BackroomsGame)
  // =========================================================================
  class BackroomsGame {
    constructor() {
      this.container = document.getElementById('gameContainer');
      this.canvas = document.getElementById('gameCanvas');
      this.audio = new BackroomsAudio();

      // Three.js Core
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = new THREE.Clock();

      // Flashlight
      this.flashlight = null;
      this.flashlightAmbient = null;
      this.isFlashlightOn = true;
      this.flashlightBattery = 100;
      this.flashlightFlickerTimer = 0;

      // Player State
      this.player = {
        position: new THREE.Vector3(0, 1.7, 0),
        velocity: new THREE.Vector3(),
        rotation: { yaw: 0, pitch: 0 },
        isGrounded: true,
        isSprinting: false,
        isCrouched: false,
        isInsideLocker: false,
        isHoldingBreath: false,
        currentLocker: null,
        isDowned: false,
        downedTimer: 45,
        invulnerabilityTimer: 0,
        sanity: 100,
        maxSanity: 100,
        stamina: 100,
        maxStamina: 100,
        level: 1,
        exp: 0,
        expToNext: 150,
        statPoints: 0,
        stats: {
          lungs: 1,      // Stamina & breath hold length
          mental: 1,     // Sanity decay reduction & max sanity
          stealth: 1,    // Sound noise radius & crouch speed
          perception: 1  // Battery drain & radar range
        },
        skills: {
          sixthSenseCd: 0,
          ghostStepCd: 0,
          decoyCd: 0,
          ghostStepActive: false,
          ghostStepDuration: 0,
          sixthSenseActive: false,
          sixthSenseDuration: 0
        },
        inventory: {
          batteries: 2,
          almondWater: 1,
          adrenaline: 1,
          tapes: 0,
          hasKeycard: false
        },
        breathTime: 9.0,
        maxBreathTime: 9.0,
        survivedTime: 0
      };

      // Control Inputs
      this.keys = {};
      this.mouseMove = { x: 0, y: 0 };
      this.isPointerLocked = false;
      this.headBobTime = 0;

      // World Geometry & Grid
      this.gridSize = 24; // 24x24 cells
      this.cellSize = 4.5; // 4.5m per cell
      this.wallBoxes = [];
      this.lockers = [];
      this.collectibles = [];
      this.exitDoor = null;
      this.isExitUnlocked = false;

      // Entity AI ("The Bacteria")
      this.entity = {
        mesh: null,
        lightMesh: null,
        position: new THREE.Vector3(20, 0, 20),
        state: 'PATROL', // PATROL, INVESTIGATE, CHASE, SNIFF_LOCKER
        patrolTarget: new THREE.Vector3(),
        speed: 2.8,
        chaseSpeed: 6.2,
        investigateTimer: 0,
        sniffTimer: 0,
        targetedLocker: null,
        alertness: 0,
        soundSource: null,
        screechCooldown: 0
      };

      // Decoy Entity Target
      this.activeDecoy = null;

      // P2P Co-op Multiplayer (PeerJS)
      this.peer = null;
      this.peerConn = null;
      this.isHost = false;
      this.isCoopMode = false;
      this.isRevivingTeammate = false;
      this.reviveProgress = 0;
      this.reviveHoldDuration = 2.5;
      this.jumpscareTimeout = null;
      this.roomCode = null;
      this.teammate = {
        mesh: null,
        reviveBeacon: null,
        position: new THREE.Vector3(),
        rotation: { yaw: 0, pitch: 0 },
        isDowned: false,
        isInsideLocker: false,
        flashlightOn: true,
        lastUpdate: Date.now()
      };
      this.localAudioStream = null;
      this.remoteAudioCall = null;

      // Ping Marker
      this.pingMarkerMesh = null;
      this.pingTimer = 0;

      // Cache DOM Elements
      this.dom = {
        gameContainer: document.getElementById('gameContainer'),
        interactPrompt: document.getElementById('interactPrompt'),
        interactText: document.getElementById('interactText'),
        gameHud: document.getElementById('gameHud'),
        sanityText: document.getElementById('sanityText'),
        sanityBarFill: document.getElementById('sanityBarFill'),
        staminaText: document.getElementById('staminaText'),
        staminaBarFill: document.getElementById('staminaBarFill'),
        batteryText: document.getElementById('batteryText'),
        batteryBarFill: document.getElementById('batteryBarFill'),
        hudPlayerLevel: document.getElementById('hudPlayerLevel'),
        hudExpFill: document.getElementById('hudExpFill'),
        hudExpText: document.getElementById('hudExpText'),
        tapeCountText: document.getElementById('tapeCountText'),
        keycardText: document.getElementById('keycardText'),
        teammateCard: document.getElementById('teammateCard'),
        mateDistance: document.getElementById('mateDistance'),
        mateStateText: document.getElementById('mateStateText'),
        voiceToggleBtn: document.getElementById('voiceToggleBtn'),
        audioToggleBtn: document.getElementById('audioToggleBtn'),
        cdSixthSense: document.getElementById('cdSixthSense'),
        cdGhostStep: document.getElementById('cdGhostStep'),
        cdDecoy: document.getElementById('cdDecoy'),
        qtyBattery: document.getElementById('qtyBattery'),
        qtyAlmond: document.getElementById('qtyAlmond'),
        qtyAdrenaline: document.getElementById('qtyAdrenaline'),
        lockerOverlay: document.getElementById('lockerOverlay'),
        breathBarFill: document.getElementById('breathBarFill'),
        sniffWarning: document.getElementById('sniffWarning'),
        exitLockerBtn: document.getElementById('exitLockerBtn'),
        downedOverlay: document.getElementById('downedOverlay'),
        downedTimerFill: document.getElementById('downedTimerFill'),
        downedCountdownText: document.getElementById('downedCountdownText'),
        reviveProgressContainer: document.getElementById('reviveProgressContainer'),
        reviveChannelFill: document.getElementById('reviveChannelFill'),
        startScreen: document.getElementById('startScreen'),
        btnModeSolo: document.getElementById('btnModeSolo'),
        btnModeHost: document.getElementById('btnModeHost'),
        btnModeJoin: document.getElementById('btnModeJoin'),
        joinRoomCodeInput: document.getElementById('joinRoomCodeInput'),
        btnConfirmJoin: document.getElementById('btnConfirmJoin'),
        roomCodeDisplayBanner: document.getElementById('roomCodeDisplayBanner'),
        myRoomCodeText: document.getElementById('myRoomCodeText'),
        btnCopyCode: document.getElementById('btnCopyCode'),
        btnStartAnyway: document.getElementById('btnStartAnyway'),
        upgradeModal: document.getElementById('upgradeModal'),
        closeUpgradeModalBtn: document.getElementById('closeUpgradeModalBtn'),
        upgradeStatPoints: document.getElementById('upgradeStatPoints'),
        valLungsLevel: document.getElementById('valLungsLevel'),
        valMentalLevel: document.getElementById('valMentalLevel'),
        valStealthLevel: document.getElementById('valStealthLevel'),
        valPerceptionLevel: document.getElementById('valPerceptionLevel'),
        dismissUpgradeModalBtn: document.getElementById('dismissUpgradeModalBtn'),
        escapeModal: document.getElementById('escapeModal'),
        escTime: document.getElementById('escTime'),
        escLevel: document.getElementById('escLevel'),
        btnRestartGame: document.getElementById('btnRestartGame'),
        jumpscareOverlay: document.getElementById('jumpscareOverlay'),
        sanityGlitchOverlay: document.getElementById('sanityGlitchOverlay'),
        chaseRedFlash: document.getElementById('chaseRedFlash')
      };

      this.initThree();
      this.bindInputEvents();
      this.bindMenuButtons();
    }

    // -----------------------------------------------------------------------
    // INITIALIZE THREE.JS SCENE, CAMERA, LIGHTS
    // -----------------------------------------------------------------------
    initThree() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0907);
      this.scene.fog = new THREE.FogExp2(0x18140b, 0.045);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        150
      );
      this.camera.position.set(0, 1.7, 0);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      this.renderer.shadowMap.enabled = false; // Horror soft baked lighting

      // Ambient low liminal glow
      const ambientLight = new THREE.AmbientLight(0x282315, 0.65);
      this.scene.add(ambientLight);

      // Player Flashlight (SpotLight mounted to camera)
      this.flashlight = new THREE.SpotLight(0xfff5d0, 1.85, 24, Math.PI / 7, 0.45, 1.2);
      this.flashlight.position.set(0, 0, 0);
      this.flashlight.target.position.set(0, 0, -1);
      this.camera.add(this.flashlight);
      this.camera.add(this.flashlight.target);

      // Small secondary point light around player for close surroundings
      this.flashlightAmbient = new THREE.PointLight(0xffecc0, 0.4, 4.5);
      this.camera.add(this.flashlightAmbient);
      this.scene.add(this.camera);

      // Ping Marker Mesh
      const pingGeo = new THREE.RingGeometry(0.2, 0.35, 16);
      const pingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
      this.pingMarkerMesh = new THREE.Mesh(pingGeo, pingMat);
      this.pingMarkerMesh.rotation.x = Math.PI / 2;
      this.pingMarkerMesh.visible = false;
      this.scene.add(this.pingMarkerMesh);

      // Build Backrooms Maze Level 0
      this.buildMaze();
      this.spawnEntityModel();
      this.spawnTeammateModel();

      window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // -----------------------------------------------------------------------
    // PROCEDURAL MAZE GENERATOR
    // -----------------------------------------------------------------------
    buildMaze() {
      const wallTex = TextureFactory.createWallpaperTexture();
      const carpetTex = TextureFactory.createCarpetTexture();
      const ceilingTex = TextureFactory.createCeilingTexture();
      const lockerTex = TextureFactory.createLockerTexture();
      const exitTex = TextureFactory.createExitDoorTexture();

      const mapWidth = this.gridSize * this.cellSize;
      const wallHeight = 3.3;

      // Floor
      carpetTex.repeat.set(this.gridSize * 1.5, this.gridSize * 1.5);
      const floorGeo = new THREE.PlaneGeometry(mapWidth, mapWidth);
      const floorMat = new THREE.MeshStandardMaterial({
        map: carpetTex,
        roughness: 0.9,
        metalness: 0.1
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0, 0);
      this.scene.add(floor);

      // Ceiling
      ceilingTex.repeat.set(this.gridSize * 1.2, this.gridSize * 1.2);
      const ceilingGeo = new THREE.PlaneGeometry(mapWidth, mapWidth);
      const ceilingMat = new THREE.MeshStandardMaterial({
        map: ceilingTex,
        roughness: 0.95,
        metalness: 0.05
      });
      const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.set(0, wallHeight, 0);
      this.scene.add(ceiling);

      // Maze Grid Representation: 0 = Open corridor, 1 = Wall, 2 = Pillar, 3 = Locker, 4 = Exit
      const grid = [];
      for (let r = 0; r < this.gridSize; r++) {
        grid[r] = [];
        for (let c = 0; c < this.gridSize; c++) {
          // Perimeter walls
          if (r === 0 || c === 0 || r === this.gridSize - 1 || c === this.gridSize - 1) {
            grid[r][c] = 1;
          } else {
            // Keep central lobby spawn area (r: 10..13, c: 10..13) open
            if (r >= 10 && r <= 13 && c >= 10 && c <= 13) {
              grid[r][c] = 0;
            } else {
              // Procedural rooms & partitions
              const isPillar = (r % 4 === 0 && c % 4 === 0);
              const isRandomWall = (Math.random() < 0.22);
              grid[r][c] = isPillar ? 2 : (isRandomWall ? 1 : 0);
            }
          }
        }
      }

      // Designate Exit Room at far corner
      grid[this.gridSize - 2][this.gridSize - 2] = 4;
      grid[this.gridSize - 2][this.gridSize - 3] = 0;
      grid[this.gridSize - 3][this.gridSize - 2] = 0;

      // Place 10 Lockers along walls
      let placedLockers = 0;
      for (let r = 2; r < this.gridSize - 2 && placedLockers < 10; r++) {
        for (let c = 2; c < this.gridSize - 2 && placedLockers < 10; c++) {
          if (grid[r][c] === 0 && (grid[r - 1][c] === 1 || grid[r + 1][c] === 1)) {
            if (Math.random() < 0.35) {
              grid[r][c] = 3;
              placedLockers++;
            }
          }
        }
      }

      // Build Meshes from Grid
      const wallMat = new THREE.MeshStandardMaterial({
        map: wallTex,
        roughness: 0.85,
        metalness: 0.05
      });

      const halfMap = mapWidth / 2;
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const type = grid[r][c];
          const x = (c * this.cellSize) - halfMap + (this.cellSize / 2);
          const z = (r * this.cellSize) - halfMap + (this.cellSize / 2);

          // Wall or Pillar
          if (type === 1 || type === 2) {
            const wSize = (type === 2) ? 1.6 : this.cellSize;
            const wallGeo = new THREE.BoxGeometry(wSize, wallHeight, wSize);
            const wallMesh = new THREE.Mesh(wallGeo, wallMat);
            wallMesh.position.set(x, wallHeight / 2, z);
            this.scene.add(wallMesh);

            this.wallBoxes.push({
              minX: x - wSize / 2,
              maxX: x + wSize / 2,
              minZ: z - wSize / 2,
              maxZ: z + wSize / 2
            });
          }

          // Fluorescent ceiling light fixture (every few cells)
          if ((r % 3 === 1 && c % 3 === 1) && type === 0) {
            this.createFluorescentFixture(x, wallHeight - 0.05, z);
          }

          // Locker Mesh
          if (type === 3) {
            this.createLocker(x, z, lockerTex);
          }

          // Exit Door
          if (type === 4) {
            this.createExitDoor(x, z, exitTex);
          }
        }
      }

      // Spawn Collectible Items (3 Cassette Tapes, 1 Keycard, 5 Batteries, 4 Almond Water, 3 Adrenaline)
      this.spawnCollectibles();
    }

    createFluorescentFixture(x, y, z) {
      const fixtureGeo = new THREE.BoxGeometry(1.6, 0.1, 0.6);
      const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xfff6cf });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(x, y, z);
      this.scene.add(fixture);

      // Dim point light casting eerie yellowish glow
      const light = new THREE.PointLight(0xfff2b0, 0.85, 11, 1.4);
      light.position.set(x, y - 0.3, z);
      this.scene.add(light);
    }

    createLocker(x, z, lockerTex) {
      const lockerGroup = new THREE.Group();
      const lockerGeo = new THREE.BoxGeometry(1.2, 2.7, 1.0);
      const lockerMat = new THREE.MeshStandardMaterial({
        map: lockerTex,
        roughness: 0.6,
        metalness: 0.5
      });
      const mesh = new THREE.Mesh(lockerGeo, lockerMat);
      mesh.position.y = 1.35;
      lockerGroup.add(mesh);
      lockerGroup.position.set(x, 0, z);

      this.scene.add(lockerGroup);

      this.lockers.push({
        position: new THREE.Vector3(x, 0, z),
        group: lockerGroup,
        isOccupied: false
      });

      // Add wall collider for locker body
      this.wallBoxes.push({
        minX: x - 0.6,
        maxX: x + 0.6,
        minZ: z - 0.5,
        maxZ: z + 0.5
      });
    }

    createExitDoor(x, z, exitTex) {
      const doorGeo = new THREE.BoxGeometry(1.8, 2.8, 0.2);
      const doorMat = new THREE.MeshStandardMaterial({
        map: exitTex,
        roughness: 0.7,
        metalness: 0.2
      });
      this.exitDoor = new THREE.Mesh(doorGeo, doorMat);
      this.exitDoor.position.set(x, 1.4, z);
      this.scene.add(this.exitDoor);

      // Glowing red exit beacon light
      const exitLight = new THREE.PointLight(0xdc2626, 1.5, 9);
      exitLight.position.set(x, 2.6, z + 0.3);
      this.scene.add(exitLight);
    }

    spawnCollectibles() {
      // 3 Cassette Tapes
      const tapeCoords = [
        { x: -18, z: -12, type: 'tape', name: 'Kaset Rekaman #1' },
        { x: 12, z: -20, type: 'tape', name: 'Kaset Rekaman #2' },
        { x: -14, z: 24, type: 'tape', name: 'Kaset Rekaman #3' }
      ];

      // 1 Keycard
      const keycardCoord = { x: 22, z: -15, type: 'keycard', name: 'Kartu Akses Ruang Kontrol' };

      // Supplies
      const supplies = [
        { x: -8, z: 5, type: 'battery', name: 'Baterai Senter' },
        { x: 15, z: 8, type: 'battery', name: 'Baterai Senter' },
        { x: -5, z: -15, type: 'battery', name: 'Baterai Senter' },
        { x: 4, z: 18, type: 'almond', name: 'Air Almond' },
        { x: -22, z: 2, type: 'almond', name: 'Air Almond' },
        { x: 18, z: -4, type: 'almond', name: 'Air Almond' },
        { x: -10, z: -24, type: 'adrenaline', name: 'Suntikan Adrenalin' },
        { x: 8, z: 25, type: 'adrenaline', name: 'Suntikan Adrenalin' }
      ];

      const allItems = [...tapeCoords, keycardCoord, ...supplies];

      allItems.forEach(item => {
        const group = new THREE.Group();
        let color = 0xf59e0b;
        let geo = new THREE.BoxGeometry(0.35, 0.15, 0.5); // Default cassette tape shape

        if (item.type === 'keycard') {
          color = 0x38bdf8;
          geo = new THREE.BoxGeometry(0.35, 0.05, 0.55);
        } else if (item.type === 'battery') {
          color = 0xfacc15;
          geo = new THREE.CylinderGeometry(0.1, 0.1, 0.35, 12);
        } else if (item.type === 'almond') {
          color = 0x06b6d4;
          geo = new THREE.CylinderGeometry(0.12, 0.12, 0.45, 12);
        } else if (item.type === 'adrenaline') {
          color = 0xa855f7;
          geo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
        }

        const mat = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        group.position.set(item.x, 0.6, item.z);

        // Faint glowing aura
        const light = new THREE.PointLight(color, 0.8, 3.5);
        light.position.set(0, 0.2, 0);
        group.add(light);

        this.scene.add(group);

        this.collectibles.push({
          type: item.type,
          name: item.name,
          position: new THREE.Vector3(item.x, 0.6, item.z),
          group: group,
          isCollected: false
        });
      });
    }

    // -----------------------------------------------------------------------
    // SPAWN ENTITY MODEL ("The Bacteria")
    // -----------------------------------------------------------------------
    spawnEntityModel() {
      const entityGroup = new THREE.Group();

      // Slender twisted wireframe body
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        wireframe: true
      });

      // Spine / Torso
      const torsoGeo = new THREE.CylinderGeometry(0.12, 0.18, 2.5, 8);
      const torso = new THREE.Mesh(torsoGeo, bodyMat);
      torso.position.y = 1.7;
      torso.rotation.z = 0.05;
      entityGroup.add(torso);

      // Long arms
      for (let side = -1; side <= 1; side += 2) {
        const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 2.2, 6);
        const arm = new THREE.Mesh(armGeo, bodyMat);
        arm.position.set(side * 0.45, 1.8, 0.2);
        arm.rotation.z = side * 0.2;
        entityGroup.add(arm);
      }

      // Twisted Head with glowing eyes
      const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.position.y = 3.1;
      entityGroup.add(head);

      // Glowing Eyes
      const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
      eye1.position.set(-0.1, 3.15, 0.22);
      eye1.name = 'eye';
      const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
      eye2.position.set(0.1, 3.15, 0.22);
      eye2.name = 'eye';
      entityGroup.add(eye1);
      entityGroup.add(eye2);

      // Red aura point light
      this.entity.lightMesh = new THREE.PointLight(0xdc2626, 1.6, 9);
      this.entity.lightMesh.position.set(0, 2.5, 0);
      entityGroup.add(this.entity.lightMesh);

      entityGroup.position.copy(this.entity.position);
      this.scene.add(entityGroup);

      this.entity.mesh = entityGroup;
      this.pickNewEntityPatrolTarget();
    }

    pickNewEntityPatrolTarget() {
      // Pick random accessible spot in maze
      const halfMap = (this.gridSize * this.cellSize) / 2 - 4;
      this.entity.patrolTarget.set(
        (Math.random() - 0.5) * 2 * halfMap,
        0,
        (Math.random() - 0.5) * 2 * halfMap
      );
    }

    // -----------------------------------------------------------------------
    // SPAWN TEAMMATE MODEL (Co-op Yellow Hazmat Suit)
    // -----------------------------------------------------------------------
    spawnTeammateModel() {
      const mateGroup = new THREE.Group();

      const suitMat = new THREE.MeshStandardMaterial({
        color: 0xcca33b, // Yellow hazmat
        roughness: 0.7,
        metalness: 0.1
      });

      // Body & Legs
      const bodyGeo = new THREE.CylinderGeometry(0.28, 0.24, 1.2, 10);
      const body = new THREE.Mesh(bodyGeo, suitMat);
      body.position.y = 0.95;
      mateGroup.add(body);

      // Hood & Visor
      const hoodGeo = new THREE.SphereGeometry(0.24, 12, 12);
      const hood = new THREE.Mesh(hoodGeo, suitMat);
      hood.position.y = 1.7;
      mateGroup.add(hood);

      // Visor
      const visorGeo = new THREE.BoxGeometry(0.25, 0.14, 0.1);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.9
      });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 1.7, 0.2);
      mateGroup.add(visor);

      // Oxygen Tank on back
      const tankGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.65, 8);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
      const tank = new THREE.Mesh(tankGeo, tankMat);
      tank.position.set(0, 1.1, -0.22);
      mateGroup.add(tank);

      // Teammate Flashlight
      const mateFlashlight = new THREE.SpotLight(0xfff5d0, 1.6, 20, Math.PI / 7, 0.45);
      mateFlashlight.position.set(0.18, 1.1, 0.2);
      mateFlashlight.target.position.set(0, 1.1, 5);
      mateGroup.add(mateFlashlight);
      mateGroup.add(mateFlashlight.target);

      // Glowing 3D Revival Beacon (floats above downed teammate)
      const beaconGroup = new THREE.Group();
      const ringGeo = new THREE.RingGeometry(0.35, 0.55, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.9;
      beaconGroup.add(ring);

      const crossHGeo = new THREE.BoxGeometry(0.45, 0.12, 0.08);
      const crossMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const crossH = new THREE.Mesh(crossHGeo, crossMat);
      crossH.position.y = 1.9;
      beaconGroup.add(crossH);

      const crossVGeo = new THREE.BoxGeometry(0.12, 0.45, 0.08);
      const crossV = new THREE.Mesh(crossVGeo, crossMat);
      crossV.position.y = 1.9;
      beaconGroup.add(crossV);

      const beaconLight = new THREE.PointLight(0xdc2626, 2.0, 7.0);
      beaconLight.position.y = 2.0;
      beaconGroup.add(beaconLight);

      beaconGroup.visible = false;
      mateGroup.add(beaconGroup);

      mateGroup.visible = false;
      this.scene.add(mateGroup);

      this.teammate.mesh = mateGroup;
      this.teammate.reviveBeacon = beaconGroup;
      this.teammate.flashlightLight = mateFlashlight;
    }

    // -----------------------------------------------------------------------
    // INPUT BINDINGS (WASD, Mouse Pointer Lock, Keys)
    // -----------------------------------------------------------------------
    bindInputEvents() {
      // Pointer Lock
      this.canvas.addEventListener('click', () => {
        if (!this.isPointerLocked && this.dom.upgradeModal.style.display !== 'flex' && this.dom.startScreen.style.display !== 'flex') {
          this.canvas.requestPointerLock();
          this.audio.init();
          this.audio.resume();
        }
      });

      document.addEventListener('pointerlockchange', () => {
        this.isPointerLocked = (document.pointerLockElement === this.canvas);
      });

      // Mouse Look
      document.addEventListener('mousemove', (e) => {
        if (!this.isPointerLocked) return;
        const sensitivity = 0.0022;
        this.player.rotation.yaw -= e.movementX * sensitivity;

        if (this.player.isInsideLocker) {
          // Constrain look angles inside locker grate (-30 deg to +30 deg)
          const baseYaw = this.player.lockerBaseYaw || 0;
          const diff = this.player.rotation.yaw - baseYaw;
          const clamped = Math.max(-0.55, Math.min(0.55, diff));
          this.player.rotation.yaw = baseYaw + clamped;

          this.player.rotation.pitch -= e.movementY * sensitivity;
          this.player.rotation.pitch = Math.max(-0.35, Math.min(0.35, this.player.rotation.pitch));
        } else {
          this.player.rotation.pitch -= e.movementY * sensitivity;
          this.player.rotation.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.player.rotation.pitch));
        }
      });

      // Keyboard Down
      window.addEventListener('keydown', (e) => {
        this.keys[e.code] = true;
        this.audio.resume();

        // [F] Toggle Flashlight
        if (e.code === 'KeyF') {
          this.toggleFlashlight();
        }

        // [E] Interact / Locker / Revive
        if (e.code === 'KeyE') {
          this.handleInteraction();
        }

        // [TAB] Character / Attribute Upgrades Menu
        if (e.code === 'Tab') {
          e.preventDefault();
          this.toggleUpgradeModal();
        }

        // [Q] Skill: Sixth Sense
        if (e.code === 'KeyQ') {
          this.triggerSixthSense();
        }

        // [Z] Skill: Ghost Step
        if (e.code === 'KeyZ') {
          this.triggerGhostStep();
        }

        // [X] Skill: Sound Decoy
        if (e.code === 'KeyX') {
          this.triggerSoundDecoy();
        }

        // [V] Ping Beacon
        if (e.code === 'KeyV') {
          this.placePingMarker();
        }

        // [1] Use Battery
        if (e.code === 'Digit1') {
          this.useItem('battery');
        }

        // [2] Drink Almond Water
        if (e.code === 'Digit2') {
          this.useItem('almond');
        }

        // [3] Inject Adrenaline
        if (e.code === 'Digit3') {
          this.useItem('adrenaline');
        }

        // [SPACE] Hold Breath (Inside Locker)
        if (e.code === 'Space' && this.player.isInsideLocker) {
          e.preventDefault();
          this.player.isHoldingBreath = true;
        }
      });

      // Keyboard Up
      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;

        // Release breath
        if (e.code === 'Space' && this.player.isInsideLocker) {
          if (this.player.isHoldingBreath) {
            this.player.isHoldingBreath = false;
            this.audio.setMuffle(false);
          }
        }
      });
    }

    // -----------------------------------------------------------------------
    // UI MENU BUTTONS & CO-OP SETUP
    // -----------------------------------------------------------------------
    bindMenuButtons() {
      // Solo Mode
      this.dom.btnModeSolo.addEventListener('click', () => {
        this.startSoloGame();
      });

      // Host Co-op Mode
      this.dom.btnModeHost.addEventListener('click', () => {
        this.initHostPeer();
      });

      // Join Co-op Mode
      this.dom.btnConfirmJoin.addEventListener('click', () => {
        const code = this.dom.joinRoomCodeInput.value.trim().toUpperCase();
        if (code) {
          this.initClientPeer(code);
        } else {
          alert('Silakan masukkan Kode Ruangan yang valid!');
        }
      });

      // Copy Room Code
      this.dom.btnCopyCode.addEventListener('click', () => {
        if (this.roomCode) {
          navigator.clipboard.writeText(this.roomCode);
          this.dom.btnCopyCode.innerHTML = '<i class="fa-solid fa-check"></i> TERSALIN!';
          setTimeout(() => {
            this.dom.btnCopyCode.innerHTML = '<i class="fa-solid fa-copy"></i> SALIN KODE';
          }, 2000);
        }
      });

      // Start Anyway (Host without waiting)
      this.dom.btnStartAnyway.addEventListener('click', () => {
        this.launchGameWorld();
      });

      // Exit Locker Button
      this.dom.exitLockerBtn.addEventListener('click', () => {
        this.exitLocker();
      });

      // Audio Mute Toggle
      this.dom.audioToggleBtn.addEventListener('click', () => {
        const muted = !this.audio.isMuted;
        this.audio.setMuted(muted);
        this.dom.audioToggleBtn.innerHTML = muted
          ? '<i class="fa-solid fa-volume-xmark"></i>'
          : '<i class="fa-solid fa-volume-high"></i>';
      });

      // Walkie-Talkie Voice Chat Toggle
      this.dom.voiceToggleBtn.addEventListener('click', () => {
        this.toggleVoiceChat();
      });

      // Upgrade Modal Close / Dismiss
      this.dom.closeUpgradeModalBtn.addEventListener('click', () => {
        this.closeUpgradeModal();
      });
      this.dom.dismissUpgradeModalBtn.addEventListener('click', () => {
        this.closeUpgradeModal();
      });

      // Stat Upgrade Buttons
      document.querySelectorAll('.btn-attr-upgrade').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const stat = e.currentTarget.getAttribute('data-stat');
          this.upgradeStat(stat);
        });
      });

      // Quick Slots Clicks
      const elSlotBat = document.getElementById('slotBattery');
      if (elSlotBat) elSlotBat.addEventListener('click', () => this.useItem('battery'));
      const elSlotAlm = document.getElementById('slotAlmond');
      if (elSlotAlm) elSlotAlm.addEventListener('click', () => this.useItem('almond'));
      const elSlotAdr = document.getElementById('slotAdrenaline');
      if (elSlotAdr) elSlotAdr.addEventListener('click', () => this.useItem('adrenaline'));

      // Skill Icons Click / Touch
      const elSkSixth = document.getElementById('skillSixthSense');
      if (elSkSixth) elSkSixth.addEventListener('click', () => this.triggerSixthSense());
      const elSkGhost = document.getElementById('skillGhostStep');
      if (elSkGhost) elSkGhost.addEventListener('click', () => this.triggerGhostStep());
      const elSkDecoy = document.getElementById('skillDecoy');
      if (elSkDecoy) elSkDecoy.addEventListener('click', () => this.triggerSoundDecoy());

      // Locker Breath Hold on Click/Touch (Mouse & Mobile Support)
      const elBreathWidget = document.querySelector('.locker-breath-widget');
      if (elBreathWidget) {
        const startBreathHold = (e) => {
          if (this.player.isInsideLocker) {
            e.preventDefault();
            this.player.isHoldingBreath = true;
          }
        };
        const endBreathHold = () => {
          if (this.player.isInsideLocker && this.player.isHoldingBreath) {
            this.player.isHoldingBreath = false;
            this.audio.setMuffle(false);
          }
        };
        elBreathWidget.addEventListener('mousedown', startBreathHold);
        window.addEventListener('mouseup', endBreathHold);
        elBreathWidget.addEventListener('touchstart', startBreathHold, { passive: false });
        window.addEventListener('touchend', endBreathHold);
      }

      // Restart Game on Victory
      this.dom.btnRestartGame.addEventListener('click', () => {
        window.location.reload();
      });
    }

    startSoloGame() {
      this.launchGameWorld();
    }

    launchGameWorld() {
      this.dom.startScreen.style.display = 'none';
      this.dom.gameHud.style.display = 'block';
      this.audio.init();
      this.canvas.requestPointerLock();
      this.clock.start();
      this.animate();
    }

    // -----------------------------------------------------------------------
    // PEERJS WEBRTC P2P NETWORKING
    // -----------------------------------------------------------------------
    initHostPeer() {
      this.isHost = true;
      this.isCoopMode = true;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      this.roomCode = `BCK-${randomSuffix}`;
      const peerId = `backrooms-${this.roomCode}`;

      this.dom.myRoomCodeText.innerText = this.roomCode;
      this.dom.roomCodeDisplayBanner.style.display = 'block';

      try {
        this.peer = new window.Peer(peerId, { debug: 1 });

        this.peer.on('open', (id) => {
          console.log('[Host] PeerJS Room Created:', id);
        });

        this.peer.on('connection', (conn) => {
          console.log('[Host] Teammate connected!');
          this.peerConn = conn;
          this.setupPeerDataHandlers();
          this.launchGameWorld();
        });

        this.peer.on('call', (call) => {
          this.handleIncomingAudioCall(call);
        });

        this.peer.on('error', (err) => {
          console.warn('[PeerJS Host Error]', err);
        });
      } catch (err) {
        console.error('PeerJS init failed:', err);
        alert('Gagal menginisialisasi PeerJS. Memulai dalam mode Solo.');
        this.startSoloGame();
      }
    }

    initClientPeer(code) {
      this.isHost = false;
      this.isCoopMode = true;
      this.roomCode = code;
      const targetPeerId = `backrooms-${code}`;

      try {
        this.peer = new window.Peer(null, { debug: 1 });

        this.peer.on('open', (myId) => {
          console.log('[Client] Connected to Peer Server with ID:', myId);
          this.peerConn = this.peer.connect(targetPeerId, { reliable: true });

          this.peerConn.on('open', () => {
            console.log('[Client] Connected to Host:', targetPeerId);
            this.setupPeerDataHandlers();
            this.launchGameWorld();
          });

          this.peerConn.on('error', (err) => {
            alert('Gagal terhubung ke host. Periksa Room Code!');
            console.warn('[Client Connect Error]', err);
          });
        });

        this.peer.on('call', (call) => {
          this.handleIncomingAudioCall(call);
        });

        this.peer.on('error', (err) => {
          alert('Error koneksi Peer: ' + err.message);
        });
      } catch (err) {
        console.error('PeerJS client error:', err);
        alert('Gagal menyambung ke jaringan Co-op.');
      }
    }

    setupPeerDataHandlers() {
      if (!this.peerConn) return;

      this.dom.teammateCard.style.display = 'flex';
      this.teammate.mesh.visible = true;

      this.peerConn.on('data', (data) => {
        this.handlePeerMessage(data);
      });

      this.peerConn.on('close', () => {
        this.dom.mateStateText.innerText = 'TERPUTUS';
        this.teammate.mesh.visible = false;
      });

      // Synchronize loop at 15 Hz
      setInterval(() => {
        if (this.peerConn && this.peerConn.open) {
          this.peerConn.send({
            type: 'sync',
            x: this.player.position.x,
            y: this.player.position.y,
            z: this.player.position.z,
            yaw: this.player.rotation.yaw,
            pitch: this.player.rotation.pitch,
            flashlight: this.isFlashlightOn,
            isDowned: this.player.isDowned,
            isInsideLocker: this.player.isInsideLocker,
            sanity: this.player.sanity
          });
        }
      }, 66);
    }

    handlePeerMessage(data) {
      if (data.type === 'sync') {
        this.teammate.position.set(data.x, 0, data.z);
        this.teammate.rotation.yaw = data.yaw;
        this.teammate.rotation.pitch = data.pitch;
        this.teammate.isDowned = data.isDowned;
        this.teammate.isInsideLocker = data.isInsideLocker;
        this.teammate.flashlightOn = data.flashlight;

        if (this.teammate.mesh) {
          if (data.isDowned) {
            this.teammate.mesh.position.set(data.x, 0.25, data.z);
            this.teammate.mesh.rotation.z = Math.PI / 2;
            if (this.teammate.reviveBeacon) this.teammate.reviveBeacon.visible = true;
          } else {
            this.teammate.mesh.position.set(data.x, 0, data.z);
            this.teammate.mesh.rotation.z = 0;
            if (this.teammate.reviveBeacon) this.teammate.reviveBeacon.visible = false;
          }
          this.teammate.mesh.rotation.y = data.yaw;
          this.teammate.mesh.visible = !data.isInsideLocker;
          if (this.teammate.flashlightLight) {
            this.teammate.flashlightLight.visible = data.flashlight && !data.isInsideLocker && !data.isDowned;
          }
        }

        // Horizontal Ground Distance in HUD (fixed 2D ground distance)
        const dist = Math.hypot(this.player.position.x - data.x, this.player.position.z - data.z);
        this.dom.mateDistance.innerText = `${dist.toFixed(1)} m`;

        if (data.isDowned) {
          this.dom.mateStateText.innerHTML = '<span class="text-red">PINGSAN! TAHAN [E] UNTUK REVIVE!</span>';
        } else if (data.isInsideLocker) {
          this.dom.mateStateText.innerText = 'BERSEMBUNYI DI LOKER';
        } else {
          this.dom.mateStateText.innerText = 'SEHAT';
        }
      } else if (data.type === 'reviveProgress') {
        if (this.player.isDowned) {
          this.dom.downedCountdownText.innerHTML = `<span class="text-cyan">TEMAN SEDANG MENYELAMATKAN (${Math.round(data.progress)}%)</span>`;
        }
      } else if (data.type === 'ping') {
        this.showPingMarker(new THREE.Vector3(data.x, data.y, data.z));
      } else if (data.type === 'itemCollected') {
        this.syncRemoteCollectedItem(data.index, data.itemType);
      } else if (data.type === 'revived') {
        this.handleRevivedByTeammate();
      }
    }

    // Walkie-Talkie Voice Chat via WebRTC MediaStream
    toggleVoiceChat() {
      if (!this.localAudioStream) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then((stream) => {
            this.localAudioStream = stream;
            this.dom.voiceToggleBtn.classList.add('active');
            this.dom.voiceToggleBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            this.audio.playRadioBeep();

            // Call peer if connected
            if (this.peerConn && this.peer) {
              const call = this.peer.call(this.peerConn.peer, stream);
              this.handleIncomingAudioCall(call);
            }
          })
          .catch((err) => {
            alert('Akses mikrofon ditolak atau tidak tersedia: ' + err.message);
          });
      } else {
        // Toggle Mute
        const audioTracks = this.localAudioStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const enabled = !audioTracks[0].enabled;
          audioTracks[0].enabled = enabled;
          this.dom.voiceToggleBtn.innerHTML = enabled
            ? '<i class="fa-solid fa-microphone"></i>'
            : '<i class="fa-solid fa-microphone-slash"></i>';
          this.audio.playRadioBeep();
        }
      }
    }

    handleIncomingAudioCall(call) {
      call.answer(this.localAudioStream);
      call.on('stream', (remoteStream) => {
        // Play remote voice with 1980s radio bandpass effect
        const audioEl = new Audio();
        audioEl.srcObject = remoteStream;
        audioEl.play().catch(e => console.log('Audio autoplay blocked', e));
      });
    }

    // -----------------------------------------------------------------------
    // FLASHLIGHT & INVENTORY MECHANICS
    // -----------------------------------------------------------------------
    toggleFlashlight() {
      this.isFlashlightOn = !this.isFlashlightOn;
      this.flashlight.visible = this.isFlashlightOn;
      this.flashlightAmbient.visible = this.isFlashlightOn;
      this.audio.playFlashlightClick();
    }

    useItem(type) {
      if (type === 'battery') {
        if (this.player.inventory.batteries > 0) {
          this.player.inventory.batteries--;
          this.flashlightBattery = Math.min(100, this.flashlightBattery + 50);
          this.dom.qtyBattery.innerText = `x${this.player.inventory.batteries}`;
          this.audio.playFlashlightClick();
        }
      } else if (type === 'almond') {
        if (this.player.inventory.almondWater > 0) {
          this.player.inventory.almondWater--;
          this.player.sanity = Math.min(this.player.maxSanity, this.player.sanity + 45);
          this.dom.qtyAlmond.innerText = `x${this.player.inventory.almondWater}`;
          this.audio.playDrinkSound();
        }
      } else if (type === 'adrenaline') {
        if (this.player.inventory.adrenaline > 0) {
          this.player.inventory.adrenaline--;
          this.player.stamina = this.player.maxStamina;
          this.player.skills.ghostStepActive = true;
          this.player.skills.ghostStepDuration = 7.0;
          this.dom.qtyAdrenaline.innerText = `x${this.player.inventory.adrenaline}`;
          this.audio.playInjectSound();
        }
      }
    }

    // -----------------------------------------------------------------------
    // SKILLS ([Q] Sixth Sense, [Z] Ghost Step, [X] Decoy, [V] Ping)
    // -----------------------------------------------------------------------
    triggerSixthSense() {
      if (this.player.skills.sixthSenseCd > 0) return;
      this.player.skills.sixthSenseCd = 25;
      this.player.skills.sixthSenseActive = true;
      const durationBonus = (this.player.stats.perception - 1) * 1.5;
      this.player.skills.sixthSenseDuration = 4.5 + durationBonus;
      this.audio.playRadarPing();

      // Make entity wireframe glow piercingly through walls (X-Ray)
      if (this.entity.mesh) {
        this.entity.mesh.traverse((child) => {
          if (child.material) {
            child.material.color = new THREE.Color(0xf59e0b);
            child.material.depthTest = false;
            child.renderOrder = 999;
          }
        });
      }
    }

    triggerGhostStep() {
      if (this.player.skills.ghostStepCd > 0) return;
      this.player.skills.ghostStepCd = 30;
      this.player.skills.ghostStepActive = true;
      this.player.skills.ghostStepDuration = 5.0;
      this.audio.playDrinkSound();
    }

    triggerSoundDecoy() {
      if (this.player.skills.decoyCd > 0) return;
      this.player.skills.decoyCd = 20;

      // Project target point 14m in front of camera
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      const targetPos = this.player.position.clone().add(dir.multiplyScalar(14));
      targetPos.y = 0;

      this.audio.playDecoyClatter();

      // Alert entity to investigate this sound source
      this.entity.soundSource = targetPos;
      this.entity.state = 'INVESTIGATE';
      this.entity.investigateTimer = 6.0;
    }

    placePingMarker() {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      const pingPos = this.player.position.clone().add(dir.multiplyScalar(6));
      pingPos.y = 0.05;

      this.showPingMarker(pingPos);

      // Broadcast ping to teammate
      if (this.peerConn && this.peerConn.open) {
        this.peerConn.send({
          type: 'ping',
          x: pingPos.x,
          y: pingPos.y,
          z: pingPos.z
        });
      }
    }

    showPingMarker(pos) {
      if (!this.pingMarkerMesh) return;
      this.pingMarkerMesh.position.copy(pos);
      this.pingMarkerMesh.visible = true;
      this.pingTimer = 6.0;
      this.audio.playRadarPing();
    }

    // -----------------------------------------------------------------------
    // LOCKER & INTERACTION MECHANICS
    // -----------------------------------------------------------------------
    handleInteraction() {
      // 1. If currently inside locker, exit!
      if (this.player.isInsideLocker) {
        this.exitLocker();
        return;
      }

      // 2. Check revivable teammate (horizontal 2D ground distance <= 3.8m)
      if (this.teammate && this.teammate.isDowned) {
        const distToMate = Math.hypot(
          this.player.position.x - this.teammate.position.x,
          this.player.position.z - this.teammate.position.z
        );
        if (distToMate <= 3.8) {
          this.reviveTeammate();
          return;
        }
      }

      // 3. Check nearest Locker
      let nearestLocker = null;
      let minDist = 2.4;
      this.lockers.forEach((locker) => {
        const dist = this.player.position.distanceTo(locker.position);
        if (dist < minDist) {
          minDist = dist;
          nearestLocker = locker;
        }
      });

      if (nearestLocker) {
        this.enterLocker(nearestLocker);
        return;
      }

      // 4. Check collectibles
      this.collectibles.forEach((item, idx) => {
        if (!item.isCollected) {
          const dist = this.player.position.distanceTo(item.position);
          if (dist < 2.2) {
            this.collectItem(item, idx);
          }
        }
      });

      // 5. Check Exit Door
      if (this.exitDoor) {
        const distToExit = this.player.position.distanceTo(this.exitDoor.position);
        if (distToExit < 2.8) {
          if (this.player.inventory.tapes >= 3 && this.player.inventory.hasKeycard) {
            this.triggerVictory();
          } else {
            alert('Pintu darurat terkunci! Kumpulkan 3 Kaset Rekaman dan 1 Kartu Akses untuk membuka jalan No-Clip.');
          }
        }
      }
    }

    enterLocker(locker) {
      this.player.isInsideLocker = true;
      this.player.currentLocker = locker;
      locker.isOccupied = true;

      // Lock player inside locker
      this.player.position.set(locker.position.x, 1.7, locker.position.z + 0.1);
      this.player.lockerBaseYaw = 0;
      this.player.rotation.yaw = 0;

      // Turn off flashlight to stay stealthy
      if (this.isFlashlightOn) {
        this.toggleFlashlight();
      }

      this.audio.playLockerCreak(true);
      this.dom.lockerOverlay.style.display = 'block';
      this.player.breathTime = this.player.maxBreathTime;
    }

    exitLocker() {
      if (!this.player.isInsideLocker) return;
      this.player.isInsideLocker = false;
      if (this.player.currentLocker) {
        this.player.currentLocker.isOccupied = false;
      }
      this.player.currentLocker = null;
      this.player.isHoldingBreath = false;

      // Move slightly outside
      this.player.position.z += 1.2;
      this.audio.playLockerCreak(false);
      this.audio.setMuffle(false);

      this.dom.lockerOverlay.style.display = 'none';
      this.dom.sniffWarning.style.display = 'none';
    }

    collectItem(item, idx) {
      item.isCollected = true;
      item.group.visible = false;
      this.audio.playPickupChime();

      if (item.type === 'tape') {
        this.player.inventory.tapes++;
        this.dom.tapeCountText.innerText = `${this.player.inventory.tapes} / 3`;
        this.addExp(100);
      } else if (item.type === 'keycard') {
        this.player.inventory.hasKeycard = true;
        this.dom.keycardText.innerHTML = '<span class="text-cyan">DIMILIKI</span>';
        this.addExp(150);
      } else if (item.type === 'battery') {
        this.player.inventory.batteries++;
        this.dom.qtyBattery.innerText = `x${this.player.inventory.batteries}`;
        this.addExp(35);
      } else if (item.type === 'almond') {
        this.player.inventory.almondWater++;
        this.dom.qtyAlmond.innerText = `x${this.player.inventory.almondWater}`;
        this.addExp(35);
      } else if (item.type === 'adrenaline') {
        this.player.inventory.adrenaline++;
        this.dom.qtyAdrenaline.innerText = `x${this.player.inventory.adrenaline}`;
        this.addExp(35);
      }

      // Check if exit is unlocked
      if (this.player.inventory.tapes >= 3 && this.player.inventory.hasKeycard && !this.isExitUnlocked) {
        this.isExitUnlocked = true;
        this.dom.objectiveTitle.innerHTML = '<span class="text-cyan">PINTU KELUAR NO-CLIP TERBUKA! LARI KE PINTU!</span>';
      }

      // Notify peer
      if (this.peerConn && this.peerConn.open) {
        this.peerConn.send({
          type: 'itemCollected',
          index: idx,
          itemType: item.type
        });
      }
    }

    syncRemoteCollectedItem(index, itemType) {
      if (this.collectibles[index]) {
        this.collectibles[index].isCollected = true;
        this.collectibles[index].group.visible = false;
      }
      if (itemType === 'tape') {
        this.player.inventory.tapes = Math.min(3, this.player.inventory.tapes + 1);
        this.dom.tapeCountText.innerText = `${this.player.inventory.tapes} / 3`;
      } else if (itemType === 'keycard') {
        this.player.inventory.hasKeycard = true;
        this.dom.keycardText.innerHTML = '<span class="text-cyan">DIMILIKI</span>';
      }
    }

    reviveTeammate() {
      this.teammate.isDowned = false;
      if (this.teammate.reviveBeacon) this.teammate.reviveBeacon.visible = false;
      if (this.teammate.mesh) this.teammate.mesh.rotation.z = 0;
      this.addExp(150);
      this.audio.playPickupChime();
      this.repelEntityFrom(this.player.position, 28);
      this.dom.mateStateText.innerText = 'SEHAT';

      if (this.peerConn && this.peerConn.open) {
        this.peerConn.send({ type: 'revived' });
      }
    }

    handleRevivedByTeammate() {
      this.player.isDowned = false;
      this.player.downedTimer = 45;
      this.player.sanity = Math.max(50, this.player.sanity);
      this.player.stamina = this.player.maxStamina;
      this.player.invulnerabilityTimer = 6.0; // 6 seconds invulnerability grace period!
      this.dom.downedOverlay.style.display = 'none';
      if (this.jumpscareTimeout) clearTimeout(this.jumpscareTimeout);
      this.dom.jumpscareOverlay.style.display = 'none';
      this.dom.chaseRedFlash.style.opacity = '0';
      this.audio.playPickupChime();
      this.audio.setMuffle(false);
      this.repelEntityFrom(this.player.position, 28);

      // Confirm to teammate
      if (this.peerConn && this.peerConn.open) {
        this.peerConn.send({
          type: 'sync',
          x: this.player.position.x,
          y: this.player.position.y,
          z: this.player.position.z,
          yaw: this.player.rotation.yaw,
          pitch: this.player.rotation.pitch,
          flashlight: this.isFlashlightOn,
          isDowned: false,
          isInsideLocker: false,
          sanity: this.player.sanity
        });
      }
    }

    repelEntityFrom(pos, dist = 28) {
      if (!this.entity.mesh) return;
      const halfMap = (this.gridSize * this.cellSize) / 2 - 4;
      let targetX = (Math.random() - 0.5) * 2 * halfMap;
      let targetZ = (Math.random() - 0.5) * 2 * halfMap;
      let attempts = 0;
      while (Math.hypot(targetX - pos.x, targetZ - pos.z) < dist && attempts < 25) {
        targetX = (Math.random() - 0.5) * 2 * halfMap;
        targetZ = (Math.random() - 0.5) * 2 * halfMap;
        attempts++;
      }
      this.entity.mesh.position.set(targetX, 0, targetZ);
      this.entity.position.set(targetX, 0, targetZ);
      this.entity.state = 'PATROL';
      this.entity.screechCooldown = 12;
      this.pickNewEntityPatrolTarget();
    }

    // -----------------------------------------------------------------------
    // ATTRIBUTES & LEVELING PROGRESSION
    // -----------------------------------------------------------------------
    addExp(amount) {
      this.player.exp += amount;
      if (this.player.exp >= this.player.expToNext) {
        this.player.exp -= this.player.expToNext;
        this.player.level++;
        this.player.statPoints++;
        this.player.expToNext = Math.floor(this.player.expToNext * 1.6);
        this.player.sanity = Math.min(this.player.maxSanity, this.player.sanity + 25);
        this.audio.playPickupChime();
      }
      this.updateHudStats();
    }

    updateHudStats() {
      this.dom.hudPlayerLevel.innerText = `LEVEL ${this.player.level}`;
      const expPercent = Math.min(100, (this.player.exp / this.player.expToNext) * 100);
      this.dom.hudExpFill.style.width = `${expPercent}%`;
      this.dom.hudExpText.innerText = `EXP ${this.player.exp} / ${this.player.expToNext}`;
      this.dom.upgradeStatPoints.innerText = `${this.player.statPoints} Poin`;
    }

    toggleUpgradeModal() {
      const isVisible = (this.dom.upgradeModal.style.display === 'flex');
      if (isVisible) {
        this.closeUpgradeModal();
      } else {
        document.exitPointerLock();
        this.dom.upgradeModal.style.display = 'flex';
        this.updateHudStats();
      }
    }

    closeUpgradeModal() {
      this.dom.upgradeModal.style.display = 'none';
      if (!this.player.isDowned) {
        this.canvas.requestPointerLock();
      }
    }

    upgradeStat(stat) {
      if (this.player.statPoints <= 0) return;
      this.player.statPoints--;
      this.player.stats[stat]++;

      if (stat === 'lungs') {
        this.player.maxStamina += 40;
        this.player.maxBreathTime += 2.5;
        this.dom.valLungsLevel.innerText = `${this.player.stats.lungs}`;
      } else if (stat === 'mental') {
        this.player.maxSanity += 35;
        this.dom.valMentalLevel.innerText = `${this.player.stats.mental}`;
      } else if (stat === 'stealth') {
        this.dom.valStealthLevel.innerText = `${this.player.stats.stealth}`;
      } else if (stat === 'perception') {
        this.dom.valPerceptionLevel.innerText = `${this.player.stats.perception}`;
      }

      this.updateHudStats();
      this.audio.playPickupChime();
    }

    // -----------------------------------------------------------------------
    // ENTITY AI & LOGIC UPDATE
    // -----------------------------------------------------------------------
    updateEntity(delta) {
      if (!this.entity.mesh) return;

      const entityPos = this.entity.mesh.position;
      const playerPos = this.player.position;
      const distToPlayer = entityPos.distanceTo(playerPos);

      // Decrement screech timer
      if (this.entity.screechCooldown > 0) {
        this.entity.screechCooldown -= delta;
      }

      // Check distance for flashlight flicker
      if (distToPlayer < 18 && this.isFlashlightOn) {
        this.flashlightFlickerTimer += delta * (18 / Math.max(2, distToPlayer)) * 5;
        this.flashlight.intensity = (Math.sin(this.flashlightFlickerTimer * 10) > 0.1) ? 1.85 : 0.2;
      } else if (this.isFlashlightOn) {
        this.flashlight.intensity = 1.85;
      }

      // Check Line of Sight (Raycast)
      const hasLOS = this.checkLineOfSight(entityPos, playerPos);

      // Check if player is currently targetable
      const isPlayerTargetable = !this.player.isDowned && (this.player.invulnerabilityTimer <= 0) && !this.player.isInsideLocker;

      // Auditory Detection: Sprint noise
      const isPlayerMakingSound = this.player.isSprinting && !this.player.skills.ghostStepActive;
      const soundDetectionRadius = Math.max(5, 14 - (this.player.stats.stealth - 1) * 2.5);

      // STATE MACHINE: PATROL, INVESTIGATE, CHASE, SNIFF_LOCKER
      switch (this.entity.state) {
        case 'PATROL':
          this.dom.chaseRedFlash.style.opacity = '0';
          this.audio.updateHeartbeat(65, distToPlayer < 15);

          // If player spotted in LOS and targetable
          if (hasLOS && isPlayerTargetable && distToPlayer < 20) {
            this.enterChaseState();
            break;
          }

          // If sound detected and targetable
          if (isPlayerMakingSound && isPlayerTargetable && distToPlayer < soundDetectionRadius) {
            this.entity.state = 'INVESTIGATE';
            this.entity.soundSource = playerPos.clone();
            this.entity.investigateTimer = 5.0;
            break;
          }

          // Move towards patrol target
          const patrolDir = this.entity.patrolTarget.clone().sub(entityPos);
          patrolDir.y = 0;
          if (patrolDir.length() < 2.0) {
            this.pickNewEntityPatrolTarget();
          } else {
            patrolDir.normalize();
            entityPos.add(patrolDir.multiplyScalar(this.entity.speed * delta));
            this.entity.mesh.rotation.y = Math.atan2(patrolDir.x, patrolDir.z);
          }

          // Check if entity randomly passes near an occupied locker
          if (this.player.isInsideLocker && isPlayerTargetable && distToPlayer < 3.2) {
            this.entity.state = 'SNIFF_LOCKER';
            this.entity.sniffTimer = 4.5;
            this.dom.sniffWarning.style.display = 'block';
            this.audio.playEntitySniff();
          }
          break;

        case 'INVESTIGATE':
          this.dom.chaseRedFlash.style.opacity = '0';
          this.entity.investigateTimer -= delta;

          if (hasLOS && isPlayerTargetable && distToPlayer < 18) {
            this.enterChaseState();
            break;
          }

          if (this.entity.soundSource) {
            const invDir = this.entity.soundSource.clone().sub(entityPos);
            invDir.y = 0;
            if (invDir.length() > 1.0) {
              invDir.normalize();
              entityPos.add(invDir.multiplyScalar(3.8 * delta));
              this.entity.mesh.rotation.y = Math.atan2(invDir.x, invDir.z);
            }
          }

          if (this.entity.investigateTimer <= 0) {
            this.entity.state = 'PATROL';
            this.pickNewEntityPatrolTarget();
          }
          break;

        case 'CHASE':
          if (!isPlayerTargetable) {
            this.entity.state = 'PATROL';
            this.dom.chaseRedFlash.style.opacity = '0';
            this.pickNewEntityPatrolTarget();
            break;
          }

          // Red pulse on screen & fast heartbeat
          this.dom.chaseRedFlash.style.opacity = '0.75';
          this.audio.updateHeartbeat(150, true);

          // Chase player directly
          const chaseDir = playerPos.clone().sub(entityPos);
          chaseDir.y = 0;
          const chaseDist = chaseDir.length();

          if (chaseDist > 0.5) {
            chaseDir.normalize();
            entityPos.add(chaseDir.multiplyScalar(this.entity.chaseSpeed * delta));
            this.entity.mesh.rotation.y = Math.atan2(chaseDir.x, chaseDir.z);
          }

          // If player just hid inside a locker during chase
          if (this.player.isInsideLocker) {
            this.entity.state = 'SNIFF_LOCKER';
            this.entity.sniffTimer = 5.0;
            this.dom.sniffWarning.style.display = 'block';
            this.audio.playEntitySniff();
            break;
          }

          // If player broke line of sight and gained distance
          if (!hasLOS && chaseDist > 22) {
            this.entity.state = 'PATROL';
            this.dom.chaseRedFlash.style.opacity = '0';
            this.addExp(80); // Exp for escaping chase!
            this.pickNewEntityPatrolTarget();
            break;
          }

          // ATTACK: Caught player
          if (chaseDist < 1.4 && isPlayerTargetable) {
            this.handlePlayerAttacked();
          }
          break;

        case 'SNIFF_LOCKER':
          this.entity.sniffTimer -= delta;
          this.audio.updateHeartbeat(160, true);

          // If player is NOT holding breath or ran out of breath
          if (!this.player.isHoldingBreath && isPlayerTargetable) {
            // Player detected in locker!
            this.exitLocker();
            this.handlePlayerAttacked();
            break;
          }

          if (this.entity.sniffTimer <= 0) {
            // Player successfully fooled entity!
            this.entity.state = 'PATROL';
            this.dom.sniffWarning.style.display = 'none';
            this.addExp(75);
            this.pickNewEntityPatrolTarget();
          }
          break;
      }
    }

    enterChaseState() {
      this.entity.state = 'CHASE';
      if (this.entity.screechCooldown <= 0) {
        this.audio.playEntityScreech();
        this.entity.screechCooldown = 15;
      }
    }

    checkLineOfSight(from, to) {
      // Raycast against wall boxes
      const dir = to.clone().sub(from);
      const len = dir.length();
      dir.normalize();

      const step = 0.8;
      const current = from.clone();
      for (let d = 0; d < len; d += step) {
        current.add(dir.clone().multiplyScalar(step));
        for (let i = 0; i < this.wallBoxes.length; i++) {
          const b = this.wallBoxes[i];
          if (current.x >= b.minX && current.x <= b.maxX && current.z >= b.minZ && current.z <= b.maxZ) {
            return false; // Obstructed by wall
          }
        }
      }
      return true;
    }

    handlePlayerAttacked() {
      if (this.jumpscareTimeout) clearTimeout(this.jumpscareTimeout);
      this.audio.playJumpscareSting();
      this.dom.jumpscareOverlay.style.display = 'flex';
      this.jumpscareTimeout = setTimeout(() => {
        this.dom.jumpscareOverlay.style.display = 'none';
      }, 650);

      if (this.isCoopMode || (this.peerConn && this.peerConn.open)) {
        // Co-op: Downed state
        this.player.isDowned = true;
        this.player.downedTimer = 45;
        this.dom.downedOverlay.style.display = 'flex';
        this.dom.chaseRedFlash.style.opacity = '0';
        this.entity.state = 'PATROL';
        this.repelEntityFrom(this.player.position, 28);
      } else {
        // Solo: Respawn safely at entrance with grace period
        this.player.isDowned = false;
        this.player.position.set(0, 1.7, 0);
        this.player.sanity = 60;
        this.player.invulnerabilityTimer = 5.0;
        this.dom.chaseRedFlash.style.opacity = '0';
        this.repelEntityFrom(this.player.position, 30);
      }
    }

    // -----------------------------------------------------------------------
    // GAME OVER & VICTORY
    // -----------------------------------------------------------------------
    triggerVictory() {
      document.exitPointerLock();
      this.dom.escapeModal.style.display = 'flex';
      const minutes = Math.floor(this.player.survivedTime / 60);
      const seconds = Math.floor(this.player.survivedTime % 60);
      this.dom.escTime.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      this.dom.escLevel.innerText = `Lv. ${this.player.level}`;
      this.audio.playPickupChime();
    }

    // -----------------------------------------------------------------------
    // MAIN UPDATE LOOP (Physics, Movement, HUD)
    // -----------------------------------------------------------------------
    updatePlayer(delta) {
      // Invulnerability Grace Period Countdown
      if (this.player.invulnerabilityTimer > 0) {
        this.player.invulnerabilityTimer -= delta;
      }

      // DOWNED STATE: Crawling on floor, cannot sprint/walk, but can look around
      if (this.player.isDowned) {
        this.player.downedTimer -= delta;
        const pct = Math.max(0, (this.player.downedTimer / 45) * 100);
        this.dom.downedTimerFill.style.width = `${pct}%`;
        this.dom.downedCountdownText.innerText = `Waktu Tersisa: ${Math.ceil(this.player.downedTimer)} detik`;

        // Camera crawling on floor at y = 0.35, allowing mouse look
        this.camera.position.set(this.player.position.x, 0.35, this.player.position.z);
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.player.rotation.yaw;
        this.camera.rotation.x = this.player.rotation.pitch;

        if (this.player.downedTimer <= 0) {
          window.location.reload();
        }
        return;
      }

      this.player.survivedTime += delta;

      // CHECK REVIVING TEAMMATE (HOLDING [E])
      const distToMate = Math.hypot(
        this.player.position.x - this.teammate.position.x,
        this.player.position.z - this.teammate.position.z
      );
      const canRevive = this.teammate && this.teammate.isDowned && distToMate <= 3.8;

      if (canRevive && this.keys['KeyE']) {
        this.isRevivingTeammate = true;
        this.reviveProgress += (delta / this.reviveHoldDuration) * 100;
        this.dom.reviveProgressContainer.style.display = 'block';
        this.dom.reviveChannelFill.style.width = `${Math.min(100, this.reviveProgress)}%`;

        if (Math.random() < 0.1) this.audio.playHeartbeatThump();

        if (this.peerConn && this.peerConn.open) {
          this.peerConn.send({ type: 'reviveProgress', progress: this.reviveProgress });
        }

        if (this.reviveProgress >= 100) {
          this.reviveProgress = 0;
          this.isRevivingTeammate = false;
          this.dom.reviveProgressContainer.style.display = 'none';
          this.reviveTeammate();
        }
      } else {
        if (this.isRevivingTeammate) {
          this.isRevivingTeammate = false;
          this.reviveProgress = 0;
          this.dom.reviveProgressContainer.style.display = 'none';
        }
      }

      // Update Skill Cooldowns
      if (this.player.skills.sixthSenseCd > 0) {
        this.player.skills.sixthSenseCd -= delta;
        const pct = (this.player.skills.sixthSenseCd / 25) * 100;
        this.dom.cdSixthSense.style.height = `${pct}%`;
      }
      if (this.player.skills.ghostStepCd > 0) {
        this.player.skills.ghostStepCd -= delta;
        const pct = (this.player.skills.ghostStepCd / 30) * 100;
        this.dom.cdGhostStep.style.height = `${pct}%`;
      }
      if (this.player.skills.decoyCd > 0) {
        this.player.skills.decoyCd -= delta;
        const pct = (this.player.skills.decoyCd / 20) * 100;
        this.dom.cdDecoy.style.height = `${pct}%`;
      }

      // Active Skill Durations
      if (this.player.skills.ghostStepActive) {
        this.player.skills.ghostStepDuration -= delta;
        if (this.player.skills.ghostStepDuration <= 0) {
          this.player.skills.ghostStepActive = false;
        }
      }

      if (this.player.skills.sixthSenseActive) {
        this.player.skills.sixthSenseDuration -= delta;
        if (this.player.skills.sixthSenseDuration <= 0) {
          this.player.skills.sixthSenseActive = false;
          if (this.entity.mesh) {
            this.entity.mesh.traverse((c) => {
              if (c.material) {
                if (c.name !== 'eye') {
                  c.material.color = new THREE.Color(0x111111);
                }
                c.material.depthTest = true;
                c.renderOrder = 0;
              }
            });
          }
        }
      }

      // Ping Marker Decay
      if (this.pingTimer > 0) {
        this.pingTimer -= delta;
        if (this.pingTimer <= 0) {
          this.pingMarkerMesh.visible = false;
        }
      }

      // Locker Breath Holding
      if (this.player.isInsideLocker) {
        if (this.player.isHoldingBreath) {
          this.audio.setMuffle(true);
          this.player.breathTime -= delta;
          const breathPct = Math.max(0, (this.player.breathTime / this.player.maxBreathTime) * 100);
          this.dom.breathBarFill.style.width = `${breathPct}%`;

          if (this.player.breathTime <= 0) {
            // Gasp for air!
            this.player.isHoldingBreath = false;
            this.audio.setMuffle(false);
            this.audio.playGaspSound();
          }
        } else {
          // Recover breath when not holding
          this.player.breathTime = Math.min(this.player.maxBreathTime, this.player.breathTime + delta * 1.8);
          const breathPct = (this.player.breathTime / this.player.maxBreathTime) * 100;
          this.dom.breathBarFill.style.width = `${breathPct}%`;
        }

        // Camera inside locker
        this.camera.position.set(this.player.position.x, 1.7, this.player.position.z);
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.player.rotation.yaw;
        this.camera.rotation.x = this.player.rotation.pitch;
        return;
      }

      // Movement Calculations
      const isShift = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
      const isC = this.keys['KeyC'] || this.keys['ControlLeft'];
      this.player.isCrouched = isC;

      let speed = 4.2; // Walk base speed
      if (isShift && this.player.stamina > 5) {
        speed = 7.5; // Sprint
        this.player.isSprinting = true;
        if (!this.player.skills.ghostStepActive) {
          this.player.stamina = Math.max(0, this.player.stamina - delta * 22);
        }
      } else {
        this.player.isSprinting = false;
        // Stamina Recovery
        this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + delta * 16);
      }

      if (this.player.isCrouched) {
        speed = 2.4;
      }

      // Drain Battery if flashlight on
      if (this.isFlashlightOn) {
        const drainModifier = 1.0 - (this.player.stats.perception - 1) * 0.18;
        this.flashlightBattery = Math.max(0, this.flashlightBattery - delta * 0.35 * drainModifier);
        if (this.flashlightBattery <= 0) {
          this.toggleFlashlight();
        }
      }

      // Drain Sanity in darkness & near entity
      const distToEntity = this.entity.mesh ? this.player.position.distanceTo(this.entity.mesh.position) : 999;
      let sanityDrain = this.isFlashlightOn ? 0.05 : 0.45;
      if (distToEntity < 12) {
        sanityDrain += 2.5;
      }
      const mentalResist = 1.0 - (this.player.stats.mental - 1) * 0.15;
      this.player.sanity = Math.max(0, this.player.sanity - delta * sanityDrain * mentalResist);

      // Low Sanity Visual Distortion Overlay
      if (this.player.sanity < 35) {
        this.dom.sanityGlitchOverlay.style.opacity = `${(35 - this.player.sanity) / 35}`;
      } else {
        this.dom.sanityGlitchOverlay.style.opacity = '0';
      }

      // WASD Input Vector
      const moveVec = new THREE.Vector3();
      if (this.keys['KeyW']) moveVec.z -= 1;
      if (this.keys['KeyS']) moveVec.z += 1;
      if (this.keys['KeyA']) moveVec.x -= 1;
      if (this.keys['KeyD']) moveVec.x += 1;

      if (moveVec.length() > 0) {
        moveVec.normalize();
        // Rotate vector according to camera yaw
        moveVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.rotation.yaw);

        // Move with collision checking
        const nextX = this.player.position.x + moveVec.x * speed * delta;
        const nextZ = this.player.position.z + moveVec.z * speed * delta;

        if (!this.checkWallCollision(nextX, this.player.position.z)) {
          this.player.position.x = nextX;
        }
        if (!this.checkWallCollision(this.player.position.x, nextZ)) {
          this.player.position.z = nextZ;
        }

        // Head Bobbing & Footsteps
        this.headBobTime += delta * (this.player.isSprinting ? 14 : 9);
        const bobOffset = Math.sin(this.headBobTime) * (this.player.isSprinting ? 0.08 : 0.04);
        const eyeHeight = this.player.isCrouched ? 0.9 : 1.7;
        this.camera.position.set(this.player.position.x, eyeHeight + bobOffset, this.player.position.z);

        if (Math.sin(this.headBobTime) > 0.95 && Math.random() < 0.25) {
          this.audio.playFootstep(this.player.isSprinting, this.player.isCrouched, this.player.skills.ghostStepActive);
        }
      } else {
        const eyeHeight = this.player.isCrouched ? 0.9 : 1.7;
        this.camera.position.set(this.player.position.x, eyeHeight, this.player.position.z);
      }

      // Apply camera rotations
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.y = this.player.rotation.yaw;
      this.camera.rotation.x = this.player.rotation.pitch;

      // Update Interaction Prompts in Sight
      this.updateInteractionPrompt();

      // Update HUD Bars
      this.updateHudBars();
    }

    checkWallCollision(x, z) {
      const radius = 0.45;
      for (let i = 0; i < this.wallBoxes.length; i++) {
        const b = this.wallBoxes[i];
        if (x + radius >= b.minX && x - radius <= b.maxX && z + radius >= b.minZ && z - radius <= b.maxZ) {
          return true;
        }
      }
      return false;
    }

    updateInteractionPrompt() {
      let promptText = null;

      // Check lockers
      this.lockers.forEach((l) => {
        if (this.player.position.distanceTo(l.position) < 2.2) {
          promptText = 'Bersembunyi di Loker';
        }
      });

      // Check items
      this.collectibles.forEach((item) => {
        if (!item.isCollected && this.player.position.distanceTo(item.position) < 2.2) {
          promptText = `Ambil ${item.name}`;
        }
      });

      // Check Exit
      if (this.exitDoor && this.player.position.distanceTo(this.exitDoor.position) < 2.8) {
        if (this.player.inventory.tapes >= 3 && this.player.inventory.hasKeycard) {
          promptText = 'NO-CLIP KELUAR DARI BACKROOMS!';
        } else {
          promptText = 'Pintu Terkunci (Perlu 3 Kaset & Keycard)';
        }
      }

      // Check Revive (horizontal 2D ground distance <= 3.8m)
      if (this.teammate && this.teammate.isDowned) {
        const distToMate = Math.hypot(
          this.player.position.x - this.teammate.position.x,
          this.player.position.z - this.teammate.position.z
        );
        if (distToMate <= 3.8) {
          promptText = 'TAHAN [E] Selamatkan Teman (Revive)';
        }
      }

      if (promptText && !this.player.isInsideLocker) {
        this.dom.interactText.innerText = promptText;
        this.dom.interactPrompt.style.display = 'flex';
      } else {
        this.dom.interactPrompt.style.display = 'none';
      }
    }

    updateHudBars() {
      // Sanity
      const sanityPct = Math.max(0, (this.player.sanity / this.player.maxSanity) * 100);
      this.dom.sanityText.innerText = `${Math.round(sanityPct)}%`;
      this.dom.sanityBarFill.style.width = `${sanityPct}%`;

      // Stamina
      const staminaPct = Math.max(0, (this.player.stamina / this.player.maxStamina) * 100);
      this.dom.staminaText.innerText = `${Math.round(staminaPct)}%`;
      this.dom.staminaBarFill.style.width = `${staminaPct}%`;

      // Battery
      this.dom.batteryText.innerText = `${Math.round(this.flashlightBattery)}%`;
      this.dom.batteryBarFill.style.width = `${this.flashlightBattery}%`;
    }

    // -----------------------------------------------------------------------
    // RENDER ANIMATION TICK
    // -----------------------------------------------------------------------
    animate() {
      requestAnimationFrame(() => this.animate());

      const delta = Math.min(this.clock.getDelta(), 0.1);

      this.updatePlayer(delta);
      this.updateEntity(delta);

      // Rotate floating collectibles
      this.collectibles.forEach((item) => {
        if (!item.isCollected && item.group) {
          item.group.rotation.y += delta * 1.5;
        }
      });

      this.renderer.render(this.scene, this.camera);
    }
  }

  // Launch Game Controller on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new BackroomsGame();
  });
})();
