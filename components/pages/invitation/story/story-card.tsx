"use client";

import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Controller, useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StoriesFormType } from "@/schemas/invitation/story.schema";

type StoryCardProps = {
  index: number;
  onDelete: () => void;
  dragListeners?: SyntheticListenerMap | undefined;
  isDragging: boolean;
};

export function StoryCard(props: StoryCardProps) {
  const { index, onDelete, dragListeners, isDragging } = props;

  const form = useFormContext<StoriesFormType>();

  const {
    control,
    formState: { isSubmitting },
  } = form;

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Card className="relative border-muted">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              {...dragListeners}
              className={cn("text-muted-foreground", isDragging ? "cursor-grabbing" : "cursor-grab")}
              disabled={isSubmitting}
            >
              <GripVertical className="h-5 w-5" />
            </Button>
            <span className="text-sm">Drag to sort</span>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="cursor-pointer"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 ">
        <FieldGroup className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Story Date */}
          <Controller
            name={`stories.${index}.date`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                <FieldLabel className="text-sm">Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      aria-invalid={fieldState.invalid}
                      type="button"
                      variant="outline"
                      className="justify-between font-normal"
                      disabled={isSubmitting}
                    >
                      {field.value ? format(field.value, "PPP") : "Select date"}
                      <ChevronDown />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        field.onChange(date?.toISOString());
                      }}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Story Title */}
          <Controller
            name={`stories.${index}.title`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="md:col-span-3">
                <FieldLabel className="text-sm">Story Title</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Story Title"
                  disabled={isSubmitting}
                  className="text-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Story Description */}
          <Controller
            name={`stories.${index}.description`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="md:col-span-5">
                <FieldLabel className="text-sm">Description</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  rows={3}
                  placeholder="Description"
                  disabled={isSubmitting}
                  className="text-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
