import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, PawPrint } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Browse Pets", path: "/browse" },
        { name: "Essentials", path: "/pet-essentials" },
        { name: "Stories", path: "/success-stories" },
        { name: "Patrons", path: "/sponsors" },
        { name: "About", path: "/about" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="w-[95%] md:w-[90%] mx-auto">
                {/* Navbar Island */}
                <div className={`rounded-[2rem] px-6 py-4 transition-all duration-300 ${scrolled || isOpen
                    ? 'bg-white/90 backdrop-blur-md border border-white/50 shadow-soft'
                    : 'bg-transparent'
                    }`}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-playful-coral text-white p-2 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                                <PawPrint className="h-6 w-6 fill-current" />
                            </div>
                            <span className="text-2xl font-heading font-black tracking-tight text-playful-text">
                                Adopt<span className="text-playful-coral">Dont</span>Shop
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <nav className="flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`relative font-bold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full hover:shadow-sm ${location.pathname === link.path
                                            ? 'bg-playful-yellow text-playful-text shadow-sm'
                                            : scrolled
                                                ? 'text-gray-600 hover:bg-playful-cream hover:text-playful-coral'
                                                : 'text-gray-700 hover:bg-white/80 hover:text-playful-coral'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Link to="/list-pet">
                                <PrimaryButton size="md" className="shadow-lg hover:shadow-xl">
                                    List a Pet
                                </PrimaryButton>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${isOpen
                                ? 'bg-playful-cream text-playful-coral'
                                : scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-700 bg-white/50 hover:bg-white'
                                }`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0"
                            }`}
                    >
                        <nav className="flex flex-col space-y-2 pb-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all duration-300 ${location.pathname === link.path
                                        ? 'bg-playful-cream text-playful-coral'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Mobile CTA Buttons */}
                            <div className="pt-4">
                                <Link to="/list-pet">
                                    <PrimaryButton className="w-full justify-center shadow-md">
                                        List a Pet
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;



