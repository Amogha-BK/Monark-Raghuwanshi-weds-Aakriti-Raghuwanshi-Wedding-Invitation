import { invitationConfig as original } from "../invitationConfig";
import type { WeddingRecord } from "./schema";

/** Read-only adapter: the existing customer's source configuration stays untouched. */
export const customerRecord: WeddingRecord = {
  version: 1,
  templateId: "botanical",
  language: "en",
  weddingDate: original.countdownTarget.slice(0, 10),
  city: "Indirapuram",
  scratchLocation: "Indirapuram, Ghaziabad",
  couple: { ...original.couple },
  countdownTarget: original.countdownTarget,
  memorialLine: original.memorialLine,
  invitationLine: original.invitationLine,
  blessingLine: original.blessingLine,
  homeAddress: original.homeAddress,
  hosts: original.hosts,
  rsvp: original.rsvp,
  wishesFrom: original.wishesFrom,
  venue: { ...original.venue },
  contacts: [...original.contacts],
  optional: { ...original.optional },
  media: {
    portraitUrl: "/assets/couple-illustration-v1.png",
    portraitAlt: "An illustrated couple in a teal lehenga and navy sherwani, standing together",
    venueArtworkUrl: original.artwork,
  },
  wording: {
    heroMessage: "A lifetime of love begins with a moment shared with you.",
    heroFootnote: "Your presence and blessings mean the world to us.",
    celebrationsIntro: "Two days of cherished traditions, laughter, and a lifetime of love.",
    closingNote: "Our celebration is complete with you.",
  },
  celebrations: original.celebrations.map((event) => ({ ...event, phereTime: "" })),
};
