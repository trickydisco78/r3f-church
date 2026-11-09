import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { StickyHeader } from "./StickyHeader";
import { ThemeToggle } from "./ThemeToggle";

/** `base` is "" on the home page and "/" on other pages so anchors resolve to the home page. */
export function SiteNav({ base = "" }: { base?: "" | "/" }) {
  const hasContact = site.contactEmail.length > 0;
  const [first, ...rest] = site.name.toLowerCase().split(" ");
  const initials = site.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <StickyHeader>
      <nav className="nav container" aria-label="Primary navigation">
        <Link href="/" className="wordmark" aria-label={`${site.name} home`}>
          <span className="logo-mark" aria-hidden="true">
            {initials}
          </span>
          <span className="wordmark-name">
            {first}
            {rest.length > 0 && <span className="wordmark-last"> {rest.join(" ")}</span>}
          </span>
        </Link>
        <div className="nav-links">
          <Link href={`${base}#work`}>Selected work</Link>
          <Link href={`${base}#about`}>About me</Link>
          {hasContact && (
            <Link href={`${base}#contact`}>
              Say hello <ArrowUpRight size={14} />
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </StickyHeader>
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
