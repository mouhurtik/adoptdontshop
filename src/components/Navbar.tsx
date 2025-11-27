import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, PawPrint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

const PlayfulNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
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
        { name: "Stories", path: "/success-stories" },
        { name: "Patrons", path: "/sponsors" },
        { name: "About", path: "/about" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 backdrop-blur-md shadow-soft py-2"
                : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-playful-coral text-white p-2 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300">
                            <PawPrint className="h-6 w-6 fill-current" />
                        </div>
                        <span className="text-2xl font-heading font-black text-playful-text tracking-tight">
                            Adopt<span className="text-playful-coral">Dont</span>Shop
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-full font-bold transition-all duration-200 ${location.pathname === link.path
                                    ? "bg-playful-yellow text-playful-text shadow-sm"
                                    : "text-gray-600 hover:bg-playful-cream hover:text-playful-coral"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/list-pet" className="ml-4">
                            <PrimaryButton size="md" variant="secondary">
                                List a Pet
                            </PrimaryButton>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-playful-text"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-lg font-bold p-3 rounded-xl border-2 transition-all ${location.pathname === link.path
                                        ? "bg-playful-yellow text-playful-text border-playful-yellow shadow-sm"
                                        : "text-gray-600 border-transparent hover:bg-playful-cream hover:text-playful-coral hover:border-playful-coral/20"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link to="/list-pet" className="mt-2">
                                <PrimaryButton className="w-full justify-center">
                                    List a Pet
                                </PrimaryButton>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default PlayfulNavbar;



