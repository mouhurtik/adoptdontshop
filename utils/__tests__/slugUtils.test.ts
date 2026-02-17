import { describe, it, expect } from 'vitest';
import {
    slugify,
    getShortId,
    generatePetSlug,
    parseSlugId,
    getPetUrl,
} from '../slugUtils';

describe('slugUtils', () => {
    describe('slugify', () => {
        it('should convert text to lowercase', () => {
            expect(slugify('FLUFFY')).toBe('fluffy');
        });

        it('should replace spaces with hyphens', () => {
            expect(slugify('my cute pet')).toBe('my-cute-pet');
        });

        it('should remove special characters', () => {
            expect(slugify("Fluffy's Paw!")).toBe('fluffys-paw');
        });

        it('should handle multiple spaces and hyphens', () => {
            expect(slugify('my   cute---pet')).toBe('my-cute-pet');
        });

        it('should trim leading and trailing hyphens', () => {
            expect(slugify('--fluffy--')).toBe('fluffy');
        });

        it('should handle empty string', () => {
            expect(slugify('')).toBe('');
        });

        it('should handle underscores', () => {
            expect(slugify('my_cute_pet')).toBe('my-cute-pet');
        });
    });

    describe('getShortId', () => {
        it('should return first 8 characters of UUID', () => {
            expect(getShortId('2c57d18e-ef39-4c68-9f18-d442bc857a11')).toBe('2c57d18e');
        });

        it('should handle short IDs', () => {
            expect(getShortId('abc')).toBe('abc');
        });
    });

    describe('generatePetSlug', () => {
        it('should combine name and short ID', () => {
            expect(generatePetSlug('Fluffy', '2c57d18e-ef39-4c68-9f18-d442bc857a11')).toBe('fluffy-2c57d18e');
        });

        it('should handle names with special characters', () => {
            expect(generatePetSlug("Buddy's Friend!", 'abc12345-def')).toBe('buddys-friend-abc12345');
        });

        it('should handle multi-word names', () => {
            expect(generatePetSlug('Mr Whiskers', '12345678-abcd')).toBe('mr-whiskers-12345678');
        });

        it('should return just short ID if name produces empty slug', () => {
            expect(generatePetSlug('!!!', '12345678-abcd')).toBe('12345678');
        });
    });

    describe('parseSlugId', () => {
        it('should extract short ID from simple slug', () => {
            expect(parseSlugId('fluffy-2c57d18e')).toBe('2c57d18e');
        });

        it('should extract short ID from multi-word slug', () => {
            expect(parseSlugId('my-cute-pet-2c57d18e')).toBe('2c57d18e');
        });

        it('should return entire slug if no hyphen present', () => {
            expect(parseSlugId('2c57d18e')).toBe('2c57d18e');
        });

        it('should return entire slug if last segment is not a valid UUID prefix', () => {
            expect(parseSlugId('fluffy-cat')).toBe('fluffy-cat');
        });
    });

    describe('getPetUrl', () => {
        it('should generate full URL path', () => {
            expect(getPetUrl('Fluffy', '2c57d18e-ef39-4c68-9f18-d442bc857a11')).toBe('/pet/fluffy-2c57d18e');
        });
    });
});
