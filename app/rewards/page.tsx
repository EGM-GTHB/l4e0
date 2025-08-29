"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { streakDays } from "@/lib/rewards";

export default function Rewards(){
  const [total,setTotal]=useState(0);
  const [today,setToday]=useState(0);
  const [streak,setStreak]=useState(0);
  const [thresholds,setThresholds]=useState<{small:number;big:number}>({small:100,big:250});

  useEffect(()=>{(async()=>{
    const pts = await db.points.toArray();
    const sum = pts.reduce((s,p)=> s+p.delta, 0);
    setTotal(sum);
    const ymd = new Date().toISOString().slice(0,10);
    setToday(pts.filter(p=> new Date(p.ts).toISOString().slice(0,10)===ymd).reduce((s,p)=>s+p.delta,0));
    const daysWithPoints = Array.from(new Set(pts.map(p=> new Date(p.ts).toISOString().slice(0,10))));
    setStreak(streakDays(daysWithPoints));
    const t = (await db.settings.where("key").equals("thresholds").first())?.value;
    if(t) setThresholds(t);
  })();},[]);

  async function save(){ await db.settings.put({ id:"thresholds", key:"thresholds", value:thresholds }); }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Récompenses</h1>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="border rounded p-3"><div className="text-sm text-gray-500">Points aujourd’hui</div><div className="text-2xl font-bold">{today}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-gray-500">Total cumulé</div><div className="text-2xl font-bold">{total}</div></div>
        <div className="border rounded p-3"><div className="text-sm text-gray-500">Streak (jours)</div><div className="text-2xl font-bold">{streak}</div></div>
      </div>
      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Seuils de récompense</div>
        <div className="flex items-center gap-2">Petite récompense <input type="number" className="border px-2 py-1 w-28" value={thresholds.small} onChange={e=> setThresholds({...thresholds, small: parseInt(e.target.value||"0")})}/> pts</div>
        <div className="flex items-center gap-2">Grande récompense <input type="number" className="border px-2 py-1 w-28" value={thresholds.big} onChange={e=> setThresholds({...thresholds, big: parseInt(e.target.value||"0")})}/> pts</div>
        <button onClick={save} className="px-4 py-2 rounded bg-black text-white">Enregistrer</button>
      </div>
      <p className="text-sm text-gray-500">Les points proviennent des quizz (fin de micro-tâche), des évaluations de devoir (scan) et du bonus de streak.</p>
    </main>
  );
}
