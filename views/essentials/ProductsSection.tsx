import { ShoppingBag, ExternalLink, Dog, Cat } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Product } from "./productsData";
import { trackAffiliateClick } from '@/lib/tracking';

interface ProductsSectionProps {
    products: Product[];
    activeTab: string;
    onTabChange: (value: string) => void;
}

const ProductsSection = ({ products, activeTab, onTabChange }: ProductsSectionProps) => {
    const filteredProducts = products.filter(product => product.petType === activeTab);

    return (
        <section className="py-6 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-8 max-w-3xl text-center">
                    <h2 className="font-heading text-2xl font-bold text-playful-text">Everyday pet essentials</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">Product links are being updated. These categories can help you plan what your pet needs; recommendations will be linked once they are ready.</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">Any future paid links will be identified. Store visits and Amazon purchases do not earn PawCoins.</p>
                </div>
                <Tabs defaultValue="dog" className="w-full" onValueChange={onTabChange}>
                    <div className="flex justify-center mb-6 lg:mb-12">
                        <TabsList className="bg-playful-cream/50 p-1 rounded-full border border-gray-100 flex justify-center w-max">
                            <TabsTrigger value="dog" className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-playful-coral font-bold flex items-center gap-2">
                                <Dog className="w-4 h-4" /> Dogs
                            </TabsTrigger>
                            <TabsTrigger value="cat" className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-playful-coral font-bold flex items-center gap-2">
                                <Cat className="w-4 h-4" /> Cats
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {["dog", "cat"].map((type) => (
                        <TabsContent key={type} value={type} className="mt-0">
                            <ScrollReveal
                                mode="fade-in"
                                duration={0.3}
                                width="100%"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                                {product.affiliateLink ? (
                                                    <a href={product.affiliateLink} target="_blank" rel="sponsored noopener noreferrer" onClick={() => trackAffiliateClick(product.id, product.category)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-playful-coral px-5 py-3 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                                        <ShoppingBag aria-hidden="true" className="h-4 w-4" />View on Amazon <ExternalLink aria-hidden="true" className="h-3 w-3" />
                                                    </a>
                                                ) : (
                                                    <PrimaryButton className="w-full justify-center" disabled>Links being updated</PrimaryButton>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
};

export default ProductsSection;
