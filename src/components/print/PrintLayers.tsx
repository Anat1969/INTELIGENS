import type { IntelligenceLayers } from '@/lib/synthesize'
import type { LayerImages } from '@/hooks/useLayerPrintImages'

const TITLES: Record<keyof LayerImages, string> = {
  persona: 'אישיות',
  space: 'מרחב מחיה',
  building: 'מבנה וסביבה',
}

const ORDER: (keyof LayerImages)[] = ['persona', 'space', 'building']

export function PrintLayers({
  layers,
  images,
}: {
  layers: IntelligenceLayers
  images: LayerImages
}) {
  return (
    <>
      <h2>סקאלת המחיה</h2>
      {ORDER.map((key) => (
        <div className="print-layer" key={key}>
          <h2>{TITLES[key]}</h2>
          <p>{layers.interp[key]}</p>
          {images[key] && (
            <img className="print-img" src={images[key] as string} alt={TITLES[key]} />
          )}
        </div>
      ))}
    </>
  )
}
