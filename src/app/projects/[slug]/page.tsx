import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Download } from "lucide-react";
import { SiteFooter, SiteNav } from "@/components/portfolio/SiteChrome";
import { getProject, projects, type ProjectImage } from "@/data/projects";
import { site } from "@/data/site";
import "../../portfolio.css";

export function generateStaticParams() {
  return projects.filter((p) => p.slug && p.detail).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.detail?.intro ?? project.description,
  };
}

function Figure({ image }: { image: ProjectImage }) {
  return (
    <figure className="detail-figure">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 700px) 100vw, 1116px"
        className="detail-img"
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.detail) notFound();
  const { detail } = project;

  return (
    <main className="portfolio">
      <SiteNav base="/" />

      <article className="detail container">
        <Link href="/#work" className="back-link">
          ← All work
        </Link>

        <header className="detail-header">
          <span className="eyebrow">
            {project.category} · {project.year}
          </span>
          <h1>{project.title}</h1>
          <p className="detail-intro">{detail.intro}</p>
          <div className="tag-list">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>

        {project.image && <Figure image={project.image} />}

        {detail.brief && (
          <section className="detail-section detail-brief" aria-labelledby="brief-heading">
            <h2 id="brief-heading">{detail.brief.heading}</h2>
            <div className="about-copy">
              <p>{detail.brief.text}</p>
              <h3 className="brief-sub">{detail.brief.requirementsHeading}</h3>
              <ol className="brief-list">
                {detail.brief.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
              {detail.brief.stretch && <p>{detail.brief.stretch}</p>}
              {detail.brief.file && (
                <a
                  className="file-link"
                  href={detail.brief.file.href}
                  download={detail.brief.file.downloadName}
                >
                  <Download size={15} /> {detail.brief.file.label}
                </a>
              )}
            </div>
          </section>
        )}

        <section className="detail-section detail-about" aria-labelledby="about-heading">
          <h2 id="about-heading">About the project</h2>
          <div className="about-copy">
            {detail.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {detail.thinking && detail.thinking.images.length > 0 && (
          <section className="detail-section" aria-labelledby="thinking-heading">
            <h2 id="thinking-heading">{detail.thinking.heading}</h2>
            <p className="detail-lead">{detail.thinking.text}</p>
            {detail.thinking.images.map((img) => (
              <Figure key={img.src} image={img} />
            ))}
          </section>
        )}

        {detail.design && (detail.design.images.length > 0 || detail.design.file) && (
          <section className="detail-section" aria-labelledby="design-heading">
            <h2 id="design-heading">{detail.design.heading}</h2>
            <p className="detail-lead">{detail.design.text}</p>
            {detail.design.images.map((img) => (
              <Figure key={img.src} image={img} />
            ))}
            {detail.design.file && (
              <a
                className="file-link"
                href={detail.design.file.href}
                download={detail.design.file.downloadName}
              >
                <Download size={15} /> {detail.design.file.label}
              </a>
            )}
          </section>
        )}

        {detail.model && (
          <section className="detail-section detail-model" aria-labelledby="model-heading">
            <h2 id="model-heading">{detail.model.heading}</h2>
            <p className="detail-lead">{detail.model.text}</p>
            <Link className="contact-button" href={detail.model.href}>
              {detail.model.label} <ArrowUpRight size={16} />
            </Link>
          </section>
        )}
      </article>

      <SiteFooter />
    </main>
  );
}
