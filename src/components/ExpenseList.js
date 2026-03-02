"use client";

const categoryColors = {
    "Food": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Transportation": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Entertainment": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Shopping": "bg-pink-500/10 text-pink-500 border-pink-500/20",
    "Housing": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    "Utilities": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    "Other": "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

import { X } from "lucide-react";

export default function ExpenseList({ expenses, onDelete, onDeleteCategory, exchangeRate, t }) {
    if (expenses.length === 0) {
        return (
            <div className="glass rounded-2xl p-8 text-center w-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">{t.noExpenses}</h3>
                <p className="text-muted-foreground text-sm">{t.addFirstExpense}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {expenses.map((expense) => (
                <div
                    key={expense.id}
                    className="glass rounded-xl p-4 md:p-5 flex items-center justify-between group hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                    <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center border ${categoryColors[expense.category] || categoryColors["Other"]}`}>
                            <span className="text-sm font-semibold">{expense.category.charAt(0)}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-lg">{expense.description}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-md border ${categoryColors[expense.category] || categoryColors["Other"]} inline-flex items-center gap-1.5`}>
                                    {t.categories[expense.category.toLowerCase()] || expense.category}
                                    <button
                                        onClick={() => onDeleteCategory(expense.category)}
                                        className="hover:text-danger hover:scale-125 transition-all p-1 rounded-full hover:bg-danger/10"
                                        title={t.deleteCategory}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                                <span className="text-xs text-muted-foreground">{expense.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-foreground text-xl">
                                ₺{expense.amount.toFixed(2)}
                            </span>
                            {exchangeRate && (
                                <span className="text-xs text-muted-foreground font-medium">
                                    ${(expense.amount / exchangeRate).toFixed(2)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onDelete(expense.id)}
                            className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                            aria-label="Delete expense"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
