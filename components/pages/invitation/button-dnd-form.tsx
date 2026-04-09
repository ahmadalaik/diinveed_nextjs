"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save } from "lucide-react";

interface ButtonDndFormProps {
  onAddItem: () => void;
  isMaximum: boolean;
  addButtonText: string;
  formName: string;
  isDisabled: boolean;
}

export default function ButtonDndForm(props: ButtonDndFormProps) {
  const { onAddItem, isMaximum, addButtonText, formName, isDisabled } = props;

  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        type="button"
        variant="ghost"
        className="flex items-center justify-center gap-2 rounded-md border border-slate-400 border-dashed py-5 font-medium text-accent-foreground hover:border-slate-700 cursor-pointer"
        onClick={onAddItem}
        disabled={isMaximum || isDisabled}
      >
        <Plus />
        {addButtonText}
      </Button>

      <Button
        type="submit"
        form={formName}
        className="flex items-center gap-2 cursor-pointer px-4! py-5!"
        disabled={isDisabled}
      >
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
