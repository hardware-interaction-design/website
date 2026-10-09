<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { buttonClasses, type ButtonVariant, type ButtonSize } from './button';

  type Props = HTMLAnchorAttributes & { href: string; variant?: ButtonVariant; size?: ButtonSize; ref?: HTMLAnchorElement };
  let { variant = 'primary', size = 'default', href, target, rel, class: className, ref = $bindable(), children, ...rest }: Props = $props();
  const safeRel = $derived(target === '_blank' ? [...new Set([...(rel?.split(/\s+/) ?? []), 'noopener', 'noreferrer'])].join(' ') : rel);
</script>

<a {...rest} {href} {target} rel={safeRel} bind:this={ref} class={[buttonClasses(variant, size), className]}>
  {@render children?.()}
</a>
