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
import { TrashBinIcon } from "../../icons";

interface SortableItemProps {
  id: string;
  imgUrl: string;
  onRemove: (id: string) => void;
}

function SortableItem({ id, imgUrl, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      <img
        src={imgUrl}
        className="h-full w-full object-cover pointer-events-none"
        alt="existing variant"
      />

      <div className={`absolute inset-0 bg-black/50 transition-opacity pointer-events-none ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(id); }}
        className={`absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:scale-110 hover:bg-red-600 ${isDragging ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <TrashBinIcon className="size-4 pointer-events-none" />
      </button>
    </div>
  );
}

interface SortableExistingImagesProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function SortableExistingImages({ images = [], onChange }: SortableExistingImagesProps) {
  // item ID will be the URL string itself since it's unique
  const items = images.map((img) => ({ id: img, imgUrl: img }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems.map(i => i.imgUrl));
    }
  };

  const handleRemove = (idToRemove: string) => {
    const newItems = items.filter(item => item.id !== idToRemove);
    onChange(newItems.map(i => i.imgUrl));
  };

  if (images.length === 0) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id} imgUrl={item.imgUrl} onRemove={handleRemove} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
