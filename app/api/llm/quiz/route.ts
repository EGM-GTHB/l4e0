import { NextRequest, NextResponse } from "next/server";
import { Quiz } from "@/lib/schemas";

export async function POST(req: NextRequest){
  try{
    const { topic, taskId } = await req.json();
    if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:"Missing OPENAI_API_KEY"},{status:500});

    const r = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{ "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        temperature: 0.2,
        response_format:{type:"json_object"},
        messages:[
          {role:"system",content:"Generate a 3-5 question quiz (MCQ or SHORT) for a French 4e student. Return ONLY minified JSON: {id,taskId,items:[{id,kind,q,options?,answer,explanation?}]}"},
          {role:"user",content:`topic=${topic}; taskId=${taskId||"task"}`}
        ]
      })
    });
    const js = await r.json();
    const raw = js.choices?.[0]?.message?.content ?? "{}";
    const quiz = Quiz.parse(JSON.parse(raw));

    const usage = js.usage || {};
    const inTok = usage.input_tokens ?? usage.prompt_tokens ?? 0;
    const outTok = usage.output_tokens ?? usage.completion_tokens ?? 0;

    return NextResponse.json({ data: quiz, usage: { model: (process.env.OPENAI_MODEL||"gpt-4o"), inTok, outTok } });
  }catch(e:any){
    return NextResponse.json({error:e?.message||"quiz failed"},{status:500});
  }
}
