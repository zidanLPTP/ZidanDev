# 🕹️ Situs Web Portofolio Retro Arcade

Selamat datang di **Bumbu Arcade**, sebuah situs web portofolio pengembang interaktif berakurasi tinggi yang dirancang dengan gaya kabinet arkade klasik tahun 80-an dan antarmuka RPG. Dibangun menggunakan teknologi web modern dengan arsitektur kode yang ringan dan bebas ketergantungan framework (dependency-free).

Portofolio ini menampilkan antarmuka hibrida: antarmuka visual grid yang indah dan widget terminal baris perintah (CLI) melayang yang berfungsi penuh.

---

## 🚀 Live Demo & Repositori
- **Tautan Repositori**: [https://github.com/zidanLPTP/ZidanDev.git](https://github.com/zidanLPTP/ZidanDev.git)
- **Server Pengembangan Lokal**: Jalankan `npm run dev` to start locally.

---

## 👾 Fitur Utama

### 1. Widget Terminal CLI Interaktif (`<retro-terminal>`)
Laci terminal melayang di pojok kanan bawah (dapat dialihkan melalui tombol backtick `` ` `` atau tombol sentuh seluler `[ >_ CLI_MODE ]` dengan target sentuh `48px`).
- **Siklus Autocomplete Tab**: Penyelesaian perintah dan argumen yang tidak sensitif terhadap huruf besar/kecil (case-insensitive) yang berputar secara berurutan.
- **Riwayat Perintah**: Menavigasi perintah sebelumnya menggunakan tombol Panah Atas/Bawah.
- **Perutean Autocomplete Kontekstual**:
  - `project <id>` & `use <id>` otomatis melengkapi target ID proyek dari `projects.json`.
  - `inspect <id>` otomatis melengkapi ID keahlian dari `skills.json`.
- **Eksekusi Perintah**:
  - `help` - Menampilkan panduan instruksi.
  - `about` / `socials` - Biografi pengembang & saluran sosial.
  - `projects` - Mencetak daftar proyek terstruktur.
  - `project <id>` - Memeriksa spesifikasi proyek.
  - `use <id>` - Membuka tautan eksternal secara aman di tab baru (`noopener,noreferrer`).
  - `inventory` / `inspect <item-id>` - Membaca data keahlian.
  - `quests` - Menampilkan semua misi aktif dan selesai.
  - `guilds` - Menampilkan guild aktif dan asosiasi faksi.
  - `status` - Menampilkan statistik karakter aktif.
  - `select <class-id>` - Mengubah kelas karakter aktif.
  - `guestbook` / `sign <init> <msg>` - Berinteraksi dengan buku tamu.
  - `clear` - Membersihkan log konsol.
  - `reset-guestbook` - Mereset database lokal buku tamu.

### 2. Status & Pemilihan Karakter RPG (Tentang Saya)
Halaman biografi profil interaktif yang dirancang seperti layar status RPG.
- **Pemilihan Karakter Dinamis**: Pilih di antara kelas (Pengembang, Seniman 3D, Gamer) untuk mengubah potret, atribut, dan deskripsi secara dinamis.
- **Bilah Kemajuan Estetis**: Merender atribut HP, MP, INT, STR, dan AGI menggunakan blok piksel tajam yang bergaya dengan gradien linier berulang.
- **Sinkronisasi CLI select**: Gunakan `select <class>` untuk mengubah pilihan dari terminal, yang langsung memicu pembaruan visual pada GUI.

### 3. Galeri Seni 3D Blender & Penampil Modal
Menampilkan karya pemodelan 3D secara langsung menggunakan aset `.glb`.
- **Mesin 3D Lazy-Loaded**: Komponen `@google/model-viewer` dan `three.js` diimpor secara dinamis saat pengguna mengklik kartu aset 3D, memastikan pemuatan halaman awal yang cepat.
- **Interaksi Modal yang Aksesibel**: Penutupan melalui klik latar belakang (backdrop), penguncian gulir halaman, dan penutupan dengan tombol keyboard `Escape`.

### 4. Inventaris Keahlian RPG (Tas Ransel)
Keahlian teknis ditampilkan sebagai item di dalam grid inventaris ransel 4x4.
- **SVG Seni Piksel Kustom**: Ikon vektor piksel kustom yang melambangkan teknologi asli (misal: perisai oranye untuk HTML, perisai biru untuk CSS, logo ular piksel untuk Python, dll.).
- **Lembar Detail Inventaris**: Klik slot untuk memperbarui panel samping dengan tipe item, statistik atribut (INT, STR, DEF), dan catatan deskripsi.
- **Kisi Responsif**: Tata letak baris flex pada desktop, yang menumpuk menjadi kolom vertikal pada layar di bawah `768px`.

### 5. Log Misi RPG & Faksi Guild (Timeline)
Mencatat pengalaman kerja, riwayat pendidikan, dan keanggotaan organisasi sebagai misi RPG.
- **Kontrol Tab Misi Aktif & Selesai**: Antarmuka visual yang memisahkan tugas aktif dari pencapaian yang telah diselesaikan.
- **Akordeon Misi**: Klik judul misi untuk memperluas secara dinamis dan menampilkan pemberi misi (Guild/Faksi), tanggal, deskripsi, dan hadiah EXP.
- **Reset Otomatis Tab**: Secara otomatis membersihkan status akordeon yang diperluas saat beralih tab.
- **Pesan Cadangan Guild Kosong**: Jika tidak ada guild aktif yang terdaftar, terminal CLI akan menampilkan pesan cadangan yang cerdas.

### 6. Buku Tamu Arkade & Leaderboard (Formulir Kontak)
Buku tamu kontak yang dirancang sebagai Papan Skor Klasik yang mengurutkan entri berdasarkan skor tertinggi secara menurun.
- **Skor Gamifikasi**: Skor dihitung secara dinamis berdasarkan panjang pesan (`panjang * 100` + bonus acak) untuk mendorong entri yang detail.
- **Perenderaan Aman (Perlindungan XSS)**: Membersihkan input dengan merender pesan/inisial menggunakan `.textContent` / `.innerText` untuk mencegah injeksi HTML/Script.
- **Sinkronisasi Berbasis Event**: Memperbarui visual secara real-time di seluruh komponen CLI dan GUI saat menerima sinyal event kustom.
- **Penyimpanan Lokal (Local Storage)**: Menyimpan entri secara lokal dengan blok try-catch untuk mencegah crash pada data penyimpanan yang tidak valid.

### 7. Estetika Monitor CRT Retro
- **Scanline CRT**: Efek fosfor buatan dan kisi scanline horizontal.
- **Efek Flickering**: Animasi flicker layar monitor CRT listrik.
- **Tipografi Piksel**: Memuat Google Fonts `Press Start 2P` & `VT323` yang cocok dengan konfigurasi sistem retro.

---

## 🛠️ Stack Teknologi & Arsitektur

- **Bundler & Server**: Vite
- **Logika**: Vanilla JS (Custom Web Elements, ES Modules)
- **Gaya**: Vanilla CSS (Variabel, Flexbox, CSS Grid)
- **Render 3D**: Google `@google/model-viewer` & `three.js` (Lazy-loaded)
- **Pengujian**: Vitest dengan `jsdom` (Verifikasi TDD)
- **Filosofi Desain**: **Gaya Ponytail** (Tanpa boilerplate framework, menggunakan API standar web, baris kode minimal).

---

## 🧪 Menjalankan Pengujian & Pengembangan

Mulai server pengembangan:
```bash
npm run dev
```

Jalankan rangkaian pengujian unit dan integrasi:
```bash
npm run test
```

Cakupan pengujian memvalidasi:
- Logika perutean autocomplete.
- Analisis argumen CLI yang mempertahankan spasi.
- Pencegahan celah keamanan XSS.
- Pengurutan skor tinggi & skema struktur JSON.
- Pembuatan markup kartu proyek.
- Validasi skema misi dan konsistensi ID kebab-case.
- Penanganan klik akordeon dan rendering mock UI.
- Skema data JSON karakter dan keluaran ikon SVG.
- Rendering konsol status CLI seleksi karakter dan pemotongan baris string.
