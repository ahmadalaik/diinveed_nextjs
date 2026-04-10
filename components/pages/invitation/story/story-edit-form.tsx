"use client";

import { updateStoryAction } from "@/app/actions/invitation/story";
import { storiesFormSchema, StoriesFormType } from "@/schemas/invitation/story.schema";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { FormProvider, Path, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SortableStoryItem } from "./sortable-story-item";
import ButtonDndForm from "../button-dnd-form";

const MAX_MILESTONES = 3;

export default function StoryEditForm({ stories }: StoriesFormType) {
  const router = useRouter();

  const form = useForm<StoriesFormType>({
    resolver: zodResolver(storiesFormSchema),
    values: { stories },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const { fields, append, remove, move } = useFieldArray({
    name: "stories",
    control,
  });

  const addStory = () => {
    if (fields.length >= MAX_MILESTONES) return;

    append({
      id: nanoid(),
      title: "",
      date: "",
      description: "",
      order: fields.length,
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((i) => i.id === active.id);
    const newIndex = fields.findIndex((i) => i.id === over.id);

    move(oldIndex, newIndex);
  };

  const deleteStory = (index: number) => {
    if (fields.length === 1) return;

    remove(index);
  };

  const onSubmit = async (data: StoriesFormType) => {
    console.log("data: ", data);

    const finalData = {
      stories: data.stories.map((story, index) => ({
        ...story,
        order: index,
      })),
    };

    console.log("submitting data..", finalData);

    const result = await updateStoryAction(finalData);

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
              const fullPath = `stories.${index}.${String(fieldName)}` as Path<StoriesFormType>;
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
      toast.success("Story information updated successfully!");
      router.push("/dashboard/invitation");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FormProvider {...form}>
        <form id="form-inv-story" onSubmit={handleSubmit(onSubmit)}>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <SortableStoryItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    onDelete={() => deleteStory(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </form>
      </FormProvider>

      <ButtonDndForm
        onAddItem={addStory}
        addButtonText="Add New Milestone"
        formName="form-inv-story"
        isMaximum={fields.length >= MAX_MILESTONES || isSubmitting}
        isDisabled={isSubmitting}
      />
    </div>
  );
}
