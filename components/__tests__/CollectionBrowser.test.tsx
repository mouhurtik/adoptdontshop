import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CollectionBrowser from '@/views/essentials/CollectionBrowser';

vi.mock('@/lib/tracking', () => ({ trackAffiliateClick: vi.fn() }));
afterEach(cleanup);

describe('Amazon collection browser', () => {
    it('starts with all thirteen cards and disclosed sponsored links', () => {
        render(<CollectionBrowser />);
        const panel = within(screen.getByRole('tabpanel'));
        expect(panel.getAllByRole('link')).toHaveLength(13);
        expect(screen.getByRole('tab', { name: 'All', exact: true })).toHaveAttribute('aria-selected', 'true');
        const food = panel.getByRole('link', { name: 'Shop cat dry food on Amazon (opens in a new tab)' });
        expect(food).toHaveAttribute('href', 'https://link.amazon/B0brLSDMX');
        expect(food).toHaveAttribute('rel', 'sponsored noopener noreferrer');
        expect(food).toHaveAttribute('target', '_blank');
        expect(panel.getByRole('link', { name: /Shop whiskas on Amazon/ })).toHaveAttribute('href', 'https://link.amazon/B0jl3KssC');
        expect(screen.getByText(/As an Amazon Associate I earn from qualifying purchases/)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Buy|Add to cart/ })).not.toBeInTheDocument();
    });

    it('switches to the four dog selections through the keyboard', async () => {
        const user = userEvent.setup();
        render(<CollectionBrowser />);
        await user.click(screen.getByRole('tab', { name: 'All', exact: true }));
        await user.keyboard('{ArrowRight}');
        expect(within(screen.getByRole('tabpanel')).getAllByRole('link')).toHaveLength(9);
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: /Dogs/ })).toHaveAttribute('aria-selected', 'true');
        const panel = within(screen.getByRole('tabpanel'));
        expect(panel.getAllByRole('link')).toHaveLength(4);
        expect(panel.getByRole('link', { name: /Shop dog dry food/ })).toHaveAttribute('href', 'https://link.amazon/B00xz6ND5');
        expect(panel.getByRole('link', { name: /Shop royal canin on Amazon/ })).toHaveAttribute('href', 'https://link.amazon/B0gCKvTcs');
        expect(panel.queryByRole('link', { name: /Shop cat / })).not.toBeInTheDocument();
    });
});
