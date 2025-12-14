"use client";

import { useState, useEffect } from "react";
import { saveAvailability } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Need to install Switch possibly

interface AvailabilitySettingsProps {
    userId: string;
}

export function AvailabilitySettings({ userId }: AvailabilitySettingsProps) {
    const [enabled, setEnabled] = useState(true);
    const [startHour, setStartHour] = useState("09:00");
    const [endHour, setEndHour] = useState("17:00");
    const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const toggleDay = (day: string) => {
        if (days.includes(day)) {
            setDays(days.filter(d => d !== day));
        } else {
            setDays([...days, day]);
        }
    };

    const handleSave = async () => {
        try {
            await saveAvailability({
                enabled,
                start: startHour,
                end: endHour,
                days
            });
            alert("Availability saved!");
        } catch (e) {
            console.error(e);
            alert("Failed to save availability");
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Availability Rules</CardTitle>
                <CardDescription>Set your weekly recurring schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="availability-mode">Enable Availability</Label>
                    <div className="flex items-center space-x-2">
                        {/* Placeholder for Switch if not available yet */}
                        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="toggle" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input type="time" value={startHour} onChange={(e) => setStartHour(e.target.value)} disabled={!enabled} />
                    </div>
                    <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input type="time" value={endHour} onChange={(e) => setEndHour(e.target.value)} disabled={!enabled} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Active Days</Label>
                    <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <Button
                                key={day}
                                variant={days.includes(day) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleDay(day)}
                                disabled={!enabled}
                                className="w-12"
                            >
                                {day}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Public Booking Link</p>
                    <div className="flex gap-2">
                        <Input readOnly value={origin ? `${origin}/book/${userId}` : "Loading..."} />
                        <Button variant="outline" onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/book/${userId}`);
                            alert("Copied!");
                        }}>Copy</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={!enabled}>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
