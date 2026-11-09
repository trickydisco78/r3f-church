import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/portfolio/SiteChrome";
import { WorkGrid } from "@/components/portfolio/WorkGrid";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import "./portfolio.css";

export default function Home() {
  const hasContact = site.contactEmail.length > 0;

  return (
    <main className="portfolio">
      <SiteNav />

      <section id="top" className="hero container">
        <div className="hero-kicker">
          <Sparkles size={15} /> {site.hero.kicker}
        </div>
        <h1>
          {site.hero.headline}
          <br />
          <em>{site.hero.headlineEmphasis}</em>
        </h1>
        <div className="hero-bottom">
          <p className="hero-intro">{site.hero.intro}</p>
          <a className="circle-link" href="#work" aria-label="Scroll to selected work">
            <ArrowUpRight size={22} />
          </a>
        </div>
      </section>

      <section id="work" className="work-section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / Selected work</span>
            <h2>
              {site.work.heading}
              <br />
              <em>{site.work.headingEmphasis}</em>
            </h2>
          </div>
          <p style={{ whiteSpace: "pre-line" }}>{site.work.blurb}</p>
        </div>
        <WorkGrid projects={projects} />
      </section>

      <section id="about" className="about-section container">
        <span className="eyebrow">02 / A little about me</span>
        <div className="about-grid">
          <h2>
            {site.about.heading}
            <br />
            <em>{site.about.headingEmphasis}</em>
          </h2>
          <div className="about-copy">
            {site.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {hasContact && (
        <section id="contact" className="contact-section container">
          <div className="contact-card">
            <span className="eyebrow">03 / Let&apos;s connect</span>
            <h2>
              Have an idea?
              <br />
              <em>Let&apos;s make it real.</em>
            </h2>
            <a className="contact-button" href={`mailto:${site.contactEmail}`}>
              Send a note <Mail size={16} />
            </a>
            <div className="contact-orbit" aria-hidden="true">
              ✦
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
