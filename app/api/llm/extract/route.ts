import { NextRequest, NextResponse } from "next/server";
import { AssignmentList } from "@/lib/schemas";

export async function POST(req: NextRequest){
  try{
    const { images } = await req.json();
    if(!process.env.OPENAI_API_KEY) return NextResponse.json({error:"Missing OPENAI_API_KEY"},{status:500});

    const messages:any[] = [
      { role: "system", content: "You extract French homework items from screenshots/notes. Return ONLY minified JSON: {\"items\":[{\"id\":string,\"subject\":string,\"due\":\"YYYY-MM-DD\",\"type\":\"DM|DST|Exposé|Révision\",\"title\"?:string,\"rawText\"?:string,\"estimateMin\"?:number,\"source\":\"ED|AGENDA\"}]}" },
      { role: "user", content: [
        { type: "text", text: "Images suivantes (1=ED, 2=AGENDA) :" },
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
    const parsed = JSON.parse(raw);
    const data = AssignmentList.parse(parsed);

    const usage = js.usage || {};
    const inTok = usage.input_tokens ?? usage.prompt_tokens ?? 0;
    const outTok = usage.output_tokens ?? usage.completion_tokens ?? 0;

    return NextResponse.json({ data, usage: { model: (process.env.OPENAI_MODEL||"gpt-4o"), inTok, outTok } });
  }catch(e:any){
    return NextResponse.json({error:e?.message||"extract failed"},{status:500});
  }
}
