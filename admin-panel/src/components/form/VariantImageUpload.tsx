import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrashBinIcon, PlusIcon } from "../../icons";

interface SortableItemProps {
  id: string;
  file: File;
  onRemove: (id: string) => void;
}

function SortableItem({ id, file, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative h-28 w-28 overflow-hidden rounded-2xl border ${isDragging ? 'border-brand-500 shadow-xl scale-105 z-10' : 'border-gray-100 dark:border-gray-800 shadow-sm hover:scale-105 transition-transform'} bg-gray-50 dark:bg-gray-800 touch-none cursor-grab active:cursor-grabbing`}
    >
      {preview && (
        <img
          src={preview}
          className="h-full w-full object-cover pointer-events-none"
          alt="variant"
        />
      )}

      {/* Visual dark overlay on hover */}
      <div className={`absolute inset-0 bg-black/50 transition-opacity pointer-events-none ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />

      {/* Top right delete button (Only this part intercepts clicks) */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag triggering on delete click
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(id); }}
        className={`absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:scale-110 hover:bg-red-600 ${isDragging ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <TrashBinIcon className="size-4 pointer-events-none" />
      </button>
    </div>
  );
}

interface VariantImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  currentTotal?: number;
}

export default function VariantImageUpload({
  value = [],
  onChange,
  maxFiles = 20,
  currentTotal = 0
}: VariantImageUploadProps) {

  // Create stable items with IDs
  const items = value.map(file => ({
    // Best effort unique ID. If two identical files are added at the exact same moment, 
    // it could clash, but this is extremely rare in drag & drop file upload.
    id: `${file.name}-${file.lastModified}-${file.size}`,
    file
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // require 5px movement before dragging starts
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems.map(i => i.file));
    }
  };

  const handleRemove = (idToRemove: string) => {
    const newItems = items.filter(item => item.id !== idToRemove);
    onChange(newItems.map(i => i.file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const allowedToAdd = maxFiles - currentTotal;

    if (allowedToAdd <= 0) return;

    let filesToAdd = selectedFiles;
    if (filesToAdd.length > allowedToAdd) {
      filesToAdd = filesToAdd.slice(0, allowedToAdd);
    }

    // Check if files are already in the array to prevent duplication
    const existingFileIds = new Set(items.map(i => i.id));
    const uniqueFilesToAdd = filesToAdd.filter(file => {
      const id = `${file.name}-${file.lastModified}-${file.size}`;
      return !existingFileIds.has(id);
    });

    onChange([...value, ...uniqueFilesToAdd]);
    e.target.value = '';
  };

  const currentCount = currentTotal;

  return (
    <div className="flex flex-wrap gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(i => i.id)}
          strategy={rectSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              file={item.file}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>

      {currentCount < maxFiles && (
        <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 text-gray-400 transition-all hover:border-brand-500 hover:bg-brand-50/10 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-800/50">
          <PlusIcon className="size-8" />
          <span className="mt-2 text-[10px] font-black uppercase tracking-tighter">Şəkil Əlavə Et</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
