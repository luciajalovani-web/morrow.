import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearningBreadcrumbs, LearningFooter, LearningHeader, LearningCategories, SectionIntro } from "@/app/components/language-ui";
import { getLanguage, getLevel, languages, levelSlugs } from "@/app/lib/language-content";

type LevelPageProps = {
  params: Promise<{ language: string; level: string }>;
};

const skillSections = [
  { slug: "grammar", name: "Grammar", eyebrow: "Make the patterns yours", field: "grammar" },
  { slug: "vocabulary", name: "Vocabulary", eyebrow: "Words for the world around you", field: "vocabulary" },
  { slug: "listening", name: "Listening", eyebrow: "Tune in to real voices", field: "listening" },
  { slug: "reading", name: "Reading", eyebrow: "Follow the words on the page", field: "reading" },
  { slug: "writing", name: "Writing", eyebrow: "Put your thoughts into words", field: "writing" },
  { slug: "speaking", name: "Speaking", eyebrow: "Find your voice, little by little", field: "speaking" },
] as const;

export function generateStaticParams() {
  return languages.flatMap((language) =>
    levelSlugs.map((level) => ({ language: language.slug, level })),
  );
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { language: languageSlug, level: levelSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  if (!language || !level) return { title: "Learning path not found — morrow" };

  return {
    title: `${language.name} ${level.title} ${level.name} — morrow`,
    description: `${level.summary} Explore ${language.name} objectives, activities and lesson topics at ${level.title}.`,
  };
}

export default function LevelPage({ params }: LevelPageProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading this learning level…</div>}>
      <LevelPageContent params={params} />
    </Suspense>
  );
}

