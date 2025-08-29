import { NextRequest, NextResponse } from "next/server";
import { Evaluation } from "@/lib/schemas";

export async function POST(req: NextRequest){
  try{
    const { images, assignmentId, topic, consigne } = await req.json();
    if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:"Missing OPENAI_API_KEY"},{status:500});

    const messages:any[] = [
      { role:"system", content: "Evaluate the uploaded student work against topic and instruction. Score accuracy, method, coverage, presentation (0..100); confidence (0..1); finalScore. Return ONLY minified JSON: {id,assignmentId,accuracy,method,coverage,presentation,confidence,finalScore,rationale?}" },
      { role:"user", content: [
        { type:"text", text: `assignmentId=${assignmentId||"assign"}; topic=${topic||""}; consigne=${consigne||""}` },
        ...(images||[]).map((u:string)=> ({ type:"image_url" as const, image_url: { url: u } }))
      ]}
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{ "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o", temperature: 0.2, response_format:{type:"json_object"}, messages })
    });
    const js = await r.json();
    const raw = js.choices?.[0]?.message?.content ?? "{}";
    const out = Evaluation.parse(JSON.parse(raw));

    const usage = js.usage || {};
    const inTok = usage.input_tokens ?? usage.prompt_tokens ?? 0;
    const outTok = usage.output_tokens ?? usage.completion_tokens ?? 0;

    return NextResponse.json({ data: out, usage: { model: (process.env.OPENAI_MODEL||"gpt-4o"), inTok, outTok } });
  }catch(e:any){
    return NextResponse.json({error:e?.message||"eval failed"},{status:500});
  }
}
