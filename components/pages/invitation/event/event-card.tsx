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
import { EventsFormType } from "@/schemas/invitation/event.schema";
import { cn } from "@/lib/utils";
import { TimePicker } from "./time-picker";

interface EventCardProps {
  index: number;
  dragListeners?: SyntheticListenerMap | undefined;
  onDelete: () => void;
  isDragging: boolean;
}

export function EventCard(props: EventCardProps) {
  const { index, dragListeners, onDelete, isDragging } = props;

  const form = useFormContext<EventsFormType>();

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
              <GripVertical className="w-5 h-5" />
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
      <CardContent className="space-y-4">
        <FieldGroup className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Event Name */}
          <Controller
            name={`events.${index}.title`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-4">
                <FieldLabel>Event Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Event Name"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Date */}
          <Controller
            name={`events.${index}.date`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      aria-invalid={fieldState.invalid}
                      type="button"
                      variant="outline"
                      data-empty={!field.value}
                      className="justify-between font-normal data-[empty=true]:text-muted-foreground"
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
                      defaultMonth={field.value ? new Date(field.value) : new Date()}
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

          {/* Start Time */}
          <Controller
            name={`events.${index}.startTime`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-1">
                <FieldLabel>Start Time</FieldLabel>
                <TimePicker
                  value={field.value}
                  invalid={fieldState.invalid}
                  onChange={field.onChange}
                  isSubmitting={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* End Time */}
          <Controller
            name={`events.${index}.endTime`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-1">
                <FieldLabel>End Time</FieldLabel>
                <TimePicker
                  value={field.value}
                  invalid={fieldState.invalid}
                  onChange={field.onChange}
                  isSubmitting={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Ceremony Address */}
          <Controller
            name={`events.${index}.address`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-4">
                <FieldLabel>Address</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  rows={3}
                  placeholder="Jalan Raya Sukun No. 17, Kudus"
                  disabled={isSubmitting}
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