async function LevelPageContent({ params }: LevelPageProps) {
  const { language: languageSlug, level: levelSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  if (!language || !level) notFound();

  const levelIndex = language.levels.findIndex((item) => item.slug === level.slug);
  const previousLevel = language.levels[levelIndex - 1];
  const nextLevel = language.levels[levelIndex + 1];

  return (
    <>
      <LearningHeader />
      <main className="learning-page level-learning-page">
        <div className="page-width">
          <LearningBreadcrumbs items={[
            { label: "Explore languages", href: "/languages" },
            { label: language.name, href: `/languages/${language.slug}` },
            { label: `${level.title} · ${level.name}` },
          ]} />

          <section className="level-detail-hero">
            <div className="level-detail-copy">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.flag} {language.name} learning path</span>
              <h1><span>{level.title}</span><b>{level.name}</b></h1>
              <p>{level.summary}</p>
              <p className="level-detail-cefr">{language.name} · Common European Framework of Reference</p>
              <div className="language-detail-actions">
                <a className="button button-dark" href="#objectives">Explore this level <span aria-hidden="true">↓</span></a>
                <Link className="text-link" href={`/languages/${language.slug}`}>All {language.name} levels <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="level-detail-visual" aria-hidden="true">
              <span className="level-orbit orbit-a">✳</span><span className="level-orbit orbit-b">✦</span>
              <span className="level-visual-code">{level.title}</span>
              <span className="level-visual-caption">{level.name}<br /><i>one step at a time</i></span>
              <span className="level-visual-flag">{language.flag}</span>
              <span className="level-visual-index">{String(levelIndex + 1).padStart(2, "0")} / 06</span>
            </div>
          </section>

          <section className="level-objectives-section" id="objectives">
            <div className="level-objective-heading">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>A level with real-life purpose</span>
              <h2>By the end, you’ll be able to…</h2>
              <p>These goals draw on CEFR guidance and turn it into practical moments in {language.name}.</p>
            </div>
            <div className="level-objective-list">
              {level.objectives.map((objective, index) => (
                <div className="level-objective-item" key={objective}>
                  <span>0{index + 1}</span><p>{objective}</p><b aria-hidden="true">✳</b>
                </div>
              ))}
            </div>
          </section>

          <section className="skill-overview-section">
            <div className="skill-overview-heading">
              <span className="eyebrow">The six skills, in balance</span>
              <h2>Small skills.<br /><span>Big confidence.</span></h2>
            </div>
            <div className="skill-overview-grid">
              {skillSections.map((skill, index) => (
                  <Link href={`/languages/${language.slug}/${level.slug}/${skill.slug}`} className={`skill-overview-card skill-overview-tone-${(index % 4) + 1}`} key={skill.slug}>
                  <span>0{index + 1}</span><b>{skill.name}</b><span>Explore activity <i aria-hidden="true">↗</i></span>
                  </Link>
              ))}
            </div>
          </section>

          <section className="language-categories-section level-all-categories">
            <SectionIntro eyebrow={`${language.name} · ${level.title}`} title="Choose a learning section." description={`Every section opens a dedicated ${language.name} ${level.title} learning page.`} />
            <LearningCategories language={language} level={level} />
          </section>

          <section className="level-activity-section" aria-labelledby="activity-title">
            <div className="level-activity-intro">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>A closer look at {level.title}</span>
              <h2 id="activity-title">Learn it in context.</h2>
              <p>Each activity connects the language to a useful situation, not just a page of rules.</p>
            </div>
            <div className="level-activity-grid">
              {skillSections.map((skill, index) => {
                const items = level[skill.field];
                return (
                  <article className={`level-activity-card activity-tone-${(index % 5) + 1}`} id={skill.slug} key={skill.slug}>
                    <div className="activity-card-top"><span>0{index + 1} / 06</span><span aria-hidden="true">✳</span></div>
                    <span className="activity-eyebrow">{skill.eyebrow}</span>
                    <h3>{skill.name}</h3>
                    <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                    <span className="activity-language-tag">{language.flag} {language.name} · {level.title}</span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="level-assessment-grid">
            <article className="assessment-card" id="tests">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>A check-in, not a hurdle</span>
              <h2>Practice that shows what’s sticking.</h2>
              <p>{level.test}</p>
              <div className="assessment-sample"><span>TRY A SAMPLE PROMPT</span><b>{level.speaking[0]}</b><span>{language.flag} {language.name} · {level.title}</span></div>
              <Link className="button button-dark" href={`/languages/${language.slug}/${level.slug}/tests`}>Take a comprehensive test <span aria-hidden="true">→</span></Link>
            </article>
            <article className="exam-path-card" id="exam-preparation">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>A little closer to your goal</span>
              <h2>Exam preparation, at your pace.</h2>
              <p>Build the language foundations for an internationally recognised certificate. These are preparation pathways, not exam providers.</p>
              <div className="exam-path-tags">{language.exams.map((exam) => <span key={exam}>{exam}</span>)}</div>
              <Link className="button button-dark" href={`/languages/${language.slug}/${level.slug}/exam-preparation`}>Explore exam preparation <span aria-hidden="true">→</span></Link>
            </article>
          </section>

          <section className="learning-sequence-section" id="sequence">
            <div className="sequence-heading">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>Your recommended learning sequence</span>
              <h2>A good next step, then another.</h2>
              <p>Move from a useful pattern to a real exchange, then bring the pieces together.</p>
            </div>
            <ol className="learning-sequence-list">
              {level.sequence.map((item, index) => (
                <li key={item}><span className="sequence-number">0{index + 1}</span><span className="sequence-connector" /><div><span className="sequence-label">STEP 0{index + 1}</span><b>{item}</b><p>{index === 0 ? level.grammar[index] : index === 1 ? level.listening[0] : level.speaking[0]}</p></div><span className="sequence-duration">{index === 0 ? "01" : index === 1 ? "02" : "03"} · 12 MIN</span></li>
              ))}
            </ol>
          </section>

          <section className="level-pagination">
            <Link href={`/languages/${language.slug}`} className="level-pagination-back"><span aria-hidden="true">←</span><span><small>BACK TO</small>All {language.name} levels</span></Link>
            <div className="level-pagination-switch">
              {previousLevel && <Link href={`/languages/${language.slug}/${previousLevel.slug}`}><small>PREVIOUS</small><b>{previousLevel.title} · {previousLevel.name}</b></Link>}
              <span className="level-pagination-divider" />
              {nextLevel && <Link href={`/languages/${language.slug}/${nextLevel.slug}`}><small>NEXT LEVEL</small><b>{nextLevel.title} · {nextLevel.name} →</b></Link>}
            </div>
          </section>

          <section className="other-languages-section">
            <span className="eyebrow">Curious about another language?</span>
            <div>{languages.filter((item) => item.slug !== language.slug).map((item) => <Link href={`/languages/${item.slug}`} key={item.slug}>{item.flag} {item.name} <span aria-hidden="true">↗</span></Link>)}</div>
          </section>
        </div>
      </main>
      <LearningFooter />
    </>
  );
}
