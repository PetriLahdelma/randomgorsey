import { Post } from '../components/PostCard';

const mar2025: Post[] = [
  {
    id: 7,
    title: 'Light Returns',
    timestamp: '2025-03-03T17:30',
    contentType: 'text',
    category: 'scene',
    body: `<p>Something shifted this week. Sat down at the desk around 5pm and the sky was still light. Not bright, not sunny, just light. That grey-blue Helsinki twilight that means winter is finally loosening its grip. After months of leaving the house in the dark and coming home in the dark, even twenty extra minutes of daylight changes everything.</p>

<p>On the production side I've got three or four sketches I'm excited about. More open, more airy than the winter stuff. Using more reverb, letting things decay naturally instead of chopping everything tight. Funny how the weather outside your window ends up inside your music whether you mean it to or not.</p>`,
    author: 'Random Gorsey',
    excerpt: 'The days are getting longer and the music is starting to open up.',
  },
  {
    id: 8,
    title: 'Listening: Techno Club Live Set',
    timestamp: '2025-03-10T20:00',
    contentType: 'link',
    category: 'recommendation',
    body: `<p>Been thinking about economy in production lately. It's tempting working in Ableton, with unlimited tracks, to just keep adding layers. Another synth line, another percussion element, another effect. But the tracks that really stick are usually the ones where every element earns its place. Nothing there for decoration. Everything structural.</p>

<p>This Techno Club live set from late 2023 keeps coming back into rotation when I want something that just commits. No faffing around, no big drops telegraphed from a mile away. The kind of set where you realise halfway through that you've been nodding along for twenty minutes without noticing.</p>

<iframe title="Techno Club — We Love Techno Live" width="100%" height="166" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/javierdrada/techno-club-presents-we-love-techno-live-november-11-2023&color=%23e8d44d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false" loading="lazy"></iframe>

<p>Playing things like this while I work isn't really background music. It sets a standard for the session. The best records do that.</p>`,
    author: 'Random Gorsey',
    excerpt: 'A Techno Club live set from late 2023 that keeps coming back into rotation.',
  },
  {
    id: 9,
    title: 'The Tape Machine Thing',
    timestamp: '2025-03-17T15:00',
    contentType: 'text',
    category: 'studio',
    body: `<p>Alright, I want to get into something I've been obsessing over in the home studio: tape saturation plugins. Specifically, finding ones that actually convince me: not in a "sounds fine" way but in a "yes, that's the thing" way.</p>

<p>I've been down a rabbit hole. The lo-fi house stuff I make lives and dies on warmth and character, and for a while I couldn't figure out why some tracks felt alive and others felt like they were just sitting there. The answer, I've gradually figured out, is tape. Not the aesthetic of tape, not fake warmth from EQ boosting the mids. Actual tape saturation behavior: harmonic distortion, high-end softening, low-end rounding, subtle speed wobble. When it's working right you don't hear it so much as feel it. The whole thing gets denser and more real somehow.</p>

<p>The one that broke through for me is Aberrant DSP Sketch Cassette. I'd tried it before and dismissed it as too obvious, too much of an effect. But when you back off the wow and flutter and drive, and just use the tape saturation subtly, it does something genuinely beautiful to drums in particular. A clean digital drum machine sound comes in, and what comes back has weight and a bit of sag. The transients round off just enough that everything sits together more naturally in the mix. The difference between drums that sound like they're coming from a computer and drums that sound like they're in a room.</p>

<p>My current workflow: build the basic track in Ableton, then run individual stems through Sketch Cassette with different settings. Drums get a bit of drive. The chords get a gentler pass, mostly for the frequency roll-off at the top. The bass barely gets touched, just enough to add a tiny bit of harmonic density. Then I bring it all back together. Subtle, but cumulative.</p>

<p>RC-20 Retro Color is the other one worth mentioning. More of a character plugin than a surgical tool. There's a magic knob approach to it that I usually resist but here it works. Good for when you want the whole thing to feel like it's coming from a specific place and time rather than a laptop in 2025.</p>

<p>The unpredictability is what I kept thinking I was missing. Every pass through a real tape machine is slightly different. But honestly? Sketch Cassette has a randomization feature that handles that. And I can save recall settings, automate parameters, and put it across anything in seconds. The limitations I thought I needed were mostly just romanticism about physical gear.</p>`,
    author: 'Random Gorsey',
    excerpt: 'Deep in tape saturation plugins and why Sketch Cassette finally cracked the code for that warm, wrecked sound.',
  },
  {
    id: 10,
    title: 'March Picks',
    timestamp: '2025-03-24T23:00',
    contentType: 'text',
    category: 'playlist',
    body: `<p>End of March already. Clocks went forward, Helsinki is slowly thawing. Here's what's been on repeat this month.</p>

<p>DJ Seinfeld has been putting out some really beautiful stuff lately. There's a track called "Galazy" I keep going back to. Melancholy but danceable, lush pads, builds over seven minutes without ever feeling like it's in a hurry. Patient music.</p>

<iframe title="Spotify Playlist" src="https://open.spotify.com/embed/track/2aJDlirz6v2a4HREki98cP?utm_source=generator" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

<p>Peggy Gou's "It Makes You Forget (Itgehane)" has been hitting different lately. That track walks a line between accessible and underground that not many people can pull off without it feeling forced.</p>

<p>Dug out some old Mood Hut releases too. That Vancouver label was doing warm, hazy house before it had a name. Jack J's "Thirstin'" never gets old. Simple, soulful, just the right amount of grit.</p>

<p>And for late-night sessions: Floating Points' "Ratio" on repeat. Sometimes you just need one track on loop for an hour while you work. That one does it for me.</p>

<p>Spring is almost here. See you in April.</p>`,
    author: 'Random Gorsey',
    excerpt: 'Monthly listening roundup to carry you into spring.',
  },
];

export default mar2025;
