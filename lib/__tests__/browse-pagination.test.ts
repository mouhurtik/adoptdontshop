import { describe, expect, it } from 'vitest';
import { getBrowsePageHref, parseBrowsePage } from '@/lib/browse-pagination';

describe('browse pagination routes', () => {
    it('uses the root route for page one and path segments for later pages', () => {
        expect(getBrowsePageHref(1)).toBe('/browse');
        expect(getBrowsePageHref(2)).toBe('/browse/page/2');
        expect(getBrowsePageHref(12)).toBe('/browse/page/12');
    });

    it('rejects invalid page segments', () => {
        expect(parseBrowsePage('1')).toBe(1);
        expect(parseBrowsePage('08')).toBeNull();
        expect(parseBrowsePage('0')).toBeNull();
        expect(parseBrowsePage('-1')).toBeNull();
        expect(parseBrowsePage('not-a-page')).toBeNull();
    });
});
