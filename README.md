# Hardware Interaction Design

Svelte 5 and SvelteKit, Bits UI, and Tailwind CSS 4. The conference page and square poster are prerendered for static hosting.

## Development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

`npm run preview` serves the production build locally. Deploy the contents of `build/`, not the source directory. No Node server or SPA rewrite is needed. The poster remains at `/poster.html` and is 1080 × 1080 pixels.

## Files

- `src/routes/+page.svelte`: conference page and metadata
- `src/routes/poster.html/+page.svelte`: share-card layout
- `src/lib/components/`: navigation, registration links, programme cards, and telemetry
- `src/lib/components/ui/`: shared action-button and button-styled-link primitives
- `src/lib/conference.ts`: shared programme content and links
- `src/lib/calendar.ts`: calendar serialization, used by the prerendered `.ics` endpoint
- `src/app.css`: Tailwind theme and shared styles
- `static/`: original images, logos, and favicons, served at their original URLs
- `archive/`: original HTML and historical backup, retained as references but not deployed

Input telemetry stays in the browser. `LazyTelemetry.svelte` imports the demo when it is within 240px of the viewport, or when a visitor requests it. Its loading and retry states remain keyboard accessible. Event listeners, chart observers, and timers are removed when the demo unmounts. The demo can be paused and starts paused for visitors who prefer reduced motion. Each chart has a screen-reader text summary.

Registration opens the external form in a new tab. The separate "Add to calendar" links download `/hardware-interaction-design-conference.ics`. SvelteKit prerenders that endpoint, so downloading the file needs neither JavaScript nor a server at runtime.

## Component boundaries

Use `Button.svelte` for actions and `LinkButton.svelte` for navigation or downloads. Both accept native attributes, event handlers, snippets, attachments, a bindable `ref`, and additive classes. `Button` defaults to `type="button"`; disabled buttons retain native behavior. `LinkButton` keeps anchor semantics and adds `noopener noreferrer` when opening a new tab.

The shared variants are `primary`, `secondary`, `outline`, and `ghost`. Sizes are `default` and `compact`, both with a minimum 44px target. Styles live in the `.button-*` rules in `src/app.css`, not in each feature wrapper. `RegistrationLink` and `CalendarDownload` supply domain-specific URLs and copy. The Bits UI trigger renders `Button` through its child snippet, preserving its forwarded ARIA attributes and event handlers.

Import components directly rather than through a barrel that pulls interactive features into static content. Vite keeps `ui/` in a shared `ui-controls` chunk to prevent the lazy demo from depending on a route chunk. Navigation stays eager; the telemetry model and chart renderer are lazy. Bundle-manifest regression tests verify these boundaries and that the poster does not import telemetry.

## Accessibility checks

`npm test` includes axe WCAG 2.2 AA and best-practice checks for the homepage, open navigation, and poster. Regression tests also cover skip-link focus, section-menu focus, 44px navigation targets, telemetry pause/resume, reduced motion, 200% text enlargement, and text-spacing overrides at 320px width.

Automated checks do not replace testing with screen readers and assistive technology.
