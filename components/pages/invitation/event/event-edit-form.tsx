"use client";

import { eventsFormSchema, EventsFormType } from "@/schemas/invitation/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, Path, useFieldArray, useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { SortableEventItem } from "./sortable-event-item";
import { adjustTimeToDate } from "@/lib/date";
import { updateEventAction } from "@/app/actions/invitation/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ButtonDndForm from "../button-dnd-form";

const MAX_EVENTS = 3;

export default function EventEditForm({ events }: EventsFormType) {
  const router = useRouter();

  const form = useForm<EventsFormType>({
    resolver: zodResolver(eventsFormSchema),
    values: { events },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const { fields, append, remove, move } = useFieldArray({
    name: "events",
    control,
  });

  const addEvent = () => {
    if (fields.length >= MAX_EVENTS) return;

    append({
      id: nanoid(),
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      address: "",
      order: fields.length,
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    move(oldIndex, newIndex);
  };

  const deleteEvent = (index: number) => {
    if (fields.length === 1) return;

    remove(index);
  };

  const onSubmit = async (data: EventsFormType) => {
    console.log("data: ", data);
    const adjustedData = {
      events: data.events.map((event, index) => ({
        ...event,
        startTime: adjustTimeToDate(event.date, event.startTime),
        endTime: adjustTimeToDate(event.date, event.endTime),
        order: index,
      })),
    };

    const result = await updateEventAction(adjustedData);

    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((err) => {
        if (err._form) {
          const errorMessage = err._form?.[0];

          setError("root", { message: errorMessage });
          toast.error(errorMessage);
        } else if (typeof err.index === "number") {
          const { index, ...fields } = err;

          (Object.keys(fields) as (keyof typeof fields)[]).forEach((fieldName) => {
            const messages = fields[fieldName];
            if (messages && messages.length > 0) {
              const fullPath = `events.${index}.${String(fieldName)}` as Path<EventsFormType>;
              setError(fullPath, {
                message: messages[0],
              });
            }
          });
        }
      });
      return;
    }

    // Handle success response
    if (result.success) {
      toast.success("Couple information created successfully!");
      router.push("/dashboard/invitation");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FormProvider {...form}>
        <form id="form-inv-event" onSubmit={handleSubmit(onSubmit)}>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={fields.map((f) => f.id)}>
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <SortableEventItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    onDelete={() => deleteEvent(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </form>
      </FormProvider>

      <ButtonDndForm
        onAddItem={addEvent}
        addButtonText="Add New Event"
        formName="form-inv-event"
        isMaximum={fields.length >= MAX_EVENTS}
        isDisabled={isSubmitting}
      />

      {/* debug */}
      {/* <Button
        type="button"
        onClick={async () => {
          const isValid = await form.trigger();
          console.log("Form isValid:", isValid);
          console.log("Form errors:", form.formState.errors);
          if (isValid) {
            form.handleSubmit(onSubmit)();
          }
        }}
      >
        Debug Submit
      </Button> */}
    </div>
  );
}
