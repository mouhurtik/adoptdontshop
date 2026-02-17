import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | AdoptDontShop',
  description: 'Join AdoptDontShop to list pets for adoption and connect with loving families.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
