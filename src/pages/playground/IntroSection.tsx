import { motion } from 'motion/react'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './IntroSection.module.css'

export function IntroSection() {
  return (
    <div className={styles.intro}>
      <motion.h2 className={styles.heading} variants={childVariants}>
        Scroll to learn some random facts.
      </motion.h2>
      <motion.p className={styles.subtitle} variants={childVariants}>
        This presentation is brought to you by the React framework. All data is live from public APIs.
      </motion.p>
    </div>
  )
}
