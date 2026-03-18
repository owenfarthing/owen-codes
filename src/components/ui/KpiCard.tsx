import { motion } from 'motion/react'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './KpiCard.module.css'

interface KpiCardProps {
  label: string
  value: string | number
  unit?: string
}

export function KpiCard({ label, value, unit }: KpiCardProps) {
  return (
    <motion.div className={`float-card ${styles.card}`} variants={childVariants} whileHover={{ scale: 1.03 }}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </motion.div>
  )
}
