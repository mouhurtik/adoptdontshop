import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Heart, PawPrint } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

const PlayfulFooter = () => {
    return (
        <footer className="relative bg-playful-teal pt-16 md:pt-20 pb-10 text-white mt-20">
            {/* Wavy Top Border */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -mt-1">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="fill-playful-cream" // Matches the body background
                    ></path>
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 group inline-block">
                            <div className="bg-white text-playful-teal p-2 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300">
                                <PawPrint className="h-6 w-6 fill-current" />
                            </div>
                            <span className="text-3xl font-heading font-black tracking-tight">
                                Adopt<span className="text-playful-yellow">Dont</span>Shop
                            </span>
                        </Link>
                        <p className="text-white/90 text-lg max-w-md leading-relaxed">
                            We are dedicated to connecting loving families with pets in need.
                            Every adoption saves a life and creates a new story of friendship.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-6 text-playful-yellow">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Browse Pets', path: '/browse' },
                                { name: 'Success Stories', path: '/success-stories' },
                                { name: 'Our Patrons', path: '/sponsors' },
                                { name: 'About Us', path: '/about' },
                                { name: 'List a Pet', path: '/list-pet' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-white/90 hover:text-white hover:translate-x-2 transition-transform inline-block font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-6 text-playful-yellow">Connect</h3>
                        <div className="flex gap-4 mb-6">
                            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="bg-white/10 p-3 rounded-full hover:bg-white hover:text-playful-teal transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                        <PrimaryButton variant="accent" size="sm" className="w-full justify-center">
                            Donate Now
                        </PrimaryButton>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80 font-medium">
                    <p>&copy; {new Date().getFullYear()} AdoptDontShop. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="hover:text-white hover:underline">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PlayfulFooter;



