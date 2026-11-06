import { createEventICS } from '$lib/calendar';

export const prerender = true;

export function GET() {
  return new Response(createEventICS(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="hardware-interaction-design-conference.ics"'
    }
  });
}
