export interface Pet {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Small Pet' | 'Bird';
  breed: string;
  age: string;
  location: string;
  image: string;
  description?: string;
  medical_info: string;
  urgent?: boolean;
  status?: string;
}

export const pets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    location: 'New York, NY',
    image: '/images/mock/max-golden-retriever.webp',
    description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He gets along well with other dogs and is great with children.',
    medical_info: 'Fully vaccinated, neutered, and microchipped',
    status: 'available',
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: '1 year',
    location: 'Los Angeles, CA',
    image: '/images/mock/luna-siamese.webp',
    description: 'Luna is a sweet and curious Siamese cat who loves to explore. She enjoys playing with toys and lounging in sunny spots. Luna is still young and playful.',
    medical_info: 'First round of vaccinations complete, not spayed yet',
    urgent: true,
    status: 'urgent',
  },
  {
    id: '3',
    name: 'Charlie',
    type: 'Dog',
    breed: 'Beagle',
    age: '3 years',
    location: 'Chicago, IL',
    image: '/images/mock/charlie-beagle.webp',
    description: 'Charlie is a friendly beagle with a great nose for adventure. He loves to explore and sniff around. Very affectionate and good with families.',
    medical_info: 'Fully vaccinated, neutered',
  },
  {
    id: '4',
    name: 'Bella',
    type: 'Cat',
    breed: 'Maine Coon',
    age: '4 years',
    location: 'Houston, TX',
    image: '/images/mock/bella-maine-coon.webp',
    description: 'Bella is a gorgeous Maine Coon with a gentle personality. She enjoys being petted and will often follow you around the house.',
    medical_info: 'Fully vaccinated, spayed, and microchipped',
  },
  {
    id: '5',
    name: 'Rocky',
    type: 'Dog',
    breed: 'Border Collie Mix',
    age: '1 year',
    location: 'Denver, CO',
    image: '/images/mock/rocky-border-collie.webp',
    description: 'Rocky is an intelligent and energetic Border Collie mix who needs lots of mental and physical stimulation. He would thrive in an active household.',
    medical_info: 'Fully vaccinated, neutered',
  },
  {
    id: '6',
    name: 'Milo',
    type: 'Small Pet',
    breed: 'Dwarf Rabbit',
    age: '8 months',
    location: 'Portland, OR',
    image: '/images/mock/milo-rabbit.webp',
    description: 'Milo is a sweet dwarf rabbit who loves fresh vegetables and gentle petting. He\'s litter trained and would make a great indoor pet.',
    medical_info: 'Neutered, health check completed',
  },
  {
    id: '7',
    name: 'Daisy',
    type: 'Bird',
    breed: 'Cockatiel',
    age: '2 years',
    location: 'Seattle, WA',
    image: '/images/mock/daisy-cockatiel.webp',
    description: 'Daisy is a friendly cockatiel who loves to whistle and interact with people. She enjoys being out of her cage for supervised playtime.',
    medical_info: 'Vet checked, healthy',
  },
  {
    id: '8',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Labrador Retriever',
    age: '5 years',
    location: 'Miami, FL',
    image: '/images/mock/buddy-labrador.webp',
    description: 'Buddy is a well-trained and calm Labrador who loves swimming and playing fetch. He\'s great with children and other pets.',
    medical_info: 'Fully vaccinated, neutered, and microchipped',
  }
];

export const getFilteredPets = (
  query?: string,
  type?: string,
  urgentOnly?: boolean | string
): Pet[] => {
  let filtered = [...pets];

  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(pet =>
      pet.name.toLowerCase().includes(lowercaseQuery) ||
      pet.breed.toLowerCase().includes(lowercaseQuery) ||
      pet.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  if (type) {
    filtered = filtered.filter(pet => pet.type === type);
  }

  if (urgentOnly === true) {
    filtered = filtered.filter(pet => pet.urgent === true);
  }

  return filtered;
};

export const getPet = (id: string): Pet | undefined => {
  return pets.find(pet => pet.id === id);
};
