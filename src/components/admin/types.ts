export const POSTS = [
  "Secretary",
  "Joint Secretary",
  "Web Development Head",
  "Competitive Programming Head",
  "Cyber Security Head",
  "Data Science Head",
  "GenAI Head",
  "App Dev Head",
  "Media and Design Head",
  "Class Mentor",
  "Event Head",
  "Executive members"
];

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: number;
  role: string;
  status: string;
  batch?: number;
  post?: string;
  rollNo?: string;
  hideAchievementsCard?: boolean;
  achievements?: any[];
};

export type EventType = {
  _id: string;
  title: string;
  name?: string;
  eventType?: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  status: string;
  googleFormLink?: string;
  whatsappGroupLink?: string;
  coverImageUrl?: string;
  registrationDeadline?: string;
  forceGoogleForm?: boolean;
  useCustomForm?: boolean;
  registrationType?: 'individual' | 'team';
  teamMinSize?: number;
  teamMaxSize?: number;
  ruleBookUrl?: string;
  registrationFields?: any[];
  participantFields?: any[];
  resources?: { label: string; url: string }[];
};

export type RegistrationType = {
  _id: string;
  registrationId?: string;
  eventId: string;
  user?: UserType;
  teamName?: string;
  teamLeaderName?: string;
  email?: string;
  mobile?: string;
  createdAt?: string;
  attended?: boolean;
};
