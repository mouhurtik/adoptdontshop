import Link from 'next/link';
import { CONTACT_EMAIL, OFFICIAL_SOCIALS } from '@/lib/site';
import TrackingPreferences from '@/components/analytics/TrackingPreferences';
import SocialLogo from '@/components/SocialLogo';
import { Mail } from 'lucide-react';

export default function SiteFooter() {
    return (
        <footer className="border-t border-playful-text/10 bg-playful-cream px-4 py-8 text-sm text-gray-600 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="About and support">
                        {[['/about', 'About AdoptDontShop'], ['/help', 'Help & FAQs'], ['/contact', 'Contact'], ['/privacy-policy', 'Privacy policy'], ['/terms', 'Terms']].map(([href, label]) => (
                            <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-md hover:text-playful-teal-text focus-visible:outline focus-visible:outline-2">{label}</Link>
                        ))}
                    </nav>
                    <nav aria-label="Official social profiles" className="flex items-center gap-2">
                        {OFFICIAL_SOCIALS.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name} className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-playful-teal-text focus-visible:outline focus-visible:outline-2"><SocialLogo name={social.name} /></a>)}
                    </nav>
                </div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 w-fit items-center gap-2 break-all rounded-md hover:text-playful-teal-text focus-visible:outline focus-visible:outline-2"><Mail aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />{CONTACT_EMAIL}</a>
                <p className="max-w-2xl leading-relaxed">A community for adoption and everyday pet care. Member posts belong to their authors; publication does not imply verification or veterinary advice.</p>
                <TrackingPreferences />
            </div>
        </footer>
    );
}
