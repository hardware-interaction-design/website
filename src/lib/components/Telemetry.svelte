<script lang="ts">
  import { onMount } from 'svelte';
  import { InputTelemetry, pressWindow } from '$lib/telemetry';
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
  // Mouse buttons, pens, and fingers all count as presses.
  function pressStart(event: PointerEvent) { if (!paused) { input.start('pointer:' + event.pointerId, performance.now()); sync(); } }
  function pressEnd(event: PointerEvent) { if (!paused) { input.end('pointer:' + event.pointerId, performance.now()); sync(); } }
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
      if (document.hidden || paused) return;
      input.tick(performance.now());
      sync();
    }, 50);
    return () => window.clearInterval(timer);
  });

  const cell = 'p-5 min-[601px]:p-6';
  const label = 'mb-3 text-[.95rem] font-semibold text-screen-copy';
  const value = 'text-[2rem] leading-none font-semibold text-white tabular-nums [font-stretch:85%]';
  const unit = 'ml-1 text-sm font-normal text-screen-muted';
  const summary = 'mt-1.5 text-sm text-screen-muted tabular-nums';
  const directions: Record<string, string> = { '→': 'Right', '↘': 'Down and right', '↓': 'Down', '↙': 'Down and left', '←': 'Left', '↖': 'Up and left', '↑': 'Up', '↗': 'Up and right' };
</script>

<svelte:document onpointermove={move} onkeydown={keyDown} onkeyup={keyUp} onpointerdown={pressStart} onpointerup={pressEnd} onpointercancel={pressEnd} onvisibilitychange={() => { if (document.hidden) resetContact(); }} />
<svelte:window onblur={resetContact} />

<section class="instrument" aria-labelledby="telemetry-heading" aria-describedby="telemetry-help" data-ready={ready}>
  <div class="flex flex-wrap items-start justify-between gap-4 border-b border-screen-line p-5 min-[601px]:px-6">
    <div class="max-w-[34rem]">
      <h2 id="telemetry-heading" class="mb-1.5 flex items-center gap-2.5 text-[1.35rem] leading-tight font-semibold tracking-normal text-white [font-stretch:100%]"><span class="sensor-dot" data-paused={paused} aria-hidden="true"></span> Live input demo</h2>
      <p id="telemetry-help" class="text-[.95rem] text-screen-muted">Move your pointer, press keys, click, or tap. This page measures your input the way a hardware prototype would. Nothing leaves your browser.</p>
    </div>
    <Button onclick={togglePaused} disabled={!ready} aria-pressed={paused} aria-controls="telemetry-readings">Pause live input</Button>
  </div>
  <p class="sr-only" role="status">{paused ? 'Live input paused. Press Pause live input again to resume.' : 'Live input running.'}</p>
  <div id="telemetry-readings" class="grid min-[601px]:grid-cols-2" aria-live="off">
    <div class="{cell} border-b border-screen-line min-[601px]:border-r">
      <h3 class={label}>Pointer speed</h3>
      <div class={value}><span data-testid="speed">{stats.speed}</span><span class={unit} aria-hidden="true">px/s</span><span class="sr-only"> pixels per second</span></div>
      <div class={summary}>Peak <span data-testid="peak">{stats.peak}</span> px/s</div>
      <TelemetryChart label="Speed history" data={() => ({ kind: 'line', values: stats.speeds })} color="#e8b931" {paused} />
    </div>
    <div class="{cell} border-b border-screen-line">
      <h3 class={label}>Pointer position</h3>
      <div class={value}><span data-testid="cursor-x">{stats.x}</span><span class={unit}>x</span> <span data-testid="cursor-y">{stats.y}</span><span class={unit}>y</span></div>
      <div class={summary}>Heading <span data-testid="direction" aria-hidden="true">{stats.direction}</span><span class="sr-only">{directions[stats.direction] ?? 'Not measured'}</span></div>
      <TelemetryChart label="Movement trail" data={() => ({ kind: 'trail', values: stats.trail })} color="#8fb8a0" {paused} />
    </div>
    <div class="{cell} min-[601px]:col-span-2">
      <h3 class={label}>Presses</h3>
      <div class="flex flex-wrap gap-x-12 gap-y-4">
        <div>
          <div class={value}><span class="sr-only">Held for </span><span data-testid="hold" class="text-gold">{stats.hold}</span><span class={unit}>ms held</span></div>
          <div class={summary}>Average {stats.holdAverage} ms, longest {stats.holdMax} ms</div>
        </div>
        <div>
          <div class={value}><span class="sr-only">Gap before it </span><span data-testid="interval" class="text-[#8fb8a0]">{stats.interval}</span><span class={unit}>ms between</span></div>
          <div class={summary}>Average {stats.intervalAverage} ms, shortest {stats.intervalMin} ms</div>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-screen-muted" aria-hidden="true">
        <span class="flex items-center gap-2"><span class="inline-block h-3 w-4 border-2 border-b-0 border-gold bg-gold/20"></span>Held</span>
        <span class="flex items-center gap-2"><span class="inline-block h-2 w-4 border-x border-[#8fb8a0] bg-[linear-gradient(#8fb8a0,#8fb8a0)] bg-[length:100%_1px] bg-center bg-no-repeat"></span>Time between</span>
      </div>
      <TelemetryChart label="Press timeline" data={() => ({ kind: 'timeline', values: stats.presses, now: stats.now })} color="#e8b931" {paused} height={104} />
      <div class="mt-1.5 flex justify-between gap-4 text-sm text-screen-muted" aria-hidden="true"><span>{pressWindow / 1000} seconds ago</span><span>Now</span></div>
    </div>
  </div>
</section>
