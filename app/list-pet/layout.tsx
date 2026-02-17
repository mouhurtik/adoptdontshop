import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List a Pet for Adoption | AdoptDontShop',
  description: 'Help a pet find their forever home. List your pet for adoption on AdoptDontShop — it\'s free and easy.',
};

export default function ListPetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
