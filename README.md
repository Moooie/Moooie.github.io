# Moooie.github.io - Escape The Backrooms: Liminal Horror Co-op (3D)

Game horor psikologis 3D *survival* bertema **"Escape The Backrooms: Level 0 (The Yellow Lobby)"** berbasis web murni menggunakan **Three.js**, **Web Audio API**, dan **PeerJS (WebRTC P2P Co-op Multiplayer)**.

## 🌐 Mainkan Langsung di Browser
👉 **[https://moooie.github.io](https://moooie.github.io)**

---

## 🎮 Fitur Utama Game:

1. **Suasana Liminal 3D Imersif (Level 0)**:
   - Labirin lantai karpet lembab kecokelatan dan wallpaper kuning bergaris dengan noda rembesan air prosedural.
   - Efek pasca-pemrosesan (*Horror Post-Processing*): *Vignette*, *VHS scanlines*, *Sanity Glitch*, dan *Chase Red Flash*.
   - Sudut pandang orang pertama (*First-Person*) penuh dengan gerak kepala (*head-bobbing*), sprint, dan jongkok (*crouch*).

2. **Mesin Suara Prosedural 100% Offline (Web Audio API)**:
   - Dengung lampu neon fluoresen 60Hz + 120Hz harmonik elektrik.
   - Detak jantung dinamis yang berdegup kencang saat entitas mendekat atau kewarasan menipis.
   - Suara derap langkah di karpet basah (senyap saat jongkok atau menggunakan *Ghost Step*).
   - Efek redam suara (*low-pass filter muffle*) saat menahan napas di dalam loker dan suara tarikan napas (*gasp*).
   - Jeritan kawat logam mengerikan dari entitas dan klik walkie-talkie radio.

3. **AI Entitas Cerdas ("The Bacteria")**:
   - Memiliki 4 state perilaku: `PATROL` (berkeliling labirin), `INVESTIGATE` (menyelidiki suara lari/umpan koin), `CHASE` (mengejar cepat dengan jeritan seram), dan `SNIFF_LOCKER` (mengendus kisi-kisi loker).
   - Sensor sensorik ganda: Garis pandang (*Line of Sight*) dan pendengaran suara langkah.

4. **Mekanik Bersembunyi di Loker Besi & Menahan Napas**:
   - Tekan <kbd>E</kbd> saat berada di dekat loker untuk bersembunyi.
   - Sudut pandang beralih ke balik kisi-kisi louvers loker besi.
   - Tahan tombol <kbd>Space</kbd> untuk menahan napas saat entitas mengendus loker. Jika napas tidak ditahan atau kehabisan napas, entitas akan mendobrak loker!

5. **Pohon Atribut RPG Survivor & 3 Skill Aktif**:
   - Kumpulkan EXP untuk menaikkan level dan alokasikan poin atribut via menu <kbd>TAB</kbd>:
     - **Kapasitas Paru-paru (*Lungs*)**: Memperpanjang stamina sprint & kapasitas menahan napas di loker.
     - **Kekuatan Mental (*Mental Fortitude*)**: Memperlambat penurunan kewarasan (*Sanity*) di kegelapan.
     - **Langkah Hening (*Stealth*)**: Meredam radius suara langkah kaki dan meningkatkan kelincahan.
     - **Persepsi (*Perception*)**: Menghemat konsumsi baterai senter dan memperluas jarak radar.
   - **3 Skill Aktif**:
     - <kbd>Q</kbd> **Insting Survivor**: Melihat siluet entitas tembus pandang dinding (*X-Ray radar*).
     - <kbd>Z</kbd> **Langkah Hantu**: Lari sprint senyap tanpa mengonsumsi stamina selama 5 detik.
     - <kbd>X</kbd> **Umpan Koin Suara**: Melempar koin untuk memancing entitas menjauh.
   - **Slot Logistik Cepat**: [1] Baterai Senter, [2] Air Almond pemulih Sanity, [3] Suntikan Adrenalin.

6. **Multiplayer P2P Co-op Real-time (WebRTC PeerJS)**:
   - Terhubung langsung antar-teman via Room Code (contoh: `BCK-XXXX`) tanpa perlu login atau server backend terpusat.
   - Karakter teman ditampilkan dengan model 3D Pakaian Hazmat Kuning (*Yellow Hazmat Suit*) lengkap dengan tabung oksigen dan sorotan senter tersinkronisasi.
   - **Sistem Pingsan & Revive**: Saat diserang, pemain pingsan selama 45 detik; teman dapat mendekat dan menahan <kbd>E</kbd> (channeling 2.5 detik) untuk menyelamatkannya. Pemain yang baru bangun mendapatkan kebal 6 detik dan entitas otomatis terusir menjauh.
   - **Walkie-Talkie Voice Chat**: Komunikasi suara P2P langsung antar-pemain dengan simulasi filter audio radio 1980-an.
   - **3D Sonar Ping**: Tekan <kbd>V</kbd> untuk menaruh penanda visual dan audio di dunia 3D yang terlihat oleh teman.

7. **Tujuan Akhir Pelarian**:
   - Temukan **3 Kaset Rekaman** dan **1 Kartu Akses Ruang Kontrol** yang tersebar di labirin.
   - Buka pintu darurat dimensional untuk melakukan **No-Clip** dan meloloskan diri dari Level 0!!

---

## 🕹️ Panduan Kontrol Tombol

| Aksi | Tombol Keyboard | Alternatif / Klik Mouse |
| :--- | :--- | :--- |
| **Gerak Maju, Kiri, Mundur, Kanan** | <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, <kbd>D</kbd> | - |
| **Arah Pandang Kamera (360°)** | Gerakan Mouse | Klik kanvas untuk mengunci kursor |
| **Lari Cepat (Sprint)** | <kbd>Shift</kbd> | Menguras stamina |
| **Jongkok (Crouch / Hening)** | <kbd>C</kbd> atau <kbd>Ctrl</kbd> | Meredam suara langkah kaki |
| **Aksi / Masuk Loker / Ambil Item** | <kbd>E</kbd> | Muncul prompt interaksi di layar |
| **Menyelamatkan Teman (Revive)** | <kbd>E</kbd> (Tahan 2.5 detik) | Channeling bar progres |
| **Menahan Napas di Loker** | <kbd>Space</kbd> (Tahan) | Tahan klik pada widget napas |
| **Nyalakan / Matikan Senter** | <kbd>F</kbd> | Menghemat baterai senter |
| **Menu Peningkatan Karakter** | <kbd>TAB</kbd> | Alokasi poin atribut |
| **Skill: Insting (X-Ray Radar)** | <kbd>Q</kbd> | Klik ikon skill di bar HUD |
| **Skill: Langkah Hantu (Silent Sprint)** | <kbd>Z</kbd> | Klik ikon skill di bar HUD |
| **Skill: Lempar Umpan Suara (Decoy)** | <kbd>X</kbd> | Klik ikon skill di bar HUD |
| **Penanda Lokasi (3D Ping Sonar)** | <kbd>V</kbd> | Terlihat oleh teman co-op |
| **Gunakan Baterai (+50%)** | <kbd>1</kbd> | Klik slot item 1 |
| **Minum Air Almond (+45 Sanity)** | <kbd>2</kbd> | Klik slot item 2 |
| **Suntik Adrenalin (Kecepatan Maksimal)** | <kbd>3</kbd> | Klik slot item 3 |
| **Walkie-Talkie Voice Chat P2P** | Ikon Mikrofon di HUD | On / Off mikrofon |
| **Suara Game On / Off** | Ikon Speaker di HUD | On / Off audio |

---

## 📁 Struktur File Repositori

```text
├── index.html         # Entry point utama GitHub Pages (Game 3D Backrooms)
├── backrooms.html     # Halaman mandiri game Backrooms
├── backrooms.css      # Styling liminal, HUD horor, dan efek post-processing
├── backrooms.js       # Mesin Three.js, AI Entitas, Web Audio API & P2P Co-op
├── README.md          # Dokumentasi proyek & panduan bermain
└── .gitignore         # Mengabaikan file proyek lokal lainnya
```
