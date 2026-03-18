import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { useFetch } from '@/hooks/useFetch'
import { DATA_SOURCES } from '@/data/sources'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './ArtworkSection.module.css'

const IIIF_BASE = 'https://www.artic.edu/iiif/2'
const FIELDS = 'id,title,artist_display,date_display,medium_display,image_id,thumbnail,description'
const TOTAL_ARTWORKS = 120000
const COOLDOWN_SECONDS = 60
const COOLDOWN_STORAGE_KEY = 'artic-random-cooldown'
const RANDOM_PAGE_STORAGE_KEY = 'artic-random-page'

interface Artwork {
  id: number
  title: string
  artist_display: string
  date_display: string
  medium_display: string
  image_id: string | null
  thumbnail: { alt_text: string } | null
  description: string | null
}

interface ArticResponse {
  data: Artwork[]
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent ?? ''
}

function getStoredCooldown(): number {
  try {
    const raw = localStorage.getItem(COOLDOWN_STORAGE_KEY)
    if (!raw) return 0
    const expiresAt = Number(raw)
    const remaining = Math.ceil((expiresAt - Date.now()) / 1000)
    return remaining > 0 ? remaining : 0
  } catch {
    return 0
  }
}

function storeCooldownExpiry() {
  try {
    localStorage.setItem(COOLDOWN_STORAGE_KEY, String(Date.now() + COOLDOWN_SECONDS * 1000))
  } catch { /* ignore */ }
}

function getStoredRandomPage(): number | null {
  try {
    const raw = localStorage.getItem(RANDOM_PAGE_STORAGE_KEY)
    return raw ? Number(raw) : null
  } catch {
    return null
  }
}

function storeRandomPage(page: number) {
  try {
    localStorage.setItem(RANDOM_PAGE_STORAGE_KEY, String(page))
  } catch { /* ignore */ }
}

export function ArtworkSection() {
  const storedRandomPage = getStoredRandomPage()
  const [page, setPage] = useState(1)
  const [randomPage, setRandomPage] = useState<number | null>(storedRandomPage)
  const [expanded, setExpanded] = useState(false)
  const [activeBtn, setActiveBtn] = useState<'featured' | 'random'>('featured')

  const url = useMemo(
    () => `${DATA_SOURCES.artic.endpoint}?fields=${FIELDS}&limit=1&page=${page}`,
    [page]
  )

  const { data, loading, error } = useFetch<ArticResponse>(url)
  const artwork = data?.data?.[0] ?? null

  const imageUrl = artwork?.image_id
    ? `${IIIF_BASE}/${artwork.image_id}/full/843,/0/default.jpg`
    : null

  // Cooldown timer — persisted to localStorage as an expiry timestamp
  const [cooldown, setCooldown] = useState(getStoredCooldown)
  const cooldownActive = cooldown > 0

  useEffect(() => {
    if (!cooldownActive) return
    const id = setInterval(() => {
      setCooldown(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [cooldownActive])

  const handleFeatured = useCallback(() => {
    setPage(1)
    setActiveBtn('featured')
    setExpanded(false)
  }, [])

  const fetchNewRandom = useCallback(() => {
    const newPage = Math.floor(Math.random() * TOTAL_ARTWORKS) + 1
    setPage(newPage)
    setRandomPage(newPage)
    storeRandomPage(newPage)
    setActiveBtn('random')
    setExpanded(false)
    setCooldown(COOLDOWN_SECONDS)
    storeCooldownExpiry()
  }, [])

  const handleRandom = useCallback(() => {
    if (cooldownActive) {
      // Cooldown still active — toggle back to the last random artwork
      if (randomPage) {
        setPage(randomPage)
        setActiveBtn('random')
        setExpanded(false)
      }
      return
    }
    fetchNewRandom()
  }, [cooldownActive, randomPage, fetchNewRandom])

  return (
    <>
      <SectionHeader
        badge="MEDIA"
        title="From the Collection"
        subtitle={`${DATA_SOURCES.artic.name} · ${DATA_SOURCES.artic.license}`}
        sourceUrl={DATA_SOURCES.artic.url}
      />

      <motion.div variants={childVariants} className={styles.buttons}>
        <button
          className={`${styles.btn} ${activeBtn === 'featured' ? styles.btnActive : ''}`}
          onClick={handleFeatured}
        >
          Featured
        </button>
        <button
          className={`${styles.btn} ${activeBtn === 'random' ? styles.btnActive : ''}`}
          onClick={handleRandom}
        >
          {cooldownActive
            ? `Random (${cooldown}s)`
            : <>Random {activeBtn === 'random' && randomPage && <RefreshCw size={12} className={styles.refreshIcon} />}</>
          }
        </button>
      </motion.div>

      <motion.div className={`float-card ${styles.card}`} variants={childVariants}>
        {loading && (
          <div>
            <div className="skeleton" style={{ width: '100%', height: 400, borderRadius: 12, marginBottom: 16 }} />
            <div className="skeleton" style={{ width: '60%', height: 24, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '40%', height: 16, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '100%', height: 48 }} />
          </div>
        )}

        {error && (
          <div className={styles.error}>
            Unable to load artwork. Please try again.
          </div>
        )}

        {artwork && !loading && (
          <>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={artwork.thumbnail?.alt_text ?? artwork.title}
                className={styles.media}
              />
            )}
            <h3 className={styles.artTitle}>{artwork.title}</h3>
            <p className={styles.artist}>{artwork.artist_display}</p>
            <p className={styles.meta}>
              {artwork.date_display}
              {artwork.medium_display && ` · ${artwork.medium_display}`}
            </p>
            {artwork.description && (
              <>
                <p className={`${styles.description} ${!expanded ? styles.clamped : ''}`}>
                  {stripHtml(artwork.description)}
                </p>
                <button className={styles.readMore} onClick={() => setExpanded(!expanded)}>
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              </>
            )}
            <a
              href={`https://www.artic.edu/artworks/${artwork.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewLink}
            >
              View on artic.edu <ExternalLink size={12} />
            </a>
          </>
        )}
      </motion.div>

      <p className={"attribution"}>
        Data from {DATA_SOURCES.artic.name} · {DATA_SOURCES.artic.license}
      </p>
    </>
  )
}
