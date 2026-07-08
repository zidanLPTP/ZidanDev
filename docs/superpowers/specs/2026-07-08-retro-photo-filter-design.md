# Spesifikasi Desain - Filter Foto Retro Dinamis

Spesifikasi ini mendefinisikan implementasi integrasi foto retro dinamis pada panel Status Karakter di Website Portofolio Retro Arcade.

## 1. Tujuan Visual
Menampilkan foto asli pengguna (`public/zidan.jpg`) dengan gaya visual retro 8-bit monokrom dinamis. Warna foto akan berubah secara otomatis menyesuaikan warna tema kelas karakter yang sedang aktif di layar.

## 2. Struktur Komponen & Fallback Pintar
Di dalam `src/main.js`, penayangan potret karakter pada elemen `#char-portrait` diubah dari hanya mencetak SVG menjadi struktur kontainer HTML berikut:

```html
<div class="pixelated-photo-container ${id}">
  <img src="/zidan.jpg" class="retro-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
  <div class="fallback-sprite" style="display: none;">
    ${getCharacterSprite(id)}
  </div>
</div>
```

*   **Logika Umpan Balik (`onerror`)**: Jika berkas gambar `/zidan.jpg` gagal dimuat, elemen gambar disembunyikan dan SVG kartun bawaan (`getCharacterSprite(id)`) ditampilkan sebagai cadangan otomatis.

## 3. Aturan CSS Retro
Aturan CSS berikut ditambahkan ke dalam berkas `src/style.css` untuk menciptakan filter retro piksel monitor tabung:

```css
.pixelated-photo-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  border: 2px solid var(--text-cyan);
}

/* Transisi border kontainer sesuai kelas aktif */
.pixelated-photo-container.developer { border-color: var(--text-cyan); }
.pixelated-photo-container.artist { border-color: var(--text-yellow); }
.pixelated-photo-container.gamer { border-color: var(--text-magenta); }

.retro-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  filter: grayscale(1) contrast(1.8) brightness(1.1);
}

/* Layer pewarnaan monokrom retro menggunakan blend mode multiply */
.pixelated-photo-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.pixelated-photo-container.developer::after {
  background-color: var(--text-cyan);
  mix-blend-mode: multiply;
}

.pixelated-photo-container.artist::after {
  background-color: var(--text-yellow);
  mix-blend-mode: multiply;
}

.pixelated-photo-container.gamer::after {
  background-color: var(--text-magenta);
  mix-blend-mode: multiply;
}
```

## 4. Rencana Pengujian
*   Verifikasi pemuatan gambar `/zidan.jpg` lokal berhasil.
*   Verifikasi fallback SVG berjalan jika gambar diubah namanya/dihapus.
*   Uji transisi blend mode warna monokrom saat memilih kelas karakter yang berbeda (Developer, Artist, Gamer).
