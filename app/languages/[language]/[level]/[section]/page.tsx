import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LearningBreadcrumbs, LearningFooter, LearningHeader, SectionIntro } from "@/app/components/language-ui";
import { EnglishSkillModule } from "@/app/components/english-skill-module";
import { ComprehensiveTest, ExamPreparationIndex, SpeakingPractice } from "@/app/components/practice-sections";
import { categories, getLanguage, getLevel, languages, levelSlugs } from "@/app/lib/language-content";

const sectionContent = {
  listening: {
    name: "Listening",
    eyebrow: "Tune in to real voices",
    description: "Build listening confidence with practical, language-specific activities for this CEFR level.",
    field: "listening",
  },
  reading: {
    name: "Reading",
    eyebrow: "Follow the words on the page",
    description: "Work with useful texts and reading goals designed for this language and level.",
    field: "reading",
  },
  writing: {
    name: "Writing",
    eyebrow: "Put your thoughts into words",
    description: "Develop clear, purposeful writing through realistic tasks for this language and level.",
    field: "writing",
  },
  speaking: {
    name: "Speaking",
    eyebrow: "Find your voice, little by little",
    description: "Have an open-ended conversation with an AI language tutor, with kind corrections at your level.",
  },
  tests: {
    name: "Tests",
    eyebrow: "A check-in, not a hurdle",
    description: "Take an original comprehensive test covering grammar, vocabulary, listening, reading and writing.",
  },
  "exam-preparation": {
    name: "Exam Preparation",
    eyebrow: "A little closer to your goal",
    description: "Prepare for IELTS, CILS, Goethe-Zertifikat or DELE with original exam-style practice.",
  },
} as const;

type SectionSlug = keyof typeof sectionContent;
type SectionPageProps = {
  params: Promise<{ language: string; level: string; section: string }>;
};

export function generateStaticParams() {
  const sections = categories.filter((category) => category.slug !== "grammar" && category.slug !== "vocabulary");
  return languages.flatMap((language) =>
    levelSlugs.flatMap((level) =>
      sections.map((section) => ({ language: language.slug, level, section: section.slug })),
    ),
  );
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { language: languageSlug, level: levelSlug, section: sectionSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const section = sectionContent[sectionSlug as SectionSlug];
  if (!language || !level || !section) return { title: "Learning section not found — morrow" };

  return {
    title: `${language.name} ${level.title} ${section.name} — morrow`,
    description: `${section.description} ${language.name} ${level.title}.`,
  };
}

export default function LearningSectionPage({ params }: SectionPageProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading this learning section…</div>}>
      <LearningSectionContent params={params} />
    </Suspense>
  );
}

async function LearningSectionContent({ params }: SectionPageProps) {
  const { language: languageSlug, level: levelSlug, section: sectionSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const section = sectionContent[sectionSlug as SectionSlug];
  if (!language || !level || !section) notFound();
  if (
    (language.slug === "english" && (sectionSlug === "writing" || sectionSlug === "listening" || sectionSlug === "reading"))
    || (language.slug === "french" && (sectionSlug === "writing" || sectionSlug === "reading"))
  ) {
    return <EnglishSkillModule languageSlug={language.slug} levelSlug={level.slug} section={sectionSlug} />;
  }

  const activities = "field" in section ? level[section.field] : [];
  const nextLinks = [
    { href: `/languages/${language.slug}/${level.slug}/grammar`, label: "Grammar" },
    { href: `/languages/${language.slug}/${level.slug}/vocabulary`, label: "Vocabulary" },
    { href: `/languages/${language.slug}/${level.slug}/listening`, label: "Listening" },
    { href: `/languages/${language.slug}/${level.slug}/reading`, label: "Reading" },
    { href: `/languages/${language.slug}/${level.slug}/writing`, label: "Writing" },
    { href: `/languages/${language.slug}/${level.slug}/speaking`, label: "Speaking" },
    { href: `/languages/${language.slug}/${level.slug}/tests`, label: "Tests" },
    { href: `/languages/${language.slug}/${level.slug}/exam-preparation`, label: "Exam Preparation" },
  ].filter((item) => item.href !== `/languages/${language.slug}/${level.slug}/${sectionSlug}`);

  return (
    <>
      <LearningHeader />
      <main className="learning-page level-learning-page">
        <div className="page-width">
          <LearningBreadcrumbs items={[
            { label: "Explore languages", href: "/languages" },
            { label: language.name, href: `/languages/${language.slug}` },
            { label: `${level.title} · ${level.name}`, href: `/languages/${language.slug}/${level.slug}` },
            { label: section.name },
          ]} />

          <section className="level-detail-hero">
            <div className="level-detail-copy">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.flag} {language.name} · {level.title}</span>
              <h1><span>{section.name}</span><b>{level.title}</b></h1>
              <p>{section.description}</p>
              <p className="level-detail-cefr">{level.name} · {language.name} learning path</p>
              <div className="language-detail-actions">
                <Link className="button button-dark" href={`/languages/${language.slug}/${level.slug}`}>Back to {level.title} <span aria-hidden="true">→</span></Link>
                <Link className="text-link" href={`/languages/${language.slug}`}>All {language.name} levels <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="level-detail-visual" aria-hidden="true">
              <span className="level-orbit orbit-a">✳</span><span className="level-orbit orbit-b">✦</span>
              <span className="level-visual-code">{language.flag}</span>
              <span className="level-visual-caption">{section.eyebrow}<br /><i>one step at a time</i></span>
              <span className="level-visual-index">{level.title} · {language.name}</span>
            </div>
          </section>

          {sectionSlug === "speaking" ? (
            <SpeakingPractice language={language.slug} level={level.slug} />
          ) : sectionSlug === "tests" ? (
            <ComprehensiveTest language={language.slug} level={level.slug} />
          ) : sectionSlug === "exam-preparation" ? (
            <ExamPreparationIndex language={language.slug} level={level.slug} />
          ) : (
            <section className="level-activity-section">
              <SectionIntro eyebrow={`${language.name} · ${level.title}`} title={`${section.name}, in context.`} description={`Explore ${language.name} ${level.title} activities and goals, organized as practical steps rather than generic prompts.`} />
              <div className="level-activity-grid">
                {activities.map((activity, index) => (
                  <article className={`level-activity-card activity-tone-${(index % 5) + 1}`} key={activity}>
                    <div className="activity-card-top"><span>0{index + 1}</span><span aria-hidden="true">✳</span></div>
                    <span className="activity-eyebrow">{section.eyebrow}</span>
                    <h3>{level.title} · {language.name}</h3>
                    <p>{activity}</p>
                    <span className="activity-language-tag">{language.flag} {language.name} · {level.title}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="language-categories-section">
            <SectionIntro eyebrow="Keep your learning moving" title="Explore another section." description="These links stay within the same language and CEFR level." />
            <div className="module-language-switcher">
              {nextLinks.map((item) => <Link key={item.href} href={item.href}>{item.label} <span aria-hidden="true">→</span></Link>)}
            </div>
          </section>
        </div>
      </main>
      <LearningFooter />
    </>
  );
}
