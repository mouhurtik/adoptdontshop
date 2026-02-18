import { PawPrint, LogIn } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Link from "next/link";

interface FormActionProps {
  isSubmitting: boolean;
  isPage?: boolean;
  isAuthenticated?: boolean;
  onCancel?: () => void;
}

const FormActions = ({ isSubmitting, isPage = false, isAuthenticated = true, onCancel }: FormActionProps) => {
  if (!isAuthenticated) {
    return (
      <div className="relative pt-4">
        <div className="bg-gradient-to-t from-white via-white/95 to-white/0 absolute -top-16 left-0 right-0 h-16 pointer-events-none" />
        <div className="bg-playful-teal/5 border-2 border-dashed border-playful-teal/30 rounded-2xl p-6 text-center">
          <LogIn className="w-8 h-8 text-playful-teal mx-auto mb-3" />
          <p className="font-heading font-bold text-playful-text text-lg mb-1">Almost there!</p>
          <p className="text-gray-500 text-sm mb-4">Sign in to submit your pet listing and help them find a forever home.</p>
          <Link href="/login?redirect=/list-pet">
            <PrimaryButton type="button" className="w-full sm:w-auto">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In to Submit
            </PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      {!isPage && onCancel && (
        <PrimaryButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </PrimaryButton>
      )}
      <PrimaryButton
        type="submit"
        disabled={isSubmitting}
        className={`flex-1 ${isPage ? 'w-full' : ''}`}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Submitting...
          </span>
        ) : (
          <>
            <PawPrint className="mr-2 h-5 w-5" />
            List Pet for Adoption
          </>
        )}
      </PrimaryButton>
    </div>
  );
};

export default FormActions;
