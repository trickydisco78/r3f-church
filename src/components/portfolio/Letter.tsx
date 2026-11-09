import type { Letter as LetterData } from "@/data/projects";

/** A letter on headed paper: letterhead, addressee, body, sign-off and an official seal. */
export function Letter({ letter }: { letter: LetterData }) {
  return (
    <article className="letter" aria-label={`Letter from the ${letter.from}`}>
      <header className="letter-head">
        <svg className="letter-cross" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 2h3v6.5H20v3h-6.5V22h-3V11.5H4v-3h6.5z" fill="currentColor" />
        </svg>
        <p className="letter-org">{letter.from}</p>
      </header>

      <p className="letter-to">To: {letter.to}</p>

      <div className="letter-body">
        <p className="letter-salutation">{letter.salutation}</p>
        {letter.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <footer className="letter-foot">
        <div>
          <p>{letter.closing}</p>
          <p className="letter-sign">{letter.from}</p>
        </div>
        <svg className="letter-seal" viewBox="0 0 120 120" role="img" aria-label="Official seal of the Church Committee">
          <defs>
            <path id="seal-ring" d="M60 60m-42 0a42 42 0 1 1 84 0a42 42 0 1 1 -84 0" />
          </defs>
          <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <text fontSize="9.5" letterSpacing="1.2" fill="currentColor" fontFamily="Georgia, serif">
            <textPath href="#seal-ring" startOffset="0">
              CHURCH COMMITTEE · OFFICIAL SEAL
            </textPath>
          </text>
          <path d="M57.5 42h5v14.5H73v5H62.5V78h-5V61.5H47v-5h10.5z" fill="currentColor" />
        </svg>
      </footer>
    </article>
  );
}
