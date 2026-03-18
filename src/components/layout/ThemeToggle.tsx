import { motion } from 'motion/react'
import { Sun, Moon, Sunrise } from 'lucide-react'
import type { Theme } from '@/hooks/useTheme'
import styles from './ThemeToggle.module.css'

interface ThemeToggleProps {
  theme: Theme
  setTheme: (t: Theme) => void
}

const themes: { id: Theme; icon: typeof Sun; label: string }[] = [
  { id: 'light', icon: Sun, label: 'Light theme' },
  { id: 'dark', icon: Moon, label: 'Dark theme' },
  { id: 'sunset', icon: Sunrise, label: 'Sunset theme' },
]

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <div className={styles.toggle}>
      {themes.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          className={`${styles.btn} ${theme === id ? styles.btnActive : ''}`}
          onClick={() => setTheme(id)}
          title={label}
          whileHover={{ scale: 1.15 }}
          animate={theme === id ? { rotateY: 360, scale: 1.15 } : { rotateY: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon size={theme === id ? 20 : 16} />
        </motion.button>
      ))}
    </div>
  )
}
