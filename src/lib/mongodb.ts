import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

declare global {
  // 개발 중 1회만 인덱스 정리
  var __dbIndexCleanupDone: boolean | undefined;
}

async function cleanupDevIndexes(conn: typeof mongoose) {
  if (process.env.NODE_ENV === "production") return;
  if (global.__dbIndexCleanupDone) return;
  global.__dbIndexCleanupDone = true;

  try {
    const db = conn.connection.db;
    if (!db) return;

    // 과거 설계에서 생성된 unique index: communityId_1 (ChatRoom)
    // 모임별 채팅방에서는 커뮤니티당 여러 방이 가능하므로 제거 필요.
    // 존재하지 않으면 에러가 나므로 catch로 무시.
    await db.collection("chatrooms").dropIndex("communityId_1");
  } catch {
    // ignore
  }
}

export async function connectDB() {
  if (cached.conn) {
    await cleanupDevIndexes(cached.conn);
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  await cleanupDevIndexes(cached.conn);
  return cached.conn;
}
