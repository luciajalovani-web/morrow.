"use client";

import Link from "next/link";
import { InterfaceLanguageSelect, useInterfaceLanguage } from "@/app/components/interface-language";
import { learningUi, translateNavigationLabel } from "@/app/lib/learning-ui-translations";
import type { Language, LearningLevel } from "@/app/lib/language-content";
import { categories } from "@/app/lib/language-content";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12h14" /><path d="m13 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function LearningHeader() {
  const { locale } = useInterfaceLanguage();
  return (
    <header className="site-header learning-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="Morrow home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>morrow<span className="brand-period">.</span></span>
        </Link>
        <nav className="learning-nav" aria-label="Main navigation">
          <Link href="/">{learningUi(locale, "home")}</Link>
          <Link href="/languages">{learningUi(locale, "explore")}</Link>
          <Link href="/#courses">{learningUi(locale, "courses")}</Link>
          <Link href="/#about">{learningUi(locale, "about")}</Link>
        </nav>
        <div className="learning-header-actions">
          <InterfaceLanguageSelect compact />
          <Link className="learning-nav-cta" href="/languages">{learningUi(locale, "findLanguage")} <Arrow /></Link>
        </div>
      </div>
    </header>
  );
}

export function LearningBreadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { locale } = useInterfaceLanguage();
  return (
    <nav className="learning-breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">{learningUi(locale, "home")}</Link>
      <span aria-hidden="true">/</span>
      {items.map((item, index) => (
        <span className="breadcrumb-current-wrap" key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{translateNavigationLabel(locale, item.label)}</Link> : <span aria-current="page">{translateNavigationLabel(locale, item.label)}</span>}
          {index < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function LearningFooter() {
  const { locale } = useInterfaceLanguage();
  return (
    <footer className="learning-footer">
      <div className="learning-footer-inner page-width">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>morrow<span className="brand-period">.</span></span>
        </Link>
        <p>{locale === "fr" ? "Un lieu inspirant pour trouver vos mots." : locale === "es" ? "Un lugar especial para encontrar tus palabras." : locale === "it" ? "Un posto speciale per trovare le parole." : locale === "de" ? "Ein besonderer Ort, um Worte zu finden." : "A thoughtful place to find your words."}</p>
        <div className="learning-footer-links">
          <Link href="/">{learningUi(locale, "home")}</Link>
          <Link href="/languages">{learningUi(locale, "explore")}</Link>
          <Link href="/#about">{locale === "fr" ? "Notre approche" : locale === "es" ? "Nuestra filosofía" : locale === "it" ? "Il nostro metodo" : locale === "de" ? "Unser Ansatz" : "Our approach"}</Link>
        </div>
        <span className="learning-footer-copyright">© 2026 morrow language studio · <InterfaceLanguageSelect compact /></span>
      </div>
    </footer>
  );
}

export function LanguageCard({ language, index }: { language: Language; index: number }) {
  const { locale } = useInterfaceLanguage();
  return (
    <Link href={`/languages/${language.slug}`} className={`explore-language-card language-tone-${index + 1}`}>
      <span className="explore-language-card-top">
        <span className="explore-language-flag" aria-hidden="true">{language.flag}</span>
        <span className="explore-language-index">0{index + 1}</span>
      </span>
      <span className="explore-language-region">{language.region}</span>
      <span className="explore-language-name">{language.name}<Arrow /></span>
      <span className="explore-language-intro">{language.introduction}</span>
      <span className="explore-level-chips" aria-label="Available CEFR levels">
        {language.levels.map((level) => <span key={level.slug}>{level.slug.toUpperCase()}</span>)}
      </span>
      <span className="explore-language-bottom">
        <span>{language.modules} {locale === "fr" ? "modules" : locale === "es" ? "módulos" : locale === "it" ? "moduli" : locale === "de" ? "Lernmodule" : "learning modules"}</span>
        <span className="button button-dark explore-language-button">{locale === "fr" ? "Explorer" : locale === "es" ? "Explorar idioma" : locale === "it" ? "Esplora la lingua" : locale === "de" ? "Sprache entdecken" : "Explore language"} <Arrow /></span>
      </span>
    </Link>
  );
}

export function LevelCard({ language, level, index }: { language: Language; level: LearningLevel; index: number }) {
  const { locale } = useInterfaceLanguage();
  return (
    <Link href={`/languages/${language.slug}/${level.slug}`} className={`level-card level-tone-${index + 1}`}>
      <span className="level-card-top">
        <span className="level-code">{level.title}</span>
        <span className="level-card-number">0{index + 1}</span>
      </span>
      <span className="level-card-name">{level.name}</span>
      <span className="level-card-summary">{level.summary}</span>
      <span className="level-card-goal"><b>{locale === "fr" ? "À LA FIN, VOUS SAUREZ" : locale === "es" ? "AL FINAL PODRÁS" : locale === "it" ? "ALLA FINE SAPRAI" : locale === "de" ? "DAS KANNST DU DANN" : "YOU’LL BE ABLE TO"}</b>{level.objectives[0]}</span>
      <span className="level-progress-copy"><span>{locale === "fr" ? "Progression démo" : locale === "es" ? "Progreso de muestra" : locale === "it" ? "Progresso demo" : locale === "de" ? "Beispiel-Fortschritt" : "Sample progress"} · {level.progress}%</span><span>{level.lessons} {locale === "fr" ? "leçons" : locale === "es" ? "lecciones" : locale === "it" ? "lezioni" : locale === "de" ? "Lektionen" : "lessons"}</span></span>
      <span className="level-progress-track" role="progressbar" aria-valuenow={level.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${level.title} sample progress`}>
        <span style={{ width: `${level.progress}%` }} />
      </span>
      <span className="level-card-link">{locale === "fr" ? "Voir le niveau" : locale === "es" ? "Ver nivel" : locale === "it" ? "Vedi livello" : locale === "de" ? "Niveau ansehen" : "View level"} <Arrow /></span>
    </Link>
  );
}

export function LearningCategories({ language, level }: { language: Language; level?: LearningLevel }) {
  const { locale } = useInterfaceLanguage();
  const firstLevel = level ?? language.levels[0];
  return (
    <div className="learning-category-grid">
      {categories.map((category, index) => (
        <Link
          className={`learning-category-card learning-category-tone-${(index % 5) + 1}`}
          href={`/languages/${language.slug}/${firstLevel.slug}/${category.slug}`}
          key={category.slug}
        >
          <span className="learning-category-number">0{index + 1}</span>
          <span className="learning-category-star" aria-hidden="true">✳</span>
          <span className="learning-category-name">{category.slug === "grammar" ? learningUi(locale, "grammar") : category.slug === "vocabulary" ? learningUi(locale, "vocabulary") : category.name}</span>
          <span className="learning-category-description">{category.description}</span>
          <span className="learning-category-arrow"><Arrow /></span>
        </Link>
      ))}
    </div>
  );
}

export function SectionIntro({ eyebrow, title, description, titleId }: { eyebrow: string; title: string; description: string; titleId?: string }) {
  return (
    <div className="learning-section-intro">
      <div>
        <span className="eyebrow"><span className="eyebrow-star">✳</span>{eyebrow}</span>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}
