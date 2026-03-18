import { motion } from 'motion/react'
import type { Theme } from '@/hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'
import styles from './TabBar.module.css'

type Tab = 'about' | 'playground'

interface TabBarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  theme: Theme
  setTheme: (t: Theme) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'about', label: 'About Owen' },
  { id: 'playground', label: 'Playground' },
]

export function TabBar({ activeTab, setActiveTab, theme, setTheme }: TabBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <nav className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className={styles.indicator}
                  layoutId="tab-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </nav>
        <div className={styles.themeToggleArea}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  )
}
