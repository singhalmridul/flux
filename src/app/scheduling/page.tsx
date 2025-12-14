import { getEvents } from "@/server/actions";
import SchedulingPage from "@/components/Scheduling/SchedulingPage";
import { ClientFluxNode } from "@/lib/types";

import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();
    // Fetch events for a wide range for MVP, e.g., current year
    const start = new Date(new Date().getFullYear(), 0, 1);
    const end = new Date(new Date().getFullYear(), 11, 31);
    const events = await getEvents(start, end);

    const parsedEvents = events.map(event => ({
        ...event,
        properties: event.properties ? JSON.parse(event.properties as string) : {}
    })) as ClientFluxNode[];

    return <SchedulingPage initialEvents={parsedEvents} userId={session?.user?.id || ""} />;
}
