
import mongoose from "mongoose";
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      dbName : process.env.MONGODB_DATABASE
    };
    mongoose.connection.on('connected', () => console.dir('connected'));
    mongoose.connection.on('open', () => console.dir('open'));
    mongoose.connection.on('disconnected', () => console.dir('disconnected'));
    mongoose.connection.on('reconnected', () => console.dir('reconnected'));
    mongoose.connection.on('disconnecting', () => console.dir('disconnecting'));
    mongoose.connection.on('close', () => console.dir('close'));
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
    return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
