import type { Point } from './telemetry';
import { untrack } from 'svelte';

export type ChartData = { kind: 'line' | 'bars'; values: number[] } | { kind: 'trail'; values: Point[] };

export function attachChart(getData: () => ChartData, color: string, isPaused: () => boolean) {
  return (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0;
    const height = 60;

    function resize() {
      width = canvas.getBoundingClientRect().width;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      if (!ctx || !width) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#080c10';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(30,45,61,.5)';
      ctx.lineWidth = .5;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      const data = untrack(getData);
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
        if (data.kind === 'bars') {
          ctx.globalAlpha = .7;
          data.values.forEach((value, i) => {
            const barHeight = value / max * (height - 6);
            ctx.fillRect(i / data.values.length * width, height - barHeight, Math.max(2, width / data.values.length - 2), barHeight);
          });
          ctx.globalAlpha = 1;
        } else {
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
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    resize();
    const timer = window.setInterval(() => { if (!document.hidden && !untrack(isPaused)) draw(); }, 50);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.clearInterval(timer);
    };
  };
}
