import { useMemo } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { DATA_SOURCES } from '@/data/sources'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatusPipeline, type PipelineItem } from '@/components/ui/StatusPipeline'


interface OpenLibraryWork {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  edition_count?: number
  ebook_access?: string
}

interface TrendingResponse {
  works: OpenLibraryWork[]
}

function mapAccess(work: OpenLibraryWork): { status: PipelineItem['status']; label: string } {
  if (work.ebook_access === 'public') return { status: 'success', label: 'Public' }
  if (work.ebook_access === 'borrowable') return { status: 'upcoming', label: 'Borrowable' }
  return { status: 'failed', label: 'Print Only' }
}

function toBookItems(works: OpenLibraryWork[]): PipelineItem[] {
  return works.slice(0, 12).map(w => {
    const { status, label } = mapAccess(w)
    return {
      id: w.key,
      title: w.title,
      subtitle: w.author_name?.slice(0, 2).join(', ') ?? 'Unknown Author',
      date: w.first_publish_year ? `First published ${w.first_publish_year}` : 'Publication date unknown',
      status,
      statusLabel: label,
      imageUrl: w.cover_i
        ? `https://covers.openlibrary.org/b/id/${w.cover_i}-M.jpg`
        : null,
      details: w.edition_count
        ? `${w.edition_count} edition${w.edition_count > 1 ? 's' : ''} available`
        : null,
      linkUrl: `https://openlibrary.org${w.key}`,
      linkLabel: 'View on Open Library',
    }
  })
}

export function BooksPipelineSection() {
  const { data, loading, error } = useFetch<TrendingResponse>(DATA_SOURCES.openLibrary.endpoint)

  const items = useMemo<PipelineItem[]>(
    () => (data?.works ? toBookItems(data.works) : []),
    [data]
  )

  return (
    <>
      <SectionHeader
        badge="PIPELINE"
        title="Trending on the Shelf"
        subtitle={`${DATA_SOURCES.openLibrary.name} · ${DATA_SOURCES.openLibrary.license}`}
        sourceUrl={DATA_SOURCES.openLibrary.url}
      />
      {loading ? (
        <div className="float-card" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: '60%', height: 20 }} />
        </div>
      ) : error ? (
        <div className="float-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Unable to load trending books. Try again later.
        </div>
      ) : (
        <StatusPipeline items={items} />
      )}
      <p className={"attribution"}>
        Data from {DATA_SOURCES.openLibrary.name} · {DATA_SOURCES.openLibrary.license}
      </p>
    </>
  )
}
