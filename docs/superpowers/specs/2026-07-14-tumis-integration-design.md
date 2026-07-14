# Spesifikasi Desain - Integrasi Proyek TUMIS & Perapian Repositori Git

Spesifikasi ini mendefinisikan penambahan proyek "TUMIS" oleh Bumbu Studio ke bagian portofolio, pendaftaran teknologi baru Rust & Tauri ke dalam Inventaris Keahlian, dan pembersihan file pelacakan internal alat bantu pengembang dari repositori Git.

## 1. Penyalinan Aset Gambar Proyek
*   File `d:\Proyek Coding\PortofolioWeb\Tumis.png` disalin ke folder publik `public/Tumis.png` sehingga dapat dimuat di browser dengan path absolut `/Tumis.png`.

## 2. Struktur Data Proyek Baru
*   **Proyek**: TUMIS (Tugas, Waktu & Musik)
*   **Kategori**: `studio` (Bumbu Studio)
*   **Deskripsi**: Aplikasi desktop produktivitas terintegrasi Pomodoro timer LCD neon, papan Kanban drag-and-drop interaktif, pemutar musik Vinyl 8-bit, Rust filesystem folder scanner, dan YouTube audio downloader.
*   **Teknologi**: `Tauri v2`, `Rust`, `Web Audio API`, `HTML5`, `CSS3`, `JavaScript`, `Deno`, `yt-dlp`.
*   **GitHub**: `https://github.com/zidanLPTP/TumisApp`
*   **Gambar**: `/Tumis.png`

## 3. Penambahan Inventaris Keahlian
*   **Rust**:
    *   ID: `rust`
    *   Tipe: `Language`
    *   Stats: `INT +62, DEF +55`
    *   Ikon: SVG gir oranye retro 16x16.
*   **Tauri**:
    *   ID: `tauri`
    *   Tipe: `Framework`
    *   Stats: `AGI +60, INT +58`
    *   Ikon: SVG perisai biru muda retro 16x16.

## 4. Modifikasi Komponen & Tampilan Visual
*   **ProjectCard.js**: Menambahkan elemen `<div class="card-image-wrapper"><img src="${project.image}" ... /></div>` jika `project.image` tersedia.
*   **style.css**:
    *   Menambahkan aturan `.card-image-wrapper` dengan tinggi `160px`, `overflow: hidden`, dan batas bawah (border) berwarna sesuai kategori kartu.
    *   Menambahkan aturan `.card-image` dengan `object-fit: cover`, `image-rendering: pixelated` (atau `crisp-edges`), dan efek pembesaran skala (`transform: scale(1.05)`) saat hover.

## 5. Pembersihan Folder & Berkas Pelacakan Git
*   **Aturan .gitignore Baru**:
    Mengabaikan seluruh folder `.superpowers/`, berkas gambar sementara `image.png`, dan file manual pengembang `readme tumis.md`.
*   **Perintah Untrack Git**:
    Menghapus berkas `.superpowers/sdd/progress.md` dari index Git tanpa menghapusnya dari disk lokal:
    ```bash
    git rm --cached .superpowers/sdd/progress.md
    ```
