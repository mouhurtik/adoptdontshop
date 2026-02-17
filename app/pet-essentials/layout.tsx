import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pet Essentials Guide | AdoptDontShop',
  description: 'Everything you need to know about caring for your new pet. Tips on food, health, grooming, and training.',
};

export default function PetEssentialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
