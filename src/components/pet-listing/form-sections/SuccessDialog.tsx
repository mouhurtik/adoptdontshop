
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">Pet Listing Successful!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-adoptGreen" />
          </div>
          <p className="text-lg mb-6">Your pet listing has been submitted successfully and is now under review.</p>
          <Button 
            onClick={() => onOpenChange(false)} 
            className="bg-adoptGreen hover:bg-adoptGreen-dark"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;



