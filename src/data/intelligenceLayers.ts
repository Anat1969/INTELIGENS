import type { IntelligenceId } from "./intelligences";

export interface LayerSlots {
  type: string;
  persona: { archetype: string; action: string; setting: string; light: string; materials: string };
  space: { concept: string; materials: string; light: string; rhythm: string; element: string };
  building: { concept: string; site: string; materials: string; light: string; scale: string; context: string };
  interp: { persona: string; space: string; building: string };
}

export const LAYERS: Record<IntelligenceId, LayerSlots> = {
  linguistic: {
    type: "the linguistic-poetic intelligence",
    persona: { archetype: "a writer-orator who builds worlds from words", action: "mid-sentence, hand shaping the air, turning a phrase over on the tongue", setting: "a spare contemporary study lined with a single continuous reading rail", light: "warm low reading light pooling on the desk", materials: "pale oak, linen and blackened steel" },
    space: { concept: "rooms that unfold like a sentence — clause after clause, each opening onto the next", materials: "smooth lime plaster, oak and brushed brass", light: "soft raking light that lengthens as you move deeper", rhythm: "narrative, unhurried, sequential", element: "a slender spiral of shelving that threads every room into one continuous line" },
    building: { concept: "a volume composed as a legible sequence of framed thresholds read left to right", site: "a long colonnade that narrates the approach across the site", materials: "board-formed concrete, travertine and bronze reveals", light: "clear even daylight articulating each threshold", scale: "a civic library pavilion", context: "" },
    interp: { persona: "מי שיוצרת מציאות במילים. מונעת מהאמונה שהניסוח הנכון משנה את מה שאנשים מסוגלים לראות.", space: "מאכלסת חלל כמו טקסט: כל מעבר הוא משפט, כל פתח פסקה. אינטימיות שנבנית מרצף וקצב של קריאה.", building: "בקנה-מידה אדריכלי היא הופכת מבנה לנרטיב — רצף ספי-מעבר קריאים שמכתיבים איך חווים את המקום. עולם שבו המרחב עצמו נקרא." }
  },
  logical: {
    type: "the logical-structural intelligence",
    persona: { archetype: "a systems-thinker who spots the flaw at the start of the chain", action: "tracing a proof across a glass board, testing each step", setting: "a stripped contemporary studio of orthogonal grids and one long worktable", light: "cool even north light, shadowless", materials: "matte white surfaces, anodized aluminium and clear glass" },
    space: { concept: "a strict modular grid where every room is a proven unit, nothing arbitrary", materials: "exposed concrete frame, glass and steel", light: "clean diffuse light revealing the structure honestly", rhythm: "orthogonal, exact, modular", element: "an exposed structural lattice left visible as the logic of the whole" },
    building: { concept: "a rigorously gridded volume whose structure IS the argument, fully legible", site: "a clear datum line that orders the terrain around it", materials: "precast concrete frame, structural glass and exposed steel joints", light: "flat even daylight across a rational facade", scale: "a research institute", context: "" },
    interp: { persona: "מי שרואה את ההנחה המוטעית בתחילת השרשרת. מונעת מהצורך שהכול יעמוד בהוכחה.", space: "מאכלסת חלל כמערכת: רשת מדויקת שבה לכל דבר יש סיבה. אינטימיות שנבנית מסדר ובהירות.", building: "בקנה-מידה אדריכלי היא הופכת מבנה להוכחה גלויה — קונסטרוקציה שהיא עצמה הטיעון. עולם שבו הסדר נראה לעין." }
  },
  spatial: {
    type: "the spatial-visual intelligence",
    persona: { archetype: "a designer who rotates objects in the mind before they exist", action: "stepping back, framing a view with both hands, studying a scale model", setting: "a bright contemporary atelier of large models and pinned elevations", light: "crisp directional light casting sharp legible shadows", materials: "white card models, plywood and glass" },
    space: { concept: "a composition of interlocking volumes and framed views, three-dimensional at every turn", materials: "white plaster, glass and pale concrete", light: "sculpted light that models depth and reveals hidden corners", rhythm: "layered, compositional, sightline-driven", element: "a floating stair that reframes the whole space with every step" },
    building: { concept: "a sculptural massing of shifted volumes framing precise views out and through", site: "the building carves and frames the landscape into composed vistas", materials: "smooth white concrete, large glazing and thin steel", light: "dramatic directional daylight sculpting the masses", scale: "a hilltop museum", context: "overlooking a Mediterranean valley" },
    interp: { persona: "מי שרואה מה מסתתר מאחורי הפינה. מונעת מהצורך לסדר את העולם לקומפוזיציה.", space: "מאכלסת חלל כפיסול: נפחים שנכנסים זה בזה, מבטים ממוסגרים, עומק בכל פנייה. אינטימיות שנבנית מראייה.", building: "בקנה-מידה אדריכלי היא מפסלת נוף — מסה שממסגרת מבטים והופכת סביבה לתצוגה מורכבת. עולם שנבנה מהעין." }
  },
  musical: {
    type: "the rhythmic-acoustic intelligence",
    persona: { archetype: "a rhythm-analyst who hears hidden structure inside noise", action: "eyes half-closed, one hand suspended mid-air marking an unheard beat while adjusting a modular synthesizer", setting: "a minimalist contemporary sound lab of pale micro-perforated acoustic panels around a single sculptural monolithic desk", light: "cool even north light in steady rhythmic bands across the panels", materials: "brushed aluminium, matte concrete and taut acoustic fabric" },
    space: { concept: "a sequence of rooms tuned like a scale — each bay a beat, widening and narrowing in precise measured intervals", materials: "board-formed concrete, perforated anodized metal and taut stretched membranes", light: "pulsing side light repeating down the corridor at even intervals", rhythm: "intimate, layered, metric", element: "a floating ceiling of parametric ribs spaced like a metronome, tightening toward the far end" },
    building: { concept: "a long low volume articulated as a repeating series of structural bays that accelerate and decelerate like a musical measure", site: "the building meets open terrain in a rhythmic colonnade that fades into the landscape", materials: "ribbed precast concrete, perforated bronze screens and glass in a syncopated facade pattern", light: "broad even daylight sweeping across the whole site at regular intervals", scale: "a civic-scale cultural pavilion", context: "set within a dry Mediterranean hillside of terraced stone" },
    interp: { persona: "מי ששומעת סדר ברעש. מונעת מהצורך למצוא את הדופק הנסתר של כל דבר — לזהות את התבנית לפני שאחרים שומעים בכלל צליל.", space: "מאכלסת חלל כמו פרטיטורה: כל פינה מתוזמנת, המרווחים נושמים בקצב, והשקט בין הדברים חשוב לא פחות מהם. אינטימיות שנבנית ממחזוריות.", building: "בקנה-מידה של מבנה וסביבה הקצב הופך לחוק ארגון: מקצב מבני שמאיץ ומאט, חזית מתוזמנת, נוכחות ציבורית שמכתיבה לסביבה פעימה. עולם שבו האדריכלות עצמה נשמעת." }
  },
  kinesthetic: {
    type: "the bodily-kinesthetic intelligence",
    persona: { archetype: "a maker whose hands know before the mind does", action: "shaping material directly, sleeves up, trusting the grip", setting: "a contemporary workshop of clean benches and hand tools", light: "warm focused task light on the working hands", materials: "raw timber, clay and forged steel" },
    space: { concept: "a space you move THROUGH with the body — ramps, handholds and floors that change underfoot", materials: "tactile rammed earth, warm timber and textured stone", light: "warm grazing light that reveals every surface texture", rhythm: "ergonomic, tactile, kinetic", element: "a continuous ramping floor that choreographs how you move" },
    building: { concept: "a building organized around movement and touch — a choreographed path through tactile material", site: "the building follows the land's slope as a walkable gesture", materials: "rammed earth, board-formed concrete and warm timber", light: "warm raking daylight emphasizing texture across the site", scale: "a sports and dance campus", context: "" },
    interp: { persona: "מי שיודעת בידיים לפני שהראש מעבד. מונעת מהאמון בגוף כמקור ידע.", space: "מאכלסת חלל בתנועה: רמפות, מרקמים, רצפה שמשתנה תחת כף הרגל. אינטימיות שנבנית ממגע.", building: "בקנה-מידה אדריכלי היא הופכת מבנה לכוריאוגרפיה — מסלול גופני דרך חומר מוחשי. עולם שנחווה דרך הגוף." }
  },
  interpersonal: {
    type: "the interpersonal intelligence",
    persona: { archetype: "a facilitator who reads the unspoken in a room", action: "leaning in, fully present, listening to a small circle", setting: "a warm contemporary gathering room with soft seating in the round", light: "even inviting light with no harsh shadow", materials: "wool felt, warm wood and soft plaster" },
    space: { concept: "rooms shaped around gathering — circles, thresholds and soft edges that invite", materials: "acoustic felt, warm oak and clay plaster", light: "diffuse ambient light that flatters faces", rhythm: "convivial, circular, welcoming", element: "a central sunken conversation pit that draws people together" },
    building: { concept: "a building of connective public rooms and porous edges where people meet", site: "the building opens generously to a shared public plaza", materials: "warm brick, timber and large soft-framed openings", light: "warm even daylight across welcoming thresholds", scale: "a community center", context: "on a lively town square" },
    interp: { persona: "מי שיודעת מה האדם שמולה צריך לפני שנשאל. מונעת מהקשב לאחר.", space: "מאכלסת חלל סביב מפגש: מעגלים, ספים רכים, קצוות שמזמינים. אינטימיות שנבנית מנוכחות.", building: "בקנה-מידה אדריכלי היא הופכת מבנה למרקם חברתי — חדרים מקשרים וקצוות חדירים. עולם שנבנה מהקשר בין אנשים." }
  },
  intrapersonal: {
    type: "the intrapersonal intelligence",
    persona: { archetype: "a self-knower with a precise inner map", action: "seated in stillness, gaze inward, unhurried", setting: "a quiet contemporary retreat room, almost empty, with one window", light: "a single shaft of calm daylight", materials: "pale lime plaster, oak and stone" },
    space: { concept: "a single contemplative room stripped to essentials, oriented to one view", materials: "smooth plaster, pale stone and oak", light: "one still beam of northern light", rhythm: "quiet, singular, meditative", element: "a deep window seat framing one uninterrupted horizon" },
    building: { concept: "a reticent monolithic volume turned inward around a silent courtyard", site: "the building withdraws from the world around a private inner court", materials: "monolithic concrete, stone and deep reveals", light: "a calm shaft of light falling into an inner court", scale: "a meditation retreat", context: "in a quiet desert clearing" },
    interp: { persona: "מי שמחזיקה מפה פנימית מדויקת. מונעת מהצורך בבהירות עם עצמה.", space: "מאכלסת חלל בצמצום: חדר אחד, מבט אחד, שקט. אינטימיות שנבנית מהתבוננות פנימה.", building: "בקנה-מידה אדריכלי היא הופכת מבנה למונוליט מופנם סביב חצר שקטה. עולם שנבנה מבהירות פנימית." }
  },
  naturalist: {
    type: "the naturalistic-ecological intelligence",
    persona: { archetype: "an ecologist who classifies and reads living systems", action: "crouched, examining specimens, sorting by subtle difference", setting: "a contemporary field station open to the landscape", light: "soft natural daylight matching the outdoors", materials: "untreated timber, stone and living green" },
    space: { concept: "a space woven into nature — thresholds blur between inside and living landscape", materials: "rammed earth, timber and planted surfaces", light: "dappled daylight filtered through vegetation", rhythm: "organic, ecological, self-sustaining", element: "a planted courtyard that runs straight through the building" },
    building: { concept: "a low bio-integrated building that behaves like an ecosystem, self-regulating", site: "the building dissolves into terraced landscape and water", materials: "rammed earth, mass timber and green roofs", light: "even natural daylight across a living facade", scale: "an ecological research campus", context: "beside a restored wetland" },
    interp: { persona: "מי שרואה את המערכת שמאחורי הפרטים. מונעת מהחשיבה האקולוגית — הכול קשור להכול.", space: "מאכלסת חלל כבית-גידול: הגבול בין פנים לטבע מיטשטש. אינטימיות שנבנית מהשתלבות.", building: "בקנה-מידה אדריכלי היא הופכת מבנה למערכת חיה שמווסתת את עצמה. עולם שנבנה מקיימות." }
  },
  existential: {
    type: "the existential-philosophical intelligence",
    persona: { archetype: "a philosopher oriented by the largest questions", action: "standing at a threshold, gazing toward the horizon in thought", setting: "a stark contemporary space open to the sky, almost sacred", light: "a single dramatic beam from high above", materials: "raw concrete, stone and void" },
    space: { concept: "a space of thresholds and voids that stages the questions of meaning", materials: "board-formed concrete, stone and deep shadow", light: "a shaft of light descending from a hidden source", rhythm: "solemn, vertical, contemplative", element: "a tall silent void drawing the eye upward to a slot of sky" },
    building: { concept: "a monumental threshold building framing sky, horizon and passage", site: "the building marks the edge between land and infinite horizon", materials: "monolithic concrete, stone and vast openings to the sky", light: "dramatic celestial light through a single great aperture", scale: "a place of contemplation and memorial", context: "at the rim of a desert cliff" },
    interp: { persona: "מי שמכוונת לפי השאלות הגדולות. מונעת מהצורך במשמעות ותכלית.", space: "מאכלסת חלל של ספים וריקים: המרחב מעמיד את שאלות הקיום. אינטימיות שנבנית מעומק.", building: "בקנה-מידה אדריכלי היא הופכת מבנה לסף בין הארץ לאינסוף. עולם שנבנה מהמשמעות." }
  },
  emotional: {
    type: "the emotional intelligence",
    persona: { archetype: "an empath who turns feeling into energy for action", action: "hand to chest, attuned, holding another's gaze with warmth", setting: "a soft contemporary room in warm tones, enveloping", light: "warm golden light, tender", materials: "warm terracotta, velvet and rounded plaster" },
    space: { concept: "a space of soft curves and enveloping warmth that holds emotion", materials: "warm plaster, terracotta and textile", light: "golden ambient light with no hard edge", rhythm: "flowing, embracing, resonant", element: "a curved womb-like alcove that wraps around you" },
    building: { concept: "a building of flowing warm volumes that resonate with those inside", site: "the building embraces a sheltered warm garden", materials: "warm pigmented concrete, terracotta and timber", light: "warm golden daylight washing curved surfaces", scale: "a wellbeing and arts center", context: "" },
    interp: { persona: "מי שמתרגמת רגש לאנרגיית פעולה. מונעת מהתהודה עם מה שאחרים מרגישים.", space: "מאכלסת חלל ברכות: עקומות, חום, מרחב שמחזיק רגש. אינטימיות שנבנית מתהודה.", building: "בקנה-מידה אדריכלי היא הופכת מבנה לנפחים זורמים וחמים שמהדהדים. עולם שנבנה מהלב." }
  },
  digital: {
    type: "the digital-systemic intelligence",
    persona: { archetype: "a builder who thinks WITH the machine, not for it", action: "at a clean interface, orchestrating flows of data with calm precision", setting: "a crisp contemporary lab of screens and modular tech", light: "cool blue-white light, precise", materials: "brushed aluminium, glass and matte black composite" },
    space: { concept: "a responsive space of layers and interfaces, reconfigurable and networked", materials: "aluminium, glass and dark composite", light: "cool programmable light in clean gradients", rhythm: "modular, parametric, networked", element: "a kinetic reconfigurable partition system that adapts to use" },
    building: { concept: "a smart parametric building whose skin and systems adapt in real time", site: "the building connects into an infrastructural digital campus", materials: "anodized aluminium, structural glass and carbon composite", light: "cool even daylight through a parametric responsive facade", scale: "a technology campus", context: "" },
    interp: { persona: "מי שמתרגמת בין כוונה אנושית לביצוע מחשבי. מונעת מהיכולת לחשוב עם המכונה.", space: "מאכלסת חלל כממשק: שכבות, רשת, מרחב שמשתנה לפי הצורך. אינטימיות שנבנית מלוגיקה.", building: "בקנה-מידה אדריכלי היא הופכת מבנה למערכת פרמטרית מסתגלת. עולם שנבנה מזרימת מידע." }
  },
  systems: {
    type: "the systemic-causal intelligence",
    persona: { archetype: "a strategist who sees hidden feedback loops and leverage points", action: "mapping connections across a vast diagram, finding the one node that moves all", setting: "a contemporary operations room wrapped in a continuous connective diagram", light: "even analytical light, comprehensive", materials: "dark steel, glass and mapped surfaces" },
    space: { concept: "a space of interconnections — every part linked, feedback loops made visible", materials: "exposed steel networks, glass and concrete", light: "even light revealing the web of connections", rhythm: "networked, interdependent, looping", element: "an exposed circulatory system of paths and links threading every level" },
    building: { concept: "a connective infrastructural building that reveals the flows binding a whole system", site: "the building acts as a hinge knitting disparate parts of the city", materials: "exposed steel, glass bridges and concrete cores", light: "broad even daylight across an interlinked structure", scale: "a civic transit interchange", context: "at a key urban junction" },
    interp: { persona: "מי שרואה את הקשרים הנסתרים ונקודות המינוף. מונעת מהראייה המערכתית.", space: "מאכלסת חלל של חיבורים: כל חלק מקושר, לולאות המשוב גלויות. אינטימיות שנבנית מקשרים.", building: "בקנה-מידה אדריכלי היא הופכת מבנה לתשתית מקשרת שחושפת את הזרימות. עולם שנבנה מהקשרים בין דברים." }
  }
};
