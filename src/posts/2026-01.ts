import { Post } from '../components/PostCard';

const jan2026: Post[] = [
  {
    id: 47,
    title: 'New Year, New Approach',
    timestamp: '2026-01-05T14:20',
    contentType: 'text',
    category: 'studio',
    body: `<p>Minus fifteen outside. Haven't left the apartment in two days. Perfect.</p>
<p>I've been thinking about how I've been working: open Ableton, find a chord progression, build around it. It works but the tracks are starting to sound the same. Same tempo range, same structure, same palette. Comfort is the enemy.</p>
<p>So the thing I'm trying this year is to start from a different place each time. Field recording. A single rhythm. A bass note. Force myself away from the chord-first habit. First experiment: loaded one of the November metro recordings and listened to it loop for ten minutes until I started hearing rhythms in the ambient noise. Built a drum pattern following the natural cadence of the footsteps and escalator hum. Added a bass line responding to the tonal character of the space. It sounds nothing like my usual stuff and I have no idea if it's any good. But it felt exciting to make. That's what I'm optimising for this year.</p>
<p>Also reorganised my entire sample library, which took a full day. Future me will appreciate it.</p>`,
    avatarColor: '#1a2e3e',
    author: 'Random Gorsey',
    tags: ['studio', 'new-year', 'process'],
  },
  {
    id: 48,
    title: 'First Finds of 2026',
    timestamp: '2026-01-12T11:00',
    contentType: 'text',
    category: 'recommendation',
    body: `<p>The year's barely started and there's already music I can't stop putting on.</p>
<p>A new Mood Hut EP landed right after New Year's. Three tracks of sun-drenched deep house that feel completely wrong for the frozen darkness outside my window, and I love it for that. Vancouver keeps making some of the most emotionally resonant stuff around.</p>
<p>Closer to home, a Helsinki producer I've been watching on SoundCloud dropped a three-tracker on Bandcamp. Raw, lo-fi, tape hiss, wobbly samples, kick drum that sounds like it was recorded through a phone. But the musicality is genuinely there in the chord choices and the way tension builds and releases. I messaged them saying I loved it. Support your local scene.</p>`,
    avatarColor: '#2e3a1a',
    author: 'Random Gorsey',
    tags: ['recommendation', '2026', 'new-releases'],
  },
  {
    id: 49,
    title: 'Midwinter',
    timestamp: '2026-01-19T17:45',
    contentType: 'text',
    category: 'scene',
    body: `<p>About five and a half hours of daylight right now, if you're generous about what counts as daylight. The cold isn't just temperature at this point, it's structural. You move between warm interiors connected by brutal outdoor stretches. Home to metro, metro to wherever, wherever to home. The cold is the space between experiences.</p>
<p>The upside of midwinter is that you stop pretending you'll do anything except be indoors. No guilt about missing good weather. Just headphones, coffee, and whatever project is open on the laptop. Honestly the most productive time of year.</p>`,
    avatarColor: '#0d1a2e',
    author: 'Random Gorsey',
    tags: ['helsinki', 'winter', 'clubs'],
  },
  {
    id: 50,
    title: 'January Picks',
    timestamp: '2026-01-26T21:15',
    contentType: 'link',
    category: 'recommendation',
    body: `<p>Contemplative energy this month. Slow-building tracks, deep pads, rhythms that don't rush anywhere. Music for long dark evenings, basically.</p>
<p>Been spending a lot of time with the Alton Miller Headspace EP on Forbidden Dance Records. Detroit deep house, patient and warm, the kind of record that doesn't demand anything from you but keeps giving. Perfect January music. There's a Kerri Chandler record from the late 90s I pulled from a crate in Kallio that's been sitting next to it on the desk. Both live in that same unhurried, late-night space. Sometimes the old stuff hits hardest.</p>
<br /><iframe title="Forbidden Dance Records — Alton Miller Headspace EP" width="100%" height="300" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/fdance2020/sets/fd-002-alton-miller-headspace-ep&color=%23e8d44d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false" loading="lazy"></iframe>`,
    avatarColor: '#1a1a3e',
    author: 'Random Gorsey',
    tags: ['recommendation', 'january', '2026', 'detroit', 'deep-house'],
  },
];

export default jan2026;
