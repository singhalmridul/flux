"use client";

import { useState } from "react";
import { getEvents } from "@/server/actions";
import { CalendarView } from "@/components/Scheduling/CalendarView";
import { AvailabilitySettings } from "@/components/Scheduling/AvailabilitySettings";
import { ClientFluxNode } from "@/lib/types";

// This is a dummy data file for client component to simulate props or fetch
// In reality, we pass data from server page.

interface SchedulingPageProps {
    initialEvents: ClientFluxNode[];
    userId: string;
}

export default function SchedulingPage({ initialEvents, userId }: SchedulingPageProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<ClientFluxNode[]>(initialEvents);

    return (
        <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Scheduling</h1>
                <p className="text-muted-foreground">Manage your calendar and availability.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-4">Calendar</h2>
                    <CalendarView
                        events={events}
                        selectedDate={date}
                        onSelectDate={setDate}
                    />
                </div>

                <div className="w-full lg:w-[400px]">
                    <AvailabilitySettings userId={userId} />
                </div>
            </div>
        </div>
    );
}
