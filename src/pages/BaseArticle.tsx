import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppNav } from '@/components/AppNav'
import { MagazineArticle } from '@/components/MagazineArticle'
import { Button } from '@/components/ui/button'
import { BY_ID, type IntelligenceId } from '@/data/intelligences'
import { getLayers } from '@/lib/synthesize'

export default function BaseArticle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const intel = id && id in BY_ID ? BY_ID[id as IntelligenceId] : undefined

  useEffect(() => {
    if (!intel) navigate('/composer', { replace: true })
  }, [intel, navigate])

  if (!intel) return null

  return (
    <div className="base-article-page min-h-screen">
      <AppNav />
      <main className="pt-28 pb-20 px-5 sm:px-8">
        <div className="no-print mag-topbar">
          <Button type="button" className="tool-btn" onClick={() => window.print()}>
            הורד PDF
          </Button>
        </div>
        <MagazineArticle
          title={intel.name}
          subtitle={`${intel.domain} · ${intel.keyword}`}
          lead={intel.description}
          layers={getLayers(intel.id)}
          idPrefix={`base-${intel.id}`}
          footer={intel.source}
        />
      </main>
    </div>
  )
}