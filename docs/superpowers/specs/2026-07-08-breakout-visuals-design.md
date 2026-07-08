# Spesifikasi Desain - Kustomisasi Visual Piring dan Bungkusan Bumbu Breakout

Spesifikasi ini mendefinisikan perubahan gaya visual untuk minigame Breakout di dalam drawer kabinet portofolio ZidanDev.

## 1. Konseptual & Estetika Retro
Mengubah aset bentuk geometris dasar (papan persegi panjang magenta dan bola lingkaran cyan) menjadi objek bertema kuliner tradisional dengan resolusi 8-bit piksel:
*   **Papan (Paddle)** diubah menjadi **Piring Makan Tradisional** seng/keramik bergaris biru.
*   **Bola (Ball)** diubah menjadi **Bungkusan Bumbu Saset** (mie instan/penyedap rasa) lengkap dengan pinggiran gerigi kemasan.

## 2. Implementasi Gambar Canvas 2D (`RetroGame.js`)

Perubahan rendering visual di dalam metode `_draw()` pada berkas `src/components/RetroGame.js`:

### A. Rendering Piring Tradisional (Papan)
Menggantikan `fillRect` warna magenta sederhana dengan penggambaran piring seng:
```javascript
    // Draw plate (piring) paddle
    const px = this.paddleX;
    const py = this.height - this.paddleHeight;
    const pw = this.paddleWidth;
    const ph = this.paddleHeight;

    // Body piring abu-abu terang / putih seng
    this.ctx.fillStyle = "#e0e0e0";
    this.ctx.fillRect(px + 4, py + 2, pw - 8, ph - 2); // bagian tengah piring
    this.ctx.fillRect(px, py, 4, 3); // bibir piring kiri
    this.ctx.fillRect(px + 2, py + 2, 2, 2);
    this.ctx.fillRect(px + pw - 4, py, 4, 3); // bibir piring kanan
    this.ctx.fillRect(px + pw - 4, py + 2, 2, 2);

    // Garis hiasan piring tradisional biru
    this.ctx.fillStyle = "#0078d4";
    this.ctx.fillRect(px + 6, py + 4, pw - 12, 1.5);
```

### B. Rendering Bungkusan Bumbu (Bola)
Menggantikan rendering busur lingkaran (`arc`) dengan penggambaran kotak kemasan bumbu saset berukuran 8x8 piksel:
```javascript
    // Draw seasoning packet (bungkusan bumbu)
    const bx = this.ballX - 4;
    const by = this.ballY - 4;
    const size = 8;

    // Warna dasar kuning kemasan
    this.ctx.fillStyle = "#ffd343";
    this.ctx.fillRect(bx, by, size, size);

    // Label tengah merah
    this.ctx.fillStyle = "#ff2d20";
    this.ctx.fillRect(bx + 2, by + 2, size - 4, size - 4);

    // Efek gerigi kemasan atas dan bawah
    this.ctx.fillStyle = "#b58d10";
    for (let i = 0; i < size; i += 2) {
      this.ctx.fillRect(bx + i, by, 1, 1);
      this.ctx.fillRect(bx + i + 1, by + size - 1, 1, 1);
    }
```

## 3. Rencana Pengujian
*   Menjalankan unit test minigame untuk memastikan tidak ada perubahan logika tabrakan (physics) bola dan papan yang rusak.
*   Memastikan rendering berjalan lancar tanpa penurunan FPS pada browser.
