"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { weekLabelFor, ymd } from "@/lib/calendar";

export default function Next7(){
  const [days,setDays]=useState<any[]>([]);

  useEffect(()=>{(async()=>{
    const settings = await db.settings.toArray();
    const mondayA = new Date(settings.find(s=>s.key==="mondayA")?.value || new Date());
    const holidays = new Set<string>((settings.find(s=>s.key==="holidays")?.value)||[]);
    const breaks = (settings.find(s=>s.key==="breaks")?.value)||[];
    const templates = (settings.find(s=>s.key==="templates")?.value)||{ A:{slots:[]}, B:{slots:[]} };

    const out:any[]=[];
    const today=new Date();
    for(let i=0;i<7;i++){
      const d = new Date(today); d.setDate(d.getDate()+i);
      const label = weekLabelFor(d, mondayA, breaks);
      const dateStr = ymd(d);
      const isHol = holidays.has(dateStr);
      const slots = isHol ? [] : templates[label]?.slots?.filter((s:any)=> s.weekday===d.getDay())||[];
      const tasks = await db.tasks.where("day").equals(dateStr).toArray();
      out.push({ date: dateStr, label, isHol, slotsCount: slots.length, tasksCount: tasks.length });
    }
    setDays(out);
  })();},[]);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Vue +7 jours</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Date</th>
            <th className="p-2">A/B</th>
            <th className="p-2">Férié/Vacances</th>
            <th className="p-2">Créneaux</th>
            <th className="p-2">Tâches</th>
          </tr>
        </thead>
        <tbody>
          {days.map(d=> (
            <tr key={d.date} className="border-t">
              <td className="p-2 font-medium">{d.date}</td>
              <td className="p-2 text-center">{d.label}</td>
              <td className="p-2 text-center">{d.isHol?"Oui":"Non"}</td>
              <td className="p-2 text-center">{d.slotsCount}</td>
              <td className="p-2 text-center">{d.tasksCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
