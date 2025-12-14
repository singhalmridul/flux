import { getDashboardData } from "@/server/actions";
import { CheckSquare, Calendar, FileText } from "lucide-react";

export default async function DashboardPage() {
    const { priorityTasks, upcomingEvents, recentDocs } = await getDashboardData();

    return (
        <div className="h-full w-full p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8">Good morning, Mridul</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Priority Tasks */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center mb-4 text-primary">
                        <CheckSquare className="w-5 h-5 mr-2" />
                        <h2 className="font-semibold">Priority Tasks</h2>
                    </div>
                    <div className="space-y-3">
                        {priorityTasks.map(task => (
                            <div key={task.id} className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="w-4 h-4 rounded border border-primary/50 mt-1 mr-3 shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium">{task.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{task.content || JSON.parse(task.properties || '{}').status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center mb-4 text-blue-500">
                        <Calendar className="w-5 h-5 mr-2" />
                        <h2 className="font-semibold">Schedule</h2>
                    </div>
                    <div className="space-y-3">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="w-1 h-8 rounded-full bg-blue-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium">{event.title}</h3>
                                    <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Docs */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center mb-4 text-orange-500">
                        <FileText className="w-5 h-5 mr-2" />
                        <h2 className="font-semibold">Recent Ideas</h2>
                    </div>
                    <div className="space-y-3">
                        {recentDocs.map(doc => (
                            <div key={doc.id} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <FileText className="w-8 h-8 p-1.5 bg-orange-500/10 text-orange-500 rounded-lg mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium">{doc.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{doc.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
