"use client";
import { useState } from "react";
import QuizRunner from "@/components/QuizRunner";
import { db } from "@/lib/db";

export default function Page(){
  const [topic, setTopic] = useState("Thalès");
  const [quiz, setQuiz] = useState<any>(null);

  async function gen(){
    const res = await fetch("/api/llm/quiz",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ topic, taskId: "demo-task" })
    });
    const js = await res.json();
    setQuiz(js.data);
    if(js?.usage){
      await db.costs.put({ id: crypto.randomUUID(), ts: Date.now(), model: js.usage.model, inTok: js.usage.inTok, outTok: js.usage.outTok });
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Quizz</h1>
      <div className="flex gap-2">
        <input value={topic} onChange={e=> setTopic(e.target.value)} className="border px-2 py-1" />
        <button onClick={gen} className="px-4 py-2 rounded bg-black text-white">Générer</button>
      </div>
      {quiz && <QuizRunner quiz={quiz} />}
    </main>
  );
}
