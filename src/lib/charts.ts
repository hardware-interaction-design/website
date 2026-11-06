import { pressWindow, type Point, type Press } from './telemetry';
import { untrack } from 'svelte';

export type ChartData =
  | { kind: 'line'; values: number[] }
  | { kind: 'trail'; values: Point[] }
  | { kind: 'timeline'; values: Press[]; now: number };

// Matches the instrument screen in app.css.
const screen = '#101513';
const grid = '#1d2722';
const held = '#e8b931';
const gap = '#8fb8a0';
const label = '500 11px "Archivo Variable", system-ui, sans-serif';

export function attachChart(getData: () => ChartData, color: string, isPaused: () => boolean, height = 60) {
  return (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0;

    function resize() {
      width = canvas.getBoundingClientRect().width;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function drawTimeline(ctx: CanvasRenderingContext2D, presses: Press[], now: number) {
      const high = 22, low = height - 26;
      const x = (time: number) => width - (now - time) / pressWindow * width;
      // One tick per second, like the divisions on a scope.
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      for (let second = 0; second <= pressWindow / 1000; second++) {
        const tick = Math.round(width - second * 1000 / pressWindow * width) + .5;
        ctx.beginPath(); ctx.moveTo(tick, high - 6); ctx.lineTo(tick, low + 4); ctx.stroke();
      }
      ctx.strokeStyle = '#3a4a42';
      ctx.beginPath(); ctx.moveTo(0, low + .5); ctx.lineTo(width, low + .5); ctx.stroke();
      ctx.font = label;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'center';
      const sorted = [...presses].sort((a, b) => a.start - b.start);
      let previousEnd = -Infinity;
      for (const press of sorted) {
        const end = press.end ?? now;
        // Time between presses: a dimension line along the baseline, from release to the next press.
        if (previousEnd > -Infinity && press.start > previousEnd) {
          const from = x(previousEnd), to = x(press.start), y = height - 9;
          ctx.strokeStyle = gap;
          ctx.fillStyle = gap;
          ctx.beginPath();
          ctx.moveTo(from + 1, y); ctx.lineTo(to - 1, y);
          ctx.moveTo(from + .5, y - 4); ctx.lineTo(from + .5, y + 4);
          ctx.moveTo(to - .5, y - 4); ctx.lineTo(to - .5, y + 4);
          ctx.stroke();
          const text = Math.round(press.start - previousEnd) + ' ms';
          if (to - from > ctx.measureText(text).width + 12) {
            ctx.fillStyle = screen;
            const w = ctx.measureText(text).width + 8;
            ctx.fillRect((from + to) / 2 - w / 2, y - 7, w, 13);
            ctx.fillStyle = gap;
            ctx.fillText(text, (from + to) / 2, y + 4);
          }
        }
        // Held time: the trace goes high for as long as the key, button, or finger is down.
        const left = x(press.start), right = x(end);
        const active = press.end === undefined;
        ctx.fillStyle = held;
        ctx.globalAlpha = active ? .38 : .16;
        ctx.fillRect(left, high, Math.max(1, right - left), low - high);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = held;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(left, low); ctx.lineTo(left, high); ctx.lineTo(right, high);
        if (!active) ctx.lineTo(right, low);
        ctx.stroke();
        ctx.lineWidth = 1;
        const text = active ? 'holding ' + Math.round(end - press.start) + ' ms' : Math.round(end - press.start) + ' ms';
        const textWidth = ctx.measureText(text).width;
        if (active || right - left > textWidth + 6) {
          ctx.fillStyle = held;
          ctx.textAlign = active ? 'right' : 'center';
          ctx.fillText(text, active ? Math.min(right - 4, width - 4) : (left + right) / 2, high - 8);
          ctx.textAlign = 'center';
        }
        previousEnd = Math.max(previousEnd, end);
      }
    }

    function draw() {
      if (!ctx || !width) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = screen;
      ctx.fillRect(0, 0, width, height);
      const data = untrack(getData);
      if (data.kind === 'timeline') return drawTimeline(ctx, data.values, data.now);
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      for (let y = 15.5; y < height; y += 15) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      if (!data.values.length) return;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      if (data.kind === 'trail') {
        if (data.values.length < 2) return;
        const xs = data.values.map(p => p.x), ys = data.values.map(p => p.y);
        const minX = Math.min(...xs), minY = Math.min(...ys);
        const rangeX = Math.max(...xs) - minX || 1, rangeY = Math.max(...ys) - minY || 1;
        const point = (p: Point) => ({ x: (p.x - minX) / rangeX * (width - 8) + 4, y: (p.y - minY) / rangeY * (height - 8) + 4 });
        ctx.beginPath();
        data.values.forEach((p, i) => { const n = point(p); i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y); });
        ctx.stroke();
        const last = point(data.values[data.values.length - 1]);
        ctx.beginPath(); ctx.arc(last.x, last.y, 3, 0, Math.PI * 2); ctx.fill();
      } else {
        const max = Math.max(...data.values, 1);
        ctx.beginPath();
        data.values.forEach((value, i) => {
          const x = i / (data.values.length - 1) * width, y = height - value / max * (height - 8) - 4;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.stroke();
        ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath();
        ctx.globalAlpha = .12; ctx.fill(); ctx.globalAlpha = 1;
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    resize();
    // Redraw once the label face loads so canvas text does not stay in the fallback font.
    document.fonts?.ready.then(() => draw());
    const timer = window.setInterval(() => { if (!document.hidden && !untrack(isPaused)) draw(); }, 50);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.clearInterval(timer);
    };
  };
}
