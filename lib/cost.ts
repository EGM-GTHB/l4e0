export type Pricing = { inPerMTok:number; outPerMTok:number };
export const DEFAULT_PRICING: Record<string,Pricing> = {
  "gpt-4o": { inPerMTok: 5/1_000, outPerMTok: 15/1_000 },
  "gpt-5":  { inPerMTok: 1.25/1_000, outPerMTok: 10/1_000 },
  "gpt-5-mini": { inPerMTok: 0.25/1_000, outPerMTok: 2/1_000 }
};
export function estimateCostUSD(model:string, inTok:number, outTok:number, pricing=DEFAULT_PRICING){
  const p = pricing[model] || pricing["gpt-4o"];
  const cost = inTok * p.inPerMTok + outTok * p.outPerMTok;
  return +cost.toFixed(6);
}
