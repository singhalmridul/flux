import { getCanvasNodes } from "@/server/actions";
import ExecutionPage from "@/components/Execution/ExecutionPage";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const { nodes } = await getCanvasNodes();

    // Pass raw nodes, component handles parsing
    return (
        <div className="w-full h-full p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Execution</h1>
                <p className="text-muted-foreground">Manage your tasks and projects.</p>
            </header>

            <div className="h-[calc(100vh-12rem)]">
                <ExecutionPage initialNodes={nodes} />
            </div>
        </div>
    );
}
