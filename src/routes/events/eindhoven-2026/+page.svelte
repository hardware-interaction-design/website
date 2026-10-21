<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import RegistrationLink from '$lib/components/RegistrationLink.svelte';
  import CalendarDownload from '$lib/components/CalendarDownload.svelte';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import Programme from '$lib/components/Programme.svelte';
  import { eventPath, hardwarePhoto, mapUrl, programmeUrl, travelUrl } from '$lib/conference';
  const description = 'A one-day conference on designing better experiences in the physical world — talks and hands-on workshops for the people who design, research, prototype, and ship hardware.';
  const socialTitle = 'Hardware Interaction Design Conference — 23 Oct 2026, Eindhoven';
  const imageAlt = 'Hardware Interaction Design Conference — Fri 23 Oct 2026, High Tech Campus, Eindhoven, during Dutch Design Week.';
</script>

<svelte:head>
  <title>Hardware Interaction Design Conference — Oct 23, 2026</title>
  <link rel="canonical" href={'https://hardwareux.com' + eventPath} />
  <meta name="description" content={description + ' Fri 23 Oct 2026, Student Base, The Strip, High Tech Campus, Eindhoven.'} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Hardware Interaction Design" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content={'https://hardwareux.com' + eventPath} />
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

<a href="#main" class="fixed top-2 left-2 z-[200] -translate-y-24 rounded-md bg-accent px-4 py-2 text-on-accent focus:translate-y-0">Skip to content</a>
<div id="top">
  <Navigation />
  <main id="main" tabindex="-1">
    <header class="pt-14 pb-20 min-[761px]:pt-20">
      <div class="wrap">
        <h1 class="text-[clamp(3.1rem,9vw,6.75rem)] leading-[.9] tracking-[-.015em] text-balance">Hardware Interaction Design Conference</h1>
        <p class="mt-8 max-w-[36rem] text-[1.25rem] leading-[1.5] text-copy">A one-day conference on designing better experiences in the physical world. Talks and hands-on workshops, for and by the people who design, research, prototype, and ship hardware.</p>
        <dl class="mt-12 grid gap-x-10 gap-y-8 border-t-2 border-heading pt-6 min-[761px]:grid-cols-3">
          <div>
            <dt class="text-[.95rem] font-medium text-muted">When</dt>
            <dd class="mt-1 text-[1.6rem] leading-[1.15] font-bold text-heading [font-stretch:85%]">Friday 23 October 2026</dd>
            <dd class="mt-1.5 text-[.95rem] text-muted">Lunch from 12:00, programme from 13:30, during Dutch Design Week</dd>
            <dd><ExternalLink button href={programmeUrl}>See the DDW listing</ExternalLink></dd>
          </div>
          <div>
            <dt class="text-[.95rem] font-medium text-muted">Where</dt>
            <dd class="mt-1 text-[1.6rem] leading-[1.15] font-bold text-heading [font-stretch:85%]">Student Base, The Strip</dd>
            <dd class="mt-1.5 text-[.95rem] text-muted">First floor, High Tech Campus 1d, Eindhoven</dd>
            <dd><ExternalLink button href={mapUrl}>Open in maps</ExternalLink></dd>
          </div>
          <div>
            <dt class="text-[.95rem] font-medium text-muted">Format</dt>
            <dd class="mt-1 text-[1.6rem] leading-[1.15] font-bold text-heading [font-stretch:85%]">Talks, workshops, and show and tell</dd>
            <dd class="mt-1.5 text-[.95rem] text-muted">Bring a tool, product, or method of your own to share</dd>
          </div>
        </dl>
        <div class="mt-10 flex flex-wrap items-center gap-3"><RegistrationLink /><CalendarDownload /></div>
        <p class="mt-3 text-[.9rem] text-muted">Registration opens in a new tab. The calendar file downloads separately.</p>
        <figure class="mt-16">
          <img class="block aspect-[4/3] h-auto w-full rounded-[10px] object-cover min-[761px]:aspect-[21/9]" style:object-position="center 62%" src={hardwarePhoto} width="1024" height="768" alt="Close-up of rotary encoders, illuminated switches, and knobs on a hardware prototype board" />
          <figcaption class="mt-3 text-[.9rem] text-muted">Rotary encoders and illuminated knobs on a component test board, the building blocks of hardware UX.</figcaption>
        </figure>
      </div>
    </header>
    <Programme />
    <section id="people" class="section" tabindex="-1" aria-labelledby="people-heading">
      <div class="wrap grid gap-x-16 gap-y-6 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <h2 id="people-heading">Who you'll meet</h2>
        <div class="max-w-[38rem] text-[1.1rem] min-[900px]:pt-2">
          <p>The room is a mix: research professors from TU/e, researchers and PhD students, startups, company owners and self-employed designers, and people from larger organisations such as Accenture, Philips, and LEGO.</p>
          <p>All of them work in the space between user experience and hardware, and all of them are doing something worth asking about.</p>
        </div>
      </div>
    </section>
    <section id="venue" class="section bg-panel" tabindex="-1" aria-labelledby="venue-heading">
      <div class="wrap grid gap-x-16 gap-y-10 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div>
          <h2 id="venue-heading">Getting to Student Base</h2>
          <p class="intro mb-0">Student Base is on the first floor of The Strip, High Tech Campus 1d, Eindhoven. Lunch is next door at Al Fresco, the Italian place behind Student Base.</p>
        </div>
        <div class="grid gap-8 min-[601px]:grid-cols-2 min-[900px]:pt-3">
          <div class="border-t border-line pt-4">
            <h3 class="mb-2">By car</h3>
            <p class="text-muted">Parking is free. P0 Parkeergarage is the easiest one to aim for.</p>
            <ExternalLink button href={mapUrl}>Open the campus map</ExternalLink>
          </div>
          <div class="border-t border-line pt-4">
            <h3 class="mb-2">Without a car</h3>
            <p class="text-muted">Rent a bike, or take the Dutch Design Week design rides if you have a wristband.</p>
            <ExternalLink button href={travelUrl}>Campus travel directions</ExternalLink>
          </div>
        </div>
      </div>
    </section>
    <section id="register" class="section" tabindex="-1" aria-labelledby="register-heading">
      <div class="wrap">
        <h2 id="register-heading" class="text-[clamp(2.4rem,6vw,4rem)]">Reserve your spot</h2>
        <p class="max-w-[38rem] text-[1.15rem]">Whether you design headphones, medical devices, bicycles, power tools, smart home products, lab equipment, or wearables, you'll meet people facing the same problems. You can also bring your own tool, product, or method for others to try.</p>
        <p class="mt-6 mb-8 text-[1.25rem] leading-[1.35] font-semibold text-heading">Friday 23 October 2026, Student Base, The Strip, High Tech Campus, Eindhoven</p>
        <div class="flex flex-wrap items-center gap-3">
          <RegistrationLink />
          <CalendarDownload />
        </div>
        <p class="mt-4 text-[.9rem] text-muted">Hosted by Hardware Interaction Design. No spam. Also listed on the <ExternalLink href={programmeUrl}>Dutch Design Week programme</ExternalLink>.</p>
        <h3 class="mt-14 mb-2">Bring someone</h3>
        <p class="max-w-[38rem] text-muted">If you know someone who would add something to the day, pass this page on. Ask them to register through the sign-up form first, so we know how many people to expect.</p>
      </div>
    </section>
    <section id="about" class="section border-t border-line" tabindex="-1" aria-labelledby="about-heading">
      <div class="wrap grid gap-x-16 gap-y-6 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <h2 id="about-heading">Hosted by the Hardware Interaction Design community</h2>
        <p class="max-w-[38rem] text-[1.1rem] min-[900px]:pt-2">This is the first in-person event from <a class="text-link" href="/">Hardware Interaction Design</a>, a community for the interaction designers, UX researchers, industrial designers, and engineers who design, research, prototype, and ship physical products. Designing a button, a dial, or a wearable comes with problems that software communities rarely talk about.</p>
      </div>
    </section>
  </main>
  <footer class="border-t border-line py-8 text-[.9rem] text-muted">
    <div class="wrap flex w-full flex-wrap items-center justify-between gap-3">
      <span class="flex items-center gap-3 font-medium text-heading"><img class="mark h-5" src="/logo-mark.png" width="800" height="435" alt="" /> Hardware Interaction Design</span>
      <span>Conference on 23 October 2026 at Student Base, High Tech Campus, Eindhoven</span>
    </div>
  </footer>
</div>
