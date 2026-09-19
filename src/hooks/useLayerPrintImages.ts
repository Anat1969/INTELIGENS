import { useEffect, useState } from 'react'
import { resolvePrintImage } from '@/lib/living-image'

export interface LayerImages {
  persona: string | null
  space: string | null
  building: string | null
}

const EMPTY: LayerImages = { persona: null, space: null, building: null }

/** Resolves the three layer images (persona/space/building) as embedded, print-ready sources. */
export function useLayerPrintImages(idPrefix: string | null | undefined): LayerImages {
  const [images, setImages] = useState<LayerImages>(EMPTY)

  useEffect(() => {
    let alive = true
    if (!idPrefix) {
      setImages(EMPTY)
      return
    }
    setImages(EMPTY)
    Promise.all([
      resolvePrintImage(`${idPrefix}-persona`),
      resolvePrintImage(`${idPrefix}-space`),
      resolvePrintImage(`${idPrefix}-building`),
    ]).then(([persona, space, building]) => {
      if (alive) setImages({ persona, space, building })
    })
    return () => {
      alive = false
    }
  }, [idPrefix])

  return images
}
