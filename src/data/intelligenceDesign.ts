import type { IntelligenceId } from './intelligences'

// The fourth, abstract layer — "שפה עיצובית" (design language): the aesthetic
// grammar (material, geometry, light, colour) from which the living space and
// the building are later derived. Slots only; the technical suffix is fixed in
// synthesize.ts. The interp text must bridge FORWARD to the space and building.
export interface DesignSlots {
  materials: string
  geometry: string
  light: string
  color: string
}

export const DESIGN_LAYERS: Record<IntelligenceId, DesignSlots & { interp: string }> = {
  linguistic: {
    materials: 'pale oak, linen and blackened steel with a matte paper grain',
    geometry: 'a linear, sequential grammar of stacked horizontal lines and quiet margins',
    light: 'warm low light grazing along the grain, edge to edge',
    color: 'a warm palette of parchment, ink-black and oak',
    interp: 'השפה העיצובית של התבונה הלשונית קווית ורצפית — שכבות אופקיות כמו שורות טקסט, ושוליים שנושמים. זהו הדקדוק שממנו ייבנו החדר והמבנה: מרחב שנקרא לאורך, סף אחרי סף.',
  },
  logical: {
    materials: 'matte white surfaces, anodized aluminium and clear glass',
    geometry: 'a strict orthogonal grid of exact modules and right angles',
    light: 'cool even shadowless light that states every edge honestly',
    color: 'a neutral palette of white, aluminium-grey and clear glass',
    interp: 'הדקדוק הלוגי הוא רשת — מודולים מדויקים וזוויות ישרות, בלי שרירותיות. ממנו ייגזרו חדר ומבנה שבהם לכל קו יש סיבה וכל פרט מוכיח את עצמו.',
  },
  spatial: {
    materials: 'translucent glass, honed pale concrete and thin steel edges',
    geometry: 'sharp perspectival geometry with overlapping transparent planes',
    light: 'cool directional daylight refracting through the layers',
    color: 'a crisp palette of clear grey, white and pale blue',
    interp: 'התבונה המרחבית חושבת בזכוכית ובקו. השפה שלה שקופה ומדויקת — מישורים שחופפים בלי להסתיר, אור שחושף מבנה במקום לרכך. זהו הדקדוק שממנו ייבנו החדר והמבנה: כל מרחב שהיא תיצור ידבר בשפת-האם הזו.',
  },
  musical: {
    materials: 'perforated anodized metal, taut stretched membranes and board-formed concrete',
    geometry: 'a repeating metric rhythm of evenly spaced ribs and measured intervals',
    light: 'pulsing side light returning in regular bands',
    color: 'a cool graphite palette with a single resonant accent',
    interp: 'השפה של התבונה המוזיקלית מקצבית — מרווחים חוזרים, צלעות במרחקים שווים, ושתיקות שנספרות. הדקדוק הזה יכתיב מרחב שנושם בפעימות ומבנה שמאיץ ומאט כמו תיבה.',
  },
  kinesthetic: {
    materials: 'rammed earth, warm timber and hand-worked textured stone',
    geometry: 'ergonomic curves and tactile, hand-shaped edges',
    light: 'warm grazing light raking across every texture',
    color: 'an earthy palette of clay, ochre and warm brown',
    interp: 'הדקדוק הגופני מוחשי — עקומות ארגונומיות ומרקם שמזמין מגע. ממנו ייבנו מרחב שנחווה בתנועה ומבנה שמכתיב מסלול גופני דרך החומר.',
  },
  interpersonal: {
    materials: 'acoustic felt, warm oak and soft clay plaster',
    geometry: 'soft rounded gathering forms and open, welcoming thresholds',
    light: 'diffuse ambient warmth with no hard shadow',
    color: 'a warm palette of wool, honey and soft terracotta',
    interp: 'השפה הבינאישית רכה — צורות מתעגלות שמזמינות התכנסות, קצוות בלי חדות. הדקדוק הזה יוליד מרחב של מפגש ומבנה עם קצוות חדירים שנפתחים אל הזולת.',
  },
  intrapersonal: {
    materials: 'smooth lime plaster, pale stone and oak',
    geometry: 'reductive singular planes and one clean aperture',
    light: 'one still, calm shaft of northern light',
    color: 'a quiet palette of chalk, stone-grey and pale oak',
    interp: 'הדקדוק התוך-אישי מצומצם — מישור אחד, פתח אחד, שקט. ממנו ייבנו חדר יחיד של התבוננות ומבנה מופנם סביב חצר דוממת.',
  },
  naturalist: {
    materials: 'rammed earth, untreated timber and living green surfaces',
    geometry: 'organic, branching and self-similar patterns across scales',
    light: 'dappled daylight filtered through foliage',
    color: 'an ecological palette of moss, soil and bark',
    interp: 'השפה הנטורליסטית אורגנית — דפוסים מסתעפים שחוזרים על עצמם בכל קנה-מידה. הדקדוק הזה ייצור מרחב ששזור בטבע ומבנה שמתנהג כמערכת חיה.',
  },
  existential: {
    materials: 'board-formed concrete, raw stone and deep shadow',
    geometry: 'monumental voids ordered by a single vertical axis',
    light: 'a dramatic shaft descending from a hidden source',
    color: 'a solemn palette of ash-grey, black and bare stone',
    interp: 'הדקדוק הקיומי מונומנטלי — ריקים גדולים וציר אנכי אחד. ממנו ייבנו מרחב של ספים ומבנה שממסגר את השמיים ואת האופק.',
  },
  emotional: {
    materials: 'warm pigmented plaster, terracotta and soft textile',
    geometry: 'flowing, enveloping curves with no sharp edge',
    light: 'warm golden light dissolving softly into the surfaces',
    color: 'a tender palette of blush, terracotta and amber',
    interp: 'השפה הרגשית זורמת — עקומות עוטפות וחום שאין בו קצה חד. הדקדוק הזה יוליד מרחב שמחזיק רגש ומבנה של נפחים חמים שמהדהדים עם מי שבתוכם.',
  },
  digital: {
    materials: 'brushed aluminium, structural glass and matte black composite',
    geometry: 'a parametric, modular and reconfigurable pattern field',
    light: 'cool programmable light in clean gradients',
    color: 'a precise palette of blue-white, graphite and glass',
    interp: 'הדקדוק הדיגיטלי פרמטרי — מודולים שמסתדרים מחדש לפי הצורך. ממנו ייבנו מרחב שמשתנה בזמן אמת ומבנה עם עור מסתגל שמגיב לשימוש.',
  },
  systems: {
    materials: 'exposed steel, glass and mapped concrete surfaces',
    geometry: 'a networked lattice of nodes and connecting lines',
    light: 'even analytical light that reveals the whole web at once',
    color: 'a diagrammatic palette of steel-grey, white and one signal accent',
    interp: 'השפה המערכתית רשתית — צמתים וקווים שמחברים הכול. הדקדוק הזה ייצור מרחב של קשרים גלויים ומבנה-תשתית שחושף את הזרימות שמאחורי הדברים.',
  },
}
