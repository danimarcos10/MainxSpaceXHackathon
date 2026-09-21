import type { Listing, User } from "@/types";

export const users: User[] = [
  {
    id: "daniel",
    name: "Daniel",
    email: "daniel@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "anna",
    name: "Anna",
    email: "anna@exchange.maastrichtuniversity.nl",
    university: "Incoming Maastricht University exchange student",
    verified: true,
  },
  {
    id: "lotte",
    name: "Lotte",
    email: "lotte@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "samir",
    name: "Samir",
    email: "samir@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "nora",
    name: "Nora",
    email: "nora@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "lucas",
    name: "Lucas",
    email: "lucas@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "emma",
    name: "Emma",
    email: "emma@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "youssef",
    name: "Youssef",
    email: "youssef@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "sofia",
    name: "Sofia",
    email: "sofia@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
  {
    id: "bram",
    name: "Bram",
    email: "bram@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: false,
  },
  {
    id: "mei",
    name: "Mei",
    email: "mei@student.maastrichtuniversity.nl",
    university: "Maastricht University",
    verified: true,
  },
];

export const listings: Listing[] = [
  {
    id: "bright-room-wyck",
    ownerId: "daniel",
    title: "Bright room in Wyck",
    area: "Wyck",
    price: 650,
    startDate: "2026-10-01",
    endDate: "2027-01-31",
    description:
      "A calm, sun-filled room in a shared student apartment, a short walk from Maastricht station and the city centre. Fully furnished and ready for a four-month stay.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1721396104614-e71110629a2f?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "quiet-studio-randwyck",
    ownerId: "lotte",
    title: "Quiet studio near the university",
    area: "Randwyck",
    price: 575,
    startDate: "2026-09-25",
    endDate: "2026-12-20",
    description:
      "Compact furnished studio close to the Faculty of Health, Medicine and Life Sciences, with excellent train and bus connections.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1572496973076-dc34056ceb87?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "pending",
    published: true,
  },
  {
    id: "canal-room-city-centre",
    ownerId: "samir",
    title: "Canal-side room in the centre",
    area: "City Centre",
    price: 720,
    startDate: "2026-11-01",
    endDate: "2027-02-28",
    description:
      "Spacious room in a characterful townhouse, close to university buildings, cafés and the Markt. Shared kitchen with two other students.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1652882860902-7c6b0f88ef23?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "cosy-room-mariaberg",
    ownerId: "lotte",
    title: "Cosy room with a garden",
    area: "Mariaberg",
    price: 530,
    startDate: "2026-10-15",
    endDate: "2027-01-15",
    description:
      "Affordable furnished room in a friendly student house with a sunny shared garden and secure bicycle storage.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1737808773486-ca1065f37217?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "unchecked",
    published: true,
  },
  {
    id: "sunny-room-sint-pieter",
    ownerId: "samir",
    title: "Sunny room by Sint Pietersberg",
    area: "Sint Pieter",
    price: 680,
    startDate: "2026-09-20",
    endDate: "2027-01-31",
    description:
      "Light and peaceful room near green spaces, with a quick cycle to the city centre and a generous shared living area.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1665970602684-10764ae9c612?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "permission_required",
    published: true,
  },
  {
    id: "attic-room-jekerkwartier",
    ownerId: "nora",
    title: "Characterful attic in Jekerkwartier",
    area: "Jekerkwartier",
    price: 795,
    startDate: "2026-09-01",
    endDate: "2026-12-20",
    description:
      "A bright top-floor room among the historic streets of Jekerkwartier, close to the university library and city park.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1753505888770-46be3b748b41?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "budget-room-brusselsepoort",
    ownerId: "lucas",
    title: "Affordable room near Brusselsepoort",
    area: "Brusselsepoort",
    price: 495,
    startDate: "2026-09-15",
    endDate: "2027-01-31",
    description:
      "A practical room near the shopping centre with direct buses to campus and plenty of space to bring your own furniture.",
    furnished: false,
    image:
      "https://images.unsplash.com/photo-1758060215425-303300b1c7e2?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "garden-room-scharn",
    ownerId: "emma",
    title: "Garden room in peaceful Scharn",
    area: "Scharn",
    price: 610,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    description:
      "Furnished room in a quiet shared home with a large garden, bike storage and a ten-minute cycle to the station.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1722247520369-7f1495e79245?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "pending",
    published: true,
  },
  {
    id: "simple-room-wittevrouwenveld",
    ownerId: "youssef",
    title: "Simple room with great connections",
    area: "Wittevrouwenveld",
    price: 450,
    startDate: "2026-12-01",
    endDate: "2027-03-31",
    description:
      "A clean, unfurnished room close to the Groene Loper, supermarkets and fast bus connections into the centre.",
    furnished: false,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "campus-room-heugem",
    ownerId: "sofia",
    title: "Furnished room close to campus",
    area: "Heugem",
    price: 560,
    startDate: "2027-01-01",
    endDate: "2027-06-30",
    description:
      "Comfortable room for the spring semester, close to Randwyck campus with a shared balcony and modern kitchen.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "student-room-caberg",
    ownerId: "bram",
    title: "Spacious student room in Caberg",
    area: "Caberg",
    price: 475,
    startDate: "2027-02-01",
    endDate: "2027-06-30",
    description:
      "A generous furnished room in a relaxed student house, with free parking and a straightforward cycle into town.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "unchecked",
    published: true,
  },
  {
    id: "loft-room-wyck",
    ownerId: "mei",
    title: "Modern loft room by the station",
    area: "Wyck",
    price: 840,
    startDate: "2026-12-01",
    endDate: "2027-03-31",
    description:
      "A premium furnished loft room with high ceilings, a spacious shared living area and Maastricht station around the corner.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "bright-room-randwyck",
    ownerId: "nora",
    title: "Bright room near Randwyck campus",
    area: "Randwyck",
    price: 635,
    startDate: "2026-10-01",
    endDate: "2027-01-31",
    description:
      "A bright furnished room ideal for a fall-semester exchange, near the university, hospital and train station.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
  {
    id: "ensuite-city-centre",
    ownerId: "lucas",
    title: "Large ensuite in the City Centre",
    area: "City Centre",
    price: 850,
    startDate: "2027-01-01",
    endDate: "2027-06-30",
    description:
      "A large furnished room with a private bathroom, steps from the Markt and within walking distance of university buildings.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "permission_required",
    published: true,
  },
  {
    id: "courtyard-room-jekerkwartier",
    ownerId: "emma",
    title: "Courtyard room near the library",
    area: "Jekerkwartier",
    price: 590,
    startDate: "2026-09-15",
    endDate: "2027-02-28",
    description:
      "A furnished room overlooking a quiet courtyard, two minutes from the university library and cafés along the Jeker.",
    furnished: true,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=82",
    permissionStatus: "verified",
    published: true,
  },
];

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}
