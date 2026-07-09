# Spesifikasi Desain - Perbaikan Antarmuka Mobile (HP)

Spesifikasi ini mendefinisikan perubahan gaya responsif untuk meningkatkan keterbacaan, estetika, dan interaksi pengguna pada perangkat mobile (HP).

## 1. Pencegahan Pemotongan Teks & Wrapping Judul (Satu Baris)
*   **Section Headers (`.grid-section h2`)**: Mengurangi ukuran font agar tidak membungkus menjadi dua baris pada layar mobile.
*   **Buku Tamu Headers (`.leaderboard-panel h3`, `.guestbook-form-panel h3`)**: Menyesuaikan font agar muat dalam satu baris.
*   **Quest Tab Buttons (`.quest-tab-btn`) & Quest Titles (`.quest-title`) & Period (`.quest-period`)**: Memaksa teks tetap dalam satu baris menggunakan `white-space: nowrap` dan penyesuaian font size responsif.

## 2. Pencegahan Overflow Pesan Buku Tamu
*   **Table Cells (`.retro-table td`)**: Menambahkan pemisahan kata dinamis (`word-break: break-word` dan `overflow-wrap: anywhere`) agar pesan panjang tidak menembus batas tabel dan border card.

## 3. Optimasi Tinggi Card Kontak
*   **Contact Items (`.contact-link-item`)**: Menghilangkan efek pemanjangan tinggi yang disebabkan oleh properti `flex-basis: 250px` di dalam kolom flexbox pada mobile dengan menyetel `flex: none` dan `height: auto`.

## 4. Resolusi Tumpang Tindih Tombol & Akses Input CLI
*   **Tombol Navigasi Bawah (`#cli-toggle`, `#game-toggle`)**: Ketika ditutup, kurangi lebar minimal (`min-width: 0`) dan gunakan persentase lebar (`width: calc(50% - 25px)`) agar berdampingan rapi tanpa bertumpuk.
*   **Ketika CLI Terbuka**:
    *   Sembunyikan tombol Game Mode (`#game-toggle`) secara dinamis menggunakan selector `:has()`.
    *   Pindahkan tombol CLI Mode (`#cli-toggle`) ke sudut kanan atas panel CLI (menggunakan `bottom: 260px` pada mobile dan `bottom: 310px` pada tablet/desktop) sehingga bertindak sebagai tombol penutup dan membebaskan area pengetikan input CLI di bagian bawah secara penuh.

## 5. CSS Perubahan yang Diusulkan (`src/style.css`)
```css
/* Aturan Tambahan Mobile di Akhir File */
@media (max-width: 768px) {
  .contact-link-item {
    flex: none !important;
    width: 100%;
    height: auto;
  }
}

@media (max-width: 600px) {
  /* Header Font Adjustment */
  .grid-section h2 {
    font-size: 0.95rem !important;
  }
  .leaderboard-panel h3, .guestbook-form-panel h3 {
    font-size: 0.8rem !important;
  }

  /* Quest Items One-Line Fit */
  .quest-tab-btn {
    font-size: 0.65rem !important;
    padding: 6px 10px !important;
    white-space: nowrap;
  }
  .quest-tabs {
    gap: 8px;
    justify-content: center;
  }
  .quest-checkbox {
    font-size: 0.75rem !important;
  }
  .quest-title {
    font-size: 0.75rem !important;
    white-space: nowrap;
  }
  .quest-period {
    font-size: 0.65rem !important;
    white-space: nowrap;
  }
  .quest-header {
    gap: 8px;
    overflow: hidden;
  }
  .quest-title-row {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  /* Table Word-Break */
  .retro-table {
    font-size: 0.8rem !important;
  }
  .retro-table th {
    font-size: 0.65rem !important;
    padding: 4px !important;
  }
  .retro-table td {
    padding: 6px 4px !important;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  /* Toggle Buttons Layout */
  #cli-toggle, #game-toggle {
    min-width: 0 !important;
    width: calc(50% - 30px) !important;
    font-size: 0.75rem !important;
    padding: 0 5px !important;
  }

  /* CLI Mode Input Unblocking */
  #cli-panel:not(.closed) ~ #cli-toggle {
    bottom: 260px !important;
    right: 15px !important;
    height: 32px !important;
    min-width: 0 !important;
    width: auto !important;
    font-size: 0.7rem !important;
    padding: 0 10px !important;
  }
}

/* Hide Game Toggle when CLI Panel is Open */
body:has(#cli-panel:not(.closed)) #game-toggle {
  display: none !important;
}

/* Desktop Repositioning for CLI Close Toggle (to avoid covering input) */
#cli-panel:not(.closed) ~ #cli-toggle {
  bottom: 310px;
  height: 32px;
  min-width: 0;
  width: auto;
  font-size: 0.7rem;
  padding: 0 10px;
}
```
