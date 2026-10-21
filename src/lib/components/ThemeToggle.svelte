<script lang="ts">
  import { onMount } from 'svelte';
  import Button from './ui/Button.svelte';

  // Null until mounted: the prerendered page cannot know the visitor's theme.
  let dark = $state<boolean | null>(null);

  onMount(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const read = () => { dark = (document.documentElement.dataset.theme ?? (query.matches ? 'dark' : 'light')) === 'dark'; };
    read();
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  });

  function toggle() {
    dark = !dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* Private browsing can block storage; the choice still applies to this page. */ }
  }
</script>

<Button variant="ghost" size="compact" class="px-2.5" onclick={toggle} disabled={dark === null} aria-pressed={dark ?? undefined}>
  <svg class="size-[18px]" viewBox="0 0 24 24" fill={dark ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
  <span class="sr-only">Dark mode</span>
</Button>
