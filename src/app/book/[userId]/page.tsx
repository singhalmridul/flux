import { getPublicAvailability } from "@/server/actions";
import PublicBookingPage from "@/components/Scheduling/PublicBookingPage";

interface PageProps {
    params: {
        userId: string;
    }
}

export default async function Page({ params }: PageProps) {
    // Determine range (next 30 days for example)
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);

    const { userId } = await params;
    const availability = await getPublicAvailability(userId, start, end);

    return <PublicBookingPage userId={userId} availability={availability} />;
}
