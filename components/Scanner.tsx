"use client";
import { useState } from "react";
import { db } from "@/lib/db";

export default function Scanner(){
  const [edImg, setEdImg] = useState<string|undefined>();
  const [agImg, setAgImg] = useState<string|undefined>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>, set:(v:string)=>void){
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ()=> set(r.result as string);
    r.readAsDataURL(f);
  }

  async function extract(){
    setBusy(true); setResult(null);
    const res = await fetch("/api/llm/extract", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ images: [edImg, agImg].filter(Boolean) })
    });
    const js = await res.json();
    setResult(js);
    if(js?.data?.items){ for(const it of js.data.items){ await db.assignments.put({ ...it }); } }
    if(js?.usage){ await db.costs.put({ id: crypto.randomUUID(), ts: Date.now(), model: js.usage.model, inTok: js.usage.inTok, outTok: js.usage.outTok }); }
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Photo écran ED — Devoirs</label>
        <input type="file" accept="image/*" onChange={e=> onPick(e, v=> setEdImg(v))} />
      </div>
      <div>
        <label className="block font-medium">Photo agenda papier</label>
        <input type="file" accept="image/*" onChange={e=> onPick(e, v=> setAgImg(v))} />
      </div>
      <button disabled={busy || !edImg} onClick={extract} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        Extraire les devoirs
      </button>
      {result && <pre className="text-xs bg-gray-50 p-2 overflow-auto max-h-64">{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}
