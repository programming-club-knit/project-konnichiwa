import type { IconType } from "react-icons";
import {
  FiCode,
  FiCpu,
  FiGitBranch,
  FiGlobe,
  FiTerminal,
} from "react-icons/fi";
import { LuRocket, LuTrophy } from "react-icons/lu";
import { TbBraces } from "react-icons/tb";

export type NavItem = {
  label: string;
  href: string;
};

export type IconCard = {
  icon: IconType;
  name: string;
  desc: string;
};

export type FeatureCard = {
  icon: IconType;
  title: string;
  body: string;
  span: string;
};

export type EventCard = {
  tag: string;
  title: string;
  date: string;
  desc: string;
};

export const NAV: NavItem[] = [
  { label: "Events", href: "/events" },
  { label: "OSS", href: "/oss" },
  { label: "CP", href: "/cp" },
  { label: "Team", href: "/members" },
  { label: "Our Peoples", href: "/people" },
  { label: "Achievements", href: "/achievements" },
  // { label: "Blogs", href: "/blogs" },
  { label: "Support Us", href: "/support-us" },
];

export const STATS = [
  { value: "500+", label: "Active members" },
  { value: "40+", label: "Events hosted" },
  { value: "15+", label: "Hackathon wins" },
  { value: "1", label: "Community, KNIT" },
];

export const FEATURES: FeatureCard[] = [
  {
    icon: TbBraces,
    title: "DSA & Competitive Programming",
    body: "Weekly problem-solving sessions, contest ladders and peer mentorship to sharpen your algorithmic thinking.",
    span: "md:col-span-2",
  },
  {
    icon: FiGlobe,
    title: "Web & App Development",
    body: "Ship real products with modern stacks — from first commit to deployment.",
    span: "",
  },
  {
    icon: FiGitBranch,
    title: "Open Source",
    body: "Contribute to real repos and learn how software is built in the open.",
    span: "",
  },
  {
    icon: FiCpu,
    title: "AI / ML & Systems",
    body: "Explore machine learning, data and the low-level magic under the hood with hands-on builds.",
    span: "md:col-span-2",
  },
];

export const DOMAINS: IconCard[] = [
  { icon: FiCode, name: "Development", desc: "Web, mobile & backend engineering." },
  { icon: FiTerminal, name: "CP & DSA", desc: "Contests, ladders & interview prep." },
  { icon: FiCpu, name: "AI / ML", desc: "Models, data pipelines & research." },
  { icon: FiGitBranch, name: "Open Source", desc: "Real contributions, real impact." },
  { icon: LuRocket, name: "Product & Design", desc: "From idea to shipped product." },
  { icon: LuTrophy, name: "Hackathons", desc: "Build fast, win big, learn faster." },
];

export const EVENTS: EventCard[] = [
  {
    tag: "Flagship",
    title: "CodeStorm Hackathon",
    date: "36-hour build sprint",
    desc: "Our annual overnight hackathon where teams turn ideas into working prototypes.",
  },
  {
    tag: "Weekly",
    title: "Contest Ladder",
    date: "Every weekend",
    desc: "Rated in-house programming contests with editorials and leaderboards.",
  },
  {
    tag: "Series",
    title: "Dev Bootcamp",
    date: "8-week track",
    desc: "Go from zero to deployed full-stack app with mentors guiding every step.",
  },
  {
    tag: "Talks",
    title: "Tech Talks & AMAs",
    date: "Monthly",
    desc: "Sessions with seniors, alumni and industry engineers on careers & craft.",
  },
];

export const MARQUEE = [
  "C++",
  "Python",
  "JavaScript",
  "React",
  "Next.js",
  "Node",
  "Rust",
  "Go",
  "TypeScript",
  "Docker",
  "Git",
  "TensorFlow",
  "Java",
  "SQL",
  "Linux",
];