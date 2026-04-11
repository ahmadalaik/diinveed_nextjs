"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StoryCard } from "./story-card";
import { CSSProperties } from "react";

type Props = {
  id: string;
  index: number;
  onDelete: () => void;
};

export function SortableStoryItem({ id, ...props }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
    position: isDragging ? "relative" : "static",
    boxShadow: isDragging ? "0 10px 25px rgba(0,0,0,0.15)" : "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} suppressHydrationWarning className="rounded-2xl">
      <StoryCard {...props} dragListeners={listeners} isDragging={isDragging} />
    </div>
  );
}
