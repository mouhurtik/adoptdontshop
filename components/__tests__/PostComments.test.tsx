import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostComments from '@/components/community/PostComments';

const mocks = vi.hoisted(() => ({ add: vi.fn(), comments: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: 'me' }, profile: { display_name: 'Alex' }, isAuthenticated: true }) }));
vi.mock('@/hooks/useCommunity', () => ({ usePostComments: mocks.comments, useAddComment: () => ({ mutateAsync: mocks.add, isPending: false }) }));

beforeEach(() => {
    mocks.add.mockReset().mockResolvedValue({});
    mocks.comments.mockReturnValue({ data: [
        { id: 'comment-1', author_id: 'member-1', created_at: '2026-11-01T10:00:00Z', parent_comment_id: null, content: 'Where is the kitten?', profiles: { display_name: 'Sam', username: 'sam', avatar_url: null } },
        { id: 'reply-1', author_id: 'member-2', created_at: '2026-11-01T11:00:00Z', parent_comment_id: 'comment-1', content: 'Please contact the caregiver.', profiles: { display_name: 'Taylor', username: null, avatar_url: null } },
    ] });
});
afterEach(cleanup);

describe('Post comments', () => {
    it('links parent and reply authors to profiles and a deliberate message composer', () => {
        render(<PostComments postId="post-1" />);
        expect(screen.getByRole('link', { name: 'Sam' })).toHaveAttribute('href', '/user/sam');
        expect(screen.getByRole('link', { name: 'Taylor' })).toHaveAttribute('href', '/user/member-2');
        expect(screen.getByRole('link', { name: 'Message Taylor' })).toHaveAttribute('href', '/messages/new?to=member-2');
        expect(mocks.add).not.toHaveBeenCalled();
    });
    it('disables an empty comment and submits the typed text once', async () => {
        const user = userEvent.setup();
        render(<PostComments postId="post-1" />);
        expect(screen.getByRole('button', { name: 'Post comment' })).toBeDisabled();
        await user.type(screen.getByLabelText('Comment as Alex'), ' Thanks for helping! ');
        await user.click(screen.getByRole('button', { name: 'Post comment' }));
        expect(mocks.add).toHaveBeenCalledExactlyOnceWith({ postId: 'post-1', content: 'Thanks for helping!' });
        expect(screen.getByLabelText('Comment as Alex')).toHaveValue('');
    });
    it('preserves a failed comment and presents a retryable error', async () => {
        mocks.add.mockRejectedValue(new Error('Network failed'));
        const user = userEvent.setup();
        render(<PostComments postId="post-1" />);
        await user.type(screen.getByLabelText('Comment as Alex'), 'Keep this draft');
        await user.click(screen.getByRole('button', { name: 'Post comment' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('could not be sent');
        expect(screen.getByLabelText('Comment as Alex')).toHaveValue('Keep this draft');
    });
    it('sends a reply with its parent ID', async () => {
        const user = userEvent.setup();
        render(<PostComments postId="post-1" />);
        await user.click(screen.getByRole('button', { name: 'Reply', exact: true }));
        await user.type(screen.getByRole('textbox', { name: 'Reply to Sam' }), 'Thank you');
        await user.click(screen.getByRole('button', { name: 'Send reply' }));
        expect(mocks.add).toHaveBeenCalledExactlyOnceWith({ postId: 'post-1', content: 'Thank you', parentId: 'comment-1' });
    });
});
