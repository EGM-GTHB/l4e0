"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { estimateCostUSD } from "@/lib/cost";

export default function CostWidget(){
  const [today,setToday]=useState(0);
  const [month,setMonth]=useState(0);

  useEffect(()=>{(async()=>{
    const all = await db.costs.toArray();
    const now = new Date();
    const dayStr = now.toISOString().slice(0,10);
    const monthStr = dayStr.slice(0,7);
    let t=0, m=0;
    for(const c of all){
      const d = new Date(c.ts).toISOString();
      const dDay = d.slice(0,10), dMonth = d.slice(0,7);
      const cost = estimateCostUSD(c.model, c.inTok, c.outTok);
      if(dDay===dayStr) t += cost;
      if(dMonth===monthStr) m += cost;
    }
    setToday(+t.toFixed(4)); setMonth(+m.toFixed(4));
  })();},[]);

  return (
    <div className="border rounded p-3 space-y-1">
      <div className="font-medium">Coût IA</div>
      <div>Aujourd’hui : <b>${"{"+`today`+"}"}</b></div>
      <div>Mois en cours : <b>${"{"+`month`+"}"}</b></div>
    </div>
  );
}
