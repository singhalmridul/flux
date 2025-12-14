"use client";

import React, { useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ClientFluxNode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
    data: ClientFluxNode[];
    onUpdate: (nodeId: string, newStatus: string) => void;
    onSelect: (node: ClientFluxNode) => void;
}

const COLUMNS = ["To Do", "In Progress", "Done"];

interface SortableItemProps {
    id: string;
    node: ClientFluxNode;
    onSelect: (node: ClientFluxNode) => void;
}

function SortableItem({ id, node, onSelect }: SortableItemProps) {
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
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onSelect(node)}
            className={cn(
                "bg-card border border-border/40 p-3 rounded-md shadow-sm mb-2 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors",
                isDragging && "opacity-50"
            )}
        >
            <h3 className="font-medium text-sm">{node.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {/* Simple preview of content if needed, stripped of HTML */}
                {node.content?.replace(/<[^>]*>?/gm, "")}
            </p>
        </div>
    );
}

function DroppableColumn({
    id,
    items,
    onSelect,
}: {
    id: string;
    items: ClientFluxNode[];
    onSelect: (node: ClientFluxNode) => void;
}) {
    const { setNodeRef } = useSortable({
        id: id,
        data: {
            type: "Column",
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 min-w-[250px] bg-muted/20 rounded-lg p-4 flex flex-col h-full"
        >
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                {id}
                <span className="bg-muted text-xs py-0.5 px-2 rounded-full text-foreground">
                    {items.length}
                </span>
            </h2>
            <SortableContext
                items={items.map((n) => n.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 overflow-y-auto">
                    {items.map((node) => (
                        <SortableItem key={node.id} id={node.id} node={node} onSelect={onSelect} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

export function KanbanBoard({ data, onUpdate, onSelect }: KanbanBoardProps) {
    const [activeId, setActiveId] = React.useState<string | null>(null);

    // Group items by status
    const columns = useMemo(() => {
        const cols: Record<string, ClientFluxNode[]> = {
            "To Do": [],
            "In Progress": [],
            "Done": [],
        };

        data.forEach((node) => {
            // @ts-ignore - Assuming properties has status
            const status = node.properties?.status || "To Do";
            if (cols[status]) {
                cols[status].push(node);
            } else {
                // Fallback for unknown status
                cols["To Do"].push(node);
            }
        });
        return cols;
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        // Logic for rearranging items locally would go here if we were managing local state fully 
        // but for now we rely on onUpdate to persist changes
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeNodeId = active.id as string;
        const overId = over.id as string;

        // Find the container (column) of the over item
        let newStatus = overId;

        // If overId is a node, find its status
        if (!COLUMNS.includes(overId)) {
            const overNode = data.find(n => n.id === overId);
            // @ts-ignore
            newStatus = overNode?.properties?.status || "To Do";
        }

        if (COLUMNS.includes(newStatus)) {
            // @ts-ignore
            const currentStatus = data.find(n => n.id === activeNodeId)?.properties?.status || "To Do";

            if (currentStatus !== newStatus) {
                onUpdate(activeNodeId, newStatus);
            }
        }

        setActiveId(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-4 p-4 overflow-x-auto">
                {COLUMNS.map((colId) => (
                    <DroppableColumn key={colId} id={colId} items={columns[colId]} onSelect={onSelect} />
                ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeId ? (
                    <div className="bg-card border border-border/40 p-3 rounded-md shadow-xl cursor-grabbing opacity-90 rotate-2">
                        <h3 className="font-medium text-sm">
                            {data.find(n => n.id === activeId)?.title}
                        </h3>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
