import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.29.0/mod.ts";

let db: Database;

export async function connect() {
  const client = new MongoClient();
  await client.connect(
    "mongodb+srv://rmuralikrishna18:7921%40MongodbAtlas@cluster0.i5mvd.mongodb.net/shop?retryWrites=true"
  );

  db = client.database("todo-app");
}

export function getDb() {
  return db;
}
