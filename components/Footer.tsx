import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, PawPrint, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-40 bg-playful-teal text-white">
            {/* Wave Separator */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -translate-y-[99%] z-10">
                <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-playful-teal"></path>
                </svg>
            </div>

            <div className="container mx-auto px-6 pt-12 pb-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section - Desktop: col-span-4 */}
                    <div className="md:col-span-5 lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="bg-white/10 p-2.5 rounded-2xl group-hover:rotate-6 transition-transform duration-300 border-2 border-white/20 backdrop-blur-sm">
                                <PawPrint className="h-8 w-8 text-playful-yellow fill-current" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-heading font-black tracking-tight leading-none text-white">
                                    Adopt<span className="text-playful-yellow">Dont</span>Shop
                                </span>
                                <span className="text-xs font-semibold tracking-widest uppercase opacity-80 pl-0.5">Find Your Best Friend</span>
                            </div>
                        </Link>
                        <p className="text-lg opacity-90 leading-relaxed max-w-sm font-medium">
                            Connecting loving families with pets in need. Every adoption creates a new story of unconditional love and friendship.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="bg-white/10 p-3 rounded-full hover:bg-playful-yellow hover:text-playful-teal transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* About Links */}
                    <div className="md:col-span-2 lg:col-span-2 md:col-start-7 lg:col-start-6">
                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                            About
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Our Story', path: '/about?tab=story' },
                                { name: 'Patrons', path: '/about?tab=patrons' },
                                { name: 'Pet Essentials', path: '/about?tab=store' },
                                { name: 'Contact', path: '/about?tab=story#contact' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="group flex items-center gap-2 text-white hover:text-playful-yellow transition-all font-medium"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-playful-yellow/50 group-hover:w-3 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                            Community
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Latest Posts', path: '/community' },
                                { name: 'Write a Post', path: '/community/write' },
                                { name: 'Messages', path: '/messages' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="group flex items-center gap-2 text-white hover:text-playful-yellow transition-all font-medium"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-playful-yellow/50 group-hover:w-3 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Browse Pets', path: '/browse' },
                                { name: 'List a Pet', path: '/list-pet' },
                                { name: 'Login', path: '/login' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.path}
                                        className="group flex items-center gap-2 text-white hover:text-playful-yellow transition-all font-medium"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-playful-yellow/50 group-hover:w-3 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80 font-medium">
                    <p>&copy; {new Date().getFullYear()} AdoptDontShop. Made with <Heart className="h-4 w-4 inline text-red-500 fill-current mx-0.5 animate-pulse" /> for pets.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-playful-yellow transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-playful-yellow transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
