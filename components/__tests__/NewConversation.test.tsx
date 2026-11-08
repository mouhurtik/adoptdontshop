import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NewConversation from '@/components/messaging/NewConversation';

const mocks = vi.hoisted(() => ({ start: vi.fn(), replace: vi.fn() }));
const recipient = '22222222-2222-4222-8222-222222222222';
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: 'me' }, isAuthenticated: true, isLoading: false }) }));
vi.mock('@/lib/supabase/client', () => ({ supabase: {} }));
vi.mock('@tanstack/react-query', () => ({ useQuery: () => ({ data: { id: recipient, display_name: 'Sam', username: 'sam' } }) }));
vi.mock('@/hooks/useMessages', () => ({ useConversations: () => ({ data: [] }), useStartConversation: () => ({ mutateAsync: mocks.start, isPending: false }) }));
beforeEach(() => { vi.clearAllMocks(); mocks.start.mockResolvedValue('conversation-1'); });
afterEach(cleanup);

describe('New message composer', () => {
    it('sends no automatic greeting and waits for an explicit message submission', async () => {
        const user = userEvent.setup();
        render(<NewConversation recipientId={recipient} />);
        expect(mocks.start).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
        await user.type(screen.getByLabelText('Your message'), 'Hello Sam');
        await user.click(screen.getByRole('button', { name: 'Send message' }));
        expect(mocks.start).toHaveBeenCalledExactlyOnceWith({ recipientId: recipient, initialMessage: 'Hello Sam' });
        expect(mocks.replace).toHaveBeenCalledWith('/messages?conversation=conversation-1');
    });
    it('does not offer a composer for an invalid recipient', () => {
        render(<NewConversation recipientId="invalid" />);
        expect(screen.getByText('This recipient link is invalid.')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(mocks.start).not.toHaveBeenCalled();
    });
});
