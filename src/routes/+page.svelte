<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import Navigation from '$lib/components/Navigation.svelte';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import LinkButton from '$lib/components/ui/LinkButton.svelte';
  import LazyTelemetry from '$lib/components/LazyTelemetry.svelte';
  import { communityUrl, eventPath, eventPhotos, topics } from '$lib/conference';
  const description = 'A community for the interaction designers, UX researchers, industrial designers, and engineers who design, research, prototype, and ship physical products.';

  // The conference used to live on this page. Send old section links to their new home.
  onMount(() => {
    const id = location.hash.slice(1);
    if (['program', 'venue', 'register', 'about'].includes(id)) location.replace(eventPath + '#' + id);
  });
</script>

<svelte:head>
  <title>Hardware Interaction Design</title>
  <link rel="canonical" href="https://hardwareux.com/" />
  <meta name="description" content={description + ' Next event: Stockholm, early 2027. Read about our first conference in Eindhoven.'} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Hardware Interaction Design" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="https://hardwareux.com/" />
  <meta property="og:title" content="Hardware Interaction Design" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={'https://hardwareux.com' + eventPhotos.community.src} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="853" />
  <meta property="og:image:alt" content={eventPhotos.community.alt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Hardware Interaction Design" />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={'https://hardwareux.com' + eventPhotos.community.src} />
  <meta name="twitter:image:alt" content={eventPhotos.community.alt} />
</svelte:head>

<a href="#main" class="fixed top-2 left-2 z-[200] -translate-y-24 rounded-md bg-accent px-4 py-2 text-on-accent focus:translate-y-0">Skip to content</a>
<div id="top">
  <Navigation />
  <main id="main" tabindex="-1">
    <header class="pt-8 pb-12 min-[761px]:pt-12 min-[761px]:pb-16">
      <div class="wrap grid items-center gap-x-12 gap-y-5 min-[900px]:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h1 class="max-w-[48rem] text-[clamp(2.75rem,7vw,5.5rem)] leading-[.95] tracking-[-.015em]">Hardware Interaction Design</h1>
          <p class="mt-5 max-w-[36rem] text-[1.15rem] leading-[1.5] text-copy">A community for people who design physical products. Share tools, methods, and projects with designers, researchers, and engineers.</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <LinkButton href={communityUrl} target="_blank">Join on LinkedIn<span class="sr-only">, opens in a new tab</span></LinkButton>
            <LinkButton href="#events" variant="secondary">See events</LinkButton>
          </div>
          <a class="text-link mt-3 inline-flex min-h-11 items-center text-[.95rem]" href="#stockholm">Next event: Stockholm, early 2027</a>
        </div>
        <img class="order-first block h-auto w-[96px] min-[601px]:w-[160px] min-[900px]:order-none min-[900px]:w-[220px]" src="/UX.png" width="562" height="278" alt="" />
      </div>
    </header>

    <section id="events" class="section bg-panel" tabindex="-1" aria-labelledby="events-heading">
      <div class="wrap">
        <h2 id="events-heading">Upcoming events</h2>
        <div id="stockholm" class="mt-8 grid scroll-mt-24 gap-x-16 gap-y-6 border-t-2 border-heading pt-6 min-[761px]:grid-cols-2" tabindex="-1" aria-labelledby="stockholm-heading">
          <div>
            <h3 id="stockholm-heading" class="text-[clamp(2.75rem,7vw,5rem)] leading-none font-extrabold [font-stretch:75%]">Stockholm</h3>
            <p class="mt-3 text-[1.4rem] font-semibold text-accent">Early 2027</p>
          </div>
          <div class="max-w-[32rem]">
            <p class="text-[1.2rem]">Our next Hardware Interaction Design event is coming to Stockholm.</p>
            <p class="font-medium text-heading">Date and venue to be announced.</p>
            <p class="text-muted">The programme will follow. Join the LinkedIn group to keep up with plans and share what you're working on.</p>
            <ExternalLink button href={communityUrl}>Join the LinkedIn group</ExternalLink>
          </div>
        </div>
      </div>
    </section>

    <section id="past-events" class="section" tabindex="-1" aria-labelledby="past-events-heading">
      <div class="wrap">
        <h2 id="past-events-heading">Past events</h2>
        <article class="mt-10 grid overflow-hidden rounded-[14px] bg-panel min-[900px]:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]" aria-labelledby="conference-heading">
          <div class="flex flex-col p-6 min-[601px]:p-10">
            <p class="mb-3 text-[.95rem] font-medium text-accent">Eindhoven, our first edition</p>
            <h3 id="conference-heading" class="text-[clamp(2rem,4.5vw,3.1rem)] leading-[.98] font-extrabold [font-stretch:75%]"><a class="hover:text-accent" href={resolve(eventPath)}>Hardware Interaction Design Conference</a></h3>
            <p class="mt-5 text-[1.35rem] leading-[1.3] font-bold text-heading [font-stretch:85%]"><time datetime="2026-10-23">Friday 23 October 2026</time><br />Student Base, High Tech Campus</p>
            <p class="mt-4 max-w-[34rem] text-muted">Haptics you could feel, a speaker you could take apart, and tools for building and sharing hardware. Our first conference brought people together during Dutch Design Week to learn from each other's work.</p>
            <div class="mt-8 flex flex-wrap items-center gap-3 min-[900px]:mt-auto min-[900px]:pt-8">
              <LinkButton href={resolve(eventPath)} variant="secondary">Read the recap<span class="sr-only"> of the Hardware Interaction Design Conference</span></LinkButton>
            </div>
          </div>
          <img class="order-first block aspect-[3/2] size-full object-cover min-[900px]:order-none min-[900px]:aspect-auto" src={eventPhotos.community.src} width="1280" height="853" loading="lazy" alt={eventPhotos.community.alt} />
        </article>
      </div>
    </section>

    <section id="topics" class="section" tabindex="-1" aria-labelledby="topics-heading">
      <div class="wrap">
        <h2 id="topics-heading">What we talk about</h2>
        <p class="intro">The full spectrum of hardware UX.</p>
        <ul class="grid gap-x-10 min-[601px]:grid-cols-2 min-[900px]:grid-cols-3">{#each topics as topic (topic)}<li class="topic">{topic}</li>{/each}</ul>
      </div>
    </section>

    <section id="community" class="section bg-panel" tabindex="-1" aria-labelledby="community-heading">
      <div class="wrap grid gap-x-16 gap-y-6 min-[900px]:grid-cols-2">
        <h2 id="community-heading">Keep the conversation going</h2>
        <div class="max-w-[34rem]">
          <p class="text-[1.15rem]">We started the Hardware Interaction Design LinkedIn group at the first conference. Join us to share tools, methods, and inspiration with others working on physical products.</p>
          <LinkButton href={communityUrl} target="_blank">Join on LinkedIn<span class="sr-only">, opens in a new tab</span></LinkButton>
        </div>
      </div>
    </section>

    <div id="demo" class="wrap scroll-mt-24 py-16 min-[761px]:py-20" tabindex="-1">
      <LazyTelemetry />
    </div>
  </main>
  <footer class="border-t border-line py-8 text-[.9rem] text-muted">
    <div class="wrap flex w-full flex-wrap items-center justify-between gap-3">
      <span class="flex items-center gap-3 font-medium text-heading"><img class="mark h-5" src="/logo-mark.png" width="800" height="435" alt="" /> Hardware Interaction Design</span>
      <a class="text-link" href="#stockholm">Next event: Stockholm, early 2027</a>
    </div>
  </footer>
</div>
