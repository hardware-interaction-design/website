export type Point = { x: number; y: number };
export type Press = { start: number; end?: number };

/** How much history the press timeline keeps, in milliseconds. */
export const pressWindow = 8000;

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
  now = 0;
  readonly speeds = Array<number>(80).fill(0);
  readonly trail: Point[] = [];
  readonly intervals: number[] = [];
  readonly holds: number[] = [];
  readonly presses: Press[] = [];
  private previous: (Point & { time: number }) | undefined;
  private lastRelease: number | undefined;
  private contacts = new Map<string, Press>();
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
      this.trail.push({ x, y });
      if (this.trail.length > 60) this.trail.shift();
    }
    this.previous = { x, y, time: now };
  }

  /** Samples the speed history at a steady rate so the line falls back to zero when the pointer rests. */
  tick(now: number): void {
    this.now = now;
    this.speeds.push(this.speed);
    this.speeds.shift();
    this.speed = Math.floor(this.speed * .85);
    while (this.presses.length && (this.presses[0].end ?? now) < now - pressWindow) this.presses.shift();
  }

  start(id: string, now: number): void {
    if (this.contacts.has(id)) return;
    // The gap runs from the last release to this press. Chords and overlapping presses have no gap.
    if (this.contacts.size === 0 && this.lastRelease !== undefined) {
      const gap = Math.round(now - this.lastRelease);
      this.interval = gap;
      this.intervalTotal += gap;
      this.intervalAverage = Math.round(this.intervalTotal / ++this.intervalCount);
      this.intervalMin = Math.min(typeof this.intervalMin === 'number' ? this.intervalMin : Infinity, gap);
      this.intervals.push(gap);
      if (this.intervals.length > 40) this.intervals.shift();
    }
    const press = { start: now };
    this.contacts.set(id, press);
    this.presses.push(press);
    if (this.presses.length > 40) this.presses.shift();
    this.now = Math.max(this.now, now);
  }

  end(id: string, now: number): void {
    const press = this.contacts.get(id);
    if (press === undefined) return;
    this.contacts.delete(id);
    press.end = now;
    const held = Math.round(now - press.start);
    this.hold = held;
    this.holdTotal += held;
    this.holdAverage = Math.round(this.holdTotal / ++this.holdCount);
    this.holdMax = Math.max(typeof this.holdMax === 'number' ? this.holdMax : 0, held);
    this.holds.push(held);
    if (this.holds.length > 40) this.holds.shift();
    if (this.contacts.size === 0) this.lastRelease = now;
    this.now = Math.max(this.now, now);
  }

  pause(): void {
    // Presses still held cannot be measured, so they leave the timeline.
    for (const press of this.contacts.values()) this.presses.splice(this.presses.indexOf(press), 1);
    this.contacts.clear();
    this.previous = undefined;
    this.lastRelease = undefined;
    this.speed = 0;
  }

  snapshot() {
    return {
      speed: this.speed, peak: this.peak, x: this.x, y: this.y, direction: this.direction,
      interval: this.interval, intervalAverage: this.intervalAverage, intervalMin: this.intervalMin,
      hold: this.hold, holdAverage: this.holdAverage, holdMax: this.holdMax, now: this.now,
      speeds: [...this.speeds], trail: this.trail.map(point => ({ ...point })),
      intervals: [...this.intervals], holds: [...this.holds], presses: this.presses.map(press => ({ ...press }))
    };
  }
}
