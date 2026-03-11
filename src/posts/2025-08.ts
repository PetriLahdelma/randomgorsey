import { Post } from '../components/PostCard';

const aug27: Post = {
  id: 27,
  title: 'Berlin Sketches',
  timestamp: '2025-08-04T22:15',
  contentType: 'text',
  category: 'scene',
  body: `<p>Back from a weekend in Berlin. Hadn't been since winter and the city completely changes in August. Windows open everywhere, that particular smell of linden trees and cigarettes and doner grease. Had a good time wandering around Neukölln with a friend who lives there, did the Mauerpark flea market mostly as a joke (overpriced Kraftwerk reissues, coffee table books about techno, as expected), found a good record shop in Kreuzberg where I spent too long and too much money.</p>
<p>Saturday afternoon there was this tiny bar near Eberswalder doing a listening session. Just a decent stereo, someone's vinyl collection, cold beers. A DJ Koze record came on and the whole room kind of collectively sighed. Some records do that. Berlin keeps pulling me back. Helsinki is home but Berlin is the place where I remember why I fell in love with this music.</p>`,
  avatarColor: '#808080',
  author: 'Random Gorsey',
  tags: ['berlin', 'travel'],
  excerpt: 'A weekend in Berlin: record digging, a Koze moment, and coming home full of ideas.',
};

const aug28: Post = {
  id: 28,
  title: 'Post-Berlin Studio Mode',
  timestamp: '2025-08-11T20:40',
  contentType: 'text',
  category: 'studio',
  body: `<p>Back in Helsinki and I've been in the home studio every evening since. Something about hearing music on a serious sound system (Berlin's clubs have ridiculous systems) resets my ears. I come home and everything I've been working on sounds different. Some of it better, some worse, all of it clearer.</p>
<p>Main thing I brought back is patience. I've been guilty of overcomplicating things, adding layers because I'm anxious a loop on its own isn't "enough." But this trip reminded me that a good loop IS enough. A single well-chosen chord over the right groove can hold for ages. So this week I stripped a track I'd been building for a month and removed maybe 40% of it. Hi-hats filling space? Gone. Second bassline adding "texture"? Cut. What's left hits harder. Funny how subtraction usually wins.</p>
<p>Also started something new, loosely inspired by a Sunday morning walk back to my friend's flat. Sampling a soul record I found in Kreuzberg. The vocal chop has this yearning quality that fits perfectly over a Juno pad I've been sitting on for weeks. No idea where it's going but the beginning is exciting. Production is sometimes about inputs. Berlin was a big input. Now it's output time.</p>`,
  avatarColor: '#6a994e',
  author: 'Random Gorsey',
  tags: ['studio', 'production', 'berlin-inspired'],
  excerpt: 'Berlin reset my ears. Back in Helsinki, stripping tracks to their essentials.',
};

const aug29: Post = {
  id: 29,
  title: 'August Picks',
  timestamp: '2025-08-18T19:10',
  contentType: 'link',
  category: 'playlist',
  body: `<p>August in Helsinki has this bittersweet quality that's hard to explain if you don't live here. Days are still long but you can feel them getting shorter. Evenings have a golden tinge that wasn't there in July. Everyone's a little more present because the countdown to autumn has started, even if nobody says it.</p>
<p>This playlist reflects that. Warmer and deeper than the July stuff, less about energy, more about feeling. Rolling basslines that don't rush anywhere. The kind of thing you put on when you're watching the light change through the window and you want the music to match that slow drift.</p>
<p>The tail end gets more downtempo. Some ambient pieces, a couple of slower grooves for a late walk along the shore. August endings deserve music that knows how to be still.</p>
<p>&nbsp;</p>
<iframe title="Charles Moon — Soft Debris Mix" width="100%" height="166" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/charlesmxxn/charles-moon-soft-debris&color=%23e8d44d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false" loading="lazy"></iframe>`,
  avatarColor: '#d4a373',
  author: 'Random Gorsey',
  tags: ['playlist', 'august', 'deep-house'],
  excerpt: 'Bittersweet August selections for the golden end of Helsinki summer.',
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
<p>Good starting point: their annual sampler compilations. Put one on. If you're not hooked by track three, probably not your thing. If you are — welcome to the rabbit hole.</p>`,
  avatarColor: '#9b5de5',
  author: 'Random Gorsey',
  tags: ['label', 'shall-not-fade', 'lo-fi house'],
  excerpt: 'Shall Not Fade: consistently one of the best labels in lo-fi house.',
};

const posts202508: Post[] = [aug27, aug28, aug29, aug30];
export default posts202508;
