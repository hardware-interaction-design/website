<script lang="ts">
  import { partners, pillars, hardwarePhoto } from '$lib/conference';
  import ExternalLink from './ExternalLink.svelte';
</script>

<section id="program" class="section relative" tabindex="-1" aria-labelledby="program-heading">
  <div class="pointer-events-none absolute inset-0 bg-cover opacity-[.14] grayscale brightness-[.35]" style:background-image={`url('${hardwarePhoto}')`} style:background-position="center 30%" aria-hidden="true"></div>
  <div class="wrap">
    <div class="section-tag">Program</div>
    <h2 id="program-heading">A planned programme, plus open time to share.</h2>
    <div class="mb-7 inline-flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-xs tracking-[.1em] text-signal"><span class="sensor-dot" aria-hidden="true"></span> More talks and workshops will be announced.</div>
    <p class="intro">One track, one venue, one day — a curated programme of talks and workshops, alongside open, unstructured interactive sessions where anyone can bring a tool, product, or method to try.</p>
    <div class="mt-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px bg-line">
      {#each pillars as pillar (pillar.title)}
        <div class="bg-panel px-6 py-7 transition-colors hover:bg-raised">
          <div class="mb-3.5 text-[1.4rem]" aria-hidden="true">{pillar.icon}</div>
          <h3 class="card-title">{pillar.title}</h3>
          <p class="text-[.9rem] text-muted">{pillar.text}</p>
        </div>
      {/each}
    </div>
    <div class="mt-9 grid gap-4 min-[761px]:grid-cols-3">
      {#each partners as partner (partner.name)}
        <article class="relative flex flex-col border border-line bg-panel">
          <div class="relative flex aspect-video items-center justify-center overflow-hidden border-b border-line bg-raised min-[761px]:aspect-[5/4]">
            <img class="block size-full object-cover" style:object-position={partner.name === 'Schematik' ? '28% 50%' : 'center'} src={partner.image} width={partner.width} height={partner.height} loading="lazy" alt={partner.alt} />
            <span class="absolute bottom-3 left-3 rounded-[5px] border border-line bg-background/80 px-2.5 py-[7px] backdrop-blur-sm"><img class={['block h-[15px] w-auto', partner.invert && 'invert']} src={partner.logo} width={partner.logoWidth} height={partner.logoHeight} alt={partner.name} /></span>
          </div>
          <div class="flex-1 p-5">
            <div class="mb-2 font-mono text-[.65rem] tracking-[.15em] text-accent uppercase">{partner.kind}</div>
            <h3 class="mb-1.5 text-[1.1rem] font-bold text-heading">{partner.name}</h3>
            <p class="text-[.9rem] text-muted">
              {#if partner.name === 'Hapticlabs'}
                Hands-on haptic prototyping tools, with a session led by <strong class="text-copy">Thomas Müller</strong>, CEO of <ExternalLink href={partner.url}>Hapticlabs</ExternalLink>.
              {:else if partner.name === 'Schematik'}
                AI-based tools for embedded coding, presented by the team behind <ExternalLink href={partner.url}>Schematik.io</ExternalLink>.
              {:else}
                An open-source Bluetooth speaker built to be repaired and hacked, presented by <ExternalLink href={partner.url}>Teufel</ExternalLink>.
              {/if}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
