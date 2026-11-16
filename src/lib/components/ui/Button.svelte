<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonClasses, type ButtonVariant, type ButtonSize } from './button';

  type Props = HTMLButtonAttributes & { variant?: ButtonVariant; size?: ButtonSize; ref?: HTMLButtonElement };
  let { variant = 'secondary', size = 'default', type = 'button', class: className, ref = $bindable(), children, ...rest }: Props = $props();
</script>

<button {...rest} {type} bind:this={ref} class={[buttonClasses(variant, size), className]}>
  {@render children?.()}
</button>
