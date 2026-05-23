export type Testimonial = {
  quote: string;
  name: string;
  /** Role + city; e.g. "Seller \u00b7 Garden District". */
  role: string;
  avatar?: string;
};

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=160&q=80`;

export const testimonials: Testimonial[] = [
  {
    quote:
      "We had three offers in the first weekend. Matt knew exactly how to price it for our block and the marketing photos were the best I've seen in Alexandria.",
    name: "Anne LeBlanc",
    role: "Seller \u00b7 Garden District",
    avatar: u("1494790108377-be9c29b29330"),
  },
  {
    quote:
      "Bought our first commercial building through Ritchie. The CCIM credential is real \u2014 Matt walked us through cap rates, NOI, and lease terms like it was second nature.",
    name: "James Thibodeaux",
    role: "Investor \u00b7 Alexandria",
    avatar: u("1507003211169-0a1dd7228f2d"),
  },
  {
    quote:
      "We were relocating from Houston and didn't know Cenla at all. Ritchie sent a 14-page area guide before we even visited. By the third weekend, we had the keys.",
    name: "Priya & Eli Patel",
    role: "Buyers \u00b7 Pineville",
    avatar: u("1438761681033-6461ffad8d80"),
  },
  {
    quote:
      "Sold our parents' estate after a long, complicated probate. Ritchie's team handled the paperwork, the cleanouts, the staging \u2014 we just signed at closing.",
    name: "Tom Beaulieu",
    role: "Estate sale \u00b7 Tioga",
    avatar: u("1500648767791-00dcc994a43e"),
  },
];
