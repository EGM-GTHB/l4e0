"use client";
import { useState } from "react";
import { db } from "@/lib/db";

export default function QuizRunner({quiz}:{quiz:any}){
  const [ans, setAns] = useState<Record<string,string>>({});
  const [score, setScore] = useState<number|undefined>();

  async function grade(){
    let ok=0;
    quiz.items.forEach((it:any)=>{
      if((ans[it.id]||"").trim().toLowerCase() === (it.answer||"").trim().toLowerCase()) ok++;
    });
    const s = Math.round(100*ok/quiz.items.length);
    setScore(s);
    await db.points.put({ id: crypto.randomUUID(), ts: Date.now(), kind:"quiz", delta: Math.round(s/10) });
  }

  return (
    <div className="space-y-4">
      {quiz.items.map((it:any)=> (
        <div key={it.id} className="border p-3 rounded">
          <div className="font-medium">{it.q}</div>
          {it.kind==="MCQ" ? (
            <div className="space-y-1 mt-2">
              {it.options?.map((o:string)=> (
                <label key={o} className="block">
                  <input type="radio" name={it.id} onChange={()=> setAns({...ans,[it.id]:o})} /> {o}
                </label>
              ))}
            </div>
          ):(
            <input className="border px-2 py-1 w-full mt-2" onChange={e=> setAns({...ans,[it.id]:e.target.value})} />
          )}
        </div>
      ))}
      <button onClick={grade} className="px-4 py-2 rounded bg-black text-white">Corriger</button>
      {score!==undefined && <div>Score: <strong>{score}</strong></div>}
    </div>
  );
}
