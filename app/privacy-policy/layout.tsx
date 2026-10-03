import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AdoptDontShop',
  description: 'Learn how AdoptDontShop collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
