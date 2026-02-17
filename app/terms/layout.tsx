import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AdoptDontShop',
  description: 'Read the terms and conditions for using the AdoptDontShop platform.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
