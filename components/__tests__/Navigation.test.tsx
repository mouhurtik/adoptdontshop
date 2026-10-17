import { useState, type ComponentProps } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppSidebar from '../AppSidebar';
import BottomNav from '../BottomNav';
import TopBar from '../TopBar';

const mocks = vi.hoisted(() => ({
  pathname: vi.fn(),
  auth: vi.fn(),
  unread: vi.fn(),
  from: vi.fn(),
  memberships: vi.fn(),
  communities: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({ usePathname: mocks.pathname }));
vi.mock('next/link', () => ({
  default: ({ prefetch: _prefetch, ...props }: ComponentProps<'a'> & { prefetch?: boolean }) => (
    <a {...props} />
  ),
}));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: mocks.auth }));
vi.mock('@/hooks/useMessages', () => ({ useUnreadCount: mocks.unread }));
vi.mock('@/lib/supabase/client', () => ({ supabase: { from: mocks.from } }));

const signedInAuth = {
  user: { id: 'user-1', email: 'alex@example.com' },
  profile: { display_name: 'Alex', username: 'alex' },
  isAuthenticated: true,
  isAdmin: true,
  signOut: mocks.signOut,
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.pathname.mockReturnValue('/');
  mocks.auth.mockReturnValue({
    user: null,
    profile: null,
    isAuthenticated: false,
    isAdmin: false,
    signOut: mocks.signOut,
  });
  mocks.unread.mockReturnValue({ data: 0 });
  mocks.memberships.mockResolvedValue({ data: [] });
  mocks.communities.mockResolvedValue({ data: [] });
  mocks.signOut.mockResolvedValue(undefined);
  mocks.from.mockImplementation((table: string) =>
    table === 'group_members'
      ? { select: () => ({ eq: () => ({ limit: mocks.memberships }) }) }
      : { select: () => ({ in: () => ({ order: mocks.communities }) }) }
  );
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('mobile navigation', () => {
  it('keeps the five destinations named and keyboard reachable', async () => {
    const user = userEvent.setup();
    render(<BottomNav />);

    const navigation = within(screen.getByRole('navigation', { name: 'Mobile navigation' }));
    const destinations = [
      ['Home', '/'],
      ['Explore', '/explore'],
      ['Browse', '/browse'],
      ['Chat', '/messages'],
      ['Login', '/login'],
    ];

    expect(navigation.getAllByRole('link')).toHaveLength(5);
    for (const [name, href] of destinations) {
      const link = navigation.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      await user.tab();
      expect(link).toHaveFocus();
    }
    expect(navigation.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it.each([
    ['/communities/foster-friends', 'Explore'],
    ['/explore', 'Explore'],
    ['/browse', 'Browse'],
    ['/pet/buddy-123', 'Browse'],
    ['/messages/conversation-1', 'Chat'],
    ['/profile', 'Login'],
    ['/login', 'Login'],
  ])('identifies the current destination on %s', (pathname, name) => {
    mocks.pathname.mockReturnValue(pathname);
    render(<BottomNav />);

    const navigation = within(screen.getByRole('navigation', { name: 'Mobile navigation' }));
    expect(navigation.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
    expect(navigation.getAllByRole('link', { current: 'page' })).toHaveLength(1);
  });

  it('keeps the signed-in profile destination and a clear accessible label', () => {
    mocks.auth.mockReturnValue(signedInAuth);
    mocks.pathname.mockReturnValue('/user/alex');
    render(<BottomNav />);

    expect(screen.getByRole('link', { name: 'Me' })).toHaveAttribute('href', '/user/alex');
    expect(screen.getByRole('link', { name: 'Me' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
  });
});

describe('desktop navigation', () => {
  it('preserves accessible names, unread counts and current state through keyboard collapse', async () => {
    const user = userEvent.setup();
    mocks.pathname.mockReturnValue('/messages/conversation-1');
    mocks.unread.mockReturnValue({ data: 123 });

    function CollapsibleSidebar() {
      const [collapsed, setCollapsed] = useState(false);
      return <AppSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />;
    }

    render(<CollapsibleSidebar />);
    expect(screen.getByText('99+')).toBeInTheDocument();
    const collapse = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(collapse).toHaveAttribute('aria-expanded', 'true');
    collapse.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false');
    const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
    expect(navigation.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(navigation.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '/explore');
    expect(navigation.getByRole('link', { name: 'Browse Pets' })).toHaveAttribute('href', '/browse');
    expect(navigation.getByRole('link', { name: 'Messages 123 unread messages' })).toHaveAttribute('href', '/messages');
    expect(navigation.getByRole('link', { name: 'Messages 123 unread messages' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/login');
    expect(screen.queryByText('99+')).not.toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it.each([false, true])('retains community, profile and logout actions when collapsed=%s', async (collapsed) => {
    const user = userEvent.setup();
    mocks.auth.mockReturnValue(signedInAuth);
    mocks.pathname.mockReturnValue('/communities/foster-friends');
    mocks.memberships.mockResolvedValue({ data: [{ group_id: 'group-1' }] });
    mocks.communities.mockResolvedValue({
      data: [{ id: 'group-1', name: 'Foster Friends', slug: 'foster-friends', avatar_url: null }],
    });

    render(<AppSidebar collapsed={collapsed} onToggleCollapse={vi.fn()} />);

    const community = await screen.findByRole('link', { name: 'Foster Friends' });
    expect(community).toHaveAttribute('href', '/communities/foster-friends');
    expect(community).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: "View Alex's profile" })).toHaveAttribute('href', '/user/alex');
    if (!collapsed) {
      expect(screen.getByRole('link', { name: 'Create community' })).toHaveAttribute('href', '/communities/create');
      expect(screen.getByRole('link', { name: 'Explore all communities' })).toHaveAttribute('href', '/communities');
      expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
    }

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    expect(mocks.signOut).toHaveBeenCalledOnce();
  });
});

describe('mobile top bar', () => {
  it.each([
    ['/explore', 'Explore'],
    ['/browse', 'Browse Pets'],
    ['/messages', 'Messages'],
    ['/user/alex', 'Profile'],
    ['/profile', 'Profile'],
    ['/pet/buddy-123', 'Meet Buddy'],
    ['/login', 'Login'],
    ['/community', 'Community'],
    ['/communities', 'Explore'],
    ['/about', 'About'],
    ['/welcome', 'Welcome'],
    ['/list-pet', 'List a Pet'],
    ['/signup', 'Sign Up'],
  ])('shows the %s route context as %s beside the accessible home link', (pathname, label) => {
    mocks.pathname.mockReturnValue(pathname);
    render(<TopBar />);

    expect(screen.getByRole('link', { name: 'AdoptDontShop home' })).toHaveAttribute('href', '/');
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
