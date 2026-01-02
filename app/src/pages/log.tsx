import { type FormEvent, useState } from "react";

type Metrics = {
    sleep_hours?: number;
    weight?: number;
    calorie_intake?: number;
    resting_hr?: number;
    mood_score?: number;
    stress_score?: number;
    energy_score?: number;
    sobriety_today?: boolean;
    caffeine_cups?: number;
    alcohol_servings?: boolean;
    spending_today?: number;
    social_hangout_today?: boolean;
    video_game_time?: number;
    exercise_today?: boolean;
    screen_time?: number;
};

export default function LogPage() {
    const [metrics, setMetrics] = useState<Metrics>({});
    const [notes, setNotes] = useState("");

    function setNum(key: keyof Metrics, val: string) {
        setMetrics(m => ({ ...m, [key]: val === "" ? undefined : Number(val) }));
    }
    function setBool(key: keyof Metrics, val: boolean) {
        setMetrics(m => ({ ...m, [key]: val }));
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ metrics, notes })
        });
        if (res.ok) alert("Saved today's entry.");
        else alert("Failed to save.");
    }

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-semibold mb-4">Daily Log</h1>
                
                { /* Health */ }
                <h2 className="text-lg font-semibold mt-4">Health</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Sleep (hours)" onChange={v => setNum("sleep_hours", v)} />
                    <Input label="Weight (lbs)" onChange={v => setNum("weight", v)} />
                    <Input label="Calories (kcal)" onChange={v => setNum("calorie_intake", v)} />
                </div>

                { /* Mental */ }
                <h2 className="text-lg font-semibold mt-4">Mental</h2>
                <div className="grid grid-cols-3 gap-4">
                    <Input label="Mood (1-5)" onChange={v => setNum("mood_score", v)} />
                    <Input label="Stress (1-5)" onChange={v => setNum("stress_score", v)} />
                    <Input label="Energy (1-5)" onChange={v => setNum("energy_score", v)} />
                </div>
                <div className="mt-2">
                    <label className="block text-sm"> Journal (optional)</label>
                    <textarea className="mt-1 w-full border px-3 py-2 rounded"
                              value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                { /* Sobriety & Consumption */ }
                <h2 className="text-lg font-semibold mt-4">Sobriety & Consumption</h2>
                <div className="grid grid-cols-3 gap-4">
                    <Checkbox label="Sober today" onChange={v => setBool("sobriety_today", v)} />
                    <Input label="Caffeine (cups)" onChange={v => setNum("caffeine_cups", v)} />
                    <Input label="Alcohol (servings)" onChange={v => setNum("alcohol_servings", v)} />
                </div>

                { /* Finance */ }
                <h2 className="text-lg font-semibold mt-4">Finance</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Spending today (USD)" onChange={v => setNum("spending_today", v)} />
                </div>

                { /* Lifestyle */ }
                <h2 className="text-lg font-semibold mt-4">Lifestyle</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Checkbox label="Social hangout" onChange={v => setBool("social_hangout_today", v)} />
                    <Input label="Video game (hours)" onChange={v => setNum("video_game_time", v)} />
                    <Checkbox label="Exercise today" onChange={v => setBool("exercise_today", v)} />
                    <Input label="Screen time (hours)" onChange={v => setNum("screen_time", v)} />
                </div>

                <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        onClick={onSubmit}>
                    Save
                </button>
            </div>
        </div>
    );
}

function Input({ label, onChange }: { label: string; onChange: (v: string) => void }) {
    return (
        <label className="block">
            <span className="text-sm">{label}</span>
            <input className="mt-1 w-full border px-3 py-2 rounded"
                   onChange={e => onChange(e.target.value)} />
        </label>
    );
}
function Checkbox({ label, onChange }: { label: string; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2">
            <input type="checkbox" onChange={e => onChange(e.target.checked)} />
            <span className="text-sm">{label}</span>
        </label>
    );
}