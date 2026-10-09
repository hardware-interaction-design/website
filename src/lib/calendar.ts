export function createEventICS(now = new Date()): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hardware Interaction Design Conference//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:hidc-2026-10-23@hardware-interaction-design',
    'DTSTAMP:' + now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    'DTSTART:20261023T070000Z',
    'DTEND:20261023T160000Z',
    'SUMMARY:Hardware Interaction Design Conference',
    'DESCRIPTION:Talks\\, workshops\\, and interactive sessions on designing physical products — plus open time to bring your own tool\\, product\\, or method to share.',
    'LOCATION:High Tech Campus\\, 1d The Strip\\, Eindhoven\\, Netherlands',
    'URL:https://forms.gle/9G9bd8FyDzxz4YTr9',
    'END:VEVENT',
    'END:VCALENDAR'
  ].flatMap((line) => {
    // RFC 5545 folds at 75 UTF-8 octets, including the continuation space.
    const parts: string[] = [];
    let part = '';
    let size = 0;
    for (const character of line) {
      const bytes = new TextEncoder().encode(character).length;
      if (size + bytes > 75) {
        parts.push(part);
        part = ' ';
        size = 1;
      }
      part += character;
      size += bytes;
    }
    return [...parts, part];
  }).join('\r\n') + '\r\n';
}
