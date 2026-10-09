export type Point = { x: number; y: number };

export class InputTelemetry {
  speed = 0;
  peak = 0;
  x: number | string = '—';
  y: number | string = '—';
  direction = '—';
  interval: number | string = '—';
  intervalAverage: number | string = '—';
  intervalMin: number | string = '—';
  hold: number | string = '—';
  holdAverage: number | string = '—';
  holdMax: number | string = '—';
  readonly speeds = Array<number>(80).fill(0);
  readonly trail: Point[] = [];
  readonly intervals: number[] = [];
  readonly holds: number[] = [];
  private previous: (Point & { time: number }) | undefined;
  private lastContact: number | undefined;
  private contacts = new Map<string, number>();
  private intervalTotal = 0;
  private intervalCount = 0;
  private holdTotal = 0;
  private holdCount = 0;

  move(x: number, y: number, now: number): void {
    this.x = Math.round(x);
    this.y = Math.round(y);
    if (this.previous && now > this.previous.time) {
      const dx = x - this.previous.x;
      const dy = y - this.previous.y;
      this.speed = Math.round(Math.hypot(dx, dy) / ((now - this.previous.time) / 1000));
      this.peak = Math.max(this.peak, this.speed);
      // Screen coordinates increase downward, so zero degrees points right.
      const index = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
      this.direction = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'][index];
      this.speeds.push(this.speed);
      this.speeds.shift();
      this.trail.push({ x, y });
      if (this.trail.length > 60) this.trail.shift();
    }
    this.previous = { x, y, time: now };
  }

  start(id: string, now: number): void {
    if (this.contacts.has(id)) return;
    this.contacts.set(id, now);
    if (this.lastContact !== undefined) {
      const gap = Math.round(now - this.lastContact);
      this.interval = gap;
      this.intervalTotal += gap;
      this.intervalAverage = Math.round(this.intervalTotal / ++this.intervalCount);
      this.intervalMin = Math.min(typeof this.intervalMin === 'number' ? this.intervalMin : Infinity, gap);
      this.intervals.push(gap);
      if (this.intervals.length > 40) this.intervals.shift();
    }
    this.lastContact = now;
  }

  end(id: string, now: number): void {
    const down = this.contacts.get(id);
    if (down === undefined) return;
    this.contacts.delete(id);
    const held = Math.round(now - down);
    this.hold = held;
    this.holdTotal += held;
    this.holdAverage = Math.round(this.holdTotal / ++this.holdCount);
    this.holdMax = Math.max(typeof this.holdMax === 'number' ? this.holdMax : 0, held);
    this.holds.push(held);
    if (this.holds.length > 40) this.holds.shift();
  }

  pause(): void {
    this.contacts.clear();
    this.previous = undefined;
    this.lastContact = undefined;
    this.speed = 0;
  }

  snapshot() {
    return {
      speed: this.speed, peak: this.peak, x: this.x, y: this.y, direction: this.direction,
      interval: this.interval, intervalAverage: this.intervalAverage, intervalMin: this.intervalMin,
      hold: this.hold, holdAverage: this.holdAverage, holdMax: this.holdMax,
      speeds: [...this.speeds], trail: this.trail.map(point => ({ ...point })),
      intervals: [...this.intervals], holds: [...this.holds]
    };
  }
}
