<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import RegistrationLink from './RegistrationLink.svelte';
  import Button from './ui/Button.svelte';
  let navigating = false;
  const sections = [
    { id: 'program', label: 'Program' },
    { id: 'venue', label: 'Venue & getting there' },
    { id: 'topics', label: 'Topics' },
    { id: 'register', label: 'Register' },
    { id: 'about', label: 'Hosted by' }
  ];
</script>

<nav aria-label="Main navigation" class="top-0 z-50 border-b border-line bg-background/85 py-3.5 backdrop-blur-md min-[601px]:sticky">
  <div class="wrap flex flex-wrap items-center justify-between gap-3 max-[400px]:gap-2 max-[400px]:px-4">
    <a href="#top" aria-label="Hardware Interaction Design, back to top" class="flex min-h-11 min-w-11 shrink-0 items-center gap-3 font-mono text-[.85rem] tracking-[.1em] text-accent">
      <img class="mark h-[18px] box-content" src="/logo-mark.png" width="800" height="435" alt="" />
      <span class="hidden min-[900px]:inline"><span class="text-muted">// </span>HARDWARE INTERACTION DESIGN</span>
    </a>
    <div class="flex flex-wrap items-center gap-3 max-[400px]:gap-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger aria-label="Section menu">
          {#snippet child({ props })}
            <Button {...props} variant="ghost" size="compact" class="px-2 max-[400px]:px-1">Menu <span class="inline-block size-[6px] -translate-y-0.5 rotate-45 border-r border-b border-current" aria-hidden="true"></span></Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <nav aria-label="Conference sections">
          <DropdownMenu.Content sideOffset={12} align="end" onCloseAutoFocus={(event) => { if (navigating) { event.preventDefault(); navigating = false; } }} class="z-[100] max-h-[var(--bits-dropdown-menu-content-available-height)] min-w-56 overflow-y-auto border border-control bg-panel p-1 font-mono text-sm text-copy shadow-xl">
            <DropdownMenu.Group aria-label="Conference sections">
              {#each sections as section (section.id)}
                <DropdownMenu.Item onSelect={() => { navigating = true; }} class="flex min-h-11 cursor-pointer items-center px-3 py-2 data-highlighted:bg-raised data-highlighted:text-accent data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-accent">
                  {#snippet child({ props })}
                    <a {...props} href={'#' + section.id}>{section.label}</a>
                  {/snippet}
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
          </nav>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <RegistrationLink compact />
    </div>
  </div>
</nav>
