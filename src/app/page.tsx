"use client";
import { useState } from "react";

export default function Home() {
    const [sqlUsername, setSqlUsername] = useState("");
    const [sqlPassword, setSqlPassword] = useState("");
    const [sqlVulnerable, setSqlVulnerable] = useState(false);
    const [sqlOutput, setSqlOutput] = useState<any>(null);

    const [authUsername, setAuthUsername] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authVulnerable, setAuthVulnerable] = useState(false);
    const [authOutput, setAuthOutput] = useState<any>(null);

    const handleLogin = async () => {
        try {
            const res = await fetch("api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sqlUsername,
                    sqlPassword,
                    sqlVulnerable,
                }),
            });
            const data = await res.json();
            setSqlOutput(data);
        } catch (err) {
            setSqlOutput({ error: String(err) });
        }
    };

    const handleBrokenLogin = async () => {
        const res = await fetch("/api/broken-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: authUsername,
                password: authPassword,
                vulnerable: authVulnerable,
            }),
        });
        setAuthOutput(await res.json());
    };

    return (
        <div className="flex flex-col gap-4 mx-30 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <div className="flex flex-col my-4 p-4 rounded-xl gap-4 items-center justify-center bg-zinc-200 font-sans w-full">
                <h1 className="text-2xl font-bold">SQL Injection Demo</h1>
                <p className="font-semibold">
                    Za zadanu kombinaciju korisničkog imena i lozinke vraća
                    podatke o korisniku. Unesite u polje username "admin' OR
                    '1'='1' -- " kako bi testirali ranjivost.
                </p>
                <label>
                    <input
                        type="checkbox"
                        checked={sqlVulnerable}
                        onChange={(e) => setSqlVulnerable(e.target.checked)}
                    ></input>
                    Ranjivost uključena
                </label>
                <div className="flex gap-3">
                    <input
                        className="col-span-2 p-2 border bg-zinc-100 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="username"
                        value={sqlUsername}
                        onChange={(e) => setSqlUsername(e.target.value)}
                    />
                    <input
                        className="p-2 border border-slate-200 bg-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="password"
                        type="password"
                        value={sqlPassword}
                        onChange={(e) => setSqlPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                    >
                        Login
                    </button>
                </div>
                <div className="flex flex-col gap-1 px-8 w-full">
                    <h2 className="text-sm">API response</h2>
                    <div className="rounded-md bg-slate-100 p-3 text-sm font-mono">
                        <pre className="whitespace-pre-wrap">
                            {JSON.stringify(sqlOutput, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
            <div className="flex flex-col my-4 w-full p-4 rounded-xl gap-4 items-center justify-center bg-zinc-200 font-sans">
                <h1 className="text-2xl font-bold">
                    Broken Authentication Demo
                </h1>
                <p className="font-semibold">
                    Ako je ranjivost uključena pokazuju se detaljne poruke o
                    greškama. Ako je ranjivost isključena pokazuju se poruke o
                    greškama koje ne govore korisniku gdje griješi te se
                    spriječava "brute-force" napad tako što se korisnika blokira
                    od prijavljivanja na neko vrijeme nakon nekoliko neuspjelih
                    pokušaja.
                </p>
                <label>
                    <input
                        type="checkbox"
                        checked={authVulnerable}
                        onChange={(e) => setAuthVulnerable(e.target.checked)}
                    ></input>
                    Ranjivost uključena
                </label>
                <div className="flex gap-3">
                    <input
                        className="col-span-2 p-2 border bg-zinc-100 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="username"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                    />
                    <input
                        className="col-span-2 p-2 border bg-zinc-100 border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="password"
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                    />
                    <button
                        onClick={handleBrokenLogin}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                    >
                        Login
                    </button>
                </div>
                <div className="flex flex-col gap-1 px-8 w-full">
                    <h2 className="text-sm">API response</h2>
                    <div className="rounded-md bg-slate-100 p-3 text-sm font-mono">
                        <pre className="whitespace-pre-wrap">
                            {JSON.stringify(authOutput, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
