<script lang="ts">
  import { registrationUrl } from '$lib/conference';
  import LinkButton from './ui/LinkButton.svelte';
  let { compact = false } = $props<{ compact?: boolean }>();
</script>

<LinkButton
  href={registrationUrl}
  target="_blank"
  variant={compact ? 'outline' : 'primary'}
  size={compact ? 'compact' : 'default'}
>
  {#if compact}
    Reserve your spot
  {:else}
    Reserve your spot <span class="text-[1.1rem]" aria-hidden="true">↗</span>
  {/if}
  <span class="sr-only">, opens in a new tab</span>
</LinkButton>
