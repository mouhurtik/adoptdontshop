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
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1618189063538-57c36e03d21a?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1547565083-b548d9ad2a2d?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1591382386627-349b692688ff?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1562221440-d93d16c76232?auto=format&fit=crop&w=600&q=80',
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
