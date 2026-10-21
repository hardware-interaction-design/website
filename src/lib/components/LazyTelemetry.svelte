<script lang="ts">
  import type { Component } from 'svelte';
  import Button from './ui/Button.svelte';

  let Telemetry = $state<Component | null>(null);
  let loading = $state(false);
  let failed = $state(false);

  async function load() {
    if (loading || Telemetry) return;
    loading = true;
    failed = false;
    try {
      const module = await import('./Telemetry.svelte');
      Telemetry = module.default;
    } catch {
      failed = true;
    } finally {
      loading = false;
    }
  }

  function observe(element: HTMLElement) {
    if (!('IntersectionObserver' in window)) { void load(); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    }, { rootMargin: '240px' });
    observer.observe(element);
    return () => observer.disconnect();
  }
</script>

<div data-testid="telemetry-loader" {@attach observe}>
  {#if Telemetry}
    <Telemetry />
  {:else}
    <section class="instrument min-h-[34rem]" aria-labelledby="telemetry-heading">
      <div class="p-5 min-[601px]:px-6">
        <h2 id="telemetry-heading" class="mb-1.5 text-[1.35rem] leading-tight font-semibold tracking-normal text-white [font-stretch:100%]">Live input demo</h2>
        <p class="text-[.95rem] text-screen-muted">Measure your pointer, keys, clicks, and taps. The demo loads as you reach this section.</p>
        <p role="status" class="text-[.95rem] text-screen-copy">{failed ? 'The demo could not load. Try again.' : loading ? 'Loading the input demo.' : ''}</p>
        <Button onclick={load} disabled={loading}>{failed ? 'Retry input demo' : 'Load input demo'}</Button>
        <noscript><p class="mt-4 text-[.95rem] text-screen-muted">Turn on JavaScript to use the demo. Conference details and registration work without it.</p></noscript>
      </div>
    </section>
  {/if}
</div>
