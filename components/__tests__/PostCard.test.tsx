import type { ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostCard, { type PostCardData } from '../community/PostCard';
import PostCardList from '../community/PostCardList';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  userLiked: vi.fn(),
  mutate: vi.fn(),
  push: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: (props: ComponentProps<'a'>) => <a {...props} />,
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: mocks.auth }));
vi.mock('@/hooks/useCommunity', () => ({
  useUserLiked: mocks.userLiked,
  useLikePost: () => ({ mutate: mocks.mutate }),
}));

const post: PostCardData = {
  id: 'post-1',
  title: 'A new home for Buddy',
  slug: 'a-new-home-for-buddy',
  content_text: 'Buddy has found a loving family through our community.',
  featured_image_url: 'https://example.com/buddy.jpg',
  tags: ['success_story', 'discussion'],
  like_count: 12,
  comment_count: 4,
  view_count: 36,
  created_at: '2026-10-10T12:00:00.000Z',
  author_id: 'author-1',
  author: { display_name: 'Alex', avatar_url: null, username: 'alex' },
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReturnValue({ user: { id: 'user-1' } });
  mocks.userLiked.mockReturnValue({ data: false });
});

afterEach(cleanup);

describe.each([
  { variant: 'grid', Card: PostCard },
  { variant: 'list', Card: PostCardList },
])('$variant community card', ({ Card }) => {
  it('provides native title and image links to the canonical post URL', async () => {
    const user = userEvent.setup();
    render(<Card post={post} />);

    const imageLink = screen.getByRole('link', { name: `Read ${post.title}` });
    const titleLink = within(screen.getByRole('heading', { name: post.title })).getByRole('link');
    expect(imageLink).toHaveAttribute('href', `/community/${post.slug}`);
    expect(titleLink).toHaveAttribute('href', `/community/${post.slug}`);
    expect(imageLink).toContainElement(screen.getByRole('img', { name: post.title }));
    expect(imageLink.querySelector('a, button')).toBeNull();
    expect(titleLink.querySelector('a, button')).toBeNull();

    await user.tab();
    expect(imageLink).toHaveFocus();
    await user.tab();
    expect(titleLink).toHaveFocus();
  });

  it('keeps likes independent of post navigation with mouse and keyboard', async () => {
    const user = userEvent.setup();
    render(<Card post={post} />);

    const like = screen.getByRole('button', { name: `Like ${post.title}`, pressed: false });
    expect(like.closest('a')).toBeNull();
    await user.click(like);
    expect(mocks.mutate).toHaveBeenCalledExactlyOnceWith({ postId: post.id, liked: false });
    expect(mocks.push).not.toHaveBeenCalled();

    mocks.mutate.mockClear();
    await user.keyboard('{Enter}');
    expect(mocks.mutate).toHaveBeenCalledExactlyOnceWith({ postId: post.id, liked: false });
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('preserves the unlike state and action', async () => {
    const user = userEvent.setup();
    mocks.userLiked.mockReturnValue({ data: true });
    render(<Card post={post} />);

    await user.click(screen.getByRole('button', { name: `Unlike ${post.title}`, pressed: true }));
    expect(mocks.mutate).toHaveBeenCalledExactlyOnceWith({ postId: post.id, liked: true });
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('preserves the signed-out like redirect without triggering a mutation', async () => {
    const user = userEvent.setup();
    mocks.auth.mockReturnValue({ user: null });
    render(<Card post={post} />);

    await user.click(screen.getByRole('button', { name: `Like ${post.title}` }));
    expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/login');
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it('retains tags, author, date and count metadata without an article click handler', () => {
    const { container } = render(<Card post={post} />);

    expect(screen.getByText('Success Story')).toBeInTheDocument();
    expect(screen.getByText('Discussion')).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(container.querySelector('time')).toHaveAttribute('datetime', post.created_at);
    expect(screen.getByLabelText('4 comments')).toBeInTheDocument();
    expect(screen.getByLabelText('36 views')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Like ${post.title}` })).toHaveTextContent('12');

    fireEvent.click(screen.getByRole('article'));
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it('keeps the title link when there is no image or author', () => {
    render(<Card post={{ ...post, featured_image_url: null, author: undefined, author_id: undefined }} />);

    expect(screen.queryByRole('link', { name: `Read ${post.title}` })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: post.title })).toHaveAttribute('href', `/community/${post.slug}`);
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });
});

describe('grid community card details', () => {
  it('preserves the author profile link as an independent destination', () => {
    render(<PostCard post={post} />);
    const authorLink = screen.getByRole('link', { name: /Alex/ });
    expect(authorLink).toHaveAttribute('href', '/user/alex');
    expect(authorLink.parentElement?.closest('a')).toBeNull();
  });

  it('preserves the author ID fallback when no username exists', () => {
    render(<PostCard post={{ ...post, author: { ...post.author!, username: null } }} />);
    expect(screen.getByRole('link', { name: /Alex/ })).toHaveAttribute('href', '/user/author-1');
  });

  it('preserves eager, high-priority featured images', () => {
    render(<PostCard post={post} priority />);
    const image = screen.getByRole('img', { name: post.title });
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchpriority', 'high');
    expect(image).toHaveAttribute('decoding', 'async');
  });
});
