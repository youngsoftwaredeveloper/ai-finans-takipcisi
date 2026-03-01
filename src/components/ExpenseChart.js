"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
    "Food": "#f97316", // orange-500
    "Transportation": "#3b82f6", // blue-500
    "Entertainment": "#a855f7", // purple-500
    "Shopping": "#ec4899", // pink-500
    "Housing": "#6366f1", // indigo-500
    "Utilities": "#06b6d4", // cyan-500
    "Other": "#64748b", // slate-500
};

const CustomTooltip = ({ active, payload, exchangeRate }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
                <p className="font-medium text-foreground">{payload[0].name}</p>
                <div className="flex flex-col">
                    <p className="text-primary font-bold">₺{payload[0].value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                    {exchangeRate && (
                        <p className="text-xs text-muted-foreground font-medium">
                            ${(payload[0].value / exchangeRate).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export default function ExpenseChart({ expenses, exchangeRate }) {
    // Aggregate data by category
    const aggregatedData = expenses.reduce((acc, current) => {
        const existing = acc.find((item) => item.name === current.category);
        if (existing) {
            existing.value += current.amount;
        } else {
            acc.push({ name: current.category, value: current.amount });
        }
        return acc;
    }, []);

    const dataToRender = aggregatedData.sort((a, b) => b.value - a.value);

    if (expenses.length === 0) {
        return (
            <div className="glass rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No data to display</h3>
                <p className="text-muted-foreground text-sm">Add expenses to generate spending charts.</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6 flex flex-col h-full w-full relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

            <h3 className="text-xl font-semibold mb-6 text-foreground relative z-10 flex items-center justify-between">
                Spending by Category
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {expenses.length} records
                </span>
            </h3>

            <div className="flex-grow w-full h-[250px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataToRender}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="transparent"
                        >
                            {dataToRender.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.name] || COLORS["Other"]}
                                    className="hover:opacity-80 transition-opacity duration-300 outline-none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip exchangeRate={exchangeRate} />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry) => (
                                <span className="text-sm font-medium text-foreground ml-1">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
