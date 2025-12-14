"use client";

import { useState, useMemo } from "react";
import { FluxNode } from "@prisma/client";
import { ClientFluxNode } from "@/lib/types";
import { TableView } from "@/components/Execution/TableView";
import { KanbanBoard } from "@/components/Execution/KanbanBoard";
import { Button } from "@/components/ui/button";
import { LayoutList, Kanban, Plus } from "lucide-react";
import { updateNode, createNode } from "@/server/actions";
import { useRouter } from "next/navigation";

import { TaskDetailSheet } from "@/components/Execution/TaskDetailSheet";

interface ExecutionPageProps {
    initialNodes: FluxNode[];
}

export default function ExecutionPage({ initialNodes }: ExecutionPageProps) {
    const [viewMode, setViewMode] = useState<"table" | "board">("table");

    const parsedInitialNodes = useMemo(() => {
        return initialNodes.map(node => ({
            ...node,
            properties: node.properties ? JSON.parse(node.properties as string) : {}
        })) as ClientFluxNode[];
    }, [initialNodes]);

    const [nodes, setNodes] = useState<ClientFluxNode[]>(parsedInitialNodes);
    const [selectedNode, setSelectedNode] = useState<ClientFluxNode | null>(null);
    const router = useRouter();

    const handleCreateTask = async () => {
        const newNodeRaw = await createNode({
            title: "New Task",
            type: "task",
            content: "<p>Description...</p>",
            parentId: undefined,
            properties: { status: "To Do", priority: "Medium" }
        });

        if (newNodeRaw) {
            const newNode: ClientFluxNode = {
                ...newNodeRaw,
                properties: newNodeRaw.properties ? JSON.parse(newNodeRaw.properties as string) : {}
            };
            setNodes((prev) => [...prev, newNode]);
            router.refresh();
        }
    };

    const handleUpdateStatus = async (nodeId: string, newStatus: string) => {
        // Optimistic update
        setNodes((prev) =>
            prev.map(node =>
                node.id === nodeId
                    ? { ...node, properties: { ...node.properties, status: newStatus } }
                    : node
            )
        );

        const nodeToUpdate = nodes.find(n => n.id === nodeId);
        const currentProps = nodeToUpdate?.properties || {};

        // Server update
        await updateNode(nodeId, {
            properties: {
                ...currentProps,
                status: newStatus
            }
        });
        router.refresh();
    };

    const handleUpdateNode = async (updatedNode: ClientFluxNode) => {
        // Optimistic Update
        setNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));

        // General update handler
        await updateNode(updatedNode.id, {
            title: updatedNode.title,
            content: updatedNode.content ?? undefined,
            properties: updatedNode.properties
        });
        router.refresh();
    }

    return (
        <div className="h-full flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Execution</h1>
                    <p className="text-muted-foreground">Manage tasks and workflows.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted/20 p-1 rounded-lg border border-border/40">
                        <Button
                            variant={viewMode === "table" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className="h-8"
                        >
                            <LayoutList className="w-4 h-4 mr-2" />
                            Table
                        </Button>
                        <Button
                            variant={viewMode === "board" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("board")}
                            className="h-8"
                        >
                            <Kanban className="w-4 h-4 mr-2" />
                            Board
                        </Button>
                    </div>
                    <Button onClick={handleCreateTask} size="sm" className="h-9">
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-background/40 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden shadow-sm">
                {viewMode === "table" ? (
                    <div className="p-4 h-full overflow-auto">
                        <TableView
                            data={nodes}
                            onUpdate={handleUpdateNode}
                            onSelect={setSelectedNode}
                        />
                    </div>
                ) : (
                    <div className="h-full bg-transparent">
                        <KanbanBoard
                            data={nodes}
                            onUpdate={handleUpdateStatus}
                            onSelect={setSelectedNode}
                        />
                    </div>
                )}
            </div>

            <TaskDetailSheet
                node={selectedNode}
                isOpen={!!selectedNode}
                onClose={() => setSelectedNode(null)}
                onUpdate={handleUpdateNode}
            />
        </div>
    );
}
