<script lang="ts">
  import { afterPartyUrl, schedule } from '$lib/conference';
  import ExternalLink from './ExternalLink.svelte';
</script>

<section id="program" class="section bg-panel" tabindex="-1" aria-labelledby="program-heading">
  <div class="wrap">
    <h2 id="program-heading">Original programme</h2>
    <p class="intro">The schedule as shared for Friday 23 October 2026. This event has ended.</p>
    <details>
      <summary class="mb-6 min-h-11 cursor-pointer py-2 font-semibold text-accent underline underline-offset-4">View the day's programme</summary>
    <ol class="max-w-[54rem] border-t-2 border-heading">
      {#each schedule as item (item.start)}
        <li class={['grid gap-x-8 gap-y-1 border-b border-line py-4 min-[601px]:grid-cols-[8.5rem_minmax(0,1fr)]', item.offsite && 'mt-6 border-t border-dashed border-t-control']}>
          <p class="mb-0 text-[1.05rem] font-semibold text-heading tabular-nums [font-stretch:85%]">
            {#if item.end}<time>{item.start}</time>–<time>{item.end}</time>{:else}From <time>{item.start}</time>{/if}
          </p>
          <div>
            <h3 class="text-[1.15rem]">
              {#if item.host}<span class="block text-[.95rem] font-medium text-accent">{item.host}<span class="sr-only">:</span></span>{/if}
              {item.title}
            </h3>
            {#if item.text}<p class="mt-1 text-muted">{item.text}</p>{/if}
            {#if item.offsite}<ExternalLink button href={afterPartyUrl}>Original Open Socials listing</ExternalLink>{/if}
          </div>
        </li>
      {/each}
    </ol>
    </details>
  </div>
</section>
