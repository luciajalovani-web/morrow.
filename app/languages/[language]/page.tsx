import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearningBreadcrumbs, LearningCategories, LearningFooter, LearningHeader, LevelCard, SectionIntro } from "@/app/components/language-ui";
import { getLanguage, languages } from "@/app/lib/language-content";

type LanguagePageProps = {
  params: Promise<{ language: string }>;
};

export function generateStaticParams() {
  return languages.map((language) => ({ language: language.slug }));
}

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const { language: slug } = await params;
  const language = getLanguage(slug);
  if (!language) return { title: "Language not found — morrow" };

  return {
    title: `Learn ${language.name} — morrow`,
    description: `${language.introduction} Explore ${language.name} lessons from beginner to proficiency.`,
  };
}

export default function LanguagePage({ params }: LanguagePageProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading this language…</div>}>
      <LanguagePageContent params={params} />
    </Suspense>
  );
}

async function LanguagePageContent({ params }: LanguagePageProps) {
  const { language: slug } = await params;
  const language = getLanguage(slug);
  if (!language) notFound();

  const heroStyle: CSSProperties = {
    backgroundImage: `linear-gradient(180deg, rgba(38, 59, 86, 0.02) 28%, rgba(38, 59, 86, 0.38) 100%), url("${language.image}")`,
    backgroundPosition: language.imagePosition ?? "center",
  };

  return (
    <>
      <LearningHeader />
      <main className="learning-page">
        <div className="page-width">
          <LearningBreadcrumbs items={[
            { label: "Explore languages", href: "/languages" },
            { label: language.name },
          ]} />

          <section className="language-detail-hero">
            <div className="language-detail-copy">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.region}</span>
              <h1><span className="language-title-flag" aria-hidden="true">{language.flag}</span>{language.name}</h1>
              <p>{language.introduction}</p>
              <div className="language-detail-actions">
                <Link className="button button-dark" href={`/languages/${language.slug}/a1`}>Start learning <span aria-hidden="true">→</span></Link>
                <a className="text-link" href="#levels">Find your level <span aria-hidden="true">↓</span></a>
              </div>
              <div className="language-quick-facts">
                <span><b>06</b> CEFR levels</span><span><b>{language.modules}</b> learning modules</span>
              </div>
            </div>
            <div className="language-detail-visual" style={heroStyle} role="img" aria-label={`${language.name} language and culture`}>
              <span className="language-visual-caption">{language.name} · a word to keep</span>
              <div className="language-word-card"><span className="language-word-flag">{language.flag}</span><b>{language.heroWord}</b><span>{language.heroMeaning}</span></div>
              <span className="language-visual-stamp">A LITTLE<br />CURIOSITY<br /><i>goes far</i></span>
              <span className="language-visual-spark" aria-hidden="true">✳</span>
            </div>
          </section>

          <section className="language-about-section">
            <div className="language-about-heading">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>A language in good company</span>
              <h2>More than words.<br /><span>A way into a culture.</span></h2>
            </div>
            <div className="language-about-body">
              <p>{language.introduction}</p>
              <div className="language-about-columns">
                <div>
                  <h3>A few things to know</h3>
                  <ul className="editorial-list">{language.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
                </div>
                <div>
                  <h3>Why learn {language.name}?</h3>
                  <ul className="editorial-list">{language.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </div>
              </div>
            </div>
          </section>

          <section className="language-levels-section" id="levels">
            <SectionIntro
              eyebrow={`Your ${language.name} learning path`}
              title="Start where you are."
              description="Every level has a clear next step, real-world objectives and room to make the language your own."
            />
            <div className="level-card-grid">
              {language.levels.map((level, index) => <LevelCard language={language} level={level} index={index} key={level.slug} />)}
            </div>
          </section>

          <section className="language-categories-section" id="learning-categories">
            <SectionIntro
              eyebrow="A little practice, a lot of possibility"
              title="Find the way you like to learn."
              description={`Explore ${language.name} through eight kinds of practice. Each one opens onto a lesson path you can take at your own pace.`}
            />
            <LearningCategories language={language} />
          </section>

          <section className="language-exam-note">
            <div className="exam-note-mark" aria-hidden="true">✳</div>
            <div><span className="eyebrow">A goal worth preparing for</span><h2>Learning for what comes next.</h2><p>Explore focused practice for {language.exams.join(", ")} and more, designed to support your next step.</p></div>
            <Link className="text-link" href={`/languages/${language.slug}/b1/exam-preparation`}>Explore exam practice <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </main>
      <LearningFooter />
    </>
  );
}
