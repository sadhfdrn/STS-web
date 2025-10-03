
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
        event_date TIMESTAMPTZ,
        submitted BOOLEAN DEFAULT FALSE,
        submission_date TIMESTAMPTZ
      );
    `);
    console.log('✅ Table "notifications" created or already exists.');

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
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        upload_date TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('✅ Table "course_materials" created or already exists.');

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
    console.log('✅ Table "assignments" created or already exists.');

    console.log('\nDatabase setup complete!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

setupDatabase();
