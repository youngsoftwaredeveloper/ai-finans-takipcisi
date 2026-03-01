"use client";

import { useState, useEffect } from "react";
import { Wallet, Info, BrainCircuit, CheckCircle2, AlertTriangle } from "lucide-react";

export default function BudgetPlanner({ totalExpense, expenses, exchangeRate }) {
    const [monthlyBudget, setMonthlyBudget] = useState(15000);
    const [isEditing, setIsEditing] = useState(false);
    const [tempBudget, setTempBudget] = useState(15000);

    // Percentages and math
    const spentPercentage = (totalExpense / monthlyBudget) * 100;
    const remainingBudget = monthlyBudget - totalExpense;
    const isOverBudget = remainingBudget < 0;

    const handleSave = () => {
        setMonthlyBudget(parseFloat(tempBudget) || 0);
        setIsEditing(false);
    };

    // AI Dynamic Planning Logic
    const getAiAllocation = () => {
        // Simple but smart allocation logic
        return [
            { name: "Fixed Needs", amount: monthlyBudget * 0.5, desc: "Housing, Bills & Essentials" },
            { name: "Variable Wants", amount: monthlyBudget * 0.3, desc: "Dining, Entertainment & Hobbies" },
            { name: "Savings/Debt", amount: monthlyBudget * 0.2, desc: "Future growth & Security" }
        ];
    };

    const aiPlan = getAiAllocation();

    return (
        <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden group border-primary/20">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <BrainCircuit className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">AI Budget Planner</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                            Smart Management Active <SparkleIcon />
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-background/40 backdrop-blur-md p-2 rounded-2xl border border-border/50">
                    <div className="px-4 py-2">
                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Planned Budget</span>
                        {isEditing ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="number"
                                    value={tempBudget}
                                    onChange={(e) => setTempBudget(e.target.value)}
                                    className="w-24 bg-background border border-primary/30 rounded-lg px-2 py-1 text-sm font-bold text-foreground focus:outline-none"
                                />
                                <button onClick={handleSave} className="bg-primary text-primary-foreground p-1 rounded-lg text-xs">Save</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                                <span className="text-xl font-bold text-foreground">₺{monthlyBudget.toLocaleString()}</span>
                                <Info className="w-3 h-3 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
                {/* Visual Tracking */}
                <div className="space-y-6">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                                    Budget Usage
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold inline-block text-foreground">
                                    {Math.round(spentPercentage)}% Used
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-muted border border-border/50 p-0.5">
                            <style jsx>{`
                                .progress-bar {
                                    width: ${Math.min(spentPercentage, 100)}%;
                                    transition: width 1.5s cubic-bezier(0.65, 0, 0.35, 1);
                                }
                            `}</style>
                            <div className={`progress-bar shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full ${isOverBudget ? 'bg-danger animate-pulse' : 'bg-gradient-to-r from-primary to-accent'}`}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border ${isOverBudget ? 'bg-danger/10 border-danger/20' : 'bg-background/40 border-border/50'}`}>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Spent So Far</span>
                            <span className={`text-xl font-bold ${isOverBudget ? 'text-danger' : 'text-foreground'}`}>₺{totalExpense.toLocaleString()}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border ${isOverBudget ? 'bg-danger/10 border-danger/20' : 'bg-background/40 border-border/50'}`}>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Remaining</span>
                            <span className={`text-xl font-bold ${isOverBudget ? 'text-danger' : 'text-emerald-500'}`}>
                                {isOverBudget ? '-' : ''}₺{Math.abs(remainingBudget).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI Plan Advice */}
                <div className="bg-glass/30 rounded-2xl p-6 border border-border/30 space-y-4">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        AI Recommended Allocation
                    </h3>

                    <div className="space-y-3">
                        {aiPlan.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-foreground block">₺{item.amount.toLocaleString()}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Targets</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                            "I've calculated these targets based on your monthly income goals. Sticking to these will help you save ₺{(monthlyBudget * 0.2).toLocaleString()} this month."
                        </p>
                    </div>
                </div>
            </div>

            {isOverBudget && (
                <div className="mt-8 flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-2xl animate-bounce-subtle">
                    <AlertTriangle className="w-6 h-6 text-danger" />
                    <div>
                        <h4 className="text-sm font-bold text-danger">Budget Limit Exceeded!</h4>
                        <p className="text-xs text-danger/80 italic">Stop all unnecessary spending immediately to regain financial balance.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg className="w-3 h-3 text-primary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L14.5 9L22 11.5L14.5 14L12 21L9.5 14L2 11.5L9.5 9L12 2Z" />
        </svg>
    );
}
