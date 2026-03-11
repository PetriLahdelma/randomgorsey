import { Post } from '../components/PostCard';

const aug27: Post = {
  id: 27,
  title: 'Helsinki Sketches',
  timestamp: '2025-08-04T22:15',
  contentType: 'text',
  category: 'scene',
  body: `<p>Spent the weekend actually being in Helsinki instead of staying indoors, which in August you have to force yourself to do. Went and crawled the Kallio flea markets on Saturday morning and did the usual thing of arriving telling myself I won't buy anything and leaving with a bag of records. One DJ Koze, a couple of old Finnish soul pressings, something with no label that might be great or might be unlistenable. That's the deal.</p>
<p>In the afternoon ended up at a café in Kallio that sometimes does listening sessions. Just a decent stereo, someone's vinyl collection, cold beers. A record came on and the whole room kind of collectively sighed. Some records do that. I forget to actually leave the flat and go experience things sometimes. Good reminder that the city has this too, you just have to show up.</p>`,
  avatarColor: '#808080',
  author: 'Random Gorsey',
  tags: ['helsinki', 'records', 'scene'],
  excerpt: 'A weekend actually being in Helsinki: Hakaniemi market, a Kallio café, and a bag of records.',
};

const aug28: Post = {
  id: 28,
  title: 'Studio Reset',
  timestamp: '2025-08-11T20:40',
  contentType: 'text',
  category: 'studio',
  body: `<p>Been in the home studio every evening this week. Something shifted after the weekend out. Hearing music in an actual room with other people, on a system that isn't headphones or laptop speakers, reset something. I came back and everything I've been working on sounded different. Some of it better, some worse, all of it clearer.</p>
<p>Main thing I took away is patience with loops. I've been guilty of overcomplicating things, adding layers because I'm anxious a loop on its own isn't "enough." But a good loop IS enough. A single well-chosen chord over the right groove can hold for ages. So this week I stripped a track I'd been building for a month and removed maybe 40% of it. Hi-hats filling space? Gone. Second bassline adding "texture"? Cut. What's left hits harder. Funny how subtraction usually wins.</p>
<p>Also started something new using one of the old Finnish soul pressings I picked up at Hakaniemi. The vocal chop has this yearning quality that fits perfectly over a Juno pad I've been sitting on for weeks. No idea where it's going but the beginning is exciting. Production is sometimes about inputs. Getting out and finding records was a good input. Now it's output time.</p>`,
  avatarColor: '#6a994e',
  author: 'Random Gorsey',
  tags: ['studio', 'production', 'records'],
  excerpt: 'Hearing music in a room reset my ears. Back home, stripping tracks to their essentials.',
};

const aug29: Post = {
  id: 29,
  title: 'August Picks',
  timestamp: '2025-08-18T19:10',
  contentType: 'link',
  category: 'recommendation',
  body: `<p>August in Helsinki has this bittersweet quality that's hard to explain if you don't live here. Days are still long but you can feel them getting shorter. Evenings have a golden tinge that wasn't there in July. Everyone's a little more present because the countdown to autumn has started, even if nobody says it.</p>
<p>Charles Moon's Soft Debris Mix is what I've been putting on when I'm watching the light change through the window. Warmer and deeper than the July stuff, less about energy, more about feeling. Rolling basslines that don't rush anywhere. It drifts, which is exactly what the music needs to do right now.</p>
<p>The mix gets more downtempo toward the end. Some slower grooves, the kind of thing for a late walk along the shore. August endings deserve music that knows how to be still.</p>
<p>&nbsp;</p>
<iframe title="Charles Moon — Soft Debris Mix" width="100%" height="166" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/charlesmxxn/charles-moon-soft-debris&color=%23e8d44d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false" loading="lazy"></iframe>`,
  avatarColor: '#d4a373',
  author: 'Random Gorsey',
  tags: ['recommendation', 'august', 'deep-house'],
  excerpt: 'Charles Moon\'s Soft Debris Mix — the bittersweet sound of late summer in Helsinki.',
};

const aug30: Post = {
  id: 30,
  title: 'Label Watch: Shall Not Fade',
  timestamp: '2025-08-25T21:55',
  contentType: 'text',
  category: 'recommendation',
  body: `<p>If you're into lo-fi house and you don't know Shall Not Fade, fix that. Bristol-based label, been consistently putting out warm sample-driven house for years, and the 2025 output has been particularly strong.</p>
<p>What I love about them is the curatorial identity. Every release feels like it belongs in the same room even when the artists are from completely different places. Slightly rough around the edges, heavy on texture, always with some soul underneath. They manage to be lo-fi without being gimmicky about it, which is genuinely hard. A lot of the lo-fi house wave felt performative, like people were deliberately degrading their sound for aesthetic points. SNF's roster sounds lo-fi because that's how these producers actually hear music.</p>
<p>Their Bandcamp is worth following. But more importantly, buying there means the artists get a much bigger cut than streaming. I try to buy at least one release per month from labels I care about. It's not much but it adds up.</p>
<p>Good starting point: their annual sampler compilations. Put one on. If you're not hooked by track three, probably not your thing. If you are, welcome to the rabbit hole.</p>`,
  avatarColor: '#9b5de5',
  author: 'Random Gorsey',
  tags: ['label', 'shall-not-fade', 'lo-fi house'],
  excerpt: 'Shall Not Fade: consistently one of the best labels in lo-fi house.',
};

const posts202508: Post[] = [aug27, aug28, aug29, aug30];
export default posts202508;
