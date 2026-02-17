import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adoption Success Stories | AdoptDontShop',
  description: 'Read heartwarming stories from families who found their perfect pet through AdoptDontShop.',
};

export default function SuccessStoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
