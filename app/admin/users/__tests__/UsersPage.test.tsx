import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UsersPage from '../page';

const { profilesQuery, rolesQuery, emailQuery } = vi.hoisted(() => ({
    profilesQuery: vi.fn(),
    rolesQuery: vi.fn(),
    emailQuery: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
    supabase: {
        from: (table: string) => ({
            select: () => table === 'profiles'
                ? { order: profilesQuery }
                : rolesQuery(),
        }),
        rpc: emailQuery,
    },
}));

const profiles = [
    {
        id: '11111111-1111-4111-8111-111111111111',
        display_name: 'Alice',
        account_type: 'individual',
        organization_name: null,
        location: 'Pune',
        created_at: '2026-01-01T12:00:00Z',
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        display_name: 'Bob',
        account_type: 'individual',
        organization_name: null,
        location: 'Delhi',
        created_at: '2026-01-02T12:00:00Z',
    },
];

beforeEach(() => {
    vi.resetAllMocks();
    profilesQuery.mockResolvedValue({ data: profiles, error: null });
    rolesQuery.mockResolvedValue({ data: [], error: null });
    // Deliberately return emails in the opposite order to the profile list.
    emailQuery.mockResolvedValue({
        data: [
            { id: profiles[1].id, email: 'bob@example.test' },
            { id: profiles[0].id, email: 'alice@example.test' },
        ],
        error: null,
    });
});

afterEach(cleanup);

describe('Admin user emails', () => {
    it('shows the correct Auth email beside each profile', async () => {
        render(<UsersPage />);

        const emailCell = await screen.findByRole('cell', { name: 'alice@example.test' });
        expect(within(emailCell.closest('tr')!).getByText('Alice')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
        const bobRow = screen.getByText('Bob').closest('tr')!;
        expect(within(bobRow).getByText('bob@example.test')).toBeInTheDocument();
    });

    it('finds a user by email regardless of letter case', async () => {
        const user = userEvent.setup();
        render(<UsersPage />);
        await screen.findByText('alice@example.test');

        await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'BOB@EXAMPLE');

        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('shows an empty value for accounts without an email', async () => {
        emailQuery.mockResolvedValue({ data: [{ id: profiles[0].id, email: null }], error: null });
        render(<UsersPage />);

        const row = (await screen.findByText('Alice')).closest('tr')!;
        const cells = within(row).getAllByRole('cell');
        expect(cells[1]).toHaveTextContent('—');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('keeps profiles available and makes an email lookup failure visible', async () => {
        emailQuery.mockResolvedValue({ data: null, error: { code: '42501' } });
        render(<UsersPage />);

        expect(await screen.findByRole('alert')).toHaveTextContent('User emails could not be loaded');
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getAllByText('Unavailable')).toHaveLength(2);
        expect(screen.queryByText('No users found.')).not.toBeInTheDocument();
    });

    it('recovers from an email failure when the administrator retries', async () => {
        const user = userEvent.setup();
        emailQuery.mockResolvedValueOnce({ data: null, error: { code: 'PGRST202' } });
        render(<UsersPage />);

        await user.click(await screen.findByRole('button', { name: 'Retry loading emails' }));

        expect(await screen.findByText('alice@example.test')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('shows a retry action instead of an empty user list when profiles fail to load', async () => {
        const user = userEvent.setup();
        profilesQuery.mockResolvedValueOnce({ data: null, error: { code: '503' } });
        render(<UsersPage />);

        expect(await screen.findByRole('alert')).toHaveTextContent('Users could not be loaded');
        expect(screen.queryByText('No users found.')).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Try again' }));

        expect(await screen.findByText('alice@example.test')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
