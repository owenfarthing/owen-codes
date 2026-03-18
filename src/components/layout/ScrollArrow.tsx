import { useEffect, useState, type RefObject } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './ScrollArrow.module.css'

interface ScrollArrowProps {
  nextSectionId: string
  sectionRef: RefObject<HTMLElement | null>
}

export function ScrollArrow({ nextSectionId, sectionRef }: ScrollArrowProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide when less than 20% of section is visible (user scrolled past ~80%)
        setVisible(entry.intersectionRatio > 0.2)
      },
      { threshold: [0, 0.2, 0.5, 1] }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionRef])

  const handleClick = () => {
    document.getElementById(nextSectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      className={`${styles.arrow} ${!visible ? styles.hidden : ''} bounce-arrow`}
      onClick={handleClick}
      aria-label="Scroll to next section"
    >
      <ChevronDown size={28} />
    </button>
  )
}
