import type { ComponentProps, ReactNode } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicProfilePage from '@/app/user/[id]/page';

const mocks = vi.hoisted(() => ({ params: { id: 'sam' }, auth: vi.fn(), from: vi.fn() }));
const recipientId = '22222222-2222-4222-8222-222222222222';
const profile = { id: recipientId, display_name: 'Sam', username: 'sam', created_at: '2026-10-01', privacy_settings: {} };
const pet = { id: 'pet-1', pet_name: 'Milo', status: 'available', created_at: '2026-10-01' };
const post = { id: 'post-1', title: 'A happy adoption', slug: 'a-happy-adoption', created_at: '2026-10-01', like_count: 0, comment_count: 0 };
let fixture: { pets: typeof pet[]; posts: typeof post[] };

vi.mock('next/navigation', () => ({ useParams: () => mocks.params }));
vi.mock('next/link', () => ({ default: (props: ComponentProps<'a'>) => <a {...props} /> }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: mocks.auth }));
vi.mock('@/lib/supabase/client', () => ({ supabase: { from: mocks.from } }));
vi.mock('@/components/ui/ScrollReveal', () => ({ default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
vi.mock('@/components/ui/PawprintLoader', () => ({ default: () => <p>Loading profile...</p> }));

beforeEach(() => {
    vi.clearAllMocks();
    mocks.params = { id: 'sam' };
    mocks.auth.mockReturnValue({ user: null });
    fixture = { pets: [], posts: [post] };
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
    mocks.from.mockImplementation((table: string) => {
        const data = table === 'profiles' ? { ...profile, username: mocks.params.id }
            : table === 'pet_listings' ? fixture.pets : table === 'community_posts' ? fixture.posts : [];
        const result = Promise.resolve({ data });
        const query = { select: () => query, eq: () => query, order: () => result, single: () => result, then: result.then.bind(result) };
        return query;
    });
});

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('public profile content and messaging', () => {
    it('opens Posts first when there are no pets, and respects a manual switch to Pets', async () => {
        const user = userEvent.setup();
        render(<PublicProfilePage />);
        await screen.findByRole('heading', { name: 'Sam' });
        const tabs = screen.getAllByRole('tab');
        expect(tabs[0]).toHaveAccessibleName('Posts (1)');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(within(screen.getByRole('tabpanel')).getByText(post.title)).toBeInTheDocument();
        await user.click(screen.getByRole('tab', { name: 'Pets (0)' }));
        expect(screen.getByRole('tab', { name: 'Pets (0)' })).toHaveAttribute('aria-selected', 'true');
        expect(within(screen.getByRole('tabpanel')).getByText('No pets listed yet')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Message' })).toHaveAttribute('href', `/messages?to=${recipientId}`);
    });

    it('keeps Pets first when listings exist and supports keyboard tab selection', async () => {
        const user = userEvent.setup();
        fixture.pets = [pet];
        render(<PublicProfilePage />);
        await screen.findByRole('heading', { name: 'Sam' });
        const first = screen.getAllByRole('tab')[0];
        expect(first).toHaveAccessibleName('Pets (1)');
        expect(first).toHaveAttribute('aria-selected', 'true');
        first.focus();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'Posts (1)' })).toHaveFocus();
        expect(within(screen.getByRole('tabpanel')).getByText(post.title)).toBeInTheDocument();
    });

    it('resets a manual selection when navigating to a different profile', async () => {
        const user = userEvent.setup();
        const view = render(<PublicProfilePage />);
        await screen.findByRole('heading', { name: 'Sam' });
        await user.click(screen.getByRole('tab', { name: 'Pets (0)' }));
        mocks.params = { id: 'another-user' };
        view.rerender(<PublicProfilePage />);
        await screen.findByText('@another-user');
        expect(screen.getAllByRole('tab')[0]).toHaveAccessibleName('Posts (1)');
        expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('has a useful empty state and does not offer self messaging', async () => {
        fixture.posts = [];
        mocks.auth.mockReturnValue({ user: { id: recipientId } });
        render(<PublicProfilePage />);
        await screen.findByRole('heading', { name: 'Sam' });
        expect(screen.getAllByRole('tab')[0]).toHaveAccessibleName('Pets (0)');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('No pets listed yet');
        expect(screen.queryByRole('link', { name: 'Message' })).not.toBeInTheDocument();
    });
});
