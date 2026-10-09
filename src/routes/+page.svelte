<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import RegistrationLink from '$lib/components/RegistrationLink.svelte';
  import CalendarDownload from '$lib/components/CalendarDownload.svelte';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import Programme from '$lib/components/Programme.svelte';
  import LazyTelemetry from '$lib/components/LazyTelemetry.svelte';
  import { hardwarePhoto, mapUrl, programmeUrl, topics } from '$lib/conference';
  const description = 'A one-day conference on designing better experiences in the physical world — talks and hands-on workshops for the people who design, research, prototype, and ship hardware.';
  const socialTitle = 'Hardware Interaction Design Conference — 23 Oct 2026, Eindhoven';
  const imageAlt = 'Hardware Interaction Design Conference — Fri 23 Oct 2026, High Tech Campus, Eindhoven, during Dutch Design Week.';
</script>

<svelte:head>
  <title>Hardware Interaction Design Conference — Oct 23, 2026</title>
  <link rel="canonical" href="https://hardwareux.com/" />
  <meta name="description" content={description + ' Fri 23 Oct 2026, High Tech Campus, Eindhoven.'} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Hardware Interaction Design" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="https://hardwareux.com/" />
  <meta property="og:title" content={socialTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://hardwareux.com/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={imageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={socialTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="https://hardwareux.com/og-image.png" />
  <meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>

<a href="#main" class="fixed top-2 left-2 z-[200] -translate-y-24 bg-accent px-4 py-2 text-black focus:translate-y-0">Skip to content</a>
<div id="top">
  <Navigation />
  <main id="main" tabindex="-1">
    <header class="border-b border-line pt-[100px] pb-20">
      <div class="wrap">
        <img class="mb-[34px] block h-auto w-[260px] max-w-[70%] rounded-xl px-5 py-4" src="/UX.png" alt="Hardware Interaction Design" />
        <div class="mb-5 flex items-center gap-2.5 font-mono text-xs tracking-[.2em] text-accent uppercase after:h-px after:max-w-20 after:flex-1 after:bg-accent after:opacity-30">Hardware Interaction Design</div>
        <h1 class="mb-5 text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.1]">Hardware<br />Interaction Design<br />Conference</h1>
        <p class="mb-10 max-w-[560px] text-[1.2rem] leading-[1.6] text-muted">A one-day conference on designing better experiences in the physical world — talks and hands-on workshops, for and by the people who design, research, prototype, and ship hardware.</p>
        <div class="mt-10 mb-9 overflow-hidden border border-line bg-panel">
          <div class="panel-header"><span class="sensor-dot"></span> EVENT DETAILS</div>
          <div class="grid min-[701px]:grid-cols-3">
            <div class="border-b border-line px-[22px] py-6 min-[701px]:border-r min-[701px]:border-b-0">
              <div class="mb-2.5 font-mono text-[.65rem] tracking-[.15em] text-accent uppercase">When</div>
              <div class="mb-1.5 text-[1.35rem] leading-[1.2] font-bold text-heading">Fri 23 Oct 2026</div>
              <div class="text-[.85rem] leading-[1.4] text-muted">Dutch Design Week — <ExternalLink href={programmeUrl}>DDW programme</ExternalLink></div>
            </div>
            <div class="border-b border-line px-[22px] py-6 min-[701px]:border-r min-[701px]:border-b-0">
              <div class="mb-2.5 font-mono text-[.65rem] tracking-[.15em] text-accent uppercase">Where</div>
              <div class="mb-1.5 text-[1.35rem] leading-[1.2] font-bold text-heading">High Tech Campus</div>
              <div class="text-[.85rem] leading-[1.4] text-muted">1d The Strip, Eindhoven — <ExternalLink href={mapUrl}>View campus map</ExternalLink></div>
            </div>
            <div class="px-[22px] py-6">
              <div class="mb-2.5 font-mono text-[.65rem] tracking-[.15em] text-accent uppercase">What</div>
              <div class="mb-1.5 text-[1.35rem] leading-[1.2] font-bold text-heading">Talks, Workshops, Interactive sessions.</div>
              <div class="text-[.85rem] leading-[1.4] text-muted">A planned programme, plus open time to bring &amp; share your own tools</div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-4"><RegistrationLink /><CalendarDownload /></div>
        <p class="mt-3 text-sm text-muted">Registration opens in a new tab. The calendar file downloads separately.</p>
        <div class="relative mt-10 overflow-hidden border border-line">
          <span class="absolute top-3 left-3.5 z-20 bg-background px-2.5 py-[5px] font-mono text-xs tracking-[.15em] text-heading uppercase">// Physical Controls</span>
          <img class="block h-auto max-h-[420px] w-full object-cover grayscale contrast-[1.15] brightness-75" src={hardwarePhoto} alt="Close-up of rotary encoders, illuminated switches, and knobs on a hardware prototype board" />
          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(240,165,0,.4),rgba(0,200,160,.25)_60%,rgba(8,12,16,.3))] mix-blend-color" aria-hidden="true"></div>
          <div class="relative z-20 flex flex-wrap justify-between gap-3 bg-background px-3.5 py-3 font-mono text-xs tracking-[.05em]">
            <span>Rotary encoders, switches &amp; knobs</span><span class="text-muted">The building blocks of hardware UX</span>
          </div>
        </div>
        <LazyTelemetry />
      </div>
    </header>
    <Programme />
    <section id="venue" class="section" tabindex="-1" aria-labelledby="venue-heading">
      <div class="wrap">
        <div class="section-tag">Venue &amp; Getting There</div>
        <h2 id="venue-heading">High Tech Campus, The Strip — Eindhoven.</h2>
        <p class="intro">The conference takes place at <span class="font-semibold text-accent">1d The Strip, High Tech Campus</span>, on Friday 23 October 2026, during <ExternalLink href="https://ddw.nl/">Dutch Design Week</ExternalLink>.</p>
        <div class="mt-10 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px bg-line">
          <div class="bg-panel px-6 py-7 transition-colors hover:bg-raised">
            <div class="mb-3.5 text-[1.4rem]" aria-hidden="true">📍</div><h3 class="card-title">Location</h3>
            <p class="text-[.9rem] text-muted">1d The Strip, High Tech Campus, Eindhoven. <ExternalLink href={mapUrl}>View campus map</ExternalLink></p>
          </div>
          <div class="bg-panel px-6 py-7 transition-colors hover:bg-raised">
            <div class="mb-3.5 text-[1.4rem]" aria-hidden="true">🚗</div><h3 class="card-title">By Car, Train, Plane or OV-fiets</h3>
            <p class="text-[.9rem] text-muted">Plan your journey by car, public transport, plane, or OV-fiets. <ExternalLink href="https://www.hightechcampus.com/about-us/visit-the-campus/">Campus travel directions</ExternalLink></p>
          </div>
        </div>
      </div>
    </section>
    <section id="topics" class="section" tabindex="-1" aria-labelledby="topics-heading">
      <div class="wrap">
        <div class="section-tag">What We'll Cover</div><h2 id="topics-heading">The full spectrum of hardware UX.</h2>
        <div class="mt-8 flex flex-wrap gap-2">{#each topics as topic (topic)}<span class="topic">{topic}</span>{/each}</div>
      </div>
    </section>
    <section id="register" class="section" tabindex="-1" aria-labelledby="register-heading">
      <div class="wrap">
        <div class="section-tag">Register</div><h2 id="register-heading">Reserve your spot.</h2>
        <p class="mb-8 max-w-[620px] text-[1.05rem]">Whether you're designing headphones, medical devices, bicycles, power tools, smart home products, laboratory equipment, wearables, or something entirely different, this conference is a place to learn from others facing similar challenges — and, if you'd like, to bring your own tool, product, or method for others to try in a workshop.</p>
        <p class="mb-10 max-w-[540px] text-[1.15rem] leading-[1.5] font-semibold text-heading">Friday 23 October 2026 · High Tech Campus, Eindhoven · Dutch Design Week.</p>
        <div class="flex flex-wrap items-center gap-5">
          <RegistrationLink />
          <CalendarDownload />
          <span class="font-mono text-[.72rem] text-muted">Hosted by Hardware Interaction Design &nbsp;·&nbsp; No spam &nbsp;·&nbsp; <ExternalLink href={programmeUrl}>On the DDW programme</ExternalLink></span>
        </div>
      </div>
    </section>
    <section id="about" class="section" tabindex="-1" aria-labelledby="about-heading">
      <div class="wrap">
        <div class="section-tag">Hosted By</div><h2 id="about-heading">The Hardware Interaction Design community.</h2>
        <p>This is the first in-person event from <span class="font-semibold text-accent">Hardware Interaction Design</span>, a community for the interaction designers, UX researchers, industrial designers, and engineers who design, research, prototype, and ship physical products — because designing a button, a dial, or a wearable comes with challenges that software communities rarely discuss.</p>
      </div>
    </section>
  </main>
  <footer class="py-8 font-mono text-[.72rem] text-muted">
    <div class="wrap flex w-full flex-wrap justify-between gap-2.5">
      <span class="flex items-center gap-2.5"><img class="mark h-[14px] box-content px-1.5 py-1" src="/logo-mark.png" width="800" height="435" alt="" /> // HARDWARE INTERACTION DESIGN</span>
      <span>Hardware Interaction Design Conference · 23 Oct 2026 · High Tech Campus, Eindhoven</span>
    </div>
  </footer>
</div>
