import { useMemo } from 'react'
import { motion } from 'motion/react'
import { childVariants } from '@/components/layout/SectionWrapper'
import styles from './HeroSection.module.css'

const quotes = [
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
]

export function HeroSection() {
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [])

  return (
    <div className={styles.hero}>
      <motion.h1 className={styles.name} variants={childVariants}>
        Owen Farthing
      </motion.h1>
      <motion.p className={styles.title} variants={childVariants}>
        Full-Stack Engineer &middot; Web Application Specialist
      </motion.p>
      <motion.p className={styles.quote} variants={childVariants}>
        &ldquo;{quote.text}&rdquo; &mdash; {quote.author}
      </motion.p>
    </div>
  )
}
