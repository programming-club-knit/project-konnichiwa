import dns from "node:dns";
import mongoose from "mongoose";

try {
  const dnsServers = ["1.1.1.1"];
  dns.setServers(dnsServers);
  dns.promises.setServers(dnsServers);
} catch (error) {
  console.warn("Could not set custom DNS servers:", error);
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 2, // Limit parallel connections in serverless env
      minPoolSize: 0,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}