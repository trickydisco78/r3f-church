export type Tone = "coral" | "blue" | "lime" | "yellow";

export interface ProjectImage {
  /** Path under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Project {
  /** URL segment: the project page lives at /projects/<slug>. */
  slug?: string;
  title: string;
  /** Used for the filter chips — one chip is generated per distinct category. */
  category: string;
  year: string;
  /** Short text shown on the card. */
  description: string;
  tags: string[];
  tone: Tone;
  /** Short mark shown on the card art (1–3 characters). */
  mark: string;
  /** Optional card image. Replaces the coloured art. */
  image?: ProjectImage;
  /** Link for projects without a detail page (internal route or external URL). */
  href?: string;
  /** Content for the project page at /projects/<slug>. */
  detail?: {
    intro: string;
    /** The task as it was set (paraphrased — don't paste third-party documents or names). */
    brief?: { heading: string; text: string; requirementsHeading: string; requirements: string[]; stretch?: string };
    about: string[];
    /** The planning artefacts: sketches, mind maps, notes. */
    thinking?: { heading: string; text: string; images: ProjectImage[] };
    /** The finished 2D design(s). Section is hidden until images are added. */
    design?: {
      heading: string;
      text: string;
      images: ProjectImage[];
      /** Downloadable file, e.g. the PDF drawing. */
      file?: { href: string; label: string; downloadName?: string };
    };
    model?: { heading: string; text: string; label: string; href: string };
  };
}

// Add new work here. Cards and filters update automatically.
export const projects: Project[] = [
  {
    slug: "design-your-own-church",
    title: "Design Your Own Church",
    category: "RVE",
    year: "2026",
    description:
      "My design for a church, from first sketches to a 2D plan — which my dad then turned into a 3D model in Blender that you can explore in the browser.",
    tags: ["School project", "Design", "3D model"],
    tone: "coral",
    mark: "RVE",
    image: {
      src: "/images/image.png",
      alt: "Project poster: Design Your Own Church, with a plan, a sketch and a rendering of a timber-and-glass church",
      width: 720,
      height: 540,
    },
    detail: {
      intro:
        "The challenge: design a church that three different Christian groups could share. This is how I planned it and drew it, and how my dad turned it into a 3D model.",
      brief: {
        heading: "The brief",
        text: "The challenge arrived as a letter from a church committee, asking an architect to design a church for at least three different Christian denominations — a building where people can worship and work together, and that will last well into the future.",
        requirementsHeading: "The project had to include",
        requirements: [
          "A creative name for the church",
          "A labelled drawing showing its important features",
          "An explanation of why those features were chosen and how they meet the needs of all three groups",
          "An explanation of why churches are important to Christians",
          "Information about the three Christian groups chosen",
        ],
        stretch:
          "To go further: spaces for both quiet prayer and lively worship, space for the community, and a shape with a reason behind it.",
      },
      about: [
        "A church is not just a building — it has to suit the way people worship in it. Roman Catholic, Anglican and Orthodox churches each use their space differently, so I started by comparing what each one needs: fonts, altars, pews or chairs, a pulpit and lectern, icons, candles, an organ and a confessional room.",
        "My answer is The United Church: three hexagons that share edges and meet at a single point. Each area keeps its own tradition, while the font and the front door are shared by everyone. Hexagons fit together with no gaps, so three areas become one building.",
        "I sketched the layouts and drew the plan, and then my dad turned my 2D design into a 3D model using Blender.",
      ],
      thinking: {
        heading: "Thinking & planning",
        text: "My working notes: comparing the three traditions, mind-mapping what matters in each, and sketching floor plans and shapes to see what could work.",
        images: [
          {
            src: "/images/church-sketches.jpg",
            alt: "Photo of handwritten notes: a mind map of Roman Catholic and Orthodox features, a comparison table of Roman Catholic and Anglican church features, and rough floor-plan sketches",
            width: 1024,
            height: 768,
            caption: "Mind maps, comparison notes and early floor-plan sketches.",
          },
        ],
      },
      design: {
        heading: "The 2D design",
        text: "The floor plan for The United Church: three worship areas, one whole. The key explains each numbered feature, from the altars and pews to the shared font and front door.",
        images: [
          {
            src: "/images/church-plan.png",
            alt: "Floor plan titled The United Church: three hexagonal worship areas — Roman Catholic at the top, Orthodox at lower left and Anglican at lower right — meeting at a shared space with a font, with a numbered key to altars, pews, organs, candle stands and the front door",
            width: 2400,
            height: 1697,
            caption: "Floor plan of The United Church.",
          },
        ],
        file: {
          href: "/images/churchv3.pdf",
          label: "Download the plan (PDF)",
          downloadName: "the-united-church-plan.pdf",
        },
      },
      model: {
        heading: "Explore it in 3D",
        text: "Orbit around the outside, then step in and look at the details.",
        label: "Open the 3D model",
        href: "/church",
      },
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function projectHref(p: Project) {
  return p.slug ? `/projects/${p.slug}` : p.href;
}
