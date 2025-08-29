"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { planForDay } from "@/lib/plan";

export default function PlanPage(){
  const [assignments,setAssignments]=useState<any[]>([]);
  const [tasks,setTasks]=useState<any[]>([]);
  const [minutes,setMinutes]=useState(60);

  useEffect(()=>{(async()=>{
    setAssignments(await db.assignments.orderBy("due").toArray());
  })();},[]);

  async function generate(){
    const t = planForDay(assignments, minutes);
    setTasks(t);
    for(const x of t){ await db.tasks.put(x); }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Plan du jour</h1>
      <div className="flex gap-2 items-center">
        Temps disponible (min)
        <input type="number" className="border px-2 py-1 w-24" value={minutes} onChange={e=> setMinutes(parseInt(e.target.value||"0"))} />
        <button onClick={generate} className="px-4 py-2 rounded bg-black text-white">Générer</button>
      </div>
      <ul className="space-y-2">
        {tasks.map(t=> (
          <li key={t.id} className="border p-2 rounded">
            <b>{t.topic}</b> — {t.durationMin}’ — {t.firstAction}
          </li>
        ))}
      </ul>
    </main>
  );
}
