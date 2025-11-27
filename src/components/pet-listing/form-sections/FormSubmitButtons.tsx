
import { Button } from "@/components/ui/button";

interface FormSubmitButtonsProps {
  isSubmitting: boolean;
  isPage?: boolean;
  onCancel?: () => void;
}

const FormSubmitButtons = ({ isSubmitting, isPage = false, onCancel }: FormSubmitButtonsProps) => {
  return (
    <div className={isPage ? "pt-4" : "flex justify-end space-x-2"}>
      {!isPage && onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button 
        type="submit" 
        className={`bg-adoptGreen hover:bg-adoptGreen-dark ${isPage ? "w-full" : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Listing'}
      </Button>
    </div>
  );
};

export default FormSubmitButtons;



