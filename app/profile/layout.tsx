import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | AdoptDontShop',
  description: 'View and manage your AdoptDontShop profile, listings, and adoption applications.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
