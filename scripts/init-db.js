/**
 * Database Initialization Script
 * Creates database, schema and loads sample data into PostgreSQL
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration from environment variables
const dbName = process.env.DB_NAME || 'devops_dashboard';
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: dbName
};

// Admin config (connect to postgres database to create the target database)
const adminConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: 'postgres' // Connect to default postgres database
};

async function createDatabase() {
  let client = null;
  
  try {
    console.log('🔄 Connecting to PostgreSQL (admin)...');
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    
    client = new Client(adminConfig);
    await client.connect();
    console.log('✅ Connected successfully!');

    // Check if database exists
    console.log(`\n📋 Checking if database "${dbName}" exists...`);
    const dbResult = await client.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (dbResult.rows.length === 0) {
      console.log(`⚠️  Database "${dbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`✅ Database "${dbName}" already exists.`);
    }

    await client.end();

  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function initializeSchema() {
  let client = null;
  
  try {
    console.log(`\n🔄 Connecting to database "${dbName}"...`);
    
    client = new Client(dbConfig);
    await client.connect();
    console.log('✅ Connected successfully!');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('\n📋 Executing schema.sql...');
    await client.query(schemaSql);
    console.log('✅ Schema created successfully!');

    // Verify data was inserted
    const result = await client.query('SELECT COUNT(*) as count FROM incidents');
    const incidentCount = result.rows[0].count;
    console.log(`✅ Database initialized with ${incidentCount} sample incidents`);

    // Display sample data
    const incidents = await client.query('SELECT id, title, severity FROM incidents ORDER BY created_at DESC');
    console.log('\n📊 Sample data:');
    incidents.rows.forEach((incident, index) => {
      console.log(`   ${index + 1}. [${incident.severity}] ${incident.title}`);
    });

    console.log('\n🎉 Database initialization completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Schema initialization failed:', error.message);
    console.error('\n📌 Troubleshooting:');
    console.error('   - Ensure PostgreSQL is running');
    console.error('   - Check .env file for correct DB_HOST, DB_USER, DB_PASSWORD');
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function main() {
  try {
    await createDatabase();
    await initializeSchema();
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
main();
