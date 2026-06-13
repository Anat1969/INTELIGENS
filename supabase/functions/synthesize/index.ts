import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_INSTRUCTION = `
אתה פילוסוף קוגניטיבי ומדען רב-תחומי, מתמחה בתיאוריית האינטליגנציות המרובות, פסיכולוגיה קוגניטיבית ומדעי המוח.

## תפקיד
כשמקבלים שילוב של אינטליגנציות, תפקידך לזהות את ה**ישות הקוגניטיבית החדשה** שנוצרת בצומת ביניהן. זה לא סכום חלקים — אלא תופעת-על (emergence) שאינה קיימת כשכל אינטליגנציה פועלת לבדה.

## חוקים
1. **שם** — 2-4 מילים בעברית. פואטי, מדויק, ייחודי.
2. **תת-כותרת** — ביטוי קצר (3-6 מילים).
3. **הגרעין** — פסקה בת 3-4 משפטים, פילוסופית ועמוקה.
4. **העוצמה** — פסקה בת 2-3 משפטים, עם דוגמאות קונקרטיות.
5. **תפקידים** — 5-6 תפקידים ספציפיים ובלתי-שגרתיים.
6. **הציטוט** — משפט אחד פואטי שנשאר.
7. **שאלת-מפתח** — שאלה עמוקה שרק הצירוף הזה יכול לשאול.
8. **פרומפט ויזואלי** — באנגלית, 2-3 משפטים, מטאפורי.

השב אך ורק ב-JSON תקין, ללא טקסט נוסף, ללא markdown, ללא backticks.
`;

interface Intelligence {
  id: string;
  name: string;
  domain: string;
  description: string;
}

function buildUserPrompt(intelligences: Intelligence[]): string {
  const list = intelligences
    .map((i) => `— **${i.name}** (תחום: ${i.domain})\n  ${i.description}`)
    .join("\n\n");
  return `הנה ${intelligences.length} אינטליגנציות שנבחרו:\n\n${list}\n\nזהה את האינטליגנציה החדשה שנוצרת בצומת כולן.\n\nהחזר JSON בפורמט:\n{\n  "name": "...",\n  "type": "...",\n  "essence": "...",\n  "power": "...",\n  "roles": ["...","...","...","...","..."],\n  "quote": "...",\n  "keyQuestion": "...",\n  "visualPrompt": "..."\n}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { intelligences } = await req.json();
    if (!Array.isArray(intelligences) || intelligences.length < 2) {
      return new Response(JSON.stringify({ error: "At least 2 intelligences required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: buildUserPrompt(intelligences) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let text: string = data.choices?.[0]?.message?.content ?? "";
    text = text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    const parsed = JSON.parse(text);

    const result = {
      name: parsed.name,
      type: parsed.type,
      essence: parsed.essence,
      power: parsed.power,
      roles: parsed.roles,
      quote: parsed.quote,
      keyQuestion: parsed.keyQuestion || "",
      visualPrompt: parsed.visualPrompt || "",
      source_ids: intelligences.map((i: Intelligence) => i.id),
      source: "synthesized",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("synthesize error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});