"use client";

import { Target, PieChart, Sparkles, PlusCircle } from "lucide-react";

const BUDGET_PLANS = [
    {
        id: "50-30-20",
        title: "The 50/30/20 Rule",
        description: "Balanced allocation for stable financial growth.",
        breakdown: [
            { category: "Housing & Bills", percent: 50, color: "bg-indigo-500" },
            { category: "Food & Fun", percent: 30, color: "bg-orange-500" },
            { category: "Savings", percent: 20, color: "bg-emerald-500" }
        ],
        icon: <Target className="w-5 h-5 text-indigo-500" />
    },
    {
        id: "student",
        title: "Student Budget",
        description: "Optimized for minimal income and high education costs.",
        breakdown: [
            { category: "Food & Fun", percent: 60, color: "bg-orange-500" },
            { category: "Education", percent: 20, color: "bg-blue-500" },
            { category: "Other", percent: 20, color: "bg-slate-500" }
        ],
        icon: <PlusCircle className="w-5 h-5 text-orange-500" />
    },
    {
        id: "minimalist",
        title: "Minimalist Saver",
        description: "Aggressive saving strategy for fire (financial independence).",
        breakdown: [
            { category: "Housing & Bills", percent: 30, color: "bg-indigo-500" },
            { category: "Food", percent: 20, color: "bg-orange-500" },
            { category: "Savings", percent: 50, color: "bg-emerald-500" }
        ],
        icon: <Sparkles className="w-5 h-5 text-emerald-500" />
    }
];

export default function BudgetPlans() {
    return (
        <div className="glass rounded-2xl p-6 md:p-8 w-full mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <PieChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Spending Plans</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Recommended Allocations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BUDGET_PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className="p-5 rounded-2xl bg-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-default"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {plan.icon}
                            <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{plan.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed h-8">
                            {plan.description}
                        </p>

                        <div className="space-y-3">
                            {plan.breakdown.map((item, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                                        <span className="text-muted-foreground">{item.category}</span>
                                        <span className="text-foreground">{item.percent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-1000 group-hover:opacity-80`}
                                            style={{ width: `${item.percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-5 w-full py-2 rounded-lg bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                            Apply this logic
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
