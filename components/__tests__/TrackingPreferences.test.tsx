import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import TrackingPreferences from '@/components/analytics/TrackingPreferences';
import { TRACKING_STORAGE_KEY } from '@/lib/tracking';

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it('keeps tracking off until an explicit preference is saved, without a popout', async () => {
    const user = userEvent.setup();
    render(<TrackingPreferences />);
    expect(screen.queryByText('Choose optional measurement')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Allow Google Analytics')).not.toBeChecked();
    expect(screen.getByLabelText('Allow Meta advertising measurement')).not.toBeChecked();
    expect(localStorage.getItem(TRACKING_STORAGE_KEY)).toBeNull();
    await user.click(screen.getByLabelText('Allow Google Analytics'));
    expect(localStorage.getItem(TRACKING_STORAGE_KEY)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(JSON.parse(localStorage.getItem(TRACKING_STORAGE_KEY)!)).toEqual({ version: 1, analytics: true, marketing: false });
    expect(screen.getByRole('status')).toHaveTextContent('saved for this browser');
});
