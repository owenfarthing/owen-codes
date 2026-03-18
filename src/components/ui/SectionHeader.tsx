import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  badge: string
  title: string
  subtitle: string
  sourceUrl?: string
}

export function SectionHeader({ badge, title, subtitle, sourceUrl }: SectionHeaderProps) {
  return (
    <motion.div className={styles.header} variants={childVariants}>
      <span className={styles.badge}>[ {badge} ]</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.subtitleLink}>
            {subtitle} <ExternalLink size={12} />
          </a>
        ) : (
          subtitle
        )}
      </p>
    </motion.div>
  )
}
