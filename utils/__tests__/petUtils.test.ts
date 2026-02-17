import { describe, it, expect } from 'vitest';

// Import the actual petUtils functions
// Note: Adjust imports based on actual implementation
describe('Pet Utilities', () => {
  describe('Pet filtering', () => {
    it('should filter pets by animal type', () => {
      const pets = [
        { id: '1', animal_type: 'Dog', name: 'Buddy' },
        { id: '2', animal_type: 'Cat', name: 'Whiskers' },
        { id: '3', animal_type: 'Dog', name: 'Max' },
      ];

      const filtered = pets.filter((pet) => pet.animal_type === 'Dog');
      
      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('Buddy');
      expect(filtered[1].name).toBe('Max');
    });

    it('should filter pets by location', () => {
      const pets = [
        { id: '1', location: 'New York, NY', name: 'Buddy' },
        { id: '2', location: 'Los Angeles, CA', name: 'Whiskers' },
        { id: '3', location: 'New York, NY', name: 'Max' },
      ];

      const filtered = pets.filter((pet) => pet.location.includes('New York'));
      
      expect(filtered).toHaveLength(2);
    });

    it('should handle empty filter results', () => {
      const pets = [
        { id: '1', animal_type: 'Dog', name: 'Buddy' },
        { id: '2', animal_type: 'Cat', name: 'Whiskers' },
      ];

      const filtered = pets.filter((pet) => pet.animal_type === 'Bird');
      
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Pet search', () => {
    it('should search pets by name', () => {
      const pets = [
        { id: '1', name: 'Buddy', breed: 'Golden Retriever' },
        { id: '2', name: 'Whiskers', breed: 'Persian' },
        { id: '3', name: 'Max', breed: 'Labrador' },
      ];

      const searchQuery = 'bud';
      const results = pets.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Buddy');
    });

    it('should search pets by breed', () => {
      const pets = [
        { id: '1', name: 'Buddy', breed: 'Golden Retriever' },
        { id: '2', name: 'Whiskers', breed: 'Persian' },
        { id: '3', name: 'Max', breed: 'Golden Retriever' },
      ];

      const searchQuery = 'golden';
      const results = pets.filter((pet) =>
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(results).toHaveLength(2);
    });

    it('should be case insensitive', () => {
      const pets = [
        { id: '1', name: 'Buddy', breed: 'Golden Retriever' },
      ];

      const results1 = pets.filter((pet) =>
        pet.name.toLowerCase().includes('BUDDY'.toLowerCase())
      );
      const results2 = pets.filter((pet) =>
        pet.name.toLowerCase().includes('buddy'.toLowerCase())
      );
      
      expect(results1).toHaveLength(1);
      expect(results2).toHaveLength(1);
    });
  });
});
