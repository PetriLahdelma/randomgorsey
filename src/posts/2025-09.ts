import { Post } from '../components/PostCard';

const sep31: Post = {
  id: 31,
  title: 'September Reset',
  timestamp: '2025-09-01T18:30',
  contentType: 'text',
  category: 'scene',
  body: `<p>First of September. Ready for it.</p>
<p>Summer was brilliant, every minute. But there's something about autumn that clicks with this city's musical identity in a way summer never quite matches. The contrast is what makes both work. We love the light but we make our best music in the dark.</p>`,
  avatarColor: '#c44536',
  author: 'Random Gorsey',
  tags: ['helsinki', 'autumn'],
  excerpt: 'The indoor season begins. Helsinki trades terraces for dark rooms and it feels like coming home.',
};

const sep32: Post = {
  id: 32,
  title: 'Starting Something',
  timestamp: '2025-09-08T21:20',
  contentType: 'text',
  category: 'studio',
  body: `<p>New season, new energy. I cleared the decks in the home studio, literally and figuratively. Archived all the summer sketches (some will be revisited, most won't), reorganized the sample library, cleaned the actual desk for the first time in months. Found three USB sticks I'd forgotten about, each with half-finished tracks from various points over the past year. Problem for future me.</p>
<p>What I'm excited about is starting something with intention rather than accident. The summer sessions were great: loose, spontaneous, driven by mood and weather. But autumn is when I want to be more deliberate. Thinking about a small set of tracks that share a specific palette. Not an EP in the traditional sense, more like pieces that could live together.</p>
<p>The working concept is that transitional feeling: the shift from light to dark, warm to cool, outdoor to indoor. Tracks that sit on that threshold. Not quite summer, not quite winter. The musical equivalent of that first evening when you notice it gets dark before 8pm and feel a little pang of something that isn't quite sadness but isn't quite anything else either.</p>
<p>Sound-wise, I've been obsessing over soft synth pads. Found a preset in TAL-U-NO that has this slightly detuned, drifting quality that fits autumn perfectly. Warm but unstable, like it might dissolve at any moment. Pairing that with Ableton's drum racks and some field recordings feels like the right palette. Early days. Could be three tracks, could be six. But the intention is set and the studio is clean and the autumn rain is hitting the window.</p>`,
  avatarColor: '#457b9d',
  author: 'Random Gorsey',
  tags: ['studio', 'new-project', 'production'],
  excerpt: 'Clean desk, cleared decks, and a new project taking shape as autumn settles in.',
};

const sep33: Post = {
  id: 33,
  title: 'Autumn Frequencies',
  timestamp: '2025-09-15T11:05',
  contentType: 'text',
  category: 'field-recording',
  body: `<p>Took the recorder out again. Different mission this time. Not trying to capture a specific moment like midsummer, more just cataloguing how Helsinki sounds as it shifts into autumn.</p>
<p>The most striking thing is the change in the city's ambient frequency. In summer Helsinki hums, constant low-level buzz of activity, people outside, terraces, traffic. In September it shifts to something quieter and more percussive. Footsteps on wet pavement. Rain on different surfaces: metal awning versus canvas umbrella versus your jacket hood. Tram bells through fog. Leaves skittering across cobblestones.</p>
<p>Spent an hour in Kaivopuisto on Saturday morning with the Zoom pointed at the shoreline. The Baltic in autumn has a completely different voice than in summer. Heavier waves, more bass in the impact against the rocks. The wind was carrying industrial sounds from somewhere across the water, distant clangs and hums that sounded almost melodic stripped of context.</p>
<p>Best capture of the week happened by accident. Recording a tram stop during morning rush and a street musician started playing accordion about fifty meters away. The combination of the accordion's drone, the tram's electrical whine, commuters' footsteps, occasional PA announcements: this layered composition nobody was intending. Found music in the truest sense.</p>
<p>I've been organizing these recordings by texture rather than location. Metallic, organic, rhythmic, tonal. Makes them easier to search when I'm producing and need a specific quality rather than a specific place. The recorder stays in my bag until the snow comes.</p>`,
  avatarColor: '#a68a64',
  author: 'Random Gorsey',
  tags: ['field-recording', 'autumn', 'helsinki-sounds'],
  excerpt: 'Documenting how Helsinki sounds as it shifts from summer buzz to autumn percussion.',
};

const sep34: Post = {
  id: 34,
  title: 'September Selections',
  timestamp: '2025-09-22T20:00',
  contentType: 'link',
  category: 'recommendation',
  body: `<p>Been listening to this Theo Parrish RA Exchange episode all week. Found it on a slow Sunday afternoon and it's been playing in the background of everything since: cooking, tidying up, sitting with a coffee watching rain hit the window.</p>
<p>The mood has shifted noticeably from summer. Deeper, darker, more textured. Theo Parrish in conversation is as interesting as Theo Parrish playing music. The way he talks about records and production feels like it's coming from somewhere completely different from the usual interview circuit.</p>
<p>Headphones recommended.</p>
<p>&nbsp;</p>
<iframe title="RA Exchange — EX.763 Theo Parrish" width="100%" height="166" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/ra-exchange/ex763-theo-parrish&color=%23e8d44d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false" loading="lazy"></iframe>`,
  avatarColor: '#264653',
  author: 'Random Gorsey',
  tags: ['recommendation', 'september', 'theo-parrish', 'ra-exchange'],
  excerpt: 'Theo Parrish on the RA Exchange — been listening all week. The conversations are as good as the music.',
};

const posts202509: Post[] = [sep31, sep32, sep33, sep34];
export default posts202509;
