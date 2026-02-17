import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | AdoptDontShop',
  description: 'Sign in to your AdoptDontShop account to manage your pet listings and adoptions.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
