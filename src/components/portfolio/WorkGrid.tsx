"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projectHref, type Project } from "@/data/projects";

const ALL = "All work";

function Card({ project, index }: { project: Project; index: number }) {
  const href = projectHref(project);
  const body = (
    <>
      {project.image ? (
        <div className="project-art has-image">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 700px) 100vw, 580px"
            className="project-img"
          />
        </div>
      ) : (
        <div className="project-art" aria-hidden="true">
          <span className="art-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="art-mark">{project.mark}</span>
          <div className="art-lines" />
        </div>
      )}
      <div className="project-meta">
        <div>
          <span className="project-type">{project.category}</span>
          <h3>{project.title}</h3>
        </div>
        <span className="project-year">{project.year}</span>
      </div>
      <p>{project.description}</p>
      <div className="tag-list">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </>
  );

  return (
    <article className={`project-card ${project.tone}`}>
      {href ? (
        <Link href={href} className="project-link">
          {body}
          <span className="project-open">
            View project <ArrowUpRight size={14} />
          </span>
        </Link>
      ) : (
        body
      )}
    </article>
  );
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState(ALL);
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <>
      {categories.length > 2 && (
        <div className="filter-row" role="group" aria-label="Filter projects">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "filter active" : "filter"}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <div className="project-grid">
        {visible.map((project, i) => (
          <Card key={project.title} project={project} index={i} />
        ))}
      </div>
    </>
  );
}
