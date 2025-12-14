
"use strict";
import Link from "next/link";
import { ArrowLeft, Package, Check, Download } from "lucide-react";

export default function PluginMarketplace() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link href="/ideation" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Plugin Marketplace</h1>
                        <p className="text-muted-foreground">Extend Flux with community and enterprise modules.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Plugin Card 1 */}
                    <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">INSTALLED</div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Flux Core</h3>
                        <p className="text-sm text-muted-foreground mb-4">The essential polymorphic engine. Required for all workspaces.</p>
                        <button disabled className="w-full py-2 bg-muted text-muted-foreground rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                            <Check className="w-4 h-4" /> Installed
                        </button>
                    </div>

                    {/* Plugin Card 2 */}
                    <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">AI Operator</h3>
                        <p className="text-sm text-muted-foreground mb-4">Gen 9 Feature Set. Adds summarization, planning, and intent detection.</p>
                        <button className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Install
                        </button>
                    </div>

                    {/* Plugin Card 3 */}
                    <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-300">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Enterprise SSO</h3>
                        <p className="text-sm text-muted-foreground mb-4">Gen 10 Feature Set. SCIM provisioning and audit logs.</p>
                        <button className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Install
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
