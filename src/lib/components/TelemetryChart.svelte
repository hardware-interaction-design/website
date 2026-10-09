<script lang="ts">
  import { attachChart, type ChartData } from '$lib/charts';
  let { label, data, color, paused }: { label: string; data: () => ChartData; color: string; paused: boolean } = $props();
  const id = $props.id();
  const source = $derived(data());
  const description = $derived.by(() => {
    if (source.kind === 'trail') {
      if (!source.values.length) return 'No pointer movement recorded yet.';
      const first = source.values[0], last = source.values[source.values.length - 1];
      return `${source.values.length} recent positions, from x ${Math.round(first.x)}, y ${Math.round(first.y)} to x ${Math.round(last.x)}, y ${Math.round(last.y)}.`;
    }
    if (!source.values.length) return 'No contacts recorded yet.';
    const unit = source.kind === 'line' ? 'pixels per second' : 'milliseconds';
    return `${source.values.length} recent samples. Lowest ${Math.min(...source.values)}, highest ${Math.max(...source.values)}, latest ${source.values[source.values.length - 1]} ${unit}.`;
  });
</script>

<figure class="relative mt-3" aria-labelledby={id}>
  <canvas height="60" class="block h-[60px] w-full" aria-hidden="true" {@attach attachChart(data, color, () => paused)}></canvas>
  <span class="absolute top-2 right-2.5 font-mono text-[.6rem] tracking-[.1em] text-muted" aria-hidden="true">{label}</span>
  <figcaption id={id} class="sr-only">{label}. {description}</figcaption>
</figure>
