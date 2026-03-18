import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ── Configuration ──
const GRAVITY = 0.5;
const JUMP_VELOCITY = -11;
const DOUBLE_JUMP_FACTOR = 0.85;
const INITIAL_SPEED = 3;
const MAX_SPEED = 9;
const SPEED_INCREMENT = 0.0008;
const GROUND_Y_RATIO = 0.8;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 48;
const DUCK_HEIGHT = 28;
const OBSTACLE_MIN_GAP = 80;
const TRAIL_COUNT = 12;
const TRAIL_COUNT_MOBILE = 8;
const TRAIL_COUNT_REDUCED = 3;
const SCORE_FLASH_INTERVAL = 100;
const MAX_DPR = 2;
const STAR_COUNT = 40;
const STAR_COUNT_MOBILE = 15;
const SHAKE_FRAMES = 12;
const SPEED_LINES_THRESHOLD = 6;
const MAX_SPEED_LINES = 8;
const MAX_SPEED_LINES_MOBILE = 4;

const NEON_CYAN = '#00f0ff';
const NEON_MAGENTA = '#ff00e5';
const NEON_GREEN = '#39ff14';
const BG_COLOR = '#0a0a0f';

type GameState = 'idle' | 'running' | 'gameover';
type ObstacleShape = 'triangle' | 'barrier' | 'pillar' | 'diamond' | 'neonSign';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  y: number;
  type: 'ground' | 'air';
  shape: ObstacleShape;
}

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  radius: number;
}

interface Star {
  x: number;
  y: number;
  twinklePhase: number;
  color: string;
}

interface Building {
  x: number;
  width: number;
  height: number;
}

interface SpeedLine {
  x: number;
  y: number;
  length: number;
  opacity: number;
}

