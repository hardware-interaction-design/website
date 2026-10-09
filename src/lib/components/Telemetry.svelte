<script lang="ts">
  import { onMount } from 'svelte';
  import { InputTelemetry } from '$lib/telemetry';
  import TelemetryChart from './TelemetryChart.svelte';
  import Button from './ui/Button.svelte';
  const input = new InputTelemetry();
  let stats = $state.raw(input.snapshot());
  let paused = $state(false);
  let ready = $state(false);
  const sync = () => { stats = input.snapshot(); };

  function move(event: PointerEvent) { if (!paused) { input.move(event.clientX, event.clientY, performance.now()); sync(); } }
  function keyDown(event: KeyboardEvent) { if (!paused && !event.repeat) { input.start('key:' + event.code, performance.now()); sync(); } }
  function keyUp(event: KeyboardEvent) { if (!paused) { input.end('key:' + event.code, performance.now()); sync(); } }
  function touchStart(event: PointerEvent) { if (!paused && event.pointerType === 'touch') { input.start('touch:' + event.pointerId, performance.now()); sync(); } }
  function touchEnd(event: PointerEvent) { if (!paused && event.pointerType === 'touch') { input.end('touch:' + event.pointerId, performance.now()); sync(); } }
  function resetContact() { input.pause(); if (!paused) sync(); }
  function togglePaused() {
    paused = !paused;
    input.pause();
    if (!paused) sync();
  }

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) paused = true;
    ready = true;
    const timer = window.setInterval(() => {
      if (document.hidden || paused || input.speed === 0) return;
      input.speed = Math.floor(input.speed * .85);
      sync();
    }, 50);
    return () => window.clearInterval(timer);
  });

  const cell = 'border-line p-5 border-b last:border-b-0 min-[601px]:odd:border-r min-[601px]:nth-last-2:border-b-0';
  const label = 'mb-2 font-mono text-xs tracking-[.1em] text-muted';
  const value = 'mb-1 font-mono text-[1.6rem] leading-none font-bold text-accent';
  const unit = 'ml-1 text-xs font-normal text-muted';
  const summary = 'font-mono text-xs text-muted';
  const directions: Record<string, string> = { '→': 'Right', '↘': 'Down and right', '↓': 'Down', '↙': 'Down and left', '←': 'Left', '↖': 'Up and left', '↑': 'Up', '↗': 'Up and right' };
</script>

<svelte:document onpointermove={move} onkeydown={keyDown} onkeyup={keyUp} onpointerdown={touchStart} onpointerup={touchEnd} onpointercancel={touchEnd} onvisibilitychange={() => { if (document.hidden) resetContact(); }} />
<svelte:window onblur={resetContact} />

<section class="mt-14 border border-line bg-panel" aria-labelledby="telemetry-heading" aria-describedby="telemetry-help" data-ready={ready}>
  <div class="panel-header flex-wrap justify-between gap-3">
    <h2 id="telemetry-heading" class="mb-0 flex items-center gap-2 font-mono text-sm font-normal tracking-normal text-copy"><span class="sensor-dot" aria-hidden="true"></span> Live input demo</h2>
    <Button onclick={togglePaused} disabled={!ready} aria-pressed={paused} aria-controls="telemetry-readings">Pause live input</Button>
  </div>
  <p id="telemetry-help" class="mb-0 border-b border-line px-5 py-3 text-sm text-muted">Move your pointer, press a key, or touch the screen to try the demo. A dash means no input has been measured yet. Input stays in your browser.</p>
  <p class="sr-only" role="status">{paused ? 'Live input paused. Press Pause live input again to resume.' : 'Live input running.'}</p>
  <div id="telemetry-readings" class="grid min-[601px]:grid-cols-2" aria-live="off">
    <div class={cell}>
      <h3 class={label}>Pointer speed</h3>
      <div class={value}><span data-testid="speed">{stats.speed}</span><span class={unit} aria-hidden="true">px/s</span><span class="sr-only"> pixels per second</span></div>
      <div class={summary}>Peak: <span data-testid="peak">{stats.peak}</span> px/s</div>
      <TelemetryChart label="Speed history" data={() => ({ kind: 'line', values: stats.speeds })} color="rgb(240,165,0)" {paused} />
    </div>
    <div class={cell}>
      <h3 class={label}>Pointer position</h3>
      <div class="mb-1 font-mono text-base leading-none font-bold"><span data-testid="cursor-x">{stats.x}</span><span class={unit}>x</span> &nbsp;<span data-testid="cursor-y">{stats.y}</span><span class={unit}>y</span></div>
      <div class={summary}>Direction: <span data-testid="direction" aria-hidden="true">{stats.direction}</span><span class="sr-only">{directions[stats.direction] ?? 'Not measured'}</span></div>
      <TelemetryChart label="Movement trail" data={() => ({ kind: 'trail', values: stats.trail })} color="rgb(0,200,160)" {paused} />
    </div>
    <div class={cell}>
      <h3 class={label}>Time between inputs</h3>
      <div class={value}><span data-testid="interval">{stats.interval}</span><span class={unit}>ms</span></div>
      <div class={summary}>Avg: {stats.intervalAverage} ms &nbsp;·&nbsp; Min: {stats.intervalMin} ms</div>
      <TelemetryChart label="Input gaps" data={() => ({ kind: 'bars', values: stats.intervals })} color="rgb(240,165,0)" {paused} />
    </div>
    <div class={cell}>
      <h3 class={label}>Key or touch duration</h3>
      <div class={value}><span data-testid="hold">{stats.hold}</span><span class={unit}>ms</span></div>
      <div class={summary}>Avg: {stats.holdAverage} ms &nbsp;·&nbsp; Max: {stats.holdMax} ms</div>
      <TelemetryChart label="Contact durations" data={() => ({ kind: 'bars', values: stats.holds })} color="rgb(0,200,160)" {paused} />
    </div>
  </div>
</section>
