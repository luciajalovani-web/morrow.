import type { Metadata } from "next";
import { LanguageCard, LearningBreadcrumbs, LearningFooter, LearningHeader, SectionIntro } from "@/app/components/language-ui";
import { languages } from "@/app/lib/language-content";

export const metadata: Metadata = {
  title: "Explore Languages — morrow",
  description: "Explore English, French, Spanish, Italian and German, with thoughtful lessons for every CEFR level.",
};

export default function LanguagesPage() {
  return (
    <>
      <LearningHeader />
      <main className="learning-page">
        <div className="page-width">
          <div className="learning-overview-hero">
            <LearningBreadcrumbs items={[{ label: "Explore languages" }]} />
            <div className="learning-overview-copy">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>Five ways to find your words</span>
              <h1>One little hello.<br /><span>A whole new world.</span></h1>
              <p>Every language has its own way of seeing the everyday. Pick the one you’re curious about and find a learning path that meets you where you are.</p>
            </div>
            <div className="overview-aside-note"><span>01 — 05</span><span>Choose a language<br />to begin your next chapter.</span><b>✳</b></div>
          </div>

          <section className="explore-language-section" aria-labelledby="explore-language-title">
            <SectionIntro
              eyebrow="A place to begin"
              title="Which one feels like yours?"
              description="Five languages, six CEFR levels each and hundreds of small, useful steps to take along the way."
              titleId="explore-language-title"
            />
            <div className="explore-language-grid">
              {languages.map((language, index) => <LanguageCard language={language} index={index} key={language.slug} />)}
            </div>
          </section>

          <section className="overview-level-note">
            <div className="overview-level-mark" aria-hidden="true">A1<br /><span>→</span><br />C2</div>
            <div>
              <span className="eyebrow">From first words to full fluency</span>
              <h2>There’s a next step for every stage.</h2>
              <p>Each language follows the same internationally recognised CEFR scale. Start at the level that feels right, then build your way forward with real-life practice.</p>
            </div>
            <a className="text-link" href="#explore-language-title">Meet the five languages <span aria-hidden="true">↗</span></a>
          </section>
        </div>
      </main>
      <LearningFooter />
    </>
  );
}
