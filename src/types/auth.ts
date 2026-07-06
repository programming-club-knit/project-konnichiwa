export interface AuthUser {
  _id: string;
  role: "admin" | "member" | "normal";
  status: "pending" | "approved" | "denied";
  [key: string]: unknown;
}
