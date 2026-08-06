const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Load .env variables manually
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env file.");
  process.exit(1);
}

const Person = require("../src/models/person");

const INITIAL_PEOPLE = [
  {
    name: "Aseem Srivastava",
    batch: "Batch of '17",
    company: "MBZUAI",
    role: "Postdoctoral Researcher",
    domain: "AI & LLMs",
    imageSrc: "/peoples/aseem.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    order: 1,
  },
  {
    name: "Prashant Tripathi",
    batch: "Batch of '21",
    company: "Google",
    role: "Software Engineer",
    domain: "CP & Algorithms",
    imageSrc: "/peoples/prashant-tripathi.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    order: 2,
  },
  {
    name: "Sudhi Awasthi",
    batch: "Batch of '21",
    company: "Bloomberg",
    role: "Senior Software Engineer",
    domain: "High-Performance Systems",
    imageSrc: "/peoples/sudhi-awasthi.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    order: 3,
  },
];

async function seedPeople() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Clearing existing people collection...");
    await Person.deleteMany({});

    console.log("Seeding initial people data...");
    const created = await Person.insertMany(INITIAL_PEOPLE);
    console.log("-----------------------------------------");
    console.log(`Successfully seeded ${created.length} people members:`);
    created.forEach((p) => console.log(`- ${p.name} (${p.batch}, ${p.company})`));
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Seeding people failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedPeople();
