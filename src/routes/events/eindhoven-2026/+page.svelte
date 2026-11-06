<script lang="ts">
  import { resolve } from '$app/paths';
  import Navigation from '$lib/components/Navigation.svelte';
  import LinkButton from '$lib/components/ui/LinkButton.svelte';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import Programme from '$lib/components/Programme.svelte';
  import EventPhoto from '$lib/components/EventPhoto.svelte';
  import { communityUrl, eventPath, eventPhotos, partners, programmeUrl } from '$lib/conference';
  const description = 'A look back at our first Hardware Interaction Design conference, held at Student Base in Eindhoven on 23 October 2026 during Dutch Design Week.';
  const socialTitle = 'Eindhoven 2026 recap | Hardware Interaction Design';
  const gallery = [eventPhotos.repair, eventPhotos.workshop, eventPhotos.community];
  const partnerUrl = (name: (typeof partners)[number]['name']) => partners.find(partner => partner.name === name)!.url;
</script>

<svelte:head>
  <title>Eindhoven 2026 recap | Hardware Interaction Design</title>
  <link rel="canonical" href={'https://hardwareux.com' + eventPath} />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Hardware Interaction Design" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content={'https://hardwareux.com' + eventPath} />
  <meta property="og:title" content={socialTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={'https://hardwareux.com' + eventPhotos.talk.src} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="853" />
  <meta property="og:image:alt" content={eventPhotos.talk.alt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={socialTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={'https://hardwareux.com' + eventPhotos.talk.src} />
  <meta name="twitter:image:alt" content={eventPhotos.talk.alt} />
</svelte:head>

<a href="#main" class="fixed top-2 left-2 z-[200] -translate-y-24 rounded-md bg-accent px-4 py-2 text-on-accent focus:translate-y-0">Skip to content</a>
<div id="top">
  <Navigation />
  <main id="main" tabindex="-1">
    <header class="pt-8 pb-12 min-[761px]:pt-12 min-[761px]:pb-16">
      <div class="wrap">
        <p class="mb-4 text-[1.05rem] font-medium text-accent">Past event, Eindhoven, <time datetime="2026-10-23">23 October 2026</time></p>
        <h1 class="text-[clamp(2.75rem,7vw,5.25rem)] leading-[.95] tracking-[-.015em] text-balance">Hardware Interaction Design Conference</h1>
        <div class="mt-8 grid items-start gap-8 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[900px]:gap-12">
          <div class="max-w-[38rem]">
            <p class="text-[1.15rem] leading-[1.5] text-copy">Our first conference brought designers, researchers, and hardware teams to Student Base during Dutch Design Week. We tried haptics, took speakers apart, and shared projects.</p>
            <p class="mt-5 text-muted">Hosted by Frank van Valkenhoef and Geert Roumen at the High Tech Campus, Eindhoven.</p>
            <nav aria-label="Conference sections" class="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-2">
              <a href="#recap" class="text-link inline-flex min-h-11 items-center">Read the recap</a>
              <a href="#photos" class="text-link inline-flex min-h-11 items-center">View photos</a>
              <a href="#program" class="text-link inline-flex min-h-11 items-center">Original programme</a>
              <a href="#about" class="text-link inline-flex min-h-11 items-center">With thanks</a>
            </nav>
          </div>
          <EventPhoto photo={eventPhotos.talk} eager />
        </div>
      </div>
    </header>

    <section id="recap" class="section bg-panel" tabindex="-1" aria-labelledby="recap-heading">
      <div class="wrap">
        <h2 id="recap-heading">Talks, tools, and things to take apart</h2>
        <div class="mt-10 grid gap-x-16 gap-y-10 min-[761px]:grid-cols-2">
          <article>
            <h3 class="mb-3">Haptics in product design</h3>
            <p>Thomas Müller and Stefanie Birk from <ExternalLink href={partnerUrl('Hapticlabs')}>Hapticlabs</ExternalLink> shared their experience of haptics in product design. In the workshop, we applied their toolkit and felt the effects for ourselves.</p>
          </article>
          <article>
            <h3 class="mb-3">Prototyping with a prompt</h3>
            <p>Samuel Beek and the team from <ExternalLink href={partnerUrl('Schematik')}>Schematik</ExternalLink> demonstrated a tool that gets you started with a hardware project using a single prompt, lowering the barrier to hardware prototyping.</p>
          </article>
          <article>
            <h3 class="mb-3">Repairable by design</h3>
            <p>Klemen Lilija and Hane Park from <ExternalLink href={partnerUrl('Teufel')}>Lautsprecher Teufel</ExternalLink> introduced MYND, a repairable, open-source speaker. We worked on it ourselves and saw how thoughtful design can make repair easier and more intuitive.</p>
          </article>
          <article>
            <h3 class="mb-3">Sharing research hardware</h3>
            <p>Jurrian Doornbos from the Open Source Hardware Infrastructure of the Netherlands, <ExternalLink href={partnerUrl('OSHned')}>OSHNED</ExternalLink>, spoke about the platform he's building for sharing hardware. His practical examples included a microscope adapted for malaria detection.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="photos" class="section" tabindex="-1" aria-labelledby="photos-heading">
      <div class="wrap">
        <div id="people" class="mb-10 max-w-[40rem] scroll-mt-24" tabindex="-1">
          <h2 id="photos-heading">Around the tables</h2>
          <p class="text-[1.15rem]">Many participants brought projects they were proud of. Seeing what others were working on, and why, made the conference a community of people learning from each other.</p>
        </div>
        <div class="grid gap-x-8 gap-y-10 min-[601px]:grid-cols-2">
          {#each gallery as photo (photo.src)}
            <EventPhoto {photo} class={photo === eventPhotos.community ? 'min-[601px]:col-span-2' : ''} />
          {/each}
        </div>
      </div>
    </section>

    <Programme />

    <section id="about" class="section" tabindex="-1" aria-labelledby="about-heading">
      <div class="wrap grid gap-x-16 gap-y-6 min-[900px]:grid-cols-2">
        <h2 id="about-heading">With thanks</h2>
        <div id="venue" class="max-w-[36rem] scroll-mt-24 text-[1.1rem] min-[900px]:pt-2" tabindex="-1">
          <p>Thank you to Student Base and Bert-Jan Woertman at the High Tech Campus for providing the space, to everyone who led a session, and to everyone who brought a project, a question, or a story.</p>
          <p>This was the first in-person event from <a class="text-link" href={resolve('/')}>Hardware Interaction Design</a>. The community continues beyond the conference.</p>
          <ExternalLink button href={programmeUrl}>Original Dutch Design Week listing</ExternalLink>
        </div>
      </div>
    </section>

    <section id="register" class="section bg-panel" tabindex="-1" aria-labelledby="continue-heading">
      <div class="wrap grid gap-x-16 gap-y-6 min-[900px]:grid-cols-2">
        <h2 id="continue-heading">Beyond Eindhoven</h2>
        <div class="max-w-[36rem]">
          <p class="text-muted">This event has ended. Registration is closed.</p>
          <p class="text-[1.15rem]">We kicked off the Hardware Interaction Design LinkedIn group at the conference. Join us to share tools, methods, and inspiration, and keep the conversation going.</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <LinkButton href={communityUrl} target="_blank">Join the LinkedIn group<span class="sr-only">, opens in a new tab</span></LinkButton>
            <LinkButton href={resolve('/#stockholm')} variant="secondary">Next: Stockholm, early 2027</LinkButton>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="border-t border-line py-8 text-[.9rem] text-muted">
    <div class="wrap flex w-full flex-wrap items-center justify-between gap-3">
      <span class="flex items-center gap-3 font-medium text-heading"><img class="mark h-5" src="/logo-mark.png" width="800" height="435" alt="" /> Hardware Interaction Design</span>
      <a class="text-link" href={resolve('/#past-events')}>Back to past events</a>
    </div>
  </footer>
</div>
