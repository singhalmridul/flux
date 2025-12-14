import { getCanvasNodes } from "@/server/actions";
import { CanvasBoard } from "@/components/Canvas/CanvasBoard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function IdeationPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const { nodes, edges } = await getCanvasNodes();
    console.log(`[IdeationPage] Fetched ${nodes.length} nodes for user ${session.user.email}`);

    return (
        <div className="h-full w-full">
            <CanvasBoard initialNodes={nodes} initialEdges={edges} />
        </div>
    );
}
