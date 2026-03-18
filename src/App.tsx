import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from '@/hooks/useTheme'
import { TabBar } from '@/components/layout/TabBar'
import { AboutPage } from '@/pages/about/AboutPage'
import { PlaygroundPage } from '@/pages/playground/PlaygroundPage'

type Tab = 'about' | 'playground'

const VALID_TABS: Tab[] = ['about', 'playground']

function getTabFromHash(): Tab {
  const hash = window.location.hash.replace('#', '')
  return VALID_TABS.includes(hash as Tab) ? (hash as Tab) : 'about'
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(getTabFromHash)
  const { theme, setTheme } = useTheme()

  const changeTab = useCallback((tab: Tab) => {
    setActiveTab(tab)
    window.location.hash = tab
  }, [])

  // Sync tab when user navigates with browser back/forward
  useEffect(() => {
    function onHashChange() {
      setActiveTab(getTabFromHash())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Scroll to top on page load / refresh
  useEffect(() => {
    window.scrollTo({ top: 0 })
    if (!window.location.hash) {
      window.location.hash = 'about'
    }
  }, [])

  return (
    <>
      <TabBar
        activeTab={activeTab}
        setActiveTab={changeTab}
        theme={theme}
        setTheme={setTheme}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          onAnimationStart={(def) => {
            // Only scroll on the enter animation, not exit
            if (typeof def === 'object' && 'opacity' in def && def.opacity === 1) {
              window.scrollTo({ top: 0 })
            }
          }}
        >
          {activeTab === 'about' ? <AboutPage /> : <PlaygroundPage />}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
