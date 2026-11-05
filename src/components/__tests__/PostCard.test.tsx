import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import PostCard, { Post } from '../PostCard';

const post: Post = {
  id: 1,
  title: 'Test Post',
  timestamp: '2024-01-01',
  contentType: 'image',
  body: 'Some body text',
  media: '/images/test.jpg',
  author: 'RG'
};

describe('PostCard', () => {
  it('renders post title and image', () => {
    render(
      <HelmetProvider>
        <PostCard post={post} />
      </HelmetProvider>
    );
    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument();
    const img = screen.getByAltText('Test Post');
    expect(img).toHaveAttribute('title', 'Test Post');
  });

  it('keeps expansion and sharing as separate controls', async () => {
    const user = userEvent.setup();
    const longPost: Post = {
      ...post,
      body: `<p>${'A long post body. '.repeat(30)}</p>`,
    };

    render(
      <HelmetProvider>
        <PostCard post={longPost} truncateLength={40} />
      </HelmetProvider>
    );

    const article = screen.getByRole('article');
    expect(article).not.toHaveAttribute('tabindex');
    expect(article).not.toHaveAttribute('role', 'button');

    const expand = screen.getByRole('button', { name: 'Show more content' });
    const share = screen.getByRole('button', { name: 'Share' });
    expect(article).toContainElement(expand);
    expect(article).toContainElement(share);

    await user.click(article);
    expect(expand).toHaveAttribute('aria-expanded', 'false');

    await user.click(expand);
    expect(screen.getByRole('button', { name: 'Show less content' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('uses only the title control for an optional card action', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <HelmetProvider>
        <PostCard post={post} onClick={onClick} showSocialShare={false} />
      </HelmetProvider>
    );

    const article = screen.getByRole('article');
    const titleControl = screen.getByRole('button', { name: 'Test Post' });

    await user.click(article);
    expect(onClick).not.toHaveBeenCalled();

    await user.click(titleControl);
    expect(onClick).toHaveBeenCalledWith(post);
  });

  it('shares the stable post route rather than a homepage fragment', async () => {
    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <PostCard post={post} />
      </HelmetProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(screen.getByRole('menuitem', { name: 'Share on X (Twitter)' })).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent('/posts/1/'))
    );
  });

  it('defers trusted third-party embeds until the visitor loads them', async () => {
    const user = userEvent.setup();
    const postWithEmbed: Post = {
      ...post,
      contentType: 'text',
      body:
        '<p>Listen when ready.</p>' +
        '<iframe title="A SoundCloud selection" height="166" ' +
        'src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/randomgorsey/example"></iframe>',
    };

    render(
      <HelmetProvider>
        <PostCard
          post={postWithEmbed}
          showFullContent
          truncateLength={Number.MAX_SAFE_INTEGER}
          showSocialShare={false}
        />
      </HelmetProvider>
    );

    expect(document.querySelector('iframe')).not.toBeInTheDocument();
    expect(screen.getByText('Listen when ready.').tagName).toBe('P');
    expect(
      screen.getByRole('link', { name: 'Open on SoundCloud' })
    ).toHaveAttribute('href', 'https://soundcloud.com/randomgorsey/example');

    await user.click(
      screen.getByRole('button', { name: 'Load SoundCloud' })
    );

    expect(
      screen.getByTitle('A SoundCloud selection')
    ).toHaveAttribute(
      'src',
      expect.stringContaining('w.soundcloud.com/player/')
    );
    expect(
      screen.getByRole('link', { name: 'Open on SoundCloud' })
    ).toHaveAttribute('href', 'https://soundcloud.com/randomgorsey/example');

    await user.click(screen.getByRole('button', { name: 'Close player' }));
    expect(document.querySelector('iframe')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Load SoundCloud' })
    ).toBeInTheDocument();
  });

  it('keeps Spotify embeds behind the same explicit load boundary', async () => {
    const user = userEvent.setup();
    const spotifyPost: Post = {
      ...post,
      contentType: 'text',
      body:
        '<iframe title="Spotify selection" height="152" ' +
        'src="https://open.spotify.com/embed/track/example?utm_source=generator"></iframe>',
    };

    render(
      <HelmetProvider>
        <PostCard
          post={spotifyPost}
          showFullContent
          truncateLength={Number.MAX_SAFE_INTEGER}
          showSocialShare={false}
        />
      </HelmetProvider>
    );

    expect(document.querySelector('iframe')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open on Spotify' })).toHaveAttribute(
      'href',
      'https://open.spotify.com/track/example'
    );

    await user.click(screen.getByRole('button', { name: 'Load Spotify' }));
    expect(screen.getByTitle('Spotify selection')).toBeInTheDocument();
  });

  it('keeps only one third-party player active inside a post body', async () => {
    const user = userEvent.setup();
    const postWithTwoEmbeds: Post = {
      ...post,
      contentType: 'text',
      body:
        '<iframe title="First selection" height="166" ' +
        'src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/randomgorsey/first"></iframe>' +
        '<iframe title="Second selection" height="152" ' +
        'src="https://open.spotify.com/embed/track/second"></iframe>',
    };

    render(
      <HelmetProvider>
        <PostCard
          post={postWithTwoEmbeds}
          showFullContent
          truncateLength={Number.MAX_SAFE_INTEGER}
          showSocialShare={false}
        />
      </HelmetProvider>
    );

    await user.click(
      screen.getByRole('button', { name: 'Load SoundCloud' })
    );
    expect(screen.getByTitle('First selection')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Load Spotify' }));
    expect(screen.queryByTitle('First selection')).not.toBeInTheDocument();
    expect(screen.getByTitle('Second selection')).toBeInTheDocument();
    expect(document.querySelectorAll('iframe')).toHaveLength(1);
  });

  it('expands immediately without effect classes when effects are off', async () => {
    const user = userEvent.setup();
    const longPost: Post = {
      ...post,
      body: '<p>' + 'Still readable. '.repeat(30) + '</p>',
    };

    const { container } = render(
      <HelmetProvider>
        <PostCard
          post={longPost}
          truncateLength={30}
          showSocialShare={false}
        />
      </HelmetProvider>
    );

    await user.click(
      screen.getByRole('button', { name: 'Show more content' })
    );

    expect(container.querySelector('.noise-wipe-enter')).not.toBeInTheDocument();
    expect(screen.getByText(/Still readable\. Still readable/)).toBeInTheDocument();
  });
});
