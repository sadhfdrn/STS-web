
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMPTZ NOT NULL,
        submitted BOOLEAN DEFAULT FALSE,
        submission_date TIMESTAMPTZ
      );
    `);
    
    // Add event_date column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'notifications' AND column_name = 'event_date'
        ) THEN
          ALTER TABLE notifications ADD COLUMN event_date TIMESTAMPTZ;
        END IF;
      END $$;
    `);
    
    // Add level column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'notifications' AND column_name = 'level'
        ) THEN
          ALTER TABLE notifications ADD COLUMN level VARCHAR(10) DEFAULT '100';
        END IF;
      END $$;
    `);
    console.log('✅ Table "notifications" created/updated successfully.');

    // Create subjects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    console.log('✅ Table "subjects" created or already exists.');

    // Create course_materials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS course_materials (
        id VARCHAR(255) PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        upload_date TIMESTAMPTZ NOT NULL
      );
    `);
    
    // Add title column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'course_materials' AND column_name = 'title'
        ) THEN
          ALTER TABLE course_materials ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '';
        END IF;
      END $$;
    `);
    
    // Add level column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'course_materials' AND column_name = 'level'
        ) THEN
          ALTER TABLE course_materials ADD COLUMN level VARCHAR(10) DEFAULT '100';
        END IF;
      END $$;
    `);
    console.log('✅ Table "course_materials" created/updated successfully.');

    // Create assignments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        deadline TIMESTAMPTZ NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        date TIMESTAMPTZ NOT NULL,
        answer_file_url TEXT,
        answer_file_type VARCHAR(50),
        answer_filename VARCHAR(255),
        submitted BOOLEAN DEFAULT FALSE,
        submission_date TIMESTAMPTZ,
        notification_id VARCHAR(255)
      );
    `);
    
    // Add level column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assignments' AND column_name = 'level'
        ) THEN
          ALTER TABLE assignments ADD COLUMN level VARCHAR(10) DEFAULT '100';
        END IF;
      END $$;
    `);
    console.log('✅ Table "assignments" created or already exists.');

    // Create fcm_tokens table for push notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS fcm_tokens (
        token TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('✅ Table "fcm_tokens" created or already exists.');

    console.log('\nDatabase setup complete!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

setupDatabase();
