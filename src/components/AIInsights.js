"use client";

import { BrainCircuit, TrendingDown, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

export default function AIInsights({ expenses, exchangeRate = 31.00 }) {
    // Mock AI Insights generation
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

    // Find highest category
    const categoryTotals = expenses.reduce((acc, current) => {
        acc[current.category] = (acc[current.category] || 0) + current.amount;
        return acc;
    }, {});

    let highestCategory = "None";
    let highestAmount = 0;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > highestAmount) {
            highestAmount = amount;
            highestCategory = category;
        }
    });

    const generateInsights = () => {
        if (expenses.length === 0) {
            return [
                {
                    id: 1,
                    type: "info",
                    icon: <BrainCircuit className="w-5 h-5 text-primary" />,
                    title: "AI Analizi Hazır",
                    message: "Harcama eklemeye başlayın, AI harcama alışkanlıklarınızı analiz etsin ve size özel ipuçları sunsun.",
                    color: "bg-primary/10 text-primary border-primary/20",
                }
            ];
        }

        const insights = [];

        // Highest category insight
        insights.push({
            id: 2,
            type: "warning",
            icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
            title: `${highestCategory} Harcama Uyarısı`,
            message: `${highestCategory} kategorisinde ₺${highestAmount.toFixed(2)} ($${(highestAmount / exchangeRate).toFixed(2)}) harcadınız. Bu, bütçenizin en büyük kısmını oluşturuyor.`,
            color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        });

        if (totalExpense > 5000) { // Adjusted to 5000 for TRY context
            insights.push({
                id: 3,
                type: "danger",
                icon: <TrendingUp className="w-5 h-5 text-danger" />,
                title: "Yüksek Harcama Trendi",
                message: "Toplam harcamanız bu hafta hızlanıyor. Acil olmayan alışverişlerinizi ertelemeyi deneyebilirsiniz.",
                color: "bg-danger/10 text-danger border-danger/20",
            });
        }

        // Generic positive insight
        insights.push({
            id: 4,
            type: "success",
            icon: <Lightbulb className="w-5 h-5 text-success" />,
            title: "Akıllı Tasarruf Fırsatı",
            message: `Eğlence bütçenizi %15 oranında düşürürseniz, bu ay fazladan yaklaşık ₺1,200 ($${(1200 / exchangeRate).toFixed(2)}) tasarruf edebilirsiniz.`,
            color: "bg-success/10 text-success border-success/20",
        });

        return insights;
    };

    const insights = generateInsights();

    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden group mt-6">
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -ml-16 -mt-16 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>

            <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2 relative z-10">
                <BrainCircuit className="w-6 h-6 text-accent" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                    AI Financial Insights
                </span>
            </h3>

            <div className="space-y-4 relative z-10">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border ${insight.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                    >
                        <div className="mt-0.5 flex-shrink-0">
                            {insight.icon}
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
                            <p className="text-sm mt-1 opacity-90 leading-relaxed">
                                {insight.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
