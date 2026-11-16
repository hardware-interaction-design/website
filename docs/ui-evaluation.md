# UI evaluation

6 November 2026

## Verdict

The site has a recognizable visual identity. Its main weakness is priority: the first screen explains the community but offers no in-content action, the next event starts below the fold, and the input demo occupies more space than the community invitation.

Keep the Archivo typography, circuit-board identity, green accents, real event photography, light/dark themes, and explicit separation of upcoming and past events. Improve what visitors see first and how they move through the site. Another palette or a new card style would not solve these problems.

## Scope and method

Reviewed the current local production build, including the uncommitted Eindhoven recap and Stockholm teaser. Inspected desktop and phone layouts, both themes, the shared menu, and the loaded input demo. Measured layouts with Playwright at 1280 × 800 and 375 × 800 after fonts loaded.

Compared the actual preview images returned by Mobbin MCP, not just their tags. This is an expert UI review, not a user study. The priorities below are judgments to validate, not measured conversion gains. No application code was changed for this evaluation.

## Mobbin references

- [TheyDo community hero](https://mobbin.com/sites/sections/a4431206-1ad1-4158-9451-a00691deb121?utm_source=other&utm_medium=ai-assistant&utm_source_platform=mcp): the hero pairs a clear community description with a visible join action and photographs of participants. Useful for the relationship between explanation, evidence, and action. Do not copy its collage or replace this site's identity.
- [Luma public event calendar](https://mobbin.com/screens/107b7fa2-32da-4dd3-92ee-6f8fc27e0bf9?utm_source=other&utm_medium=ai-assistant&utm_source_platform=mcp): compact event rows keep time and title close, with upcoming/past controls nearby. Useful for event information hierarchy, not as a reason to add a calendar widget.
- [monday.com events hub](https://mobbin.com/sites/sections/9bbf03a4-0d60-4ba5-a097-60952cac1b3f?utm_source=other&utm_medium=ai-assistant&utm_source_platform=mcp): a featured event has its status, date, description, and action together. Upcoming and past are visibly distinct. Keep that distinction here, but do not add its filters and tabs for just two events.
- [Eventbrite community and recaps](https://mobbin.com/sites/sections/3099d061-0725-426c-80aa-2565d4ae21b7?utm_source=other&utm_medium=ai-assistant&utm_source_platform=mcp): event imagery supports the community story directly. Borrow the use of real people as evidence, not the oversized type or acid-green background.
- [Pitch editorial article](https://mobbin.com/sites/sections/5c087f48-be52-4fb4-b5c4-87202563bbff?utm_source=other&utm_medium=ai-assistant&utm_source_platform=mcp): a clear title, date, and narrow text column establish an article's reading order. Useful for treating Eindhoven as a story rather than another landing page.

## Findings, in priority order

### 1. Make the home page's next step explicit

The hero contains a large name, logo, and long introduction, but no action within the hero. The header's “Join the group” is the only initial action, and it does not visibly name LinkedIn. The Stockholm block starts at y=937 on desktop and y=855 on the phone, below an 800px viewport in both cases.

**Change:** shorten the opening paragraph, add a primary “Join on LinkedIn” action and a secondary “See events” link, and include a compact “Next event: Stockholm, early 2027” link in the hero. Preserve the detailed upcoming-event section. Make “Date and venue to be announced” easy to scan; do not imply registration is open or call joining LinkedIn a ticket reservation.

Use the TheyDo hero's explanation/action relationship and the events hub's close grouping of event facts. Keep the brand heading, but reduce its space before changing the font or colour system.

**Check:** at 375px and 1280px widths, visitors can identify the community, find the join action, and see the next-event summary without scrolling. At enlarged text sizes, let content reflow rather than forcing a fixed-height hero.

### 2. Separate global navigation from article shortcuts

The shared menu correctly treats this as one site, but it contains 11 links and is 571px tall at the tested sizes. A link to a particular photo section competes with the community's main destinations. Desktop visitors also have to open the menu to discover any destination.

**Change:** keep one global navigation across both pages. Show Events, Topics, and Community directly on desktop, alongside a visibly named LinkedIn action. Put recap-specific shortcuts near the recap title. On phones, keep a compact menu with main destinations first and past-event detail below, rather than 11 equal-weight choices.

Do not restore separate menus for separate pages. Keep the existing scroll-up reveal, keyboard focus handling, and reduced-motion behaviour. Add a visible current-page indication, not only `aria-current` for assistive technology.

**Check:** the same global destinations appear on both pages; visitors can reach Stockholm, the past recap, and the community without reading the whole archive menu. Keyboard and touch tests still pass.

### 3. Make the input demo an invitation, not a full section by default

The loaded demo's wrapper, including bottom spacing, is 776px tall on desktop and 1119px on the phone. That is over one phone viewport. The community section starts at y=4584 on the phone after the demo loads. The demo is relevant to hardware interaction, but it currently demands attention before explaining why someone would try it.

**Change:** move the community invitation ahead of the demo, then give the experiment a compact closed state with one sentence about what it demonstrates and a “Try the input demo” button. Expand the working graphs on request. Keep the instrument styling; it is one of the site's distinctive elements.

This recommendation comes from this site's hierarchy and measurements, not from a directly equivalent Mobbin graph. Do not remove the working timeline or regress keyboard, touch, pause, or reduced-motion support.

**Check:** the initial layout reserves only a short invitation, does not leave a large empty screen, and expands accessibly when requested. Join links are reachable before the experiment. Retain lazy loading and retry behaviour.

### 4. Give the recap a shorter route into the story

The recap is correctly marked as a past event, and the original programme is appropriately collapsed. On desktop, the recap section begins at y=1494 after the title, introduction, and full-width photo. A visitor who wants to read the sessions has no shortcut near the title. The strong new photography is doing useful work, but the opening still behaves like a promotional landing page.

**Change:** add compact “Read the recap” and “View photos” anchors under the introduction. Reduce desktop title/header spacing modestly. Keep the broad room shot and full-image proportions, but consider placing its caption and a short opening paragraph together so the image leads into the story. Use speaker names consistently in the session write-ups.

Use Pitch's article hierarchy and Eventbrite's photographic community evidence as references. Avoid inventing takeaways, attendance numbers, or placing a Teufel-specific photo under an unrelated speaker's account.

**Check:** visitors can jump directly to the recap or gallery; the reading column stays comfortable on wide screens; the original programme and old section URLs remain accessible.

### 5. Let visitors inspect the event photographs

The gallery has useful captions and alt text, and the photos retain their original proportions. They are not linked, so visitors cannot open a larger version directly from the gallery. The paired desktop images are much smaller than the supplied files.

**Change:** start with simple links from each photograph to its original JPEG. If an in-page viewer is worthwhile, give it captions, previous/next controls, Escape to close, and focus return. Do not replace the visible photo grid with an auto-advancing carousel.

This is a site-specific usability recommendation, not a claim that the referenced Mobbin examples have a viewer.

**Check:** every photograph can be opened with mouse, touch, and keyboard; the descriptive text remains available; no image is assigned a person's name unless confirmed.

## Recommended first pass

Implement findings 1–3 together. They address joining, finding events, and avoiding an overly long home page without redesigning the whole site. Then refine the recap and photo behaviour.

Do not add event filters, a booking flow, attendee counts, a new colour palette, or an automatic carousel. The current content does not justify them.

## Measurement notes

These are layout observations, not targets or performance scores. Vertical positions are measured from the document's top, not the current scroll position. Homepage measurements below are after the demo loads; its wrapper includes bottom padding.

| Observation | Desktop, 1280 × 800 | Phone, 375 × 800 |
| --- | ---: | ---: |
| Stockholm block begins | 937px | 855px |
| Menu height | 571px | 571px |
| Loaded demo wrapper height | 776px | 1119px |
| Community section begins | 3547px | 4584px |
| Home page total height | 4008px | 5152px |
| Recap section begins | 1494px | 1034px |

The unmodified site also has a header join link throughout. The low community-section position does not mean joining is impossible before reaching it. The issue is the emphasis and placement of the explanation and action together.

## Implementation follow-up

All five findings have now been implemented following approval:

- The smaller home-page hero has a shorter description, explicit "Join on LinkedIn" and "See events" actions, and a Stockholm summary link visible in the first screen at the tested 375px and 1280px widths.
- Desktop navigation exposes Home, Events, Topics, and Community. The same six-destination menu serves both pages, with a separate past-events group and visible current-page feedback. Article shortcuts now sit below the recap introduction. The mobile scroll-up reveal remains.
- The community invitation precedes the live input demo. The opt-in gate was initially implemented, then removed at the user's request. The demo now loads automatically within 240px of the viewport while scrolling. Retry, pause, reduced motion, and the existing graphs remain available.
- The recap has a smaller heading and tighter opening layout. Its introduction, jump links, and lead photo sit together on desktop; all section URLs remain valid.
- Photo-opening links were initially implemented, then removed at the user's request. All four photographs now remain inline with captions and alt text, without click-to-open behaviour or full-size labels.

The original measurements above describe the audit baseline, not the implemented layout. The regression suite now also covers first-screen actions, automatic viewport-triggered demo loading and cleanup on navigation, exposed desktop navigation, and photos remaining inline without navigation or open controls.
