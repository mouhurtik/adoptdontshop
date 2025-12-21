import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Heart, PawPrint } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

const PlayfulFooter = () => {
    return (
        <footer className="bg-gray-50 pt-16 pb-10 text-gray-600 mt-20 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 group inline-block">
                            <div className="bg-playful-teal text-white p-2 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300">
                                <PawPrint className="h-6 w-6 fill-current" />
                            </div>
                            <span className="text-3xl font-heading font-black tracking-tight text-gray-900">
                                Adopt<span className="text-playful-teal">Dont</span>Shop
                            </span>
                        </Link>
                        <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                            We are dedicated to connecting loving families with pets in need.
                            Every adoption saves a life and creates a new story of friendship.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-6 text-gray-900">Quick Links</h3>
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
                                        className="text-gray-600 hover:text-playful-teal hover:translate-x-2 transition-all inline-block font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-xl font-heading font-bold mb-6 text-gray-900">Connect</h3>
                        <div className="flex gap-4 mb-6">
                            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="bg-white p-3 rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-playful-teal transition-all duration-300 hover:-translate-y-1 ring-1 ring-gray-100"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                        <PrimaryButton variant="primary" size="sm" className="w-full justify-center">
                            Donate Now
                        </PrimaryButton>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
                    <p>&copy; {new Date().getFullYear()} AdoptDontShop. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="hover:text-playful-teal hover:underline transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-playful-teal hover:underline transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PlayfulFooter;



