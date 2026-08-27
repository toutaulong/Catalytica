import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number; r: number; c: string };
type Photon = { x: number; y: number; vx: number; vy: number; life: number; c: string };

const PALETTE = ['#5468d4', '#3046aa', '#8e5bd6', '#7a3fae'];

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let nodes: Node[] = [];
    let photons: Photon[] = [];

    const spawnPhoton = (): Photon => {
      const fromLeft = Math.random() < 0.5;
      return {
        x: fromLeft ? -30 : w + 30,
        y: Math.random() * h * 0.85,
        vx: (fromLeft ? 1 : -1) * (2.2 + Math.random() * 2.6),
        vy: (Math.random() - 0.5) * 0.9,
        life: 0,
        c: Math.random() < 0.5 ? '#7ea0ff' : '#c084d8',
      };
    };

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.min(120, Math.max(40, Math.floor((w * h) / 17000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.7 + Math.random() * 1.5,
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
      }));
      photons = Array.from({ length: 5 }, spawnPhoton);
      photons.forEach((p) => {
        p.x = Math.random() * w;
        p.life = Math.random() * 200;
      });
    };

    const LINK = 120;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of nodes) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.13;
            ctx.strokeStyle = `rgba(110, 132, 230, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of nodes) {
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduced) {
        for (const ph of photons) {
          ph.x += ph.vx;
          ph.y += ph.vy;
          ph.life += 1;
          const fade = Math.min(1, ph.life / 30) * 0.85;

          const grad = ctx.createLinearGradient(ph.x - ph.vx * 12, ph.y - ph.vy * 12, ph.x, ph.y);
          grad.addColorStop(0, 'rgba(126,160,255,0)');
          grad.addColorStop(1, ph.c);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = fade;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(ph.x - ph.vx * 12, ph.y - ph.vy * 12);
          ctx.lineTo(ph.x, ph.y);
          ctx.stroke();
          ctx.fillStyle = '#e6edff';
          ctx.beginPath();
          ctx.arc(ph.x, ph.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          if (ph.x < -60 || ph.x > w + 60 || ph.y < -40 || ph.y > h + 40 || ph.life > 520) {
            Object.assign(ph, spawnPhoton());
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    init();
    tick();
    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden>
      <div
        className="absolute -top-48 -left-48 h-[42rem] w-[42rem] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #3046aa 0%, transparent 65%)' }}
      />
      <div
        className="absolute top-1/3 -right-56 h-[46rem] w-[46rem] rounded-full opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #4a1460 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-1/3 left-1/4 h-[40rem] w-[40rem] rounded-full opacity-15 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #02318e 0%, transparent 60%)' }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
