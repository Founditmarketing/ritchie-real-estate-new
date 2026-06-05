export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  photo: string;
  /** Per-photo crop bias so faces stay framed in the portrait cards. */
  objectPosition?: string;
}

/** Broker/owner — featured above the roster. */
export const broker: TeamMember = {
  slug: "matt-ritchie",
  name: "Matt Ritchie",
  title: "Broker · Owner · CCIM",
  photo: "/team/matt-ritchie.png",
  objectPosition: "50% 18%",
};

/**
 * Agent roster, pulled from the current live site. Titles default to
 * REALTOR® where a specific designation isn't published; update as Matt
 * confirms each person's role.
 */
export const agents: TeamMember[] = [
  {
    slug: "janet-ritchie",
    name: "Janet Ritchie",
    title: "REALTOR®",
    photo: "/team/janet-ritchie.jpg",
    objectPosition: "50% 28%",
  },
  {
    slug: "david-moses",
    name: "David Moses",
    title: "REALTOR®",
    photo: "/team/david-moses.jpg",
    objectPosition: "50% 22%",
  },
  {
    slug: "teri-strickland",
    name: "Teri Strickland",
    title: "REALTOR®",
    photo: "/team/teri-strickland.jpg",
    objectPosition: "50% 22%",
  },
  {
    slug: "charmian-bernard",
    name: "Charmian Bernard",
    title: "REALTOR®",
    photo: "/team/charmian-bernard.png",
    objectPosition: "50% 20%",
  },
  {
    slug: "amanda-crooks",
    name: "Amanda Crooks",
    title: "REALTOR®",
    photo: "/team/amanda-crooks.jpg",
    objectPosition: "50% 22%",
  },
  {
    slug: "anthony-baillio",
    name: "Anthony Baillio",
    title: "REALTOR®",
    photo: "/team/anthony-baillio.jpg",
    objectPosition: "50% 22%",
  },
  {
    slug: "ben-gatch",
    name: "Ben Gatch",
    title: "REALTOR®",
    photo: "/team/ben-gatch.jpg",
    objectPosition: "50% 26%",
  },
  {
    slug: "danielle-wagner",
    name: "Danielle Wagner",
    title: "REALTOR®",
    photo: "/team/danielle-wagner.jpg",
    objectPosition: "50% 22%",
  },
  {
    slug: "robert-barker",
    name: "Robert Barker",
    title: "REALTOR®",
    photo: "/team/robert-barker.jpg",
    objectPosition: "50% 16%",
  },
  {
    slug: "aaron-lacourt",
    name: "Aaron Lacourt",
    title: "REALTOR®",
    photo: "/team/aaron-lacourt.jpg",
    objectPosition: "50% 30%",
  },
  {
    slug: "yvette-hardy",
    name: "Yvette Hardy",
    title: "REALTOR®",
    photo: "/team/yvette-hardy.jpg",
    objectPosition: "50% 22%",
  },
  {
    slug: "jennifer-byrd",
    name: "Jennifer Byrd",
    title: "REALTOR®",
    photo: "/team/jennifer-byrd.webp",
    objectPosition: "50% 22%",
  },
];
