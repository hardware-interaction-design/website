<script lang="ts">
  import type { Snippet } from 'svelte';
  import LinkButton from './ui/LinkButton.svelte';
  // `button` gives the link its own line and a full-size target instead of sitting inside a sentence.
  let { href, button = false, children }: { href: string; button?: boolean; children: Snippet } = $props();
</script>

{#if button}
  <LinkButton {href} target="_blank" variant="text" class="no-underline">
    <span class="underline">{@render children()}</span><span aria-hidden="true">↗</span><span class="sr-only"> opens in a new tab</span>
  </LinkButton>
{:else}
  <a class="text-link no-underline" {href} target="_blank" rel="noopener noreferrer">
    <span class="underline">{@render children()}</span>&nbsp;<span aria-hidden="true">↗</span><span class="sr-only"> opens in a new tab</span>
  </a>
{/if}
