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

    // Paddle
    this.paddleHeight = 8;
    this.paddleWidth = 50;
    this.paddleX = (this.width - this.paddleWidth) / 2;

    // Ball
    this.ballRadius = 4;
    this.ballX = this.width / 2;
    this.ballY = this.height - 30;
    this.ballDx = 2;
    this.ballDy = -2;

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
    };

    this._keyupHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.rightPressed = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.leftPressed = false;
    };

    this._touchHandler = (e) => {
      if (!this.active) return;
      const rect = this.canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      // Scale coordinates to canvas width
      const canvasTouchX = (touchX / rect.width) * this.width;
      this.paddleX = canvasTouchX - this.paddleWidth / 2;

      // Keep inside bounds
      if (this.paddleX < 0) this.paddleX = 0;
      if (this.paddleX > this.width - this.paddleWidth) this.paddleX = this.width - this.paddleWidth;
    };

    this._clickHandler = () => {
      if (this.gameOver || this.victory) {
        this.reset();
        this.start();
      }
    };

    window.addEventListener('keydown', this._keydownHandler);
    window.addEventListener('keyup', this._keyupHandler);
    this.canvas.addEventListener('touchmove', this._touchHandler, { passive: true });
    this.canvas.addEventListener('touchstart', this._touchHandler, { passive: true });
    this.canvas.addEventListener('click', this._clickHandler);
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
  }

  _updateScoreBoard() {
    if (this.scoreSpan) this.scoreSpan.textContent = this.score.toString().padStart(3, '0');
    if (this.livesSpan) this.livesSpan.textContent = this.lives.toString();
  }

  _updatePhysics() {
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
          this.ballDx = 2;
          this.ballDy = -2;
          this.paddleX = (this.width - this.paddleWidth) / 2;
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

    // Draw paddle
    this.ctx.fillStyle = "magenta";
    this.ctx.fillRect(this.paddleX, this.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);

    // Draw ball
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "cyan";
    this.ctx.fill();
    this.ctx.closePath();

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
  }
}
