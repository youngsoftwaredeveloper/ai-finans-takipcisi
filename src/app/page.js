"use client";

import { useState, useEffect } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import AIAssistant from "@/components/AIAssistant";
import Auth from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { getExchangeRate } from "@/lib/currency";
import { LogOut } from "lucide-react";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(31.00);

  useEffect(() => {
    // Check active session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchExpenses(session.user.id);
      } else {
        setIsLoaded(true); // Stop loading if no session
      }
    };

    const fetchRate = async () => {
      const rate = await getExchangeRate();
      setExchangeRate(rate);
    };

    checkSession();
    fetchRate();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          fetchExpenses(session.user.id);
        } else {
          setUser(null);
          setExpenses([]);
          setIsLoaded(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchExpenses = async (userId) => {
    setIsLoaded(false);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId) // Fetch only user's expenses
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleAddExpense = async (newExpense) => {
    if (!user) return;

    try {
      const expenseToAdd = {
        amount: newExpense.amount,
        category: newExpense.category,
        description: newExpense.description,
        date: newExpense.date,
        user_id: user.id // Attach user ID
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseToAdd])
        .select();

      if (error) throw error;

      if (data) {
        setExpenses([data[0], ...expenses]);
      }
    } catch (error) {
      console.error('Error adding expense:', error.message);
      alert("Harcama eklenirken bir hata oluştu.");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user owns the expense to delete

      if (error) throw error;

      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error.message);
      alert("Harcama silinirken bir hata oluştu.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Finans verileriniz yükleniyor...</p>
      </div>
    );
  }

  // Show Auth component if not logged in
  if (!user) {
    return <Auth onLogin={(user) => {
      setUser(user);
    }} />;
  }

  // Main Dashboard for logged in users
  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Header section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AI Finance Tracker
            </span>
          </h1>
          <p className="text-muted-foreground text-md max-w-xl">
            Take control of your finances with smart, elegant, and modern tracking.
          </p>
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-4 bg-glass px-5 py-3 rounded-2xl border border-border/50">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-foreground">{user.email}</span>
            <span className="text-xs text-muted-foreground">Aktif Oturum</span>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
            title="Çıkış Yap"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Summary & AI Insights */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Total Summary Card */}
          <div className="glass rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <h3 className="text-muted-foreground font-medium mb-2 relative z-10">Toplam Harcama</h3>
            <div className="flex flex-col gap-1 relative z-10">
              <p className="text-4xl font-bold text-foreground">₺{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xl font-medium text-muted-foreground opacity-80">${(totalExpense / exchangeRate).toFixed(2)}</p>
            </div>
            <div className="mt-4 text-[10px] text-muted-foreground/50 border-t border-border/20 pt-2">
              Güncel Kur: 1 USD = {exchangeRate.toFixed(2)} TRY
            </div>
          </div>

          <ExpenseForm onAddExpense={handleAddExpense} />

          <AIAssistant expenses={expenses} exchangeRate={exchangeRate} />
        </div>

        {/* Right Column: Chart & List */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="w-full h-auto min-h-[400px]">
            <ExpenseChart expenses={expenses} exchangeRate={exchangeRate} />
          </div>

          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Recent Expenses</h2>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {expenses.length} transactions
              </span>
            </div>

            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} exchangeRate={exchangeRate} />
          </div>
        </div>
      </div>
    </div>
  );
}
