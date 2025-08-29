"use client";
import { useState } from "react";
import { db } from "@/lib/db";

export default function Page(){
  const [images, setImages] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [consigne, setConsigne] = useState("");
  const [result, setResult] = useState<any>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ()=> setImages(prev=> [...prev, r.result as string]);
    r.readAsDataURL(f);
  }

  async function evaluate(){
    const res = await fetch("/api/llm/eval",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ images, assignmentId: "assign", topic, consigne })
    });
    const js = await res.json();
    setResult(js.data);
    if(js?.data?.finalScore !== undefined){
      await db.points.put({ id: crypto.randomUUID(), ts: Date.now(), kind:"devoir", delta: Math.round(js.data.finalScore/5) });
    }
    if(js?.usage){
      await db.costs.put({ id: crypto.randomUUID(), ts: Date.now(), model: js.usage.model, inTok: js.usage.inTok, outTok: js.usage.outTok });
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Évaluation (scan)</h1>
      <div className="space-y-2">
        <input type="file" accept="image/*" onChange={onPick} />
        <div className="text-xs text-gray-500">Images sélectionnées : {images.length}</div>
        <input placeholder="Topic" className="border px-2 py-1 w-full" value={topic} onChange={e=> setTopic(e.target.value)} />
        <input placeholder="Consigne" className="border px-2 py-1 w-full" value={consigne} onChange={e=> setConsigne(e.target.value)} />
        <button onClick={evaluate} className="px-4 py-2 rounded bg-black text-white">Évaluer</button>
      </div>
      {result && <pre className="text-xs bg-gray-50 p-2 overflow-auto max-h-64">{JSON.stringify(result,null,2)}</pre>}
    </main>
  );
}
