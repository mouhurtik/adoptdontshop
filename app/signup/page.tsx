import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Create Account | AdoptDontShop',
  description: 'Join AdoptDontShop to list pets for adoption, connect with shelters, and find your next furry companion.',
};

export default function SignupPage() {
  return <SignupForm />;
}
