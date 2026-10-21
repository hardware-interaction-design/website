<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import { page } from '$app/state';
  import { siteMenu } from '$lib/conference';
  import Button from './ui/Button.svelte';
  import RegistrationLink from './RegistrationLink.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  // Links into the current page stay as bare fragments, so the browser moves focus to the section.
  const here = (path: string) => page.url.pathname === path || page.url.pathname + '/' === path;
  const link = (path: string, id?: string) => here(path) ? '#' + (id ?? 'top') : path + (id ? '#' + id : '');
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
    <a href={link('/')} aria-label={here('/') ? 'Hardware Interaction Design, back to top' : 'Hardware Interaction Design home'} class="flex min-h-11 min-w-11 shrink-0 items-center gap-3 font-semibold text-heading">
      <img class="mark h-[22px]" src="/logo-mark.png" width="800" height="435" alt="" />
      <span class="hidden min-[700px]:inline">Hardware Interaction Design</span>
    </a>
    <div class="flex flex-wrap items-center gap-3 max-[400px]:gap-2">
      <DropdownMenu.Root bind:open>
        <DropdownMenu.Trigger aria-label="Site menu">
          {#snippet child({ props })}
            <Button {...props} variant="ghost" size="compact" class="px-2 max-[400px]:px-1">Menu <span class="inline-block size-[6px] -translate-y-0.5 rotate-45 border-r border-b border-current" aria-hidden="true"></span></Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <nav aria-label="Site menu">
          <DropdownMenu.Content sideOffset={12} align="end" onCloseAutoFocus={(event) => { if (navigating) { event.preventDefault(); navigating = false; } }} class="z-[100] max-h-[var(--bits-dropdown-menu-content-available-height)] min-w-56 overflow-y-auto rounded-lg border border-line bg-panel p-1 text-[.95rem] text-copy shadow-[0_8px_24px_rgb(22_24_23/18%)]">
            {#each siteMenu as group, index (group.path)}
              {#if index}<DropdownMenu.Separator class="mx-2 my-1 h-px bg-line" />{/if}
              <DropdownMenu.Group>
                <DropdownMenu.GroupHeading class="px-3 pt-2.5 pb-1 text-sm font-medium text-muted">{group.label}</DropdownMenu.GroupHeading>
                <DropdownMenu.Item onSelect={() => { navigating = true; }} class="flex min-h-11 cursor-pointer items-center rounded-md px-3 py-2 data-highlighted:bg-raised data-highlighted:text-heading data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-accent font-semibold">
                  {#snippet child({ props })}
                    <a {...props} href={link(group.path)} aria-current={here(group.path) ? 'page' : undefined}>{group.overview}</a>
                  {/snippet}
                </DropdownMenu.Item>
                {#each group.sections as section (section.id)}
                  <DropdownMenu.Item onSelect={() => { navigating = true; }} class="flex min-h-11 cursor-pointer items-center rounded-md px-3 py-2 data-highlighted:bg-raised data-highlighted:text-heading data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-accent pl-6">
                    {#snippet child({ props })}
                      <a {...props} href={link(group.path, section.id)}>{section.label}</a>
                    {/snippet}
                  </DropdownMenu.Item>
                {/each}
              </DropdownMenu.Group>
            {/each}
          </DropdownMenu.Content>
          </nav>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <ThemeToggle />
      <RegistrationLink compact />
    </div>
  </div>
</nav>
