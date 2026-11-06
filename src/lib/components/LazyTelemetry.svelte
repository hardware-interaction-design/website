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
    <section class="instrument p-5 min-[601px]:p-6" aria-labelledby="telemetry-heading" aria-busy={loading}>
      <h2 id="telemetry-heading" class="mb-2 text-[1.35rem] leading-tight font-semibold tracking-normal text-white [font-stretch:100%]">Live input demo</h2>
      <p class="max-w-[38rem] text-[.95rem] text-screen-copy">See how a prototype measures movement, presses, and the pauses between them. The demo loads as you scroll here. Input stays in your browser.</p>
      {#if loading || failed}<p role="status" class="mt-3 text-[.95rem] text-screen-copy">{failed ? 'The demo could not load. Try again.' : 'Loading the input demo.'}</p>{/if}
      {#if failed}<Button onclick={load}>Retry input demo</Button>{/if}
      <noscript><p class="mt-4 text-[.95rem] text-screen-muted">Turn on JavaScript to use the demo. The rest of the site works without it.</p></noscript>
    </section>
  {/if}
</div>
