"use client";

import { useState, useEffect } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import AIAssistant from "@/components/AIAssistant";
import Auth from "@/components/Auth";
import { supabase } from "@/lib/supabase";
import { getExchangeRate } from "@/lib/currency";
import BudgetPlanner from "@/components/BudgetPlanner";
import BudgetPlans from "@/components/BudgetPlans";
import { translations } from "@/lib/translations";
import { LogOut, Globe, Sun, Moon, Plus, List, LayoutDashboard, X } from "lucide-react";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(31.00);
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const [showMobileForm, setShowMobileForm] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

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
      alert(t.errorAdding || "An error occurred while adding the expense.");
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
      alert(t.errorDeleting || "An error occurred while deleting the expense.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!user) return;
    if (!confirm(t.confirmDeleteCategory)) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('category', categoryName)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses(expenses.filter(expense => expense.category !== categoryName));
    } catch (error) {
      console.error('Error deleting category:', error.message);
      alert(t.errorDeleting || "An error occurred while deleting the category.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background transition-colors duration-500">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">{t.loading}</p>
      </div>
    );
  }

  // Show Auth component if not logged in
  if (!user) {
    return <Auth onLogin={(user) => {
      setUser(user);
    }} lang={lang} setLang={setLang} />;
  }

  // Main Dashboard for logged in users
  return (
    <div className={`min-h-screen transition-colors duration-500 bg-background ${showMobileForm ? 'overflow-hidden' : ''}`}>
      {/* Optimized Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 md:px-8 md:py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {t.title}
                </span>
              </h1>
              <p className="hidden md:block text-muted-foreground text-sm">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-glass p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-border/50">
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-muted text-[10px] md:text-xs font-bold transition-all"
              title={lang === "en" ? "Turkish" : "İngilizce"}
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="hidden xs:inline">{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 hover:bg-muted rounded-lg transition-all text-foreground"
              title={theme === "light" ? t.darkMode : t.lightMode}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-border/50"></div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* Top Row on Mobile: Summary & Charts */}
          <div className="lg:col-span-4 order-1 space-y-6">
            <div className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <h3 className="text-muted-foreground text-xs font-semibold mb-1 relative z-10 uppercase tracking-wider">{t.totalExpenses}</h3>
              <div className="flex flex-col gap-0.5 relative z-10">
                <p className="text-3xl md:text-4xl font-black text-foreground">₺{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                <p className="text-lg font-medium text-muted-foreground opacity-80">${(totalExpense / exchangeRate).toFixed(2)}</p>
              </div>
              <div className="mt-4 text-[10px] text-muted-foreground/50 border-t border-border/20 pt-2 flex justify-between items-center">
                <span>{t.exchangeRate}: 1$ = {exchangeRate.toFixed(2)}₺</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
            </div>

            {/* Hidden on Mobile Form Container */}
            <div className="hidden lg:block">
              <ExpenseForm
                onAddExpense={handleAddExpense}
                t={t}
                existingCategories={[...new Set(expenses.map(e => e.category))]}
              />
            </div>

            <div className="hidden lg:block">
              <AIAssistant expenses={expenses} exchangeRate={exchangeRate} t={t} />
            </div>
          </div>

          {/* Center Column: List & Planner */}
          <div className="lg:col-span-8 order-2 space-y-6 md:space-y-8">
            <div className="w-full">
              <ExpenseChart expenses={expenses} exchangeRate={exchangeRate} t={t} />
            </div>

            <BudgetPlanner expenses={expenses} totalExpense={totalExpense} exchangeRate={exchangeRate} t={t} />

            <div className="lg:hidden">
              <AIAssistant expenses={expenses} exchangeRate={exchangeRate} t={t} />
            </div>

            <div className="glass rounded-2xl p-5 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <List className="w-5 h-5 text-primary" />
                  {t.recentExpenses}
                </h2>
                <span className="text-[10px] md:text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {expenses.length} {t.transactions}
                </span>
              </div>

              <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onDeleteCategory={handleDeleteCategory}
                exchangeRate={exchangeRate}
                t={t}
              />
            </div>

            <BudgetPlans t={t} />
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setShowMobileForm(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Mobile Form Overlay */}
      {showMobileForm && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowMobileForm(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 sm:hidden"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{t.addExpense}</h3>
              <button onClick={() => setShowMobileForm(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <ExpenseForm
                onAddExpense={(exp) => {
                  handleAddExpense(exp);
                  setShowMobileForm(false);
                }}
                t={t}
                existingCategories={[...new Set(expenses.map(e => e.category))]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
