"use client"

import { useEffect, useState } from 'react';
import { Search, Command, Calendar, CheckSquare, Layout, PenTool, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Command Palette Store
interface CommandPaletteState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

interface CommandItem {
    icon: any;
    label: string;
    shortcut?: string;
    action: () => void;
}

export const CommandPalette = () => {
    const { isOpen, close, toggle } = useCommandPalette();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
            if (e.key === 'Escape') {
                close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle, close]);

    const navigationCommands: CommandItem[] = [
        { icon: Layout, label: 'Go to Dashboard', action: () => { router.push('/dashboard'); close(); } },
        { icon: CheckSquare, label: 'Go to Execution', action: () => { router.push('/execution'); close(); } },
        { icon: PenTool, label: 'Go to Ideation', action: () => { router.push('/ideation'); close(); } },
        { icon: Calendar, label: 'Go to Schedule', action: () => { router.push('/schedule'); close(); } },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[100]"
                        onClick={close}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101]"
                    >
                        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                            {/* Search Input */}
                            <div className="flex items-center px-4 h-14 border-b border-border/50">
                                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                                <input
                                    autoFocus
                                    placeholder="Type a command or search..."
                                    className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                        ESC
                                    </kbd>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[300px] overflow-y-auto p-2">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Navigation
                                </div>
                                {navigationCommands.map((cmd, i) => (
                                    <button
                                        key={i}
                                        onClick={cmd.action}
                                        className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group text-left"
                                    >
                                        <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center mr-3 group-hover:border-primary/20 transition-colors">
                                            <cmd.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                        <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                            {cmd.label}
                                        </span>
                                        {cmd.shortcut && (
                                            <span className="text-xs text-muted-foreground">{cmd.shortcut}</span>
                                        )}
                                    </button>
                                ))}

                                <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Coming Soon
                                </div>
                                <div className="px-3 py-8 text-center text-sm text-muted-foreground italic">
                                    AI Actions & Global Search coming in Gen 8...
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="h-10 bg-muted/30 border-t border-border/50 flex items-center justify-between px-4 text-xs text-muted-foreground">
                                <span>Flux Command</span>
                                <div className="flex gap-3">
                                    <span><span>↑↓</span> to navigate</span>
                                    <span><span>↵</span> to select</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
