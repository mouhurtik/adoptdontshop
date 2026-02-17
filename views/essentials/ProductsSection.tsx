import { ShoppingBag, ExternalLink, Dog, Cat, Fish } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Product } from "./productsData";

interface ProductsSectionProps {
    products: Product[];
    activeTab: string;
    onTabChange: (value: string) => void;
}

const ProductsSection = ({ products, activeTab, onTabChange }: ProductsSectionProps) => {
    const filteredProducts = products.filter(product => product.petType === activeTab);

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <Tabs defaultValue="dog" className="w-full" onValueChange={onTabChange}>
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
                                                <PrimaryButton className="w-full justify-center group/btn">
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    View Details
                                                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                </PrimaryButton>
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
