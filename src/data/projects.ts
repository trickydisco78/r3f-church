export type Tone = "coral" | "blue" | "lime" | "yellow";

export interface ProjectImage {
  /** Path under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/** A letter shown in the official-letter style (see components/portfolio/Letter.tsx). */
export interface Letter {
  from: string;
  to: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
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
    brief?: { heading: string; text: string; letter?: Letter; requirementsHeading: string; requirements: string[]; stretch?: string; file?: { href: string; label: string; downloadName?: string } };
    about: string[];
    /** Written answers to the brief, in his own words (spelling and punctuation tidied only). */
    answers?: {
      heading: string;
      intro: string;
      items: { eyebrow: string; heading: string; paragraphs?: string[]; groups?: { name: string; text: string }[] }[];
    };
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
    tags: ["School project", "Design", "RVE"],
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
        text: "The challenge arrived as a letter from a church committee:",
        letter: {
          from: "Church Committee",
          to: "The Architect",
          salutation: "Dear Architect,",
          paragraphs: [
            "We are writing to ask for your assistance in designing a building that will become a worldwide landmark. Various churches in Britain would like you to design a church for at least 3 different denominations. We believe that a building where we can worship and work together is a wonderful way of celebrating over 2000 years of Jesus Christ and we would like it to be a building that will survive well into the future. We do hope that you will be able to come up with a striking design that will be able to meet all of our various needs. We look forward to seeing your design.",
          ],
          closing: "Yours sincerely",
        },
        requirementsHeading: "The project had to include",
        requirements: [
          "A creative name for the church",
          "A labelled drawing showing its important features",
          "An explanation of why those features were chosen and how they meet the needs of all three groups",
          "An explanation of why churches are important to Christians",
          "Information about the three Christian groups chosen",
        ],
        file: {
          href: "/images/church-brief.pdf",
          label: "Read the brief (PDF)",
          downloadName: "design-your-own-church-brief.pdf",
        },
        stretch:
          "To go further: spaces for both quiet prayer and lively worship, space for the community, and a shape with a reason behind it.",
      },
      about: [
        "A church is not just a building — it has to suit the way people worship in it. Roman Catholic, Anglican and Orthodox churches each use their space differently, so I started by comparing what each one needs: fonts, altars, pews or chairs, a pulpit and lectern, icons, candles, an organ and a confessional room.",
        "My answer is The United Church: three hexagons that share edges and meet at a single point. Each area keeps its own tradition, while the font and the front door are shared by everyone. Hexagons fit together with no gaps, so three areas become one building.",
        "I sketched the layouts and drew the plan, and then my dad turned my 2D design into a 3D model using Blender.",
      ],
      answers: {
        heading: "My answers to the brief",
        intro: "The written part of the project, in my own words.",
        items: [
          {
            eyebrow: "Brief point 3",
            heading: "Why I designed it this way",
            paragraphs: [
              "I designed my church differently because I wanted my church to be different to other churches. The sacred space is the most important part, so that people can come together.",
              "I designed it using hexagon shapes so there is more room for people to sit in the church, and so that you have your individual denomination in different rooms.",
              "I put in an organ so they can have music, church pews so they can sit, confessionals so they can confess, and candles so they can remember their loved ones.",
            ],
          },
          {
            eyebrow: "Brief point 4",
            heading: "Why churches are important to Christians",
            paragraphs: [
              "Churches are important to Christians because churches are a place of worship, a place of community and a place of support. Also, you can go there if you want to start a new life.",
              "Christians also have celebrations such as Christmas and Easter, and sometimes weddings or funerals.",
            ],
          },
          {
            eyebrow: "Brief point 5",
            heading: "The three Christian groups",
            groups: [
              {
                name: "Roman Catholic",
                text: "They are the biggest denomination, with over 1.2 billion members in the world. They look to Mary and the saints as role models. Roman Catholicism is based on 7 sacraments. A sacrament is a ritual that demonstrates God's grace and builds faith. The seven sacraments are baptism, eucharist, confirmation, reconciliation, anointing of the sick, marriage and holy orders.",
              },
              {
                name: "Orthodox",
                text: "They have around 200 million people who follow the Orthodox tradition. It is made up of a number of self-choice churches. They sing and chant a lot and they have lots of statues and icons. Most of their churches have a dome-shaped ceiling.",
              },
              {
                name: "Anglican",
                text: "Anglicans are the third biggest denomination, with around 110 million members in the world. They love singing hymns and music. They follow a set order and it is a mix of formal and informal worship.",
              },
            ],
          },
        ],
      },
      thinking: {
        heading: "Thinking & planning",
        text: "My working notes: comparing the three traditions, mind-mapping what matters in each, sketching floor plans and shapes to see what could work, and writing up what I found out. Select a photo to see it full size.",
        images: [
          {
            src: "/images/church-sketches.jpg",
            alt: "Photo of handwritten notes: a mind map of Roman Catholic and Orthodox features, a comparison table of Roman Catholic and Anglican church features, and rough floor-plan sketches",
            width: 1024,
            height: 768,
            caption: "Mind maps, comparison notes and early floor-plan sketches.",
          },
          {
            src: "/images/church-notes-groups.jpg",
            alt: "Handwritten notes about the three Christian groups: Roman Catholic, Orthodox and Anglican, with the size of each and what is special about their worship",
            width: 2048,
            height: 1536,
            caption: "Research notes on the three Christian groups.",
          },
          {
            src: "/images/church-notes-importance.jpg",
            alt: "Handwritten notes on why churches are important to Christians, followed by the start of the notes on the Roman Catholic and Orthodox groups",
            width: 2048,
            height: 1536,
            caption: "Why churches are important to Christians.",
          },
          {
            src: "/images/church-notes-design.jpg",
            alt: "Handwritten page titled Explanation of my church design, explaining the hexagon shapes, organ, pews, confessionals and candles",
            width: 2048,
            height: 1536,
            caption: "My explanation of the church design.",
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
        text: "My dad did a degree in multimedia IT and used Blender as part of his university project work. He used new AI MCP tools to generate a 3D model from my 2D plan, then exported it into a web project using React Three Fiber. Orbit around the outside, then step in and look at the details.",
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
