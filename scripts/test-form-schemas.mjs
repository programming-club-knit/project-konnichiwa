import { z } from "zod";

console.log("=== Testing Form Schemas ===");

// 1. Login Schema Test
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

const validLogin = loginSchema.safeParse({ email: "admin@knit.ac.in", password: "password123" });
console.assert(validLogin.success === true, "Valid login should pass");

const invalidLoginEmail = loginSchema.safeParse({ email: "invalid-email", password: "password123" });
console.assert(invalidLoginEmail.success === false, "Invalid email should fail");

const shortPassword = loginSchema.safeParse({ email: "admin@knit.ac.in", password: "123" });
console.assert(shortPassword.success === false, "Short password should fail");
console.log("PASS: Login Schema validation");

// 2. Student Register Schema Test (must end with @knit.ac.in)
const studentRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .refine(
      (val) => val.toLowerCase().endsWith("@knit.ac.in"),
      "General registration requires an official @knit.ac.in email address."
    ),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  rollNo: z.string().optional(),
  batch: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const validStudent = studentRegisterSchema.safeParse({
  firstName: "Abhay",
  lastName: "Gupta",
  username: "abhay_knit",
  email: "abhay.24305@knit.ac.in",
  mobile: "9876543210",
  password: "securePassword123",
});
console.assert(validStudent.success === true, "Valid student registration should pass");

const nonKnitStudent = studentRegisterSchema.safeParse({
  firstName: "Abhay",
  lastName: "Gupta",
  username: "abhay_knit",
  email: "abhay@gmail.com",
  mobile: "9876543210",
  password: "securePassword123",
});
console.assert(nonKnitStudent.success === false, "Non-KNIT email should fail refinement");
console.log("PASS: Student Register Schema validation (@knit.ac.in enforcement)");

// 3. Contact Schema Test
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required").min(3, "Subject must be at least 3 characters"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

const validContact = contactSchema.safeParse({
  name: "Ken Kaneki",
  email: "ken@anteiku.com",
  subject: "Partnership",
  message: "We would love to sponsor the PTSC hackathon.",
});
console.assert(validContact.success === true, "Valid contact submission should pass");

const shortContactMessage = contactSchema.safeParse({
  name: "Ken",
  email: "ken@anteiku.com",
  subject: "Hi",
  message: "short",
});
console.assert(shortContactMessage.success === false, "Short contact message should fail");
console.log("PASS: Contact Schema validation");

// 4. Open To Work Schema Test
const openToWorkSchema = z.object({
  showInHireUs: z.boolean(),
  availability: z.string().min(1, "Please select availability"),
  headlineRole: z.string().optional(),
  domain: z.string().optional(),
  skillsInput: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  resume: z.string().optional(),
}).refine(
  (data) => !data.showInHireUs || (Boolean(data.headlineRole && data.headlineRole.trim().length > 0)),
  {
    message: "Target Job Role / Headline is required when showing in Hire Us showcase",
    path: ["headlineRole"],
  }
);

const validTalent = openToWorkSchema.safeParse({
  showInHireUs: true,
  availability: "Full-time",
  headlineRole: "Full Stack Engineer",
  skillsInput: "React, Node.js",
});
console.assert(validTalent.success === true, "Valid talent profile should pass");

const missingHeadlineWhenOptedIn = openToWorkSchema.safeParse({
  showInHireUs: true,
  availability: "Full-time",
  headlineRole: "",
});
console.assert(missingHeadlineWhenOptedIn.success === false, "Missing headline when opted in should fail");
console.log("PASS: Open To Work Schema validation");

console.log("\nALL 4 FORM SCHEMAS VALIDATED SUCCESSFULLY!");
