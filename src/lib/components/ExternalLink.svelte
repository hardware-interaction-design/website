<script lang="ts">
  import type { Snippet } from 'svelte';
  let { href, children }: { href: string; children: Snippet } = $props();
</script>

<a class="text-link" {href} target="_blank" rel="noopener noreferrer">
  {@render children()} <span aria-hidden="true">↗</span><span class="sr-only"> opens in a new tab</span>
</a>
