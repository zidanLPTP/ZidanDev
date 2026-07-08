export class RetroGame {
  constructor(canvasId, scoreId, livesId, onFinished) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById(scoreId);
    this.livesSpan = document.getElementById(livesId);
    this.onFinished = onFinished;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Reset Parameters
    this.reset();

    // Bind controls
    this.rightPressed = false;
    this.leftPressed = false;
    this._setupControls();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.victory = false;
    this.active = false;
    this.rAF = null;
    this.gameStarted = false;
    this.countdown = 0;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // Paddle
    this.paddleHeight = 8;
    this.paddleWidth = 50;
    this.paddleX = (this.width - this.paddleWidth) / 2;

    // Ball (Slower ball speed: 1.2 pixels/frame, down from 2)
    this.ballRadius = 4;
    this.ballX = this.width / 2;
    this.ballY = this.height - 30;
    this.ballDx = 1.2;
    this.ballDy = -1.2;

    // Bricks Grid (3 rows x 6 columns)
    this.brickRows = 3;
    this.brickCols = 6;
    this.brickWidth = 40;
    this.brickHeight = 10;
    this.brickPadding = 4;
    this.brickOffsetTop = 20;
    this.brickOffsetLeft = 10;

    this.bricks = [];
    for (let c = 0; c < this.brickCols; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRows; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    this._updateScoreBoard();
  }

  _setupControls() {
    this._keydownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.rightPressed = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.leftPressed = true;
      if ((e.key === 'Enter' || e.key === ' ') && !this.gameStarted && this.countdown === 0) {
        e.preventDefault();
        this.startCountdown();
      }
    };

    this._keyupHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.rightPressed = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.leftPressed = false;
    };

    this._touchHandler = (e) => {
      if (!this.active) return;
      const rect = this.canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const canvasTouchX = (touchX / rect.width) * this.width;
      this.paddleX = canvasTouchX - this.paddleWidth / 2;

      if (this.paddleX < 0) this.paddleX = 0;
      if (this.paddleX > this.width - this.paddleWidth) this.paddleX = this.width - this.paddleWidth;
    };

    this._clickHandler = () => {
      if (this.gameOver || this.victory) {
        this.reset();
        this.start();
        return;
      }
      if (!this.gameStarted && this.countdown === 0) {
        this.startCountdown();
      }
    };

    window.addEventListener('keydown', this._keydownHandler);
    window.addEventListener('keyup', this._keyupHandler);
    this.canvas.addEventListener('touchmove', this._touchHandler, { passive: true });
    this.canvas.addEventListener('touchstart', this._touchHandler, { passive: true });
    this.canvas.addEventListener('click', this._clickHandler);
  }

  startCountdown() {
    this.countdown = 3;
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        this.gameStarted = true;
      }
    }, 1000);
  }

  destroy() {
    if (!this.canvas) return;
    window.removeEventListener('keydown', this._keydownHandler);
    window.removeEventListener('keyup', this._keyupHandler);
    this.canvas.removeEventListener('touchmove', this._touchHandler);
    this.canvas.removeEventListener('touchstart', this._touchHandler);
    this.canvas.removeEventListener('click', this._clickHandler);
    this.stop();
  }

  start() {
    if (!this.canvas || this.active) return;
    this.active = true;
    const loop = () => {
      if (!this.active) return;
      this._updatePhysics();
      this._draw();
      this.rAF = requestAnimationFrame(loop);
    };
    this.rAF = requestAnimationFrame(loop);
  }

  stop() {
    this.active = false;
    if (this.rAF) {
      cancelAnimationFrame(this.rAF);
      this.rAF = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  _updateScoreBoard() {
    if (this.scoreSpan) this.scoreSpan.textContent = this.score.toString().padStart(3, '0');
    if (this.livesSpan) this.livesSpan.textContent = this.lives.toString();
  }

  _updatePhysics() {
    if (!this.gameStarted || this.countdown > 0) {
      // Allow the player to move the paddle and practice before starting!
      if (this.rightPressed && this.paddleX < this.width - this.paddleWidth) this.paddleX += 3;
      if (this.leftPressed && this.paddleX > 0) this.paddleX -= 3;
      return;
    }
    if (this.gameOver || this.victory) return;

    // Move paddle
    if (this.rightPressed && this.paddleX < this.width - this.paddleWidth) this.paddleX += 3;
    if (this.leftPressed && this.paddleX > 0) this.paddleX -= 3;

    // Collision with walls
    if (this.ballX + this.ballDx > this.width - this.ballRadius || this.ballX + this.ballDx < this.ballRadius) {
      this.ballDx = -this.ballDx;
    }

    // Ceiling collision
    if (this.ballY + this.ballDy < this.ballRadius) {
      this.ballDy = -this.ballDy;
    } else if (this.ballY + this.ballDy > this.height - this.ballRadius - this.paddleHeight) {
      // Bounce off paddle
      if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
        this.ballDy = -this.ballDy;
      } else {
        // Drop ball: lose a life
        this.lives--;
        this._updateScoreBoard();
        if (this.lives === 0) {
          this.gameOver = true;
          if (this.onFinished) this.onFinished(this.score);
        } else {
          // Reset ball position
          this.ballX = this.width / 2;
          this.ballY = this.height - 30;
          this.ballDx = 1.2;
          this.ballDy = -1.2;
          this.paddleX = (this.width - this.paddleWidth) / 2;
          this.gameStarted = false;
          this.countdown = 0;
        }
      }
    }

    // Brick Collision
    let activeBricks = 0;
    for (let c = 0; c < this.brickCols; c++) {
      for (let r = 0; r < this.brickRows; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          activeBricks++;
          const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          b.x = brickX;
          b.y = brickY;

          if (this.ballX > brickX && this.ballX < brickX + this.brickWidth &&
              this.ballY > brickY && this.ballY < brickY + this.brickHeight) {
            this.ballDy = -this.ballDy;
            b.status = 0;
            this.score += 100;
            this._updateScoreBoard();
          }
        }
      }
    }

    // Victory Check
    if (activeBricks === 0) {
      this.victory = true;
      if (this.onFinished) this.onFinished(this.score);
    }

    // Move ball
    this.ballX += this.ballDx;
    this.ballY += this.ballDy;
  }

  _draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.gameOver) {
      this.ctx.font = "14px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "red";
      this.ctx.textAlign = "center";
      this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2 - 10);
      this.ctx.font = "8px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("TAP OR CLICK TO RESTART", this.width / 2, this.height / 2 + 15);
      return;
    }

    if (this.victory) {
      this.ctx.font = "14px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "lime";
      this.ctx.textAlign = "center";
      this.ctx.fillText("VICTORY!", this.width / 2, this.height / 2 - 10);
      this.ctx.font = "8px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("TAP OR CLICK TO PLAY AGAIN", this.width / 2, this.height / 2 + 15);
      return;
    }


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

    // Draw bricks

    for (let c = 0; c < this.brickCols; c++) {
      for (let r = 0; r < this.brickRows; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          
          // Color coding by row
          if (r === 0) this.ctx.fillStyle = "red";
          else if (r === 1) this.ctx.fillStyle = "yellow";
          else this.ctx.fillStyle = "green";

          this.ctx.fillRect(brickX, brickY, this.brickWidth, this.brickHeight);
        }
      }
    }

    if (!this.gameStarted) {
      if (this.countdown > 0) {
        // Draw Countdown
        this.ctx.font = "24px 'Press Start 2P', sans-serif";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.countdown.toString(), this.width / 2, this.height / 2 + 10);
      } else {
        // Draw Tutorial / Start Prompt
        this.ctx.font = "10px 'Press Start 2P', sans-serif";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "center";
        this.ctx.fillText("BUMBU BREAKOUT", this.width / 2, this.height / 2 - 25);

        this.ctx.font = "8px 'Press Start 2P', sans-serif";
        this.ctx.fillStyle = "white";
        // Flash text
        if (Math.floor(Date.now() / 500) % 2 === 0) {
          this.ctx.fillText("[ CLICK TO START ]", this.width / 2, this.height / 2);
        }

        this.ctx.font = "6px 'Press Start 2P', sans-serif";
        this.ctx.fillStyle = "cyan";
        this.ctx.fillText("GESER PADDLE UNTUK LATIHAN", this.width / 2, this.height / 2 + 25);
        this.ctx.fillText("A/D ATAU TOMBOL PANAH", this.width / 2, this.height / 2 + 37);
      }
      return;
    }

    // Draw seasoning packet (bungkusan bumbu) ball
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
  }

}
