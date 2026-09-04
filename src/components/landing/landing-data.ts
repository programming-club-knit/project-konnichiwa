import type { IconType } from "react-icons";
import {
  FiCode,
  FiCpu,
  FiGitBranch,
  FiGlobe,
  FiTerminal,
  FiInstagram,
  FiGithub,
  FiSlack,
  FiGlobe as FiDribbble,
} from "react-icons/fi";
import {
  FaSkype,
  FaWhatsapp,
  FaTwitch,
  FaTiktok,
  FaDiscord,
  FaGoogle,
  FaLinkedin,
} from "react-icons/fa";
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

export type HeroTopicCard = {
  title: string;
  desc: string;
  linkText: string;
  href: string;
  bgImage?: string;
};

export type EventCard = {
  tag: string;
  title: string;
  date: string;
  desc: string;
};

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  // { label: "OSS", href: "/oss" },
  // { label: "CP", href: "/cp" },
  { label: "Team", href: "/team" },
  { label: "Alumni", href: "/people" },
  { label: "Achievements", href: "/achievements" },
  { label: "Support", href: "/support-us" },
  { label: "Hire Us", href: "/hire-us" },
];

export const SOCIAL_PLATFORMS = [
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },
  {
    name: "Twitch",
    icon: FaTwitch,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },

  {
    name: "Discord",
    icon: FaDiscord,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },
  {
    name: "Instagram",
    icon: FiInstagram,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },
  {
    name: "Google",
    icon: FaGoogle,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },
  {
    name: "GitHub",
    icon: FiGithub,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1&pp=ygUJcmljayByb2xsoAcB0gcJCRMMAYcqIYzv",
  },
];

export const HERO_TOPIC_CARDS: HeroTopicCard[] = [
  {
    title: "Competitive Programming",
    desc: "Sharpen your algorithmic thinking with weekly problem sessions, contest ladders, and peer mentorship.",
    linkText: "Learn More",
    href: "/cp",
  },
  {
    title: "Web & App Development",
    desc: "Ship real full-stack products with modern web technologies — from first commit to cloud deployment.",
    linkText: "Learn More",
    href: "/#domains",
  },
  {
    title: "Open Source & AI",
    desc: "Contribute to open source repositories, build AI models, and learn how real software is crafted.",
    linkText: "Learn More",
    href: "/oss",
  },
];

export const STATS = [
  { value: "34", label: "Active members" },
  { value: "+", label: "Events hosted" },
  { value: "2", label: "Hackathon conducted" },
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
  {
    icon: FiCode,
    name: "Development",
    desc: "Web, mobile & backend engineering.",
  },
  {
    icon: FiTerminal,
    name: "CP & DSA",
    desc: "Contests, ladders & interview prep.",
  },
  { icon: FiCpu, name: "AI / ML", desc: "Models, data pipelines & research." },
  {
    icon: FiGitBranch,
    name: "Open Source",
    desc: "Real contributions, real impact.",
  },
  {
    icon: LuRocket,
    name: "Product & Design",
    desc: "From idea to shipped product.",
  },
  {
    icon: LuTrophy,
    name: "Hackathons",
    desc: "Build fast, win big, learn faster.",
  },
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
