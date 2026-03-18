import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ── Configuration ──
const GRAVITY = 0.6;
const JUMP_VELOCITY = -12;
const INITIAL_SPEED = 5;
const MAX_SPEED = 14;
const SPEED_INCREMENT = 0.001;
const GROUND_Y_RATIO = 0.8;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 48;
const DUCK_HEIGHT = 28;
const OBSTACLE_MIN_GAP = 80;
const TRAIL_COUNT = 5;
const SCORE_FLASH_INTERVAL = 100;
const MAX_DPR = 2;

const NEON_CYAN = '#00f0ff';
const NEON_MAGENTA = '#ff00e5';
const NEON_GREEN = '#39ff14';
const BG_COLOR = '#0a0a0f';

type GameState = 'idle' | 'running' | 'gameover';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  y: number; // top of the obstacle
  type: 'ground' | 'air';
}

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
}

interface NeonRunnerGameProps {
  onClose?: () => void;
  autoStart?: boolean;
}

export default function NeonRunnerGame({ autoStart = false }: NeonRunnerGameProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [optedIn, setOptedIn] = useState(false);

  const stateRef = useRef({
    gameState: 'idle' as GameState,
    playerY: 0,
    velocityY: 0,
    isDucking: false,
    speed: INITIAL_SPEED,
    score: 0,
    highScore: 0,
    obstacles: [] as Obstacle[],
    trail: [] as TrailDot[],
    groundOffset: 0,
    frameCount: 0,
    lastObstacleX: 0,
    animationId: 0,
    paused: false,
    canvasW: 0,
    canvasH: 0,
    groundY: 0,
    isMobile: false,
    scoreFlash: 0,
  });

  // Force re-render for score display
  const [, setTick] = useState(0);

  const getGroundY = useCallback((h: number) => Math.floor(h * GROUND_Y_RATIO), []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.gameState = 'running';
    s.playerY = s.groundY - PLAYER_HEIGHT;
    s.velocityY = 0;
    s.isDucking = false;
    s.speed = INITIAL_SPEED;
    s.score = 0;
    s.obstacles = [];
    s.trail = [];
    s.groundOffset = 0;
    s.frameCount = 0;
    s.lastObstacleX = s.canvasW;
    s.scoreFlash = 0;
    setTick((n) => n + 1);
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === 'idle' || s.gameState === 'gameover') {
      startGame();
      s.velocityY = JUMP_VELOCITY;
      return;
    }
    if (s.gameState === 'running' && s.playerY >= s.groundY - PLAYER_HEIGHT - 1) {
      s.velocityY = JUMP_VELOCITY;
    }
  }, [startGame]);

  const setDucking = useCallback((ducking: boolean) => {
    stateRef.current.isDucking = ducking;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReduced);

    // Load high score
    try {
      const saved = localStorage.getItem('neonRunnerHighScore');
      if (saved) stateRef.current.highScore = parseInt(saved, 10) || 0;
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (reducedMotion && !optedIn) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = stateRef.current;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
      const rect = container!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.canvasW = w;
      s.canvasH = h;
      s.groundY = getGroundY(h);
      s.isMobile = w < 640;
      if (s.gameState === 'idle') {
        s.playerY = s.groundY - PLAYER_HEIGHT;
      }
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function handleVisibility() {
      s.paused = document.hidden;
    }
    document.addEventListener('visibilitychange', handleVisibility);

    // ── Input handlers ──
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        setDucking(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === 'ArrowDown') {
        setDucking(false);
      }
    }
    function handleTouch(e: TouchEvent) {
      e.preventDefault();
      jump();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    if (autoStart && s.gameState === 'idle') {
      startGame();
    }

    // ── Spawn obstacles ──
    function spawnObstacle() {
      const minGap = OBSTACLE_MIN_GAP + s.speed * 15;
      if (s.canvasW - s.lastObstacleX < minGap) return;
      if (Math.random() > 0.02) return;

      const isAir = !s.isMobile && Math.random() < 0.3;
      const width = 20 + Math.random() * 20;
      const height = isAir ? 20 + Math.random() * 15 : 30 + Math.random() * 30;
      const y = isAir ? s.groundY - PLAYER_HEIGHT - 10 - Math.random() * 20 : s.groundY - height;

      s.obstacles.push({ x: s.canvasW + 10, width, height, y, type: isAir ? 'air' : 'ground' });
      s.lastObstacleX = s.canvasW + 10;
    }

    // ── Collision ──
    function checkCollision() {
      const ph = s.isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT;
      const px = 40;
      const py = s.isDucking ? s.groundY - DUCK_HEIGHT : s.playerY;
      const pw = PLAYER_WIDTH;

      for (const obs of s.obstacles) {
        if (
          px < obs.x + obs.width &&
          px + pw > obs.x &&
          py < obs.y + obs.height &&
          py + ph > obs.y
        ) {
          return true;
        }
      }
      return false;
    }

    // ── Draw helpers ──
    function drawGlow(color: string, blur: number, fn: () => void) {
      ctx!.save();
      ctx!.shadowColor = color;
      ctx!.shadowBlur = blur;
      fn();
      ctx!.restore();
    }

    function drawPlayer() {
      const px = 40;
      const ducking = s.isDucking;
      const py = ducking ? s.groundY - DUCK_HEIGHT : s.playerY;
      const h = ducking ? DUCK_HEIGHT : PLAYER_HEIGHT;
      const running = s.gameState === 'running';
      const legPhase = running ? Math.floor(s.frameCount / 6) % 2 : 0;

      drawGlow(NEON_CYAN, 10, () => {
        ctx!.strokeStyle = NEON_CYAN;
        ctx!.lineWidth = 2;
        ctx!.beginPath();

        // Head
        const headR = ducking ? 5 : 6;
        const headCx = px + PLAYER_WIDTH / 2;
        const headCy = py + headR + 1;
        ctx!.arc(headCx, headCy, headR, 0, Math.PI * 2);
        ctx!.stroke();

        // Body
        const bodyTop = headCy + headR;
        const bodyBottom = py + h - (ducking ? 8 : 16);
        ctx!.beginPath();
        ctx!.moveTo(headCx, bodyTop);
        ctx!.lineTo(headCx, bodyBottom);
        ctx!.stroke();

        // Arms
        const armY = bodyTop + (ducking ? 4 : 8);
        ctx!.beginPath();
        if (ducking) {
          ctx!.moveTo(headCx - 8, armY);
          ctx!.lineTo(headCx + 8, armY);
        } else {
          const armSwing = running ? (legPhase === 0 ? 4 : -4) : 0;
          ctx!.moveTo(headCx - 10, armY + armSwing);
          ctx!.lineTo(headCx, armY);
          ctx!.lineTo(headCx + 10, armY - armSwing);
        }
        ctx!.stroke();

        // Legs
        ctx!.beginPath();
        if (ducking) {
          ctx!.moveTo(headCx, bodyBottom);
          ctx!.lineTo(headCx - 8, py + h);
          ctx!.moveTo(headCx, bodyBottom);
          ctx!.lineTo(headCx + 8, py + h);
        } else if (legPhase === 0) {
          ctx!.moveTo(headCx, bodyBottom);
          ctx!.lineTo(headCx - 8, py + h);
          ctx!.moveTo(headCx, bodyBottom);
          ctx!.lineTo(headCx + 4, py + h);
        } else {
          ctx!.moveTo(headCx, bodyBottom);
          ctx!.lineTo(headCx + 8, py + h);
          ctx!.moveTo(headCx, bodyBottom);
          ctx!.lineTo(headCx - 4, py + h);
        }
        ctx!.stroke();
      });
    }

    function drawObstacles() {
      drawGlow(NEON_MAGENTA, 8, () => {
        ctx!.fillStyle = NEON_MAGENTA;
        for (const obs of s.obstacles) {
          if (obs.type === 'ground') {
            // Triangle
            ctx!.beginPath();
            ctx!.moveTo(obs.x + obs.width / 2, obs.y);
            ctx!.lineTo(obs.x + obs.width, obs.y + obs.height);
            ctx!.lineTo(obs.x, obs.y + obs.height);
            ctx!.closePath();
            ctx!.fill();
          } else {
            // Diamond
            const cx = obs.x + obs.width / 2;
            const cy = obs.y + obs.height / 2;
            ctx!.beginPath();
            ctx!.moveTo(cx, obs.y);
            ctx!.lineTo(obs.x + obs.width, cy);
            ctx!.lineTo(cx, obs.y + obs.height);
            ctx!.lineTo(obs.x, cy);
            ctx!.closePath();
            ctx!.fill();
          }
        }
      });
    }

    function drawGround() {
      ctx!.save();
      ctx!.shadowColor = NEON_CYAN;
      ctx!.shadowBlur = 4;
      ctx!.strokeStyle = NEON_CYAN;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([8, 6]);
      ctx!.lineDashOffset = -s.groundOffset;
      ctx!.beginPath();
      ctx!.moveTo(0, s.groundY);
      ctx!.lineTo(s.canvasW, s.groundY);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawTrail() {
      for (const dot of s.trail) {
        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(57, 255, 20, ${dot.opacity})`;
        ctx!.fill();
      }
    }

    function drawScore() {
      const flash = s.scoreFlash > 0;
      const color = flash ? NEON_CYAN : NEON_GREEN;
      ctx!.save();
      ctx!.shadowColor = color;
      ctx!.shadowBlur = flash ? 12 : 6;
      ctx!.fillStyle = color;
      ctx!.font = '16px "Fira Code", monospace';
      ctx!.textAlign = 'right';
      ctx!.fillText(`${t('game.score')}: ${s.score}`, s.canvasW - 16, 30);
      ctx!.fillStyle = NEON_GREEN;
      ctx!.shadowBlur = 4;
      ctx!.fillText(`${t('game.highScore')}: ${s.highScore}`, s.canvasW - 16, 52);
      ctx!.restore();
    }

    function drawIdleScreen() {
      ctx!.save();
      ctx!.fillStyle = NEON_CYAN;
      ctx!.shadowColor = NEON_CYAN;
      ctx!.shadowBlur = 8;
      ctx!.font = '18px "Space Grotesk", sans-serif';
      ctx!.textAlign = 'center';
      ctx!.fillText(t('game.start'), s.canvasW / 2, s.canvasH / 2);
      ctx!.restore();
    }

    function drawGameOver() {
      ctx!.save();
      ctx!.fillStyle = NEON_MAGENTA;
      ctx!.shadowColor = NEON_MAGENTA;
      ctx!.shadowBlur = 12;
      ctx!.font = 'bold 28px "Space Grotesk", sans-serif';
      ctx!.textAlign = 'center';
      ctx!.fillText(t('game.gameOver'), s.canvasW / 2, s.canvasH / 2 - 20);
      ctx!.font = '16px "Space Grotesk", sans-serif';
      ctx!.fillStyle = NEON_CYAN;
      ctx!.shadowColor = NEON_CYAN;
      ctx!.shadowBlur = 6;
      ctx!.fillText(t('game.restart'), s.canvasW / 2, s.canvasH / 2 + 16);
      ctx!.restore();
    }

    // ── Main loop ──
    function update() {
      if (s.gameState !== 'running') return;

      // Player physics
      s.velocityY += GRAVITY;
      s.playerY += s.velocityY;
      if (s.playerY >= s.groundY - (s.isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT)) {
        s.playerY = s.groundY - (s.isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT);
        s.velocityY = 0;
      }

      // Speed up
      if (s.speed < MAX_SPEED) {
        s.speed += SPEED_INCREMENT;
      }

      // Move obstacles
      for (const obs of s.obstacles) {
        obs.x -= s.speed;
      }
      s.obstacles = s.obstacles.filter((obs) => obs.x + obs.width > -20);

      // Track last obstacle x for gap calculation
      if (s.obstacles.length > 0) {
        s.lastObstacleX = Math.max(...s.obstacles.map((o) => o.x));
      } else {
        s.lastObstacleX = 0;
      }

      // Ground scroll
      s.groundOffset = (s.groundOffset + s.speed) % 14;

      // Trail
      const trailY = s.isDucking ? s.groundY - DUCK_HEIGHT / 2 : s.playerY + PLAYER_HEIGHT / 2;
      s.trail.push({ x: 40 - 5, y: trailY + (Math.random() - 0.5) * 6, opacity: 0.6 });
      if (s.trail.length > TRAIL_COUNT) s.trail.shift();
      for (const dot of s.trail) {
        dot.opacity -= 0.12;
        dot.x -= s.speed * 0.4;
      }
      s.trail = s.trail.filter((d) => d.opacity > 0);

      // Score
      s.frameCount++;
      if (s.frameCount % 5 === 0) {
        s.score++;
        if (s.score % SCORE_FLASH_INTERVAL === 0) {
          s.scoreFlash = 20;
        }
      }
      if (s.scoreFlash > 0) s.scoreFlash--;

      // Spawn
      spawnObstacle();

      // Collision
      if (checkCollision()) {
        s.gameState = 'gameover';
        if (s.score > s.highScore) {
          s.highScore = s.score;
          try {
            localStorage.setItem('neonRunnerHighScore', String(s.highScore));
          } catch {
            // ignore
          }
        }
        setTick((n) => n + 1);
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, s.canvasW, s.canvasH);
      ctx!.fillStyle = BG_COLOR;
      ctx!.fillRect(0, 0, s.canvasW, s.canvasH);

      drawGround();
      drawTrail();
      drawPlayer();
      drawObstacles();
      drawScore();

      if (s.gameState === 'idle') drawIdleScreen();
      if (s.gameState === 'gameover') drawGameOver();
    }

    function loop() {
      if (!s.paused) {
        update();
        draw();
      }
      s.animationId = requestAnimationFrame(loop);
    }

    s.animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.animationId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, [reducedMotion, optedIn, autoStart, t, jump, setDucking, startGame, getGroundY]);

  if (reducedMotion && !optedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-text-secondary">{t('game.reducedMotion')}</p>
        <button
          onClick={() => setOptedIn(true)}
          className="rounded-lg border border-neon-cyan px-4 py-2 text-neon-cyan transition-colors hover:bg-neon-cyan/10"
        >
          {t('game.reducedMotionPlay')}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[200px] w-full sm:h-[300px]"
      aria-label={t('game.ariaLabel')}
      role="application"
    >
      <canvas ref={canvasRef} className="block h-full w-full rounded-lg" />
    </div>
  );
}
