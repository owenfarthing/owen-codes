import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { HeroSection } from './HeroSection'
import { ExperienceSection } from './ExperienceSection'
import { ProjectSection } from './ProjectSection'
import { FindMeSection } from './FindMeSection'

export function AboutPage() {
  return (
    <>
      <SectionWrapper id="hero" bg="primary" nextSectionId="experience">
        <HeroSection />
      </SectionWrapper>
      <SectionWrapper id="experience" bg="secondary" nextSectionId="project">
        <ExperienceSection />
      </SectionWrapper>
      <SectionWrapper id="project" bg="tertiary" nextSectionId="findme">
        <ProjectSection />
      </SectionWrapper>
      <SectionWrapper id="findme" bg="primary">
        <FindMeSection />
      </SectionWrapper>
    </>
  )
}
