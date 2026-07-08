# Spesifikasi Desain - Pembaruan Stat Karakter, Keahlian SQL, dan Log Misi

Spesifikasi ini mendefinisikan perubahan data dan visual untuk antarmuka Portofolio Retro Arcade ZidanDev.

## 1. Penyesuaian Stat & Deskripsi Karakter (`characters.json`)
Stat ketiga kelas karakter disesuaikan untuk merepresentasikan fase keahlian pengguna secara realistis (100% adalah tingkat Master):

*   **DEVELOPER** (Menguasai JavaScript, Python, PHP, Laravel, Java, Dart, Flutter):
    *   Deskripsi: "Menguasai JavaScript dan Python untuk membangun aplikasi web yang cepat, interaktif, serta skrip otomatisasi/scraping data dinamis."
    *   Stat: HP 65%, MP 70%, INT 72%, STR 50%, AGI 68%
*   **3D ARTIST** (Pemodelan Bangunan 3D Dasar):
    *   Deskripsi: "Fokus pada pembuatan pemodelan bangunan 3D bergaya low-to-mid poly dengan detail struktural murni tanpa shader kompleks."
    *   Stat: HP 45%, MP 30%, INT 40%, STR 35%, AGI 45%
*   **GAMER** (Pemula Godot & Game Retro):
    *   Deskripsi: "Menggemari game retro klasik dan mulai mempelajari dasar-dasar pengembangan game menggunakan game engine Godot."
    *   Stat: HP 55%, MP 20%, INT 40%, STR 30%, AGI 50%

## 2. Penambahan SQL pada Inventaris Keahlian (`skills.json` & `SkillSprites.js`)
*   **Data Baru (`skills.json`)**:
    ```json
    {
      "id": "sql",
      "name": "SQL",
      "iconType": "sql",
      "type": "Database",
      "stats": "INT +50, DEX +42",
      "description": "Menguasai dasar-dasar query SQL (SELECT, INSERT, JOIN) untuk pengelolaan database relasional."
    }
    ```
*   **Ikon Baru (`SkillSprites.js`)**:
    Menambahkan ikon lencana piksel berwarna biru bertuliskan `SQL`.

## 3. Pembaruan Log Misi (`quests.json`)
Daftar misi aktif dan selesai diubah menjadi:
*   **Active (Misi Aktif)**:
    1.  `unri-student`: Kuliah Informatika di Universitas Riau (Semester 5) (2024 - Sekarang)
    2.  `ieee-webmaster`: Web Master di IEEE SB UNRI (22 Des 2025 - Sekarang)
    3.  `erc-researcher`: Anggota Department Research ERC UNRI (2026 - Sekarang)
    4.  `kse-divisi`: Anggota Divisi Pendidikan & Pelatihan KSE UNRI (2025 - 2026)
*   **Completed (Misi Selesai)**:
    5.  `school-grad`: Lulus dari SMA Negeri 2 Sawahlunto (2021 - 2024)
