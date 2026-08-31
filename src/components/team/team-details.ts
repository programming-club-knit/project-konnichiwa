export const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Khatarnak naam",
    batch: 2027,
    post: " Secretary",
    domain: "Web & Animation",
    imageSrc: "/teams/first.png",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
  {
    id: "2",
    name: "Aarav Sharma",
    batch: 2027,
    post: "President",
    domain: "Competitive Programming",
    imageSrc: "/teams/aarav.png",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
  {
    id: "3",
    name: "Diya Verma",
    batch: 2027,
    post: "Vice President",
    domain: "Web Development",
    imageSrc: "/teams/diya.png",
  },
  {
    id: "4",
    name: "Kabir Singh",
    batch: 2027,
    post: "Technical Head",
    domain: "Machine Learning",
    imageSrc: "/teams/kabir.png",
  },
  {
    id: "5",
    name: "Meera Nair",
    batch: 2028,
    post: "Executive Member",
    domain: "Design",
    imageSrc: "/teams/meera.png",
  },
  {
    id: "6",
    name: "Rohan Gupta",
    batch: 2028,
    post: "Executive Member",
    domain: "App Development",
    imageSrc: "/teams/rohan.png",
  },
  {
    id: "7",
    name: "Sanya Kapoor",
    batch: 2028,
    post: "Executive Member",
    domain: "Content & Outreach",
    imageSrc: "/teams/sanya.png",
  },
  {
    id: "8",
    name: "Vivaan Mehta",
    batch: 2028,
    post: "Executive Member",
    domain: "Cloud & DevOps",
    imageSrc: "/teams/vivaan.png",
  },
];

export type ExecutiveMember = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  batch?: number | string;
  post?: string;
  role?: string;
  domain?: string;
  category?: string;
  imageSrc?: string;
  github?: string;
  linkedin?: string;
};
