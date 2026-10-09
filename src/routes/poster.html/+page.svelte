<script lang="ts">
  import { partners } from '$lib/conference';
</script>

<svelte:head><title>Hardware Interaction Design Conference — Square Poster</title><meta name="robots" content="noindex" /></svelte:head>

<main class="relative z-10 flex min-h-screen w-full flex-col bg-background px-6 py-10 text-[#f2f6fa] min-[1080px]:h-[1080px] min-[1080px]:min-h-0 min-[1080px]:w-[1080px] min-[1080px]:px-[72px] min-[1080px]:py-[76px]">
  <h1 class="text-[clamp(2rem,8vw,6.25rem)] leading-[.97] tracking-[-.035em] text-[#f2f6fa] min-[1080px]:text-[100px]">Hardware<br />Interaction Design<br />Conference</h1>
  <div class="mt-[30px] text-2xl font-medium tracking-[-.01em] text-accent min-[1080px]:text-[36px]">Friday 23 October 2026</div>
  <div class="mt-10 grid gap-6 min-[600px]:grid-cols-3 min-[1080px]:mt-auto">
    {#each partners as partner (partner.name)}
      <div>
        <img class="block aspect-[5/4] h-auto w-full object-cover" style:object-position={partner.name === 'Schematik' ? '28% 50%' : 'center'} src={partner.image} width={partner.width} height={partner.height} alt={partner.alt} />
        <div class="mt-5 font-mono text-base tracking-[.14em] text-muted">{partner.kind}</div>
        <div class="mt-[13px] flex h-[26px] items-center gap-2.5">
          <img class={['block w-auto', partner.invert && 'invert']} style:height={partner.name === 'Hapticlabs' ? '24px' : partner.name === 'Schematik' ? '21px' : '25px'} src={partner.logo} width={partner.logoWidth} height={partner.logoHeight} alt={partner.name === 'Hapticlabs' ? '' : partner.name} />
          {#if partner.name === 'Hapticlabs'}<span class="text-[23px] font-semibold tracking-[-.01em]">Hapticlabs</span>{/if}
        </div>
      </div>
    {/each}
  </div>
  <footer class="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t border-[#22313f] pt-[26px] font-mono text-base text-muted min-[1080px]:mt-auto min-[1080px]:flex-nowrap min-[1080px]:text-xl">
    <span>High Tech Campus, Eindhoven · Dutch Design Week</span><span class="text-[#f2f6fa]">hardwareux.com</span>
  </footer>
</main>
