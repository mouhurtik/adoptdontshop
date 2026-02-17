/**
 * URL slug utilities for generating clean, human-readable pet URLs
 * 
 * Strategy: Combine slugified pet name with short UUID prefix
 * Example: "Fluffy's Paw" + "2c57d18e-ef39-4c68-9f18-d442bc857a11" -> "fluffys-paw-2c57d18e"
 */

/**
 * Convert text to URL-safe slug format
 * - Converts to lowercase
 * - Replaces spaces and special chars with hyphens
 * - Removes consecutive hyphens
 * - Trims leading/trailing hyphens
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Trim hyphens from start and end
};

/**
 * Extract the short UUID (first 8 characters) from a full UUID
 */
export const getShortId = (uuid: string): string => {
  return uuid.slice(0, 8);
};

/**
 * Generate a clean URL slug for a pet
 * Combines slugified name with short UUID to ensure uniqueness
 * 
 * @param name - Pet name (e.g., "Fluffy")
 * @param id - Full UUID of the pet
 * @returns URL-safe slug (e.g., "fluffy-2c57d18e")
 */
export const generatePetSlug = (name: string, id: string): string => {
  const nameSlug = slugify(name);
  const shortId = getShortId(id);

  // If name produces empty slug, just use the short ID
  if (!nameSlug) {
    return shortId;
  }

  return `${nameSlug}-${shortId}`;
};

/**
 * Parse slug to extract the short UUID for database lookup
 * The short ID is always the last segment after the final hyphen
 * 
 * @param slug - URL slug (e.g., "fluffy-2c57d18e" or "my-cute-pet-2c57d18e")
 * @returns Short UUID prefix (e.g., "2c57d18e")
 */
export const parseSlugId = (slug: string): string => {
  // The short ID is the last 8 characters after the final hyphen
  const lastHyphenIndex = slug.lastIndexOf('-');

  if (lastHyphenIndex === -1) {
    // No hyphen found, assume the entire slug is the ID
    return slug;
  }

  const potentialId = slug.slice(lastHyphenIndex + 1);

  // Validate it looks like a UUID prefix (8 hex characters)
  if (/^[a-f0-9]{8}$/i.test(potentialId)) {
    return potentialId;
  }

  // If last segment doesn't look like a UUID prefix, return the whole slug
  // This is a fallback for edge cases
  return slug;
};

/**
 * Parse slug to extract the pet name portion
 * 
 * @param slug - URL slug (e.g., "fluffy-2c57d18e" or "my-cute-pet-2c57d18e")
 * @returns Pet name portion (e.g., "fluffy" or "my-cute-pet")
 */
export const parseSlugName = (slug: string): string => {
  const lastHyphenIndex = slug.lastIndexOf('-');

  if (lastHyphenIndex === -1) {
    // No hyphen found, return empty string
    return '';
  }

  const potentialId = slug.slice(lastHyphenIndex + 1);

  // If last segment looks like a UUID prefix, return everything before it
  if (/^[a-f0-9]{8}$/i.test(potentialId)) {
    return slug.slice(0, lastHyphenIndex);
  }

  // If last segment doesn't look like a UUID prefix, return the whole slug
  return slug;
};

/**
 * Build the full pet details URL path
 */
export const getPetUrl = (name: string, id: string): string => {
  return `/pet/${generatePetSlug(name, id)}`;
};
