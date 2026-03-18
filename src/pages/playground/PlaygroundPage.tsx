import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { IntroSection } from './IntroSection'
import { CountriesTableSection } from './CountriesTableSection'
import { ClimateKpiSection } from './ClimateKpiSection'
import { BooksPipelineSection } from './BooksPipelineSection'
import { ArtworkSection } from './ArtworkSection'

export function PlaygroundPage() {
  return (
    <div className="graph-paper-bg">
      <SectionWrapper id="playground-intro" bg="secondary" nextSectionId="countries">
        <IntroSection />
      </SectionWrapper>
      <SectionWrapper id="countries" bg="primary" nextSectionId="climate">
        <CountriesTableSection />
      </SectionWrapper>
      <SectionWrapper id="climate" bg="secondary" nextSectionId="books">
        <ClimateKpiSection />
      </SectionWrapper>
      <SectionWrapper id="books" bg="primary" nextSectionId="artwork">
        <BooksPipelineSection />
      </SectionWrapper>
      <SectionWrapper id="artwork" bg="secondary">
        <ArtworkSection />
      </SectionWrapper>
    </div>
  )
}
