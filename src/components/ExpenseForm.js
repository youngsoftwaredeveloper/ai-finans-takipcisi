"use client";

import { useState } from "react";

export default function ExpenseForm({ onAddExpense, t, existingCategories = [] }) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const defaultCategories = [
        { id: "Food", name: t.categories.food },
        { id: "Transportation", name: t.categories.transportation },
        { id: "Entertainment", name: t.categories.entertainment },
        { id: "Shopping", name: t.categories.shopping },
        { id: "Housing", name: t.categories.housing },
        { id: "Utilities", name: t.categories.utilities },
        { id: "Other", name: t.categories.other },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCategory = isNewCategory ? newCategoryName : category;
        if (!amount || !description || !finalCategory) return;

        onAddExpense({
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category: finalCategory,
            description,
            date,
        });

        setAmount("");
        setDescription("");
        if (isNewCategory) {
            setIsNewCategory(false);
            setCategory(newCategoryName);
            setNewCategoryName("");
        }
    };

    const handleCategoryChange = (e) => {
        if (e.target.value === "NEW") {
            setIsNewCategory(true);
            setNewCategoryName("");
        } else {
            setIsNewCategory(false);
            setCategory(e.target.value);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 md:p-8 w-full mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <h2 className="text-2xl font-semibold mb-6 text-foreground relative z-10">{t.addExpense}</h2>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.amount}</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.category}</label>
                    <select
                        value={isNewCategory ? "NEW" : category}
                        onChange={handleCategoryChange}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer transition-all duration-200"
                    >
                        {defaultCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        {existingCategories.filter(cat => !defaultCategories.some(dc => dc.id === cat)).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="NEW">+ {t.addNewCategory}</option>
                    </select>

                    {isNewCategory && (
                        <div className="animate-in slide-in-from-top-1 duration-200">
                            <input
                                type="text"
                                autoFocus
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder={t.newCategoryPlaceholder}
                                className="w-full bg-background/50 border border-primary/50 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.description}</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.placeholderDesc}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.date}</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
                >
                    {t.addExpense}
                </button>
            </form>
        </div>
    );
}
