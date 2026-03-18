import { useRef, type ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { useSectionInView } from '@/hooks/useSectionInView'
import { ScrollArrow } from './ScrollArrow'
import styles from './SectionWrapper.module.css'

interface SectionWrapperProps {
  id: string
  bg?: 'primary' | 'secondary' | 'tertiary'
  nextSectionId?: string
  children: ReactNode
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 },
  },
}

export const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function SectionWrapper({ id, bg = 'primary', nextSectionId, children }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useSectionInView(ref)

  return (
    <motion.section
      ref={ref}
      id={id}
      className={styles.section}
      style={{ background: `var(--bg-${bg})` }}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <div className={styles.content}>
        {children}
      </div>
      {nextSectionId && (
        <div className={styles.arrowWrap}>
          <ScrollArrow nextSectionId={nextSectionId} sectionRef={ref} />
        </div>
      )}
    </motion.section>
  )
}
