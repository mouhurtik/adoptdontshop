import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import PawprintLoader from '@/components/ui/PawprintLoader';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign In | AdoptDontShop',
  description: 'Sign in to your AdoptDontShop account to manage pet listings, messages, and adoptions.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<PawprintLoader fullScreen size="lg" />}>
      <LoginForm />
    </Suspense>
  );
}
