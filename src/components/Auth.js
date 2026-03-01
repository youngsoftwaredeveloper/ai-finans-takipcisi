"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { translations } from "@/lib/translations";
import { LogIn, UserPlus, Globe } from "lucide-react";

export default function Auth({ onLogin, lang, setLang }) {
    const t = translations[lang];
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLogin(data.user);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                if (data.session) {
                    onLogin(data.user);
                } else {
                    // If email confirmation is required by Supabase settings
                    setError(t.regSuccess);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-8 w-full max-w-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="flex justify-start mb-4 relative z-10">
                    <button
                        onClick={() => setLang(lang === "en" ? "tr" : "en")}
                        className="flex items-center gap-2 px-3 py-1 rounded-xl bg-muted/50 hover:bg-muted text-[10px] font-bold transition-all border border-border/50"
                    >
                        <Globe className="w-3 h-3 text-primary" />
                        {lang.toUpperCase()}
                    </button>
                </div>

                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {t.title}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {isLogin ? t.signinToAccount : t.createNewAccount}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm relative z-10">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                            {t.emailAddress}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                            {t.password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength="6"
                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : isLogin ? (
                            <>
                                {t.login}
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                {t.signup}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center relative z-10">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none"
                    >
                        {isLogin
                            ? t.noAccount
                            : t.haveAccount}
                    </button>
                </div>
            </div>
        </div>
    );
}
