import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | AdoptDontShop',
  description: 'Learn about our mission to connect pets with loving families. Every pet deserves a forever home.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
