"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { ClientFluxNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CalendarViewProps {
    events: ClientFluxNode[];
    selectedDate: Date | undefined;
    onSelectDate: (date: Date | undefined) => void;
}

export function CalendarView({ events, selectedDate, onSelectDate }: CalendarViewProps) {
    // Highlight days with events
    const modifiers = {
        hasEvent: (date: Date) => {
            return events.some((event) => {
                if (!event.startDate) return false;
                const eventDate = new Date(event.startDate);
                return (
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                );
            });
        },
    };

    const modifiersStyles = {
        hasEvent: {
            fontWeight: "bold",
            textDecoration: "underline",
            color: "var(--primary)",
        },
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-background/40 backdrop-blur-sm border border-border/40 rounded-xl p-4 shadow-sm">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onSelectDate}
                    className="rounded-md"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                />
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">
                    {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>
                <div className="flex flex-col gap-3">
                    {selectedDate ? (
                        events
                            .filter((event) => {
                                if (!event.startDate) return false;
                                const eventDate = new Date(event.startDate);
                                return (
                                    eventDate.getDate() === selectedDate.getDate() &&
                                    eventDate.getMonth() === selectedDate.getMonth() &&
                                    eventDate.getFullYear() === selectedDate.getFullYear()
                                );
                            })
                            .map((event) => (
                                <Card key={event.id} className="bg-card/50">
                                    <CardHeader className="p-4 py-3">
                                        <CardTitle className="text-base font-medium flex items-center justify-between">
                                            {event.title}
                                            <span className="text-xs font-normal text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">
                                                {event.type}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 py-2 pt-0 text-sm text-muted-foreground">
                                        {event.content?.replace(/<[^>]*>?/gm, "") || "No details"}
                                    </CardContent>
                                </Card>
                            ))
                    ) : (
                        <p className="text-muted-foreground">Select a date to view scheduled items.</p>
                    )}
                    {selectedDate && events.filter(e => {
                        if (!e.startDate) return false;
                        const d = new Date(e.startDate);
                        return d.getDate() === selectedDate.getDate() &&
                            d.getMonth() === selectedDate.getMonth() &&
                            d.getFullYear() === selectedDate.getFullYear();
                    }).length === 0 && (
                            <p className="text-muted-foreground italic">No events scheduled for this day.</p>
                        )}
                </div>
            </div>
        </div>
    );
}
