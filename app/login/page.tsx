import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign In | AdoptDontShop',
  description: 'Sign in to your AdoptDontShop account to manage pet listings, messages, and adoptions.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-playful-cream">
        <div className="w-16 h-16 border-4 border-playful-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
