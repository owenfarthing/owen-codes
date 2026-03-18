import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './StatusPipeline.module.css'

export interface PipelineItem {
  id: string
  title: string
  subtitle: string
  date: string
  status: 'success' | 'failed' | 'upcoming'
  statusLabel?: string
  imageUrl?: string | null
  details?: string | null
  linkUrl?: string | null
  linkLabel?: string | null
}

interface StatusPipelineProps {
  items: PipelineItem[]
}

const chipClass: Record<PipelineItem['status'], string> = {
  success: styles.chipSuccess,
  failed: styles.chipFailed,
  upcoming: styles.chipUpcoming,
}

export function StatusPipeline({ items }: StatusPipelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll, items])

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <div className={styles.pipelineWrapper}>
      <motion.div ref={scrollRef} className={styles.scrollContainer} variants={childVariants}>
        {items.map((item, i) => (
          <div key={item.id} className={styles.cardWrapper}>
            <motion.div
              className={`float-card ${styles.card}`}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className={styles.patchImage} />
              ) : (
                <div className={styles.patchPlaceholder}>
                  <BookOpen size={20} />
                </div>
              )}
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardSubtitle}>{item.subtitle}</div>
              <div className={styles.date}>{item.date}</div>
              <span className={`${styles.chip} ${chipClass[item.status]}`}>
                {item.statusLabel ?? item.status}
              </span>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    className={styles.detailsOuter}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.detailsInner}>
                      {item.details && <p>{item.details}</p>}
                      {item.linkUrl && (
                        <p>
                          <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                            {item.linkLabel ?? 'View more'}
                          </a>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {i < items.length - 1 && <div className={styles.connector} />}
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {items.length > 3 && canScrollRight && (
          <motion.button
            className={`${styles.scrollArrow} bounce-arrow-horizontal`}
            onClick={scrollRight}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll right for more"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
