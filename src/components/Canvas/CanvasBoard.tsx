"use client";

import { useState, useRef, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { motion, useAnimation } from "framer-motion";
import { updateNode, createNode, deleteNode } from "@/server/actions";
import { StickyNote, Type, Image as ImageIcon, Bot, Trash2, MoreHorizontal, Sparkles } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { toast } from "sonner";

interface CanvasBoardProps {
    initialNodes: any[];
    initialEdges: any[];
}

export function CanvasBoard({ initialNodes, initialEdges }: CanvasBoardProps) {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges]);

    const getEdgePath = (edge: any) => {
        const source = nodes.find(n => n.id === edge.sourceId);
        const target = nodes.find(n => n.id === edge.targetId);
        if (!source || !target) return "";

        const sPos = source.position ? JSON.parse(source.position) : { x: 0, y: 0 };
        const tPos = target.position ? JSON.parse(target.position) : { x: 0, y: 0 };
        // Center of the node roughly (assuming 280px width, ~150px height)
        const sx = sPos.x + 140;
        const sy = sPos.y + 75;
        const tx = tPos.x + 140;
        const ty = tPos.y + 75;

        // Cubic bezier for smooth curves
        return `M${sx},${sy} C${sx},${sy + 100} ${tx},${ty - 100} ${tx},${ty}`;
    };

    const updatePosition = async (id: string, x: number, y: number) => {
        await updateNode(id, { position: { x, y } });
    }

    const handleCreateNode = async (type: 'note' | 'task', position: { x: number, y: number }) => {
        const title = type === 'note' ? 'New Note' : 'New Task';
        const content = '';
        await createNode({
            type,
            title,
            content,
            position,
            properties: type === 'task' ? { status: 'todo' } : {}
        });

        toast.success("Node created");
        window.location.reload();
    };

    const handleDeleteNode = async (id: string) => {
        setNodes(nodes.filter(n => n.id !== id));
        await deleteNode(id);
        toast.success("Node deleted");
    }

    const handleUpdateContent = async (id: string, newContent: string) => {
        await updateNode(id, { content: newContent });
    }

    const handleUpdateTitle = async (id: string, newTitle: string) => {
        await updateNode(id, { title: newTitle });
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger className="w-full h-full block">
                <div
                    className="w-full h-full relative overflow-hidden bg-white/50 dark:bg-black/50"
                    ref={containerRef}
                    onMouseMove={(e) => {
                        if (containerRef.current) {
                            const rect = containerRef.current.getBoundingClientRect();
                            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                        }
                    }}
                >
                    {/* Premium Ambient Background */}
                    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
                        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                        <div className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-purple-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-pink-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
                    </div>

                    {/* Subtle Dot Grid */}
                    <div className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                            color: 'var(--foreground)'
                        }}
                    />

                    {/* Toolbar (Glass Panel) */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-panel p-2.5 rounded-2xl flex gap-3 z-50">
                        <ToolbarButton
                            onClick={() => handleCreateNode('note', { x: 300, y: 300 })}
                            icon={StickyNote}
                            label="Note"
                        />
                        <ToolbarButton
                            onClick={() => handleCreateNode('task', { x: 450, y: 300 })}
                            icon={Type}
                            label="Task"
                        />
                        <div className="w-px h-8 bg-border/50 self-center mx-1" />
                        <ToolbarButton
                            onClick={() => { }}
                            icon={ImageIcon}
                            label="Image"
                        />
                    </div>

                    {/* Canvas Content */}
                    <div className="w-full h-full relative z-10 p-10">
                        {/* Edges */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            <defs>
                                <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--border)" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="var(--border)" stopOpacity="0.4" />
                                </linearGradient>
                            </defs>
                            {edges.map(edge => (
                                <path
                                    key={edge.id}
                                    d={getEdgePath(edge)}
                                    stroke="url(#edge-gradient)"
                                    strokeWidth="2"
                                    fill="none"
                                    className="transition-all duration-300"
                                />
                            ))}
                        </svg>

                        {/* Nodes */}
                        {nodes.map((node) => {
                            const pos = node.position ? JSON.parse(node.position) : { x: 0, y: 0 };
                            return (
                                <DraggableNode
                                    key={node.id}
                                    node={node}
                                    initialPos={pos}
                                    onUpdatePos={(x, y) => updatePosition(node.id, x, y)}
                                    onDelete={() => handleDeleteNode(node.id)}
                                    onUpdateContent={(c) => handleUpdateContent(node.id, c)}
                                    onUpdateTitle={(t) => handleUpdateTitle(node.id, t)}
                                />
                            )
                        })}
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-64 glass-panel border-[var(--border-glass)]">
                <ContextMenuItem inset onClick={() => handleCreateNode('note', mousePos)} className="focus:bg-black/5 dark:focus:bg-white/10 cursor-pointer">
                    New Note <span className="ml-auto text-xs text-muted-foreground opacity-70">N</span>
                </ContextMenuItem>
                <ContextMenuItem inset onClick={() => handleCreateNode('task', mousePos)} className="focus:bg-black/5 dark:focus:bg-white/10 cursor-pointer">
                    New Task <span className="ml-auto text-xs text-muted-foreground opacity-70">T</span>
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-border/50" />
                <ContextMenuItem inset className="focus:bg-black/5 dark:focus:bg-white/10 cursor-pointer">
                    Paste <span className="ml-auto text-xs text-muted-foreground opacity-70">⌘V</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

function ToolbarButton({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label: string }) {
    return (
        <button onClick={onClick} className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all group relative">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="sr-only">{label}</span>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </div>
        </button>
    )
}

function DraggableNode({
    node,
    initialPos,
    onUpdatePos,
    onDelete,
    onUpdateContent,
    onUpdateTitle
}: {
    node: any,
    initialPos: { x: number, y: number },
    onUpdatePos: (x: number, y: number) => void,
    onDelete: () => void,
    onUpdateContent: (c: string) => void,
    onUpdateTitle: (t: string) => void
}) {
    const controls = useAnimation();
    const [aiLoading, setAiLoading] = useState(false);

    // We only drag if the user is NOT interacting with inputs
    const bind = useDrag(({ offset: [x, y], last, event }) => {
        // Prevent drag if target is an input/textarea
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea') return;

        controls.start({ x, y, transition: { duration: 0 } });
        if (last) {
            onUpdatePos(initialPos.x + x, initialPos.y + y);
        }
    }, { from: () => [0, 0], filterTaps: true });

    const isTask = node.type === 'task';

    const handleAIAction = async (action: 'summarize' | 'plan') => {
        setAiLoading(true);
        // ... (Keep existing AI logic if working, or mock for now)
        setTimeout(() => {
            setAiLoading(false);
            toast.success("AI Logic Placeholder");
        }, 1000);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <motion.div
                    {...(bind() as any)}
                    animate={controls}
                    style={{ left: initialPos.x, top: initialPos.y, position: 'absolute', touchAction: 'none' }}
                    className={`
                        w-[300px] min-h-[180px] rounded-[24px] cursor-grab active:cursor-grabbing group relative 
                        glass-card flex flex-col
                        ${isTask ? 'bg-white/60 dark:bg-[#1C1C1E]/60' : 'bg-white/40 dark:bg-[#1C1C1E]/40'}
                    `}
                >
                    {/* Header Strip with Controls */}
                    <div className="flex items-center justify-between p-4 pb-2 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2">
                            {isTask && (
                                <div className="w-5 h-5 rounded-md border-[1.5px] border-primary/50 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                                    {/* Checkbox logic here */}
                                </div>
                            )}
                            <div className={`p-1.5 rounded-lg ${isTask ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {isTask ? <Type className="w-3.5 h-3.5" /> : <StickyNote className="w-3.5 h-3.5" />}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button onClick={() => handleAIAction('summarize')} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="glass-panel">
                                    <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500 cursor-pointer">
                                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-5 pb-5 flex flex-col flex-1 gap-1.5">
                        <input
                            className="font-medium text-[16px] leading-tight text-foreground bg-transparent outline-none w-full placeholder:text-muted-foreground/40"
                            value={node.title}
                            onChange={(e) => onUpdateTitle(e.target.value)}
                            placeholder="Untitled"
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                        <textarea
                            className="bg-transparent text-[14px] leading-relaxed text-muted-foreground/90 resize-none outline-none w-full flex-1 placeholder:text-muted-foreground/30 mt-1 font-light"
                            value={node.content || ''}
                            onChange={(e) => onUpdateContent(e.target.value)}
                            placeholder="Type something..."
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </motion.div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56 glass-panel border-[var(--border-glass)]">
                <ContextMenuItem onClick={() => handleAIAction('summarize')} className="focus:bg-black/5 dark:focus:bg-white/10 cursor-pointer">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-500" /> Optimize with AI
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-border/50" />
                <ContextMenuItem className="text-red-500 focus:text-red-500 cursor-pointer focus:bg-red-500/10" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Layer
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

