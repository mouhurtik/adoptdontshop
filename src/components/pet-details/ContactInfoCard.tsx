import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactInfoCardProps {
    petName?: string;
    petId?: string;
}

const ContactInfoCard = ({ petName, petId }: ContactInfoCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100 lg:w-96 flex-shrink-0 h-fit sticky top-24"
        >
            <h3 className="text-2xl font-heading font-bold text-playful-text mb-6">
                Contact Us
            </h3>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-playful-coral/10 p-3 rounded-full text-playful-coral">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Phone</p>
                        <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-playful-teal/10 p-3 rounded-full text-playful-teal">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Email</p>
                        <p className="text-gray-600">adopt@adoptdontshop.com</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-playful-yellow/20 p-3 rounded-full text-yellow-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Hours</p>
                        <p className="text-gray-600">Mon-Sat: 9am - 6pm</p>
                        <p className="text-gray-600">Sun: 10am - 4pm</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-playful-lavender/30 p-3 rounded-full text-purple-600">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Location</p>
                        <p className="text-gray-600">123 Puppy Lane</p>
                        <p className="text-gray-600">Pet City, PC 12345</p>
                    </div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 rounded-2xl overflow-hidden h-48 bg-gray-100 relative group">
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                    alt="Map location"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                    <div className="bg-white p-2 rounded-full shadow-lg">
                        <MapPin className="w-6 h-6 text-playful-coral" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactInfoCard;