interface DoubleJumpParticle {
  x: number;
  y: number;
  vy: number;
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
    jumpCount: 0,
    speed: INITIAL_SPEED,
    score: 0,
    scoreAccumulator: 0,
    highScore: 0,
    isNewBest: false,
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
    lastTimestamp: 0,
    // Visual layers
    stars: [] as Star[],
    farBuildings: [] as Building[],
    nearBuildings: [] as Building[],
    farBuildingOffset: 0,
    nearBuildingOffset: 0,
    farTotalWidth: 0,
    nearTotalWidth: 0,
    speedLines: [] as SpeedLine[],
    shakeFrames: 0,
    doubleJumpParticles: [] as DoubleJumpParticle[],
    reducedMotion: false,
  });

  const [, setTick] = useState(0);

  const getGroundY = useCallback((h: number) => Math.floor(h * GROUND_Y_RATIO), []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.gameState = 'running';
    s.playerY = s.groundY - PLAYER_HEIGHT;
    s.velocityY = 0;
    s.isDucking = false;
    s.jumpCount = 0;
    s.speed = INITIAL_SPEED;
    s.score = 0;
    s.scoreAccumulator = 0;
    s.isNewBest = false;
    s.obstacles = [];
    s.trail = [];
    s.groundOffset = 0;
    s.frameCount = 0;
    s.lastObstacleX = s.canvasW;
    s.scoreFlash = 0;
    s.lastTimestamp = 0;
    s.speedLines = [];
    s.shakeFrames = 0;
    s.doubleJumpParticles = [];
    setTick((n) => n + 1);
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === 'idle' || s.gameState === 'gameover') {
      startGame();
      s.velocityY = JUMP_VELOCITY;
      s.jumpCount = 1;
      return;
    }
    if (s.gameState === 'running') {
      const onGround = s.playerY >= s.groundY - PLAYER_HEIGHT - 1;
      if (onGround) {
        s.velocityY = JUMP_VELOCITY;
        s.jumpCount = 1;
      } else if (s.jumpCount === 1) {
        // Double jump
        s.velocityY = JUMP_VELOCITY * DOUBLE_JUMP_FACTOR;
        s.jumpCount = 2;
        // Emit particles downward
        const px = 40 + PLAYER_WIDTH / 2;
        const py = s.playerY + PLAYER_HEIGHT;
        for (let i = 0; i < 4; i++) {
          s.doubleJumpParticles.push({
            x: px + (Math.random() - 0.5) * 12,
            y: py,
            vy: 1 + Math.random() * 2,
            opacity: 0.8,
          });
        }
      }
    }
  }, [startGame]);

  const setDucking = useCallback((ducking: boolean) => {
    stateRef.current.isDucking = ducking;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReduced);
    stateRef.current.reducedMotion = prefersReduced;

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

    // ── Generate buildings ──
    function generateBuildings(
      canvasWidth: number,
      minH: number,
      maxH: number,
    ): { buildings: Building[]; totalWidth: number } {
      const buildings: Building[] = [];
      let x = 0;
      // Generate enough to tile seamlessly (at least 2x canvas width)
      while (x < canvasWidth * 2.5) {
        const width = 30 + Math.random() * 60;
        const height = minH + Math.random() * (maxH - minH);
        buildings.push({ x, width, height });
        x += width + 2 + Math.random() * 8;
      }
      return { buildings, totalWidth: x };
    }

    function generateStars(canvasWidth: number, maxY: number, count: number): Star[] {
      const stars: Star[] = [];
      const neonColors = [NEON_CYAN, NEON_MAGENTA, NEON_GREEN];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * (maxY - 80),
          twinklePhase: Math.random() * Math.PI * 2,
          color: Math.random() < 0.15 ? neonColors[Math.floor(Math.random() * 3)] : '#ffffff',
        });
      }
      return stars;
    }

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

      // Regenerate visual layers
      const starCount = s.isMobile ? STAR_COUNT_MOBILE : STAR_COUNT;
      s.stars = generateStars(w, s.groundY, starCount);

      const far = generateBuildings(w, 20, 60);
      s.farBuildings = far.buildings;
      s.farTotalWidth = far.totalWidth;
      s.farBuildingOffset = 0;

      const near = generateBuildings(w, 15, 40);
      s.nearBuildings = near.buildings;
      s.nearTotalWidth = near.totalWidth;
      s.nearBuildingOffset = 0;
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function handleVisibility() {
      if (document.hidden) {
        s.paused = true;
        s.lastTimestamp = 0;
      } else {
        s.paused = false;
      }
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

      let shape: ObstacleShape;
      let width: number;
      let height: number;

      if (isAir) {
        // Air obstacles
        if (Math.random() < 0.5) {
          shape = 'diamond';
          width = 20 + Math.random() * 15;
          height = 20 + Math.random() * 15;
        } else {
          shape = 'neonSign';
          width = 25 + Math.random() * 15;
          height = 18 + Math.random() * 10;
        }
      } else {
        // Ground obstacles
        const roll = Math.random();
        if (roll < 0.4) {
          shape = 'triangle';
          width = 20 + Math.random() * 20;
          height = 30 + Math.random() * 30;
        } else if (roll < 0.7) {
          shape = 'barrier';
          width = 22 + Math.random() * 18;
          height = 28 + Math.random() * 20;
        } else {
          shape = 'pillar';
          width = 12 + Math.random() * 8;
          height = 45 + Math.random() * 25;
        }
      }

      const y = isAir ? s.groundY - PLAYER_HEIGHT - 10 - Math.random() * 20 : s.groundY - height;

      s.obstacles.push({
        x: s.canvasW + 10,
        width,
        height,
        y,
        type: isAir ? 'air' : 'ground',
        shape,
      });
      s.lastObstacleX = s.canvasW + 10;
    }

    // ── Collision ──
    function checkCollision() {
      const ph = s.isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT;
      const px = 40;
      const py = s.isDucking ? s.groundY - DUCK_HEIGHT : s.playerY;
      const pw = PLAYER_WIDTH;

      for (const obs of s.obstacles) {
        if (px < obs.x + obs.width && px + pw > obs.x && py < obs.y + obs.height && py + ph > obs.y) {
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

    function drawStars() {
      for (const star of s.stars) {
        const brightness = s.reducedMotion
          ? 0.5
          : 0.3 + 0.3 * Math.sin(s.frameCount * 0.02 + star.twinklePhase);
        ctx!.fillStyle =
          star.color === '#ffffff'
            ? `rgba(255, 255, 255, ${brightness})`
            : star.color + Math.round(brightness * 60).toString(16).padStart(2, '0');
        ctx!.fillRect(star.x, star.y, 1, 1);
      }
    }

    function drawCityscape() {
      // Far layer
      ctx!.save();
      for (const b of s.farBuildings) {
        const bx = ((b.x - s.farBuildingOffset) % s.farTotalWidth + s.farTotalWidth) % s.farTotalWidth - 50;
        const by = s.groundY - b.height;
        ctx!.fillStyle = 'rgba(15, 10, 25, 0.8)';
        ctx!.fillRect(bx, by, b.width, b.height);
        // Magenta top edge
        ctx!.strokeStyle = 'rgba(255, 0, 229, 0.15)';
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(bx, by);
        ctx!.lineTo(bx + b.width, by);
        ctx!.stroke();
      }
      ctx!.restore();

      // Near layer
      ctx!.save();
      for (const b of s.nearBuildings) {
        const bx =
          ((b.x - s.nearBuildingOffset) % s.nearTotalWidth + s.nearTotalWidth) % s.nearTotalWidth - 50;
        const by = s.groundY - b.height;
        ctx!.fillStyle = 'rgba(20, 15, 35, 0.9)';
        ctx!.fillRect(bx, by, b.width, b.height);
        // Cyan top edge
        ctx!.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(bx, by);
        ctx!.lineTo(bx + b.width, by);
        ctx!.stroke();
        // Window dots (skip on mobile)
        if (!s.isMobile && b.width > 20 && b.height > 20) {
          for (let wy = by + 6; wy < s.groundY - 4; wy += 8) {
            for (let wx = bx + 5; wx < bx + b.width - 5; wx += 7) {
              if (Math.random() < 0.03) {
                const windowColors = [NEON_CYAN, NEON_MAGENTA, '#ffcc00'];
                ctx!.fillStyle = windowColors[Math.floor(Math.random() * 3)];
                ctx!.globalAlpha = 0.3 + Math.random() * 0.3;
                ctx!.fillRect(wx, wy, 2, 2);
                ctx!.globalAlpha = 1;
              }
            }
          }
        }
      }
      ctx!.restore();
    }

    function drawSynthwaveGrid() {
      const gY = s.groundY;
      const belowHeight = s.canvasH - gY;

      // Gradient fill below ground
      const grad = ctx!.createLinearGradient(0, gY, 0, s.canvasH);
      grad.addColorStop(0, 'rgba(60, 0, 80, 0.4)');
      grad.addColorStop(1, 'transparent');
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, gY, s.canvasW, belowHeight);

      // Horizontal lines with exponential spacing (perspective)
      ctx!.strokeStyle = 'rgba(100, 0, 140, 0.25)';
      ctx!.lineWidth = 0.5;
      for (let i = 1; i <= 6; i++) {
        const ratio = (i / 6) ** 2;
        const ly = gY + ratio * belowHeight;
        ctx!.beginPath();
        ctx!.moveTo(0, ly);
        ctx!.lineTo(s.canvasW, ly);
        ctx!.stroke();
      }

      // Vertical converging lines
      const vanishX = s.canvasW / 2;
      ctx!.strokeStyle = 'rgba(100, 0, 140, 0.2)';
      const lineCount = 14;
      for (let i = 0; i <= lineCount; i++) {
        const baseX =
          ((i / lineCount) * s.canvasW * 1.5 - s.canvasW * 0.25 + s.groundOffset * 3) %
          (s.canvasW * 1.5);
        const bottomX = baseX - s.canvasW * 0.25;
        ctx!.beginPath();
        ctx!.moveTo(vanishX, gY);
        ctx!.lineTo(bottomX, s.canvasH);
        ctx!.stroke();
      }

      // Ground line (bright cyan with glow)
      ctx!.save();
      ctx!.shadowColor = NEON_CYAN;
      ctx!.shadowBlur = 6;
      ctx!.strokeStyle = NEON_CYAN;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(0, gY);
      ctx!.lineTo(s.canvasW, gY);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawSpeedLines() {
      if (s.reducedMotion) return;
      for (const line of s.speedLines) {
        ctx!.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`;
        ctx!.lineWidth = 0.5;
        ctx!.beginPath();
        ctx!.moveTo(line.x, line.y);
        ctx!.lineTo(line.x + line.length, line.y);
        ctx!.stroke();
      }
    }

    function drawTrail() {
      ctx!.save();
      ctx!.globalCompositeOperation = 'lighter';
      for (const dot of s.trail) {
        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(57, 255, 20, ${dot.opacity})`;
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawDoubleJumpParticles() {
      ctx!.save();
      ctx!.globalCompositeOperation = 'lighter';
      for (const p of s.doubleJumpParticles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawPlayer() {
      const px = 40;
      const ducking = s.isDucking;
      const py = ducking ? s.groundY - DUCK_HEIGHT : s.playerY;
      const h = ducking ? DUCK_HEIGHT : PLAYER_HEIGHT;
      const running = s.gameState === 'running';
      const legPhase = running ? Math.floor(s.frameCount / 6) % 2 : 0;

      // Glow aura behind player
      const auraCx = px + PLAYER_WIDTH / 2;
      const auraCy = py + h / 2;
      const auraGrad = ctx!.createRadialGradient(auraCx, auraCy, 0, auraCx, auraCy, 30);
      auraGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
      auraGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx!.fillStyle = auraGrad;
      ctx!.fillRect(auraCx - 30, auraCy - 30, 60, 60);

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
      for (const obs of s.obstacles) {
        const fillAlpha = 0.3;
        ctx!.save();
        ctx!.shadowColor = NEON_MAGENTA;
        ctx!.shadowBlur = 8;
        ctx!.strokeStyle = NEON_MAGENTA;
        ctx!.lineWidth = 1.5;

        switch (obs.shape) {
          case 'triangle': {
            ctx!.fillStyle = `rgba(255, 0, 229, ${fillAlpha})`;
            ctx!.beginPath();
            ctx!.moveTo(obs.x + obs.width / 2, obs.y);
            ctx!.lineTo(obs.x + obs.width, obs.y + obs.height);
            ctx!.lineTo(obs.x, obs.y + obs.height);
            ctx!.closePath();
            ctx!.fill();
            ctx!.stroke();
            break;
          }
          case 'barrier': {
            ctx!.fillStyle = `rgba(255, 0, 229, ${fillAlpha})`;
            ctx!.strokeRect(obs.x, obs.y, obs.width, obs.height);
            ctx!.fillRect(obs.x, obs.y, obs.width, obs.height);
            // Inner horizontal lines
            const lineY1 = obs.y + obs.height * 0.33;
            const lineY2 = obs.y + obs.height * 0.66;
            ctx!.beginPath();
            ctx!.moveTo(obs.x, lineY1);
            ctx!.lineTo(obs.x + obs.width, lineY1);
            ctx!.moveTo(obs.x, lineY2);
            ctx!.lineTo(obs.x + obs.width, lineY2);
            ctx!.stroke();
            break;
          }
          case 'pillar': {
            ctx!.fillStyle = `rgba(255, 0, 229, ${fillAlpha})`;
            ctx!.strokeRect(obs.x, obs.y, obs.width, obs.height);
            ctx!.fillRect(obs.x, obs.y, obs.width, obs.height);
            // Neon dot on top
            ctx!.beginPath();
            ctx!.arc(obs.x + obs.width / 2, obs.y - 3, 3, 0, Math.PI * 2);
            ctx!.fillStyle = NEON_CYAN;
            ctx!.shadowColor = NEON_CYAN;
            ctx!.fill();
            break;
          }
          case 'diamond': {
            const cx = obs.x + obs.width / 2;
            const cy = obs.y + obs.height / 2;
            ctx!.fillStyle = `rgba(255, 0, 229, ${fillAlpha})`;
            ctx!.beginPath();
            ctx!.moveTo(cx, obs.y);
            ctx!.lineTo(obs.x + obs.width, cy);
            ctx!.lineTo(cx, obs.y + obs.height);
            ctx!.lineTo(obs.x, cy);
            ctx!.closePath();
            ctx!.fill();
            ctx!.stroke();
            break;
          }
          case 'neonSign': {
            ctx!.fillStyle = `rgba(255, 0, 229, ${fillAlpha})`;
            ctx!.strokeRect(obs.x, obs.y, obs.width, obs.height);
            ctx!.fillRect(obs.x, obs.y, obs.width, obs.height);
            // Inner X pattern
            ctx!.beginPath();
            ctx!.moveTo(obs.x + 2, obs.y + 2);
            ctx!.lineTo(obs.x + obs.width - 2, obs.y + obs.height - 2);
            ctx!.moveTo(obs.x + obs.width - 2, obs.y + 2);
            ctx!.lineTo(obs.x + 2, obs.y + obs.height - 2);
            ctx!.stroke();
            break;
          }
        }
        ctx!.restore();
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

      // Speed indicator during gameplay
      if (s.gameState === 'running') {
        const speedPct = Math.min((s.speed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED), 1);
        const barW = 60;
        const barH = 4;
        const barX = s.canvasW - 16 - barW;
        const barY = 60;
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx!.fillRect(barX, barY, barW, barH);
        ctx!.fillStyle = NEON_MAGENTA;
        ctx!.shadowColor = NEON_MAGENTA;
        ctx!.shadowBlur = 4;
        ctx!.fillRect(barX, barY, barW * speedPct, barH);
        ctx!.font = '9px "Fira Code", monospace';
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx!.shadowBlur = 0;
        ctx!.fillText(t('game.speed'), s.canvasW - 16, barY + 14);
      }
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
      // Dark overlay
      ctx!.fillStyle = 'rgba(10, 10, 15, 0.7)';
      ctx!.fillRect(0, 0, s.canvasW, s.canvasH);

      ctx!.save();
      // GAME OVER
      ctx!.fillStyle = NEON_MAGENTA;
      ctx!.shadowColor = NEON_MAGENTA;
      ctx!.shadowBlur = 16;
      ctx!.font = 'bold 28px "Space Grotesk", sans-serif';
      ctx!.textAlign = 'center';
      ctx!.fillText(t('game.gameOver'), s.canvasW / 2, s.canvasH / 2 - 30);

      // Final score
      ctx!.fillStyle = NEON_GREEN;
      ctx!.shadowColor = NEON_GREEN;
      ctx!.shadowBlur = 8;
      ctx!.font = '20px "Fira Code", monospace';
      ctx!.fillText(`${t('game.score')}: ${s.score}`, s.canvasW / 2, s.canvasH / 2 + 2);

      // NEW BEST! (pulsing)
      if (s.isNewBest) {
        const pulse = 0.6 + 0.4 * Math.sin(s.frameCount * 0.1);
        ctx!.globalAlpha = pulse;
        ctx!.fillStyle = NEON_CYAN;
        ctx!.shadowColor = NEON_CYAN;
        ctx!.shadowBlur = 14;
        ctx!.font = 'bold 16px "Space Grotesk", sans-serif';
        ctx!.fillText(t('game.newBest'), s.canvasW / 2, s.canvasH / 2 + 28);
        ctx!.globalAlpha = 1;
      }

      // Restart prompt
      ctx!.font = '14px "Space Grotesk", sans-serif';
      ctx!.fillStyle = NEON_CYAN;
      ctx!.shadowColor = NEON_CYAN;
      ctx!.shadowBlur = 6;
      ctx!.fillText(t('game.restart'), s.canvasW / 2, s.canvasH / 2 + 52);
      ctx!.restore();
    }

    // ── Main loop ──
    function update(dt: number) {
      if (s.gameState !== 'running') return;

      // Player physics
      s.velocityY += GRAVITY * dt;
      s.playerY += s.velocityY * dt;
      const currentHeight = s.isDucking ? DUCK_HEIGHT : PLAYER_HEIGHT;
      if (s.playerY >= s.groundY - currentHeight) {
        s.playerY = s.groundY - currentHeight;
        s.velocityY = 0;
        s.jumpCount = 0;
      }

      // Speed up
      if (s.speed < MAX_SPEED) {
        s.speed += SPEED_INCREMENT * dt;
      }

      // Move obstacles
      for (const obs of s.obstacles) {
        obs.x -= s.speed * dt;
      }
      s.obstacles = s.obstacles.filter((obs) => obs.x + obs.width > -20);

      // Track last obstacle x for gap calculation
      if (s.obstacles.length > 0) {
        s.lastObstacleX = Math.max(...s.obstacles.map((o) => o.x));
      } else {
        s.lastObstacleX = 0;
      }

      // Ground scroll
      s.groundOffset = (s.groundOffset + s.speed * dt) % 14;

      // Parallax cityscape scroll
      if (!s.reducedMotion) {
        s.farBuildingOffset += s.speed * 0.15 * dt;
        s.nearBuildingOffset += s.speed * 0.35 * dt;
      }

      // Trail
      const maxTrail = s.reducedMotion
        ? TRAIL_COUNT_REDUCED
        : s.isMobile
          ? TRAIL_COUNT_MOBILE
          : TRAIL_COUNT;
      const trailY = s.isDucking ? s.groundY - DUCK_HEIGHT / 2 : s.playerY + PLAYER_HEIGHT / 2;
      s.trail.push({
        x: 40 - 5,
        y: trailY + (Math.random() - 0.5) * 6,
        opacity: 0.6,
        radius: 1 + Math.random() * 2.5,
      });
      if (s.trail.length > maxTrail) s.trail.shift();
      for (const dot of s.trail) {
        dot.opacity -= 0.06 * dt;
        dot.x -= s.speed * 0.4 * dt;
      }
      s.trail = s.trail.filter((d) => d.opacity > 0);

      // Double jump particles
      for (const p of s.doubleJumpParticles) {
        p.y += p.vy * dt;
        p.opacity -= 0.04 * dt;
      }
      s.doubleJumpParticles = s.doubleJumpParticles.filter((p) => p.opacity > 0);

      // Speed lines
      if (!s.reducedMotion && s.speed > SPEED_LINES_THRESHOLD) {
        const maxLines = s.isMobile ? MAX_SPEED_LINES_MOBILE : MAX_SPEED_LINES;
        const spawnChance = (s.speed - SPEED_LINES_THRESHOLD) * 0.03;
        if (s.speedLines.length < maxLines && Math.random() < spawnChance) {
          s.speedLines.push({
            x: s.canvasW,
            y: 20 + Math.random() * (s.groundY - 40),
            length: 20 + Math.random() * 40,
            opacity: 0.2 + Math.random() * 0.3,
          });
        }
        for (const line of s.speedLines) {
          line.x -= s.speed * 2 * dt;
          line.opacity -= 0.01 * dt;
        }
        s.speedLines = s.speedLines.filter((l) => l.x + l.length > 0 && l.opacity > 0);
      }

      // Score
      s.frameCount++;
      s.scoreAccumulator += dt;
      if (s.scoreAccumulator >= 5) {
        const points = Math.floor(s.scoreAccumulator / 5);
        s.score += points;
        s.scoreAccumulator -= points * 5;
        if (s.score % SCORE_FLASH_INTERVAL < points) {
          s.scoreFlash = 20;
        }
      }
      if (s.scoreFlash > 0) s.scoreFlash--;

      // Spawn
      spawnObstacle();

      // Collision
      if (checkCollision()) {
        s.gameState = 'gameover';
        if (!s.reducedMotion) {
          s.shakeFrames = SHAKE_FRAMES;
        }
        if (s.score > s.highScore) {
          s.highScore = s.score;
          s.isNewBest = true;
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

      // Screen shake
      const shaking = s.shakeFrames > 0;
      if (shaking) {
        ctx!.save();
        const intensity = s.shakeFrames * 0.8;
        ctx!.translate((Math.random() - 0.5) * intensity * 2, (Math.random() - 0.5) * intensity * 2);
        s.shakeFrames--;
      }

      drawStars();
      drawCityscape();
      drawSynthwaveGrid();
      drawSpeedLines();
      drawTrail();
      drawDoubleJumpParticles();
      drawPlayer();
      drawObstacles();
      drawScore();

      if (shaking) {
        ctx!.restore();
      }

      if (s.gameState === 'idle') drawIdleScreen();
      if (s.gameState === 'gameover') drawGameOver();
    }

    function loop(timestamp: number) {
      if (!s.paused) {
        let dt = 1;
        if (s.lastTimestamp > 0) {
          dt = (timestamp - s.lastTimestamp) / 16.667;
          if (dt < 0) dt = 1;
          if (dt > 3) dt = 3;
        }
        s.lastTimestamp = timestamp;
        update(dt);
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
