# Hardware Interaction Design

Svelte 5 and SvelteKit, Bits UI, and Tailwind CSS 4. The community home page, the conference page, and the square poster are prerendered for static hosting.

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

- `src/routes/+page.svelte`: community home page, with the Stockholm early-2027 teaser, past events, topics, the input demo, and the LinkedIn group
- `src/routes/events/eindhoven-2026/+page.svelte`: past-event recap, photos, and original programme, served at the unchanged `/events/eindhoven-2026/` URL. Its trailing slash makes it a directory index, so it works without server rewrites. Old `/#program`, `/#venue`, `/#register`, and `/#about` links redirect here; those sections remain valid on the recap.
- `src/routes/poster.html/+page.svelte`: share-card layout
- `src/lib/components/`: shared site navigation, archived programme, links, and telemetry
- `src/lib/components/EventPhoto.svelte`: inline event photos with captions and alt text. Photos are not clickable and have no open controls.
- `src/lib/components/ui/`: shared action-button and button-styled-link primitives
- `src/lib/conference.ts`: shared programme content, the day's schedule, and links
- `src/lib/calendar.ts`: calendar serialization, used by the prerendered `.ics` endpoint
- `src/app.css`: Tailwind theme and shared styles. Colours use `light-dark()`, so the page follows the system theme. `ThemeToggle.svelte` lets visitors override it and stores the choice in `localStorage`. A small script in `src/app.html` applies a saved choice before first paint.
- `static/`: original images, logos, and favicons, served at their original URLs
- `static/events/eindhoven-2026/`: the four event photos, renamed from numeric filenames at the repository root. `eventPhotos` in `src/lib/conference.ts` holds their paths, alt text, and captions. The original 1280 × 853 JPEGs are preserved.
- `archive/`: original HTML and historical backup, retained as references but not deployed

Input telemetry stays in the browser. `LazyTelemetry.svelte` imports and mounts the demo automatically within 240px of the viewport as visitors scroll toward it, after the community section. There is no open/close gate. If IntersectionObserver is unavailable, it loads immediately. Loading and retry states remain keyboard accessible. Navigating away unmounts the demo and removes event listeners, chart observers, and timers. The demo can be paused and starts paused for visitors who prefer reduced motion. Each chart has a screen-reader text summary.

Global navigation is identical on both pages. Desktop shows Home, Events, Topics, and Community directly. The shared six-link menu puts these ahead of past-event destinations, with visible current-page feedback. Recap-specific anchors live in the recap header, not in the global menu. The header joins the LinkedIn group and retains its mobile scroll-up reveal.

Eindhoven registration is closed, and live pages no longer promote the old registration form or calendar download. `/hardware-interaction-design-conference.ics` and `/poster.html` remain available as historical assets for existing links. The shared navigation now links to the LinkedIn group. Stockholm has only an early-2027 teaser, with no exact date, venue, programme, or registration announced.

## Component boundaries

Use `Button.svelte` for actions and `LinkButton.svelte` for navigation or downloads. Both accept native attributes, event handlers, snippets, attachments, a bindable `ref`, and additive classes. `Button` defaults to `type="button"`; disabled buttons retain native behavior. `LinkButton` keeps anchor semantics and adds `noopener noreferrer` when opening a new tab.

The shared variants are `primary`, `secondary`, `outline`, `ghost`, and `text`, a standalone text link with a full-size target. `ExternalLink` uses `text` when given `button`. Sizes are `default` and `compact`, both with a minimum 44px target. Styles live in the `.button-*` rules in `src/app.css`, not in each feature wrapper. `RegistrationLink` and `CalendarDownload` supply domain-specific URLs and copy. The Bits UI trigger renders `Button` through its child snippet, preserving its forwarded ARIA attributes and event handlers.

Import components directly rather than through a barrel that pulls interactive features into static content. Vite keeps `ui/` in a shared `ui-controls` chunk to prevent the lazy demo from depending on a route chunk. Navigation stays eager; the telemetry model and chart renderer are lazy. Bundle-manifest regression tests verify these boundaries and that the poster does not import telemetry.

## Accessibility checks

`npm test` includes axe WCAG 2.2 AA and best-practice checks for the homepage, open navigation, and poster. Regression tests also cover skip-link focus, section-menu focus, 44px navigation targets, telemetry pause/resume, reduced motion, 200% text enlargement, and text-spacing overrides at 320px width.

Automated checks do not replace testing with screen readers and assistive technology.
