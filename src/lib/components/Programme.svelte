<script lang="ts">
  import { afterPartyUrl, partners, schedule } from '$lib/conference';
  import ExternalLink from './ExternalLink.svelte';
  const byTime = [...partners].sort((a, b) => a.time.localeCompare(b.time));
</script>

<section id="program" class="section bg-panel" tabindex="-1" aria-labelledby="program-heading">
  <div class="wrap">
    <h2 id="program-heading">Programme</h2>
    <p class="intro">Lunch from 12:00, sessions from 13:30, then show and tell into the evening.</p>
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
            {#if item.offsite}<ExternalLink button href={afterPartyUrl}>See the Open Socials event</ExternalLink>{/if}
          </div>
        </li>
      {/each}
    </ol>

    <div class="mt-20 grid gap-x-8 gap-y-12 min-[601px]:grid-cols-2 min-[1000px]:grid-cols-4">
      {#each byTime as partner (partner.name)}
        <article class="flex flex-col">
          <div class="relative overflow-hidden rounded-[10px] bg-raised">
            <img class="block aspect-[4/3] size-full object-cover" style:object-position={partner.name === 'Schematik' ? '28% 50%' : 'center'} src={partner.image} width={partner.width} height={partner.height} loading="lazy" alt={partner.alt} />
            <span class={['absolute bottom-3 left-3 rounded-md px-2.5 py-[7px]', partner.lightChip ? 'bg-white' : 'bg-[#161817]']}><img class={['block w-auto', partner.lightChip ? 'h-[26px]' : 'h-[15px]', partner.invert && 'invert']} src={partner.logo} width={partner.logoWidth} height={partner.logoHeight} alt={partner.name} /></span>
          </div>
          <div class="mt-4">
            <p class="mb-1 text-[.95rem] font-medium text-accent tabular-nums">{partner.time}</p>
            <h3 class="mb-1.5 text-[1.2rem] leading-tight font-semibold text-heading">{partner.name}</h3>
            <p class="text-muted">
              {#if partner.name === 'Hapticlabs'}
                Hands-on haptic prototyping tools, with a session led by <strong class="font-semibold text-copy">Thomas Müller</strong>, CEO of <ExternalLink href={partner.url}>Hapticlabs</ExternalLink>.
              {:else if partner.name === 'Schematik'}
                AI-based tools for embedded coding, presented by the team behind <ExternalLink href={partner.url}>Schematik.io</ExternalLink>.
              {:else if partner.name === 'OSHned'}
                Open-source research hardware from Dutch universities, from lab robots to batteries and microscopes, brought together in one national network.
              {:else}
                An open-source Bluetooth speaker built to be repaired and hacked. Take it apart with the UX hardware team at <ExternalLink href={partner.url}>Teufel</ExternalLink>.
              {/if}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
