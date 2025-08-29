"use client";
import { useState } from "react";
import { db } from "@/lib/db";
import { parseAllDayICS } from "@/lib/calendar";

export default function Calendars(){
  const [holics,setHolics]=useState("");
  const [breakics,setBreakics]=useState("");
  const [mondayA,setMondayA]=useState("");
  const [templates,setTemplates]=useState<any>({ A:{slots:[]}, B:{slots:[]} });
  const [msg,setMsg]=useState("");

  async function save(){
    const holidays = parseAllDayICS(holics);
    const breaksDates = parseAllDayICS(breakics);
    await db.settings.put({ id:"mondayA", key:"mondayA", value:mondayA || new Date().toISOString().slice(0,10) });
    await db.settings.put({ id:"holidays", key:"holidays", value:holidays });
    await db.settings.put({ id:"breaks", key:"breaks", value: breaksDates.map(d=> ({start:d, end:d})) });
    await db.settings.put({ id:"templates", key:"templates", value:templates });
    setMsg("Enregistré.");
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Calendriers</h1>
      <div className="space-y-2">
        <label className="font-medium">Lundi de référence (Semaine A)</label>
        <input className="border px-2 py-1" placeholder="YYYY-MM-DD" value={mondayA} onChange={e=> setMondayA(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="font-medium">ICS — Jours fériés (collez le contenu)</label>
        <textarea className="border p-2 w-full h-32" value={holics} onChange={e=> setHolics(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="font-medium">ICS — Vacances Zone C (collez le contenu)</label>
        <textarea className="border p-2 w-full h-32" value={breakics} onChange={e=> setBreakics(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="font-medium">Templates A/B (JSON)</label>
        <textarea className="border p-2 w-full h-32" placeholder='{"A":{"slots":[{"weekday":1,"start":"08:30","end":"09:25","subject":"Maths"}]},"B":{"slots":[]}}' value={JSON.stringify(templates,null,2)} onChange={e=> { try{ setTemplates(JSON.parse(e.target.value||"{}")); }catch{} }} />
      </div>
      <button onClick={save} className="px-4 py-2 rounded bg-black text-white">Enregistrer</button>
      {msg && <div className="text-green-700">{msg}</div>}
    </main>
  );
}
