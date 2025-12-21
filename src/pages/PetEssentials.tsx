
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Shield, Check, ExternalLink, Dog, Cat, Fish } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock Data
const PRODUCTS = [
    {
        id: 1,
        name: "Premium Dog Food",
        category: "Food",
        petType: "dog",
        price: "$45.99",
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=2070&auto=format&fit=crop",
        description: "High-protein, grain-free formula for active dogs.",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Indestructible Chew Toy",
        category: "Toys",
        petType: "dog",
        price: "$15.99",
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop",
        description: "Durable rubber toy for aggressive chewers.",
        badge: "New"
    },
    {
        id: 3,
        name: "Orthopedic Dog Bed",
        category: "Accessories",
        petType: "dog",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=2574&auto=format&fit=crop",
        description: "Memory foam bed for joint support and comfort.",
    },
    {
        id: 4,
        name: "Gourmet Cat Treats",
        category: "Food",
        petType: "cat",
        price: "$12.99",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop",
        description: "Salmon infused treats that cats love.",
        badge: "Staff Pick"
    },
    {
        id: 5,
        name: "Interactive Laser Toy",
        category: "Toys",
        petType: "cat",
        price: "$24.99",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop",
        description: "Automatic laser toy to keep your cat entertained.",
    },
    {
        id: 6,
        name: "Modern Cat Tower",
        category: "Accessories",
        petType: "cat",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=2588&auto=format&fit=crop",
        description: "Stylish condensed wood cat tree.",
    },
    {
        id: 7,
        name: "Tropical Fish Flakes",
        category: "Food",
        petType: "other",
        price: "$9.99",
        image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=2069&auto=format&fit=crop",
        description: "Nutrient-rich food for vibrant community fish.",
    },
    {
        id: 8,
        name: "Hamster Wheel",
        category: "Toys",
        petType: "other",
        price: "$18.50",
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=2071&auto=format&fit=crop",
        description: "Silent spinner for small pets.",
    },
];

const PetEssentials = () => {
    const [activeTab, setActiveTab] = useState("dog");

    const filteredProducts = PRODUCTS.filter(product => product.petType === activeTab);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-playful-cream/30">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <Badge variant="secondary" className="mb-4 bg-playful-yellow text-playful-text hover:bg-playful-yellow/80">
                            Editor's Picks
                        </Badge>
                        <h1 className="text-3xl md:text-6xl font-heading font-black text-playful-text mb-6 leading-tight">
                            Pamper Your
                            <span className="relative inline-block ml-3 transform -rotate-2">
                                <span className="absolute inset-0 bg-playful-teal rounded-2xl transform rotate-2"></span>
                                <span className="relative text-white px-4 py-1">Best Friend</span>
                            </span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-8 font-heading">
                            Discover our curated selection of top-rated food, toys, and accessories.
                            Every purchase supports our shelter partners.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="dog" className="w-full" onValueChange={setActiveTab}>
                        <div className="flex justify-center mb-12">
                            <TabsList className="bg-playful-cream/50 p-1 rounded-full border border-gray-100">
                                <TabsTrigger value="dog" className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-playful-coral font-bold flex items-center gap-2">
                                    <Dog className="w-4 h-4" /> Dogs
                                </TabsTrigger>
                                <TabsTrigger value="cat" className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-playful-coral font-bold flex items-center gap-2">
                                    <Cat className="w-4 h-4" /> Cats
                                </TabsTrigger>
                                <TabsTrigger value="other" className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-playful-coral font-bold flex items-center gap-2">
                                    <Fish className="w-4 h-4" /> Others
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {["dog", "cat", "other"].map((type) => (
                            <TabsContent key={type} value={type} className="mt-0">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {filteredProducts.map((product) => (
                                        <Card key={product.id} className="group hover:shadow-soft transition-all duration-300 border-gray-100 overflow-hidden bg-white h-full flex flex-col">
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {product.badge && (
                                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-playful-text text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                        {product.badge}
                                                    </span>
                                                )}
                                                <span className="absolute top-4 right-4 bg-playful-coral/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-xl font-bold text-playful-text group-hover:text-playful-coral transition-colors">
                                                    {product.name}
                                                </CardTitle>
                                                <CardDescription className="text-gray-500 text-sm">
                                                    {product.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-auto">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-black text-playful-text">{product.price}</span>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <PrimaryButton className="w-full justify-center group/btn">
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    View Details
                                                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                </PrimaryButton>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </motion.div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Insurance Section */}
            <section className="py-20 bg-gray-50 text-playful-text relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-playful-coral/5 blur-3xl rounded-full translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-playful-yellow/10 blur-3xl rounded-full -translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-playful-coral font-bold text-sm mb-6 border border-playful-coral/20 shadow-sm">
                                <Shield className="w-4 h-4" />
                                Peace of Mind Protected
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-playful-text">
                                Protect Your Pet With <span className="text-playful-coral">Top-Rated</span> Insurance
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Unexpected vet bills shouldn't happen. Secure your pet's health with comprehensive coverage for accidents, illnesses, and routine care.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Up to 90% reimbursement on vet bills",
                                    "Coverage for accidents & illnesses",
                                    "24/7 Vet helpline included",
                                    "Fast claim processing"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-playful-coral/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-playful-coral" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <PrimaryButton variant="secondary" size="lg" className="bg-playful-text text-white hover:bg-playful-text/90 shadow-xl">
                                Get a Free Quote
                            </PrimaryButton>
                        </div>

                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10"
                            >
                                <Card className="bg-white border-gray-100 shadow-2xl p-2 overflow-hidden rotate-2 hover:rotate-0 transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop"
                                        alt="Happy Dog"
                                        className="rounded-xl w-full h-auto object-cover"
                                    />
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-xl font-bold text-playful-text">Standard Plan</h3>
                                            <span className="text-2xl font-black text-playful-teal">$25<span className="text-sm text-gray-400 font-normal">/mo</span></span>
                                        </div>
                                        <p className="text-gray-500 text-sm">Great for puppies and young pets.</p>
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-playful-coral/20 rounded-full opacity-50 blur-xl" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-playful-yellow/30 rounded-full opacity-50 blur-xl" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PetEssentials;
