import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Sponsors | AdoptDontShop',
  description: 'Meet the generous sponsors and partners who help us connect pets with loving families.',
};

export default function SponsorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
