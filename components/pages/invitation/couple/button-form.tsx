import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface ButtonFormProps {
  isDisabled: boolean;
}

export default function ButtonForm({ isDisabled }: ButtonFormProps) {
  return (
    <div className="flex justify-end">
      <Button form="form-inv-couple" className="px-4! py-4.5!" type="submit" disabled={isDisabled}>
        {isDisabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </>
        ) : (
          <>
            <Save />
            Save
          </>
        )}
      </Button>
    </div>
  );
}
