<script lang="ts">
  import { attachChart, type ChartData } from '$lib/charts';
  import { pressWindow } from '$lib/telemetry';
  let { label, data, color, paused, height = 60 }: { label: string; data: () => ChartData; color: string; paused: boolean; height?: number } = $props();
  const id = $props.id();
  const source = $derived(data());
  const description = $derived.by(() => {
    if (source.kind === 'trail') {
      if (!source.values.length) return 'No pointer movement recorded yet.';
      const first = source.values[0], last = source.values[source.values.length - 1];
      return `${source.values.length} recent positions, from x ${Math.round(first.x)}, y ${Math.round(first.y)} to x ${Math.round(last.x)}, y ${Math.round(last.y)}.`;
    }
    if (source.kind === 'timeline') {
      const presses = source.values;
      if (!presses.length) return `No presses in the last ${pressWindow / 1000} seconds.`;
      const latest = presses[presses.length - 1];
      const held = latest.end === undefined ? `still held after ${Math.round(source.now - latest.start)}` : `held ${Math.round(latest.end - latest.start)}`;
      const previous = presses[presses.length - 2];
      const gap = previous?.end !== undefined && latest.start > previous.end ? `, ${Math.round(latest.start - previous.end)} milliseconds after the previous release` : '';
      return `${presses.length} presses in the last ${pressWindow / 1000} seconds. Latest ${held} milliseconds${gap}.`;
    }
    if (!source.values.length) return 'No samples recorded yet.';
    return `${source.values.length} recent samples. Lowest ${Math.min(...source.values)}, highest ${Math.max(...source.values)}, latest ${source.values[source.values.length - 1]} pixels per second.`;
  });
</script>

<figure class="relative mt-4" aria-labelledby={id}>
  <canvas {height} style:height="{height}px" class="block w-full rounded-[3px]" aria-hidden="true" {@attach attachChart(data, color, () => paused, height)}></canvas>
  {#if source.kind !== 'timeline'}<span class="absolute top-1.5 right-2 text-xs text-screen-muted" aria-hidden="true">{label}</span>{/if}
  <figcaption id={id} class="sr-only">{label}. {description}</figcaption>
</figure>
