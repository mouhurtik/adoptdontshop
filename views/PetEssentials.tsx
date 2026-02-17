import { useState } from "react";
import EssentialsHero from "./essentials/EssentialsHero";
import ProductsSection from "./essentials/ProductsSection";
import InsuranceSection from "./essentials/InsuranceSection";
import { PRODUCTS } from "./essentials/productsData";

const PetEssentials = () => {
    const [activeTab, setActiveTab] = useState("dog");

    return (
        <div className="min-h-screen bg-white">
            <EssentialsHero />
            <ProductsSection
                products={PRODUCTS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <InsuranceSection />
        </div>
    );
};

export default PetEssentials;
