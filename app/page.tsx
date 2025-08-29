"use client";
import { useEffect, useState } from "react";
import CostWidget from "@/components/CostWidget";
import { db } from "@/lib/db";

export default function Dashboard(){
  const [points, setPoints] = useState(0);
  useEffect(()=>{(async()=>{
    const all = await db.points.toArray();
    setPoints(all.reduce((s,p)=> s+p.delta, 0));
  })();},[]);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">L4‑E0 — Tableau de bord</h1>
      <div className="text-lg">Points cumulés : <strong>{points}</strong></div>
      <CostWidget />
      <p className="text-sm text-gray-500">Utilisez le menu en haut pour scanner, planifier, quizz et évaluer.</p>
    </main>
  );
}
