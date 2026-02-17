import { Upload, X } from "lucide-react";

interface PhotoUploadSectionProps {
    previewUrl: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

const PhotoUploadSection = ({ previewUrl, onFileChange, onRemoveImage }: PhotoUploadSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-playful-coral/30 pb-2">
                <div className="bg-playful-coral/20 p-2 rounded-full text-playful-coral">
                    <Upload className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-heading font-bold text-playful-text">Pet Photo</h3>
            </div>

            {!previewUrl ? (
                <div className="border-4 border-dashed border-gray-200 rounded-[2rem] p-8 text-center hover:border-playful-coral/50 transition-colors bg-gray-50">
                    <div className="bg-white p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full shadow-soft text-playful-coral">
                        <Upload className="h-10 w-10" />
                    </div>
                    <p className="text-lg font-bold text-gray-700 mb-2">
                        Upload a clear photo
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                        High-quality photos help pets get adopted faster!
                    </p>
                    <label className="inline-block cursor-pointer">
                        <span className="bg-playful-coral hover:bg-playful-coral/90 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-playful-coral/20 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Choose Photo
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="hidden"
                            required
                        />
                    </label>
                </div>
            ) : (
                <div className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                    <img
                        src={previewUrl}
                        alt="Pet preview"
                        className="w-full h-64 object-cover"
                    />
                    <button
                        type="button"
                        onClick={onRemoveImage}
                        className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white text-center font-bold">
                        Looking good! 📸
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoUploadSection;
