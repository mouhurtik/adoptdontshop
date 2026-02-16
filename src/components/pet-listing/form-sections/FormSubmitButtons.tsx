import { PawPrint } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface FormActionProps {
  isSubmitting: boolean;
  isPage?: boolean;
  onCancel?: () => void;
}

const FormActions = ({ isSubmitting, isPage = false, onCancel }: FormActionProps) => {
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
