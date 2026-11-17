import type { EventKind, WeddingRecord } from "./schema";

const venueName = "Mahamaya Marriage Garden";
const venueAddress = "Near Aashima Mall, Hosangabad, Bhopal";
const fullLocation = `${venueName}, ${venueAddress}`;
const venueMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullLocation)}`;

const functions: [EventKind, string, string, string, string][] = [
  [
    "mata-pujan",
    "2027-01-31",
    "Mata Pujan",
    "Mangal Aarambh",
    "With devotion to Mata Rani, we seek her blessings for an auspicious beginning and a lifetime of happiness.",
  ],
  [
    "mehndi",
    "2027-01-31",
    "Mehndi Function",
    "Rang Pyaar Ke",
    "Henna-adorned hands, folk melodies and the warmth of loved ones mark the beginning of our wedding celebrations.",
  ],
  [
    "engagement",
    "2027-02-01",
    "Engagement",
    "Rishton Ki Shuruaat",
    "In the presence of our families, we exchange rings and promise a lifetime of love and togetherness.",
  ],
  [
    "tilak",
    "2027-02-01",
    "Tilak Ceremony",
    "Shubh Tilak",
    "With a ceremonial tilak and heartfelt blessings, our families honour the groom and celebrate this cherished union.",
  ],
  [
    "haldi",
    "2027-02-01",
    "Mandap / Haldi",
    "Sunehre Pal",
    "A sacred mandap, a touch of turmeric and a shower of blessings prepare us for a beautiful new beginning.",
  ],
  [
    "sangeet",
    "2027-02-01",
    "Sangeet",
    "Sur, Taal Aur Pyaar",
    "An evening of music, dance and joyful family performances, celebrating the love that brings us together.",
  ],
  [
    "chikat",
    "2027-02-02",
    "Chikat",
    "Apnon Ka Aashirvaad",
    "Join our family for the cherished Chikat tradition, filled with affection, blessings and the joy of togetherness.",
  ],
  [
    "chadhya",
    "2027-02-02",
    "Chadhya",
    "Parampara Ke Rang",
    "With traditional offerings and the blessings of our elders, we honour the customs that unite our families.",
  ],
  [
    "baraat",
    "2027-02-02",
    "Baraat",
    "Dhoom Dhadake Ke Saath",
    "Accompany the groom with music, dancing and joyful hearts as the baraat sets out to celebrate our wedding.",
  ],
  [
    "wedding",
    "2027-02-02",
    "Phere / Shubh Vivaah",
    "Saat Phere, Saat Vachan",
    "Around the sacred fire, we take seven steps and exchange vows of love, companionship and lifelong devotion.",
  ],
  [
    "reception",
    "2027-02-02",
    "Reception",
    "Khushiyon Ka Milan",
    "Celebrate the newlyweds with warm wishes, laughter and a joyful gathering of family and friends.",
  ],
];

export const customerRecord: WeddingRecord = {
  version: 1,
  templateId: "botanical",
  language: "en",
  weddingDate: "2027-02-02",
  countdownTarget: "2027-02-02T00:00:00+05:30",
  city: "Bhopal",
  scratchLocation: fullLocation,
  couple: {
    first: "Monark Raghuwanshi",
    second: "Aakrati Raghuwanshi",
    firstIsGroom: true,
    groomParents: "Son of Shri Ashok Raghuwanshi & Smt. Neha Raghuwanshi",
    brideParents: "Daughter of Shri Raghuveer Singh Raghuwanshi & Smt. Mamta Raghuwanshi",
    groomGrandparents: "",
  },
  memorialLine: "Shri Ganeshaya Namah · With the blessings of our elders",
  invitationLine:
    "With joyful hearts, Ashok & Neha Raghuwanshi and Raghuveer Singh & Mamta Raghuwanshi cordially invite you to celebrate the wedding of their beloved children, Monark Raghuwanshi and Aakrati Raghuwanshi.",
  blessingLine:
    "Please grace our wedding celebrations with your presence and bless us as we begin our life together.",
  homeAddress: fullLocation,
  hosts: "The Raghuwanshi families",
  rsvp: "Ashok & Neha Raghuwanshi · Raghuveer Singh & Mamta Raghuwanshi",
  wishesFrom: "All our relatives & friends",
  venue: {
    name: venueName,
    address: venueAddress,
    mapUrl: venueMapUrl,
  },
  contacts: [],
  optional: {
    travel: "",
    stay: "",
    contact: "",
    musicUrl: "/assets/tu-saval.mp3",
    whatsappHostNumber: "",
  },
  media: {
    portraitUrl: "/assets/couple-illustration-v1.png",
    portraitAlt: "An illustrated bride and groom in traditional wedding attire",
    venueArtworkUrl: "/assets/wedding-floral-arch-v2.webp",
  },
  wording: {
    heroMessage: "With our families’ blessings, our forever begins.",
    heroFootnote: "Your presence and blessings mean the world to us.",
    celebrationsIntro:
      "Three days of cherished traditions, music and love · 31 January – 2 February 2027",
    closingNote: "We look forward to celebrating with you. With love, Monark & Aakrati.",
  },
  celebrations: functions.map(([id, date, shortName, subtitle, supportingLine]) => ({
    id,
    shortName,
    title: `${shortName} — ${subtitle}`,
    start: `${date}T00:00:00+05:30`,
    timeToBeAnnounced: true,
    venue: venueName,
    address: venueAddress,
    mapUrl: venueMapUrl,
    supportingLine,
    image: `/assets/ceremony-${id}-v1.webp`,
    scene: id === "wedding" ? "fire" : "lanterns",
    phereTime: "",
  })),
};
