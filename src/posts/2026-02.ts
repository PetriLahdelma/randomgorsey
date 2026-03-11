import { Post } from '../components/PostCard';

const feb2026: Post[] = [
  {
    id: 51,
    title: 'The Midnight Sessions',
    timestamp: '2026-02-02T01:47',
    contentType: 'text',
    category: 'studio',
    body: `<p>Can't sleep, so I get up around midnight, make a coffee, and work until three or four. Then sleep until ten. It's a stupid schedule but honestly the stuff I'm making in these late sessions is different from anything I do during the day. Helsinki at 2am is completely silent. No traffic, no neighbours moving around, nothing. You start hearing details in your mixes that you'd miss otherwise.</p>
<p>Finally nailed the arrangement on the track I've been calling "Sunday" — the slow one with the Tascam chords that I've been circling back to since November. It's done now. Or I'm stopping before I ruin it, which is the same thing. Six minutes, mostly space, a bassline that enters halfway through and completely changes the mood. Played it to a friend and she said it sounded like "the last song at a party you don't want to leave." I'll take it.</p>
<p>Been thinking a lot about how tracks can shift from one emotional place to another without you noticing. Very slowly, it turns out. With reverb. Not a groundbreaking answer but it's working.</p>`,
    avatarColor: '#0d0d2e',
    author: 'Random Gorsey',
    tags: ['studio', 'production', 'midnight'],
  },
  {
    id: 52,
    title: 'Field Notes: Frozen City',
    timestamp: '2026-02-09T15:20',
    contentType: 'text',
    category: 'field-recording',
    body: `<p>Out with the recorder again. Helsinki in February sounds completely different from November — everything muffled by snow, sounds damped and compressed. The harbour was frozen solid so I walked out on the ice near Kauppatori and recorded for twenty minutes. The ice groans in this low, tonal way that changes depending on temperature. Pitched down it becomes something genuinely weird and beautiful.</p>
<p>Best find of the week: snow falling off a roof onto the street. A heavy thud and then this crystalline scatter as it breaks apart. I got about a dozen of these and dropped two of them straight into a new track as percussion. Also recorded my boots on different surfaces — packed snow at minus twenty sounds almost like a snare hit, sharp and dry. Building a whole kit from winter walking sounds. Frostbitten fingers, worth it.</p>`,
    avatarColor: '#e0e8f0',
    author: 'Random Gorsey',
    tags: ['field-recording', 'winter', 'helsinki', 'ice'],
  },
  {
    id: 53,
    title: 'Label Spotlight: Shall Not Fade',
    timestamp: '2026-02-16T11:05',
    contentType: 'text',
    category: 'recommendation',
    body: `<p>Shall Not Fade is quietly doing some of the most consistent work in electronic music right now and doesn't get nearly enough credit for it — good A&R, good vinyl pressings, and they actually keep stuff in stock instead of doing 100-copy runs that sell out before you can open the page.</p>`,
    avatarColor: '#2e1a3e',
    author: 'Random Gorsey',
    tags: ['recommendation', 'shall-not-fade', 'label'],
  },
  {
    id: 54,
    title: 'February Picks',
    timestamp: '2026-02-23T21:30',
    contentType: 'link',
    category: 'playlist',
    body: `<p>February playlist. Went deep on Bandcamp this month and ended up somewhere between meditative and groovy — not quite ambient, not quite dance music. Found this Japanese producer making lo-fi house with traditional instrument samples that I've been obsessing over. A few South African artists in there too doing something I hadn't heard before. Closes with a long ambient piece. Let it run.</p>
<br /><iframe title="RA Exchange — EX.763 Theo Parrish" width="100%" height="166" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/ra-exchange/ex763-theo-parrish&color=%23e8d44d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false" loading="lazy"></iframe>`,
    avatarColor: '#2e2e3e',
    author: 'Random Gorsey',
    tags: ['playlist', 'february', '2026'],
  },
];

export default feb2026;
