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
    <section class="mt-14 min-h-[30rem] border border-line bg-panel" aria-labelledby="telemetry-heading">
      <div class="panel-header"><h2 id="telemetry-heading" class="mb-0 font-mono text-sm font-normal tracking-normal text-copy">Live input demo</h2></div>
      <div class="p-5">
        <p class="text-sm text-muted">Explore pointer, keyboard, and touch input. The demo loads as you approach this section.</p>
        <p role="status" class="text-sm text-copy">{failed ? 'The demo could not load. Try again.' : loading ? 'Loading the input demo.' : ''}</p>
        <Button onclick={load} disabled={loading}>{failed ? 'Retry input demo' : 'Load input demo'}</Button>
        <noscript><p class="mt-4 text-sm text-muted">Enable JavaScript to use the interactive demo. The conference information and registration links work without it.</p></noscript>
      </div>
    </section>
  {/if}
</div>
