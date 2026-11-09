import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

/** `base` is "" on the home page and "/" on other pages so anchors resolve to the home page. */
export function SiteNav({ base = "" }: { base?: "" | "/" }) {
  const hasContact = site.contactEmail.length > 0;
  const [first, ...rest] = site.name.toLowerCase().split(" ");
  return (
    <nav className="nav container" aria-label="Primary navigation">
      <Link href="/" className="wordmark" aria-label={`${site.name} home`}>
        <span className="wordmark-dot" />
        {first}
        {rest.length > 0 && <span>{rest.join(" ")}</span>}
      </Link>
      <div className="nav-links">
        <Link href={`${base}#work`}>Selected work</Link>
        <Link href={`${base}#about`}>About me</Link>
        {hasContact && (
          <Link href={`${base}#contact`}>
            Say hello <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer container">
      <span>
        © {site.year} {site.name}
      </span>
      <span>{site.footerNote}</span>
    </footer>
  );
}
