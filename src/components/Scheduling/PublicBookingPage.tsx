"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookEvent } from "@/server/actions";
import { BookingCard } from "./BookingCard";
import { format } from "date-fns";

interface PublicBookingPageProps {
    userId: string;
    availability: {
        rules: any;
        events: any[]; // specific types can be imported
    };
}

export default function PublicBookingPage({ userId, availability }: PublicBookingPageProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [booked, setBooked] = useState(false);

    // Naive slot generation based on rules (ignoring busy times for MVP visual simplicity logic)
    // In real app: subtract events from rules
    const getSlots = () => {
        if (!date) return [];

        // Check if day is enabled in rules
        const dayName = format(date, "EEE"); // "Mon", "Tue"
        if (!availability.rules.days?.includes(dayName)) return [];

        // Generate slots from start to end
        const slots = [];
        const startHour = parseInt(availability.rules.start.split(":")[0]);
        const endHour = parseInt(availability.rules.end.split(":")[0]);

        for (let i = startHour; i < endHour; i++) {
            slots.push(`${i}:00`);
            slots.push(`${i}:30`);
        }
        return slots;
    };

    const handleBook = async () => {
        if (!date || !selectedTime || !guestEmail) return;

        setIsBooking(true);
        try {
            // Construct start/end dates
            const [hours, minutes] = selectedTime.split(":").map(Number);
            const startDate = new Date(date);
            startDate.setHours(hours, minutes);
            const endDate = new Date(startDate);
            endDate.setMinutes(minutes + 30); // 30 min default

            await bookEvent(userId, {
                title: "Meeting with " + guestName,
                start: startDate,
                end: endDate,
                guestEmail
            });
            setBooked(true);
        } catch (error) {
            console.error(error);
            alert("Booking failed");
        } finally {
            setIsBooking(false);
        }
    };

    if (booked) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-center text-green-600">Booking Confirmed! 🎉</CardTitle>
                        <CardDescription className="text-center">
                            You are scheduled for {format(date!, "MMMM d, yyyy")} at {selectedTime}.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="max-w-[800px] w-full shadow-lg border-border/50">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Calendar Side */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-border/50">
                        <div className="mb-6">
                            <h2 className="font-semibold text-lg">Select a Date</h2>
                            <p className="text-sm text-muted-foreground">Displaying availability for User</p>
                        </div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setSelectedTime(null); }}
                            className="rounded-md border shadow-sm mx-auto"
                            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </div>

                    {/* Slots Side */}
                    <div className="p-6 flex-1 max-w-md">
                        {!selectedTime ? (
                            <>
                                <h2 className="font-semibold text-lg mb-4">
                                    {date ? format(date, "EEEE, MMMM d") : "Availability"}
                                </h2>
                                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
                                    {getSlots().length > 0 ? (
                                        getSlots().map(time => (
                                            <BookingCard
                                                key={time}
                                                date={date!}
                                                time={time}
                                                onBook={setSelectedTime}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground col-span-2 text-center py-8">
                                            No slots available.
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTime(null)} className="-ml-2 text-muted-foreground">
                                        ← Back to times
                                    </Button>
                                    <h3 className="font-semibold text-lg">Confirm Booking</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(date!, "MMMM d")} at {selectedTime}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label>Name</Label>
                                        <Input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Email</Label>
                                        <Input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="john@example.com" />
                                    </div>
                                    <Button className="w-full mt-2" onClick={handleBook} disabled={isBooking || !guestEmail}>
                                        {isBooking ? "Booking..." : "Confirm Meeting"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
