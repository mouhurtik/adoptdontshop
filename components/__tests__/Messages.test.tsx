import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Messages from '@/views/Messages';

const mocks = vi.hoisted(() => ({
    params: new URLSearchParams(), replace: vi.fn(), auth: vi.fn(), conversations: vi.fn(), member: vi.fn(), search: vi.fn(),
    start: vi.fn(), send: vi.fn(), refetch: vi.fn(), mark: vi.fn(),
}));
const viewer = '11111111-1111-4111-8111-111111111111';
const recipient = { id: '22222222-2222-4222-8222-222222222222', display_name: 'Sam Caregiver', username: 'sam', avatar_url: null };
const another = { ...recipient, id: '33333333-3333-4333-8333-333333333333', display_name: 'Taylor', username: 'taylor' };
const conversation = { id: 'conversation-1', participant_ids: [viewer, recipient.id], other_participant_id: recipient.id, other_participant_name: recipient.display_name, other_participant_username: recipient.username, unread_count: 0, last_message: 'Hello', last_message_at: '2026-11-01T00:00:00Z' };

vi.mock('next/navigation', () => ({ useSearchParams: () => mocks.params, useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: mocks.auth }));
vi.mock('@/hooks/useMessageMembers', async (importOriginal) => ({ ...await importOriginal<typeof import('@/hooks/useMessageMembers')>(), useMessageMember: mocks.member, useMessageMemberSearch: mocks.search }));
vi.mock('@/hooks/useMessages', () => ({
    useConversations: mocks.conversations, useConversationMessages: () => ({ data: [], isLoading: false }),
    useSendMessage: () => ({ mutateAsync: mocks.send, isPending: false }),
    useStartConversation: () => ({ mutateAsync: mocks.start, isPending: false }),
    useMessageRealtime: vi.fn(), useMarkAsRead: () => mocks.mark,
}));

beforeEach(() => {
    vi.clearAllMocks();
    mocks.params = new URLSearchParams({ to: recipient.id });
    mocks.auth.mockReturnValue({ user: { id: viewer }, isAuthenticated: true, isLoading: false });
    mocks.conversations.mockReturnValue({ data: [], isLoading: false, isError: false, refetch: mocks.refetch });
    mocks.member.mockReturnValue({ data: recipient, isPending: false, isError: false });
    mocks.search.mockReturnValue({ data: [], isFetching: false, isError: false });
    mocks.start.mockResolvedValue('new-conversation');
    mocks.send.mockResolvedValue(undefined);
    mocks.refetch.mockResolvedValue({ data: [conversation] });
});
afterEach(cleanup);

describe('unified messaging', () => {
    it('opens a recipient inside the inbox and creates nothing until the first message is submitted', async () => {
        const user = userEvent.setup();
        render(<Messages />);
        expect(screen.getByRole('complementary', { name: 'Message sidebar' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: recipient.display_name })).toHaveAttribute('href', '/user/sam');
        expect(mocks.start).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
        await user.type(screen.getByLabelText('Your message'), 'Hello Sam');
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        expect(mocks.start).toHaveBeenCalledExactlyOnceWith({ recipientId: recipient.id, initialMessage: 'Hello Sam' });
        expect(mocks.replace).toHaveBeenCalledWith('/messages?conversation=new-conversation');
    });

    it('reuses the existing conversation when a profile message link is opened', async () => {
        const user = userEvent.setup();
        mocks.conversations.mockReturnValue({ data: [conversation], isLoading: false });
        render(<Messages />);
        expect(screen.queryByText('New message')).not.toBeInTheDocument();
        expect(mocks.member).toHaveBeenCalledWith(recipient.id, false);
        expect(mocks.mark).toHaveBeenCalledWith(conversation.id);
        await user.type(screen.getByLabelText('Your message'), 'Thanks!');
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        expect(mocks.send).toHaveBeenCalledExactlyOnceWith({ conversationId: conversation.id, content: 'Thanks!' });
        expect(mocks.start).not.toHaveBeenCalled();
    });

    it('filters conversations by username and finds another member in the sidebar', async () => {
        const user = userEvent.setup();
        mocks.params = new URLSearchParams();
        mocks.member.mockReturnValue({ data: null });
        mocks.conversations.mockReturnValue({ data: [conversation], isLoading: false });
        mocks.search.mockImplementation((term: string) => ({ data: term === 'taylor' ? [another] : [], isFetching: false }));
        render(<Messages />);
        const sidebar = within(screen.getByRole('complementary', { name: 'Message sidebar' }));
        const input = sidebar.getByRole('searchbox');
        await user.type(input, '@sam');
        expect(sidebar.getByText(recipient.display_name)).toBeInTheDocument();
        await user.clear(input);
        await user.type(input, 'Taylor');
        expect(sidebar.queryByText(recipient.display_name)).not.toBeInTheDocument();
        await user.click(await sidebar.findByRole('button', { name: 'Message Taylor (@taylor)' }));
        expect(mocks.replace).toHaveBeenCalledWith(`/messages?to=${another.id}`);
        expect(mocks.start).not.toHaveBeenCalled();
    });

    it('preserves a failed first message for retry', async () => {
        const user = userEvent.setup();
        mocks.start.mockRejectedValueOnce(new Error('offline'));
        render(<Messages />);
        await user.type(screen.getByLabelText('Your message'), 'Please keep this draft');
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('could not be sent');
        expect(screen.getByLabelText('Your message')).toHaveValue('Please keep this draft');
        expect(mocks.replace).not.toHaveBeenCalled();
    });

    it('does not offer messaging for invalid links or the current user', () => {
        mocks.params = new URLSearchParams({ to: 'invalid' });
        mocks.member.mockReturnValue({ data: null });
        const view = render(<Messages />);
        expect(screen.getByRole('alert')).toHaveTextContent('member link is invalid');
        expect(screen.queryByLabelText('Your message')).not.toBeInTheDocument();
        mocks.params = new URLSearchParams({ to: viewer });
        view.rerender(<Messages />);
        expect(screen.getByRole('alert')).toHaveTextContent('Choose another member');
        expect(mocks.start).not.toHaveBeenCalled();
    });

    it('keeps the recipient destination through the sign-in gate', () => {
        mocks.auth.mockReturnValue({ user: null, isAuthenticated: false, isLoading: false });
        render(<Messages />);
        expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', `/login?redirect=${encodeURIComponent(`/messages?to=${recipient.id}`)}`);
        expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
        expect(mocks.start).not.toHaveBeenCalled();
    });
});
