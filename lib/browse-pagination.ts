export const BROWSE_PAGE_SIZE = 8;

export function getBrowsePageHref(page: number): string {
    return page <= 1 ? '/browse' : `/browse/page/${page}`;
}

export function parseBrowsePage(segment: string): number | null {
    if (!/^[1-9]\d*$/.test(segment)) return null;

    const page = Number(segment);
    return Number.isSafeInteger(page) ? page : null;
}
