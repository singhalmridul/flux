"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface BookingCardProps {
    date: Date;
    time: string;
    onBook: (time: string) => void;
}

export function BookingCard({ date, time, onBook }: BookingCardProps) {
    return (
        <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={() => onBook(time)}
        >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{time}</span>
        </Button>
    );
}
