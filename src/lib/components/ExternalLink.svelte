<script lang="ts">
  import type { Snippet } from 'svelte';
  import LinkButton from './ui/LinkButton.svelte';
  // `button` gives the link its own line and a full-size target instead of sitting inside a sentence.
  let { href, button = false, children }: { href: string; button?: boolean; children: Snippet } = $props();
</script>

{#if button}
  <LinkButton {href} target="_blank" variant="text">
    {@render children()}<span aria-hidden="true">↗</span><span class="sr-only"> opens in a new tab</span>
  </LinkButton>
{:else}
  <a class="text-link" {href} target="_blank" rel="noopener noreferrer">
    {@render children()}&nbsp;<span aria-hidden="true">↗</span><span class="sr-only"> opens in a new tab</span>
  </a>
{/if}
