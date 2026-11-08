import EssentialsHero from "./essentials/EssentialsHero";
import CollectionBrowser from "./essentials/CollectionBrowser";
import InsuranceSection from "./essentials/InsuranceSection";

const PetEssentials = () => {

    return (
        <div className="min-h-screen bg-white">
            <EssentialsHero />
            <CollectionBrowser defaultPet="dog" />
            <InsuranceSection />
        </div>
    );
};

export default PetEssentials;
