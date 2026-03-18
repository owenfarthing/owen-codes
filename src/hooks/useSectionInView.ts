import { useEffect, useState, type RefObject } from 'react'

export function useSectionInView(
  ref: RefObject<HTMLElement | null>,
  threshold = 0.15
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])

  return inView
}
