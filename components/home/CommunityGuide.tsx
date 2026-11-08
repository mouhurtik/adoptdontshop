import Link from 'next/link';

export default function CommunityGuide() {
    return (
        <section aria-labelledby="community-guide" className="mt-10 rounded-2xl border border-playful-text/10 bg-white p-6 text-sm leading-relaxed text-gray-600 lg:p-8">
            <h2 id="community-guide" className="mb-3 font-heading text-xl font-bold text-playful-text">How can you use AdoptDontShop?</h2>
            <p>Find a rescue pet, meet people who care about animals, and share what you learn. Start with what you need today:</p>
            <ul className="my-4 list-disc space-y-2 pl-5">
                <li><Link href="/browse" className="font-medium text-playful-teal-text underline underline-offset-4">Browse pets for adoption</Link> and speak with the caregiver about the animal&apos;s needs.</li>
                <li><Link href="/explore" className="font-medium text-playful-teal-text underline underline-offset-4">Explore community stories</Link>, questions and experiences from other members.</li>
                <li><Link href="/help" className="font-medium text-playful-teal-text underline underline-offset-4">Read adoption and community FAQs</Link> before making a decision or sharing personal information.</li>
            </ul>
            <h2 className="mb-2 mt-6 font-heading text-xl font-bold text-playful-text">Who is behind the community?</h2>
            <p><Link href="/about#founder" className="text-playful-teal-text underline underline-offset-4">Meet founder Mouhurtik Ray</Link> and learn why the platform was built. Community posts are written by the members named on each post. You can <Link href="/contact" className="text-playful-teal-text underline underline-offset-4">contact the team</Link> about a concern or read our <Link href="/privacy-policy" className="text-playful-teal-text underline underline-offset-4">privacy policy</Link>.</p>
        </section>
    );
}
