<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { archiveNavigation, communityUrl, eventPath, siteNavigation } from '$lib/conference';
  import Button from './ui/Button.svelte';
  import LinkButton from './ui/LinkButton.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  // Use the same site-wide destinations on every page, including section fragments.
  const here = (path: string) => page.url.pathname === path || page.url.pathname + '/' === path;
  function current(href: string): 'page' | 'location' | undefined {
    if (href === eventPath) return here(eventPath) ? 'page' : undefined;
    if (!here('/')) return;
    const hash = page.url.hash;
    if (href === '/') return !hash || hash === '#top' ? 'page' : undefined;
    if (href === '/#events' && hash === '#stockholm') return 'location';
    if (href === '/#topics' && hash === '#demo') return 'location';
    return href === '/' + hash ? 'location' : undefined;
  }
  let navigating = false;
  let open = $state(false);
  let focused = $state(false);
  let scrolledDown = $state(false);
  let lastY = 0;
  // On phones the bar slides away while reading down the page and returns on any scroll up.
  // It stays put while the menu is open or a keyboard user is inside it.
  const hidden = $derived(scrolledDown && !open && !focused);

  function onscroll() {
    const y = Math.max(0, window.scrollY);
    if (!window.matchMedia('(max-width: 600px)').matches || y < 80) { scrolledDown = false; lastY = y; return; }
    // Ignore small movements so the bar does not flicker on momentum scrolling.
    if (Math.abs(y - lastY) < 8) return;
    scrolledDown = y > lastY;
    lastY = y;
  }
</script>

<svelte:window {onscroll} />

<nav aria-label="Main navigation" data-hidden={hidden} onfocusin={(event) => { focused = (event.target as Element).matches(':focus-visible'); }} onfocusout={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused = false; }} class="sticky top-0 z-50 border-b border-line bg-background/90 py-3 backdrop-blur-md transition-transform duration-200 ease-out data-[hidden=true]:-translate-y-full">
  <div class="wrap flex flex-wrap items-center justify-between gap-3 max-[400px]:gap-2 max-[400px]:px-4">
    <a href={here('/') ? '#top' : resolve('/')} aria-label={here('/') ? 'Hardware Interaction Design, back to top' : 'Hardware Interaction Design home'} class="flex min-h-11 min-w-11 shrink-0 items-center gap-3 font-semibold text-heading">
      <img class="mark h-[22px] max-[400px]:h-5 max-[400px]:px-0.5" src="/logo-mark.png" width="800" height="435" alt="" />
      <span class="hidden min-[1100px]:inline">Hardware Interaction Design</span>
    </a>
    <div class="flex flex-wrap items-center gap-3 max-[400px]:gap-1">
      <div class="hidden items-center gap-1 min-[1000px]:flex">
        {#each siteNavigation as item (item.href)}
          <a href={resolve(item.href)} aria-current={current(item.href)} class="flex min-h-11 items-center rounded-md px-3 text-[.95rem] font-medium hover:bg-raised aria-[current]:bg-raised aria-[current]:font-bold aria-[current]:text-heading">{item.label}</a>
        {/each}
      </div>
      <DropdownMenu.Root bind:open>
        <DropdownMenu.Trigger aria-label="Site menu">
          {#snippet child({ props })}
            <Button {...props} variant="ghost" size="compact" class="px-2 max-[400px]:w-11 max-[400px]:px-0"><span class="min-[1000px]:hidden">Menu</span><span class="hidden min-[1000px]:inline">More</span> <span class="inline-block size-[6px] -translate-y-0.5 rotate-45 border-r border-b border-current max-[400px]:hidden" aria-hidden="true"></span></Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <nav aria-label="Site menu">
          <DropdownMenu.Content sideOffset={12} align="end" onCloseAutoFocus={(event) => { if (navigating) { event.preventDefault(); navigating = false; } }} class="z-[100] max-h-[var(--bits-dropdown-menu-content-available-height)] min-w-56 overflow-y-auto rounded-lg border border-line bg-panel p-1 text-[.95rem] text-copy shadow-[0_8px_24px_rgb(22_24_23/18%)]">
            <DropdownMenu.Group>
              <DropdownMenu.GroupHeading class="px-3 pt-2.5 pb-1 text-sm font-medium text-muted">Explore</DropdownMenu.GroupHeading>
              {#each siteNavigation as item (item.href)}
                <DropdownMenu.Item onSelect={() => { navigating = true; }} class="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 data-highlighted:bg-raised data-highlighted:text-heading data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-accent">
                  {#snippet child({ props })}
                    <a {...props} href={resolve(item.href)} aria-current={current(item.href)}>{item.label}{#if current(item.href)}<span class="text-xs font-medium text-accent">You are here</span>{/if}</a>
                  {/snippet}
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Group>
            <DropdownMenu.Separator class="mx-2 my-1 h-px bg-line" />
            <DropdownMenu.Group>
              <DropdownMenu.GroupHeading class="px-3 pt-2.5 pb-1 text-sm font-medium text-muted">Past events</DropdownMenu.GroupHeading>
              {#each archiveNavigation as item (item.href)}
                <DropdownMenu.Item onSelect={() => { navigating = true; }} class="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 data-highlighted:bg-raised data-highlighted:text-heading data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-accent">
                  {#snippet child({ props })}
                    <a {...props} href={resolve(item.href)} aria-current={current(item.href)}>{item.label}{#if current(item.href)}<span class="text-xs font-medium text-accent">You are here</span>{/if}</a>
                  {/snippet}
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
          </nav>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <ThemeToggle />
      <LinkButton href={communityUrl} target="_blank" variant="outline" size="compact">Join on LinkedIn<span class="sr-only">, opens in a new tab</span></LinkButton>
    </div>
  </div>
</nav>
