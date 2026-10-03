import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Pets for Adoption | AdoptDontShop',
  description: 'Find dogs, cats, and other pets looking for their forever home. Filter by type, breed, age, and location.',
  alternates: { canonical: '/browse' },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
