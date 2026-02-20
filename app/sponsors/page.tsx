import { redirect } from 'next/navigation';

export default function SponsorsPage() {
    redirect('/about?tab=patrons');
}
