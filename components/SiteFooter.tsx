import Link from 'next/link';
import { Mail, PawPrint } from 'lucide-react';
import { CONTACT_EMAIL, OFFICIAL_SOCIALS } from '@/lib/site';
import SocialLogo from '@/components/SocialLogo';

export default function SiteFooter() {
    return (
        <footer className="border-t border-gray-200/70 bg-white/50 px-5 py-8 text-sm text-gray-600 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-[1.5fr_1fr_1fr] sm:gap-10">
                    <div className="col-span-2 sm:col-span-1">
                        <Link href="/" aria-label="AdoptDontShop home" className="inline-flex min-h-11 items-center gap-2.5 rounded-lg text-playful-text">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-playful-coral-text text-white"><PawPrint aria-hidden="true" className="h-5 w-5" /></span>
                            <span className="font-heading text-lg font-bold">Adopt<span className="text-playful-coral-text">Dont</span>Shop</span>
                        </Link>
                        <p className="mt-3 max-w-xs leading-relaxed">A little care. A lasting connection. A community for pets and the people who love them.</p>
                        <nav aria-label="Official social profiles" className="mt-4 flex items-center gap-1">
                            {OFFICIAL_SOCIALS.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2"><SocialLogo name={social.name} /></a>)}
                        </nav>
                    </div>
                    {[
                        { title: 'Community', links: [['/browse', 'Find a pet'], ['/explore', 'Explore stories'], ['/store', 'Shop for pets']] },
                        { title: 'Here to help', links: [['/about', 'About us'], ['/help', 'Help & FAQs'], ['/contact', 'Contact']] },
                    ].map(group => <nav key={group.title} aria-label={group.title}>
                        <h2 className="mb-2 font-heading font-semibold text-playful-text">{group.title}</h2>
                        <ul>{group.links.map(([href, label]) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center rounded-md hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2">{label}</Link></li>)}</ul>
                    </nav>)}
                </div>
                <div className="mt-7 flex flex-col gap-3 border-t border-gray-200/70 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 w-fit items-center gap-2 break-all rounded-md hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2"><Mail aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />{CONTACT_EMAIL}</a>
                    <nav aria-label="Legal and privacy" className="flex flex-wrap gap-x-6">
                        <Link href="/privacy-policy#tracking-preferences" className="inline-flex min-h-11 items-center rounded-md hover:text-playful-coral-text">Privacy & preferences</Link>
                        <Link href="/terms" className="inline-flex min-h-11 items-center rounded-md hover:text-playful-coral-text">Terms</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
