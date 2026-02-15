import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    onPreview?: () => void;
    isSelected?: boolean;
    onSelect?: (selected: boolean) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
    id,
    children,
    onEdit,
    onDelete,
    onPreview,
    isSelected,
    onSelect,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg border p-4 mb-3 shadow-sm transition-all ${isDragging
                    ? 'shadow-xl border-brand-400 rotate-2'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isSelected ? 'ring-2 ring-brand-500 border-brand-500' : ''}`}
            layout
        >
            <div className="flex items-center gap-4">
                {/* Checkbox for bulk operations */}
                {onSelect && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelect(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                )}

                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-2 hover:bg-slate-100 rounded-lg cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                >
                    <GripVertical size={20} />
                </button>

                {/* Content */}
                <div className="flex-1">{children}</div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {onPreview && (
                        <button
                            onClick={onPreview}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Предпросмотр"
                        >
                            <Eye size={18} />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Редактировать"
                        >
                            <Edit size={18} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

interface SortableListProps<T> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    getItemId: (item: T) => string;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onPreview?: (item: T) => void;
    selectedIds?: string[];
    onSelect?: (id: string, selected: boolean) => void;
    onSelectAll?: (selected: boolean) => void;
}

export function SortableList<T>({
    items,
    onReorder,
    renderItem,
    getItemId,
    onEdit,
    onDelete,
    onPreview,
    selectedIds = [],
    onSelect,
    onSelectAll,
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
            const newIndex = items.findIndex((item) => getItemId(item) === over.id);
            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    };

    const allSelected = items.length > 0 && items.every((item) =>
        selectedIds.includes(getItemId(item))
    );

    return (
        <div className="space-y-4">
            {/* Bulk Actions Header */}
            {onSelect && items.length > 0 && (
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => onSelectAll?.(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-slate-600">
                        {selectedIds.length > 0
                            ? `Выбрано: ${selectedIds.length}`
                            : 'Выбрать все'}
                    </span>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(getItemId)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <SortableItem
                                key={getItemId(item)}
                                id={getItemId(item)}
                                onEdit={onEdit ? () => onEdit(item) : undefined}
                                onDelete={onDelete ? () => onDelete(item) : undefined}
                                onPreview={onPreview ? () => onPreview(item) : undefined}
                                isSelected={selectedIds.includes(getItemId(item))}
                                onSelect={onSelect ? (selected) => onSelect(getItemId(item), selected) : undefined}
                            >
                                {renderItem(item, index)}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {items.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    Нет элементов для отображения
                </div>
            )}
        </div>
    );
}
