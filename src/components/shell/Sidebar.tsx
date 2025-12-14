"use client"

import { LayoutDashboard, CheckSquare, PenTool, Calendar, ChevronLeft, ChevronRight, Search, Settings } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const { isSidebarCollapsed, toggleSidebar } = useAppStore();
    const pathname = usePathname();

    const navItems = [
        { id: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        // Dynamic link added in component logic or assume user knows.
        // For MVP, letting user manual navigate.
        // Ideally we add a "Copy Public Link" button in Availability Settings.
        { id: '/scheduling', icon: Calendar, label: 'Scheduling' },
        { id: '/ideation', icon: PenTool, label: 'Ideation' },
        { id: '/schedule', icon: Calendar, label: 'Schedule' },
    ] as const;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarCollapsed ? 80 : 260 }}
            className="h-full glass flex flex-col z-50 relative pointer-events-auto transition-all duration-300 ease-in-out border-r border-sidebar-border bg-sidebar/50"
        >
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white font-bold text-lg cursor-pointer">
                    F
                </div>
                {!isSidebarCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 font-semibold text-lg tracking-tight text-sidebar-foreground"
                    >
                        Flux
                    </motion.span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.id}
                            className={cn(
                                "w-full flex items-center h-11 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-sidebar-accent shadow-sm text-blue-600 font-medium"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-sidebar-accent rounded-xl shadow-sm z-0 border border-sidebar-border/50"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn("relative z-10 flex items-center w-full", isSidebarCollapsed ? "justify-center" : "px-3")}>
                                <item.icon size={20} strokeWidth={2} className={cn("transition-colors", isActive ? "text-blue-600" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80")} />
                                {!isSidebarCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="ml-3"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border/50 space-y-2">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center rounded-lg hover:bg-sidebar-accent h-10 text-sidebar-foreground/50 transition-colors"
                >
                    {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>


                <div className={cn("flex items-center w-full p-2 rounded-xl transition-all cursor-pointer hover:bg-sidebar-accent group border border-transparent hover:border-sidebar-border/50", isSidebarCollapsed && "justify-center")}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-orange-500 shadow-md ring-2 ring-white/10 shrink-0" />
                    {!isSidebarCollapsed && (
                        <div className="ml-3 text-left overflow-hidden">
                            <p className="text-sm font-semibold text-sidebar-foreground truncate">Mridul S.</p>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-blue-500 truncate">Enterprise</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
