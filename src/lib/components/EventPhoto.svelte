<script lang="ts">
  import { asset } from '$app/paths';
  import type { eventPhotos } from '$lib/conference';

  type Photo = (typeof eventPhotos)[keyof typeof eventPhotos];
  let { photo, eager = false, class: className }: { photo: Photo; eager?: boolean; class?: string } = $props();
</script>

<figure class={className}>
  <img class="block h-auto w-full rounded-[10px]" src={asset(photo.src)} width="1280" height="853" loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} alt={photo.alt} />
  <figcaption class="mt-3 text-[.9rem] text-muted">{photo.caption}</figcaption>
</figure>
