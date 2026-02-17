import "dotenv/config";
import { db } from "./db";
import { users } from "@shared/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function migrateAuth() {
  try {
    console.log("Starting auth migration...");

    // Add username and password columns if they don't exist
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username VARCHAR,
      ADD COLUMN IF NOT EXISTS password VARCHAR
    `);

    // Update existing users with default credentials
    const existingUsers = await db.select().from(users);
    
    for (const user of existingUsers) {
      if (!user.username) {
        const defaultUsername = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
        const defaultPassword = await bcrypt.hash("password123", 10);
        
        await db.execute(sql`
          UPDATE users 
          SET username = ${defaultUsername}, 
              password = ${defaultPassword}
          WHERE id = ${user.id}
        `);
        
        console.log(`Updated user ${user.id} with username: ${defaultUsername}`);
      }
    }

    // Now make columns NOT NULL
    await db.execute(sql`
      ALTER TABLE users 
      ALTER COLUMN username SET NOT NULL,
      ALTER COLUMN password SET NOT NULL
    `);

    // Add unique constraint
    await db.execute(sql`
      ALTER TABLE users 
      ADD CONSTRAINT users_username_unique UNIQUE (username)
    `);

    console.log("Migration completed successfully!");
    console.log("Default password for all users: password123");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
  
  process.exit(0);
}

migrateAuth();
