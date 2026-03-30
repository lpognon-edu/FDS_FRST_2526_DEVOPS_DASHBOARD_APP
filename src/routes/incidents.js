/**
 * Incidents API Routes
 * Endpoints for managing incidents
 */

const express = require('express');
const router = express.Router();

// In-memory incident storage
let incidents = [];
let nextId = 1;

/**
 * GET /api/incidents
 * Returns list of all incidents
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: incidents.length,
      incidents: incidents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

module.exports = router;
