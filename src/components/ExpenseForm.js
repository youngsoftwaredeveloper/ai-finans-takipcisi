"use client";

import { useState } from "react";

export default function ExpenseForm({ onAddExpense }) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        onAddExpense({
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category,
            description,
            date,
        });

        setAmount("");
        setDescription("");
    };

    return (
        <div className="glass rounded-2xl p-6 md:p-8 w-full mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <h2 className="text-2xl font-semibold mb-6 text-foreground relative z-10">Harcama Ekle</h2>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tutar (TL)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Kategori</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer transition-all duration-200"
                    >
                        <option value="Food">Yemek & Gıda</option>
                        <option value="Transportation">Ulaşım</option>
                        <option value="Entertainment">Eğlence</option>
                        <option value="Shopping">Alışveriş</option>
                        <option value="Housing">Barınma & Fatura</option>
                        <option value="Utilities">Abonelikler</option>
                        <option value="Other">Diğer</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Açıklama</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ne için harcadınız?"
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tarih</label>
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
                    Harcama Ekle
                </button>
            </form>
        </div>
    );
}
