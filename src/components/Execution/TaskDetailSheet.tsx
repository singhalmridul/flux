"use client";

import { FluxNode } from "@prisma/client";
import { ClientFluxNode } from "@/lib/types";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "./RichTextEditor";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label"; // Check if I have label, if not I might need to install it or use plain label

interface TaskDetailSheetProps {
    node: ClientFluxNode | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedNode: ClientFluxNode) => void;
    onDelete?: (nodeId: string) => void;
}

export function TaskDetailSheet({
    node,
    isOpen,
    onClose,
    onUpdate,
}: TaskDetailSheetProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("To Do");
    const [priority, setPriority] = useState("Medium");

    useEffect(() => {
        if (node) {
            setTitle(node.title);
            setContent(node.content || "");
            // @ts-ignore
            setStatus(node.properties?.status || "To Do");
            // @ts-ignore
            setPriority(node.properties?.priority || "Medium");
        }
    }, [node]);

    const handleSave = () => {
        if (!node) return;

        const updatedNode = {
            ...node,
            title,
            content,
            properties: {
                ...(node.properties as object),
                status,
                priority,
            },
            updatedAt: new Date(),
        };

        onUpdate(updatedNode);
        onClose(); // Optional: close on save or keep open
    };

    if (!node) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col gap-6 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Task Details</SheetTitle>
                    <SheetDescription>
                        View and edit the details of your task.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-semibold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="To Do">To Do</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
                        <label className="text-sm font-medium">Description</label>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            className="flex-1 min-h-[300px]"
                        />
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
