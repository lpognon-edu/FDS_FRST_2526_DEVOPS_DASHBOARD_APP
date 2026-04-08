#!/usr/bin/env node

/**
 * Script to create versioned tar.gz artifacts for production deployment
 * Called by semantic-release during the publish phase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

const VERSION = packageJson.version;
const DIST_DIR = path.join(__dirname, '../dist');
const ARTIFACT_NAME = `devops-dashboard-v${VERSION}.tar.gz`;
const ARTIFACT_PATH = path.join(DIST_DIR, ARTIFACT_NAME);

// Create dist directory if it doesn't exist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log(`✓ Created dist directory`);
}

try {
  // Files and directories to include in the artifact
  const filesToArchive = [
    'src',
    'public',
    'package.json',
    'package-lock.json',
    'Dockerfile',
    'docker-compose.yml',
    '.env.example'
  ];

  // Validate that required files exist
  const missingFiles = filesToArchive.filter(file => {
    const filePath = path.join(__dirname, '../', file);
    return !fs.existsSync(filePath);
  });

  if (missingFiles.length > 0) {
    console.warn(`⚠ Warning: Missing files: ${missingFiles.join(', ')}`);
  }

  // Create tar.gz archive
  const tarCommand = `tar -czf "${ARTIFACT_PATH}" -C "${path.join(__dirname, '..')}" ${filesToArchive.join(' ')}`;
  
  console.log(`📦 Creating artifact: ${ARTIFACT_NAME}`);
  execSync(tarCommand, { stdio: 'pipe' });

  // Verify artifact was created
  if (fs.existsSync(ARTIFACT_PATH)) {
    const stats = fs.statSync(ARTIFACT_PATH);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`✓ Artifact created successfully`);
    console.log(`  Path: ${ARTIFACT_PATH}`);
    console.log(`  Size: ${sizeInMB} MB`);
    console.log(`  Version: ${VERSION}`);
  } else {
    throw new Error('Failed to create artifact');
  }

} catch (error) {
  console.error(`✗ Error creating artifact:`, error.message);
  process.exit(1);
}
