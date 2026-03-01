"use client";

import { useState, useEffect } from "react";
import { Bot, Sparkles, Coffee, DollarSign, TrendingDown, MessageSquare } from "lucide-react";

export default function AIAssistant({ expenses, exchangeRate = 31.00 }) {
    const [advice, setAdvice] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (expenses.length > 0) {
            setIsAnalyzing(true);
            // Simulate "thinking" 1s
            const timer = setTimeout(() => {
                analyzeExpenses();
                setIsAnalyzing(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [expenses]);

    const analyzeExpenses = () => {
        const insights = [];
        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

        // Coffee Analysis
        const coffeeKeywords = ["kahve", "coffee", "starbucks", "latte", "espresso", "americano", "çay", "tea", "cafe", "kafe"];
        const coffeeExpenses = expenses.filter(e =>
            coffeeKeywords.some(kw => e.description.toLowerCase().includes(kw))
        );

        const coffeeTotal = coffeeExpenses.reduce((sum, e) => sum + e.amount, 0);
        const coffeeCount = coffeeExpenses.length;

        if (coffeeCount >= 3) {
            insights.push({
                type: "habit",
                icon: <Coffee className="w-5 h-5 text-amber-600" />,
                title: "Coffee Habit Analysis",
                message: `You've made ${coffeeCount} coffee/drink expenses this month (Total: ₺${coffeeTotal.toFixed(2)}). It looks like you're drinking too much coffee out.`,
                tip: `☕ If you start brewing at home, you could save about ₺${(coffeeTotal * 0.8).toFixed(2)} (20%) this month!`,
                color: "bg-amber-500/10 border-amber-500/20 text-amber-700"
            });
        }

        // General Savings Tip
        if (totalAmount > 0) {
            const potentialSavings = totalAmount * 0.15;
            insights.push({
                type: "saving",
                icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
                title: "General Savings Potential",
                message: `I've analyzed your expenses. You can save an additional ₺${potentialSavings.toFixed(2)} this month by cutting some flexible spending.`,
                tip: "💡 I can optimize your spending by 15% by setting weekly budget limits.",
                color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
            });
        }

        // High Spending Category Check
        const categoryTotals = expenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        }, {});

        let mainCategory = "";
        let maxAmt = 0;
        Object.entries(categoryTotals).forEach(([cat, amt]) => {
            if (amt > maxAmt) {
                maxAmt = amt;
                mainCategory = cat;
            }
        });

        if (maxAmt > (totalAmount * 0.4)) {
            insights.push({
                type: "warning",
                icon: <TrendingDown className="w-5 h-5 text-blue-600" />,
                title: "Category Balance",
                message: `${mainCategory} expenses account for more than 40% of your total budget!`,
                tip: "📊 You should review this item to make room for other categories.",
                color: "bg-blue-500/10 border-blue-500/20 text-blue-700"
            });
        }

        setAdvice(insights);
    };

    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">AI Finance Assistant</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Active Analysis</p>
                    </div>
                </div>
                {isAnalyzing && (
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    </div>
                )}
            </div>

            <div className="space-y-4 relative z-10">
                {advice.length === 0 ? (
                    <div className="text-center py-4">
                        <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground italic">
                            Waiting for expense data. I haven't found anything to analyze yet...
                        </p>
                    </div>
                ) : (
                    advice.map((item, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border ${item.color} transition-all duration-300 hover:scale-[1.02] cursor-default`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {item.icon}
                                <span className="font-bold text-xs uppercase tracking-tight">{item.title}</span>
                            </div>
                            <p className="text-sm mb-2 opacity-90 leading-tight">{item.message}</p>
                            <div className="text-sm font-semibold border-t border-current/10 pt-2 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{item.tip}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-center">
                <button className="text-xs text-primary hover:underline font-medium">
                    Show more detailed analysis →
                </button>
            </div>
        </div>
    );
}
