/**
 * Incidents API Routes
 * Endpoints for managing incidents with PostgreSQL database
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/incidents
 * Returns list of all incidents sorted by created_at descending
 */
router.get('/', async (req, res) => {
  try {
    const incidents = await db.getAll(
      'SELECT id, title, description, severity, created_at, updated_at FROM incidents ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    console.error('GET /incidents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch incidents',
      message: error.message 
    });
  }
});

/**
 * GET /api/incidents/:id
 * Get specific incident by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'ID must be a valid number'
      });
    }

    const incident = await db.getOne(
      'SELECT id, title, description, severity, created_at, updated_at FROM incidents WHERE id = $1',
      [id]
    );
    
    if (!incident) {
      return res.status(404).json({
        error: 'Not found',
        message: `Incident with id ${id} not found`
      });
    }

    res.json({
      success: true,
      incident
    });
  } catch (error) {
    console.error('GET /incidents/:id error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch incident',
      message: error.message 
    });
  }
});

/**
 * POST /api/incidents
 * Create new incident
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, severity } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Title is required'
      });
    }

    if (!severity || !['Low', 'Medium', 'High'].includes(severity)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Severity must be Low, Medium, or High'
      });
    }

    // Insert into database
    const result = await db.query(
      'INSERT INTO incidents (title, description, severity) VALUES ($1, $2, $3) RETURNING id, title, description, severity, created_at, updated_at',
      [title.trim(), description ? description.trim() : '', severity]
    );

    const incident = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Incident created successfully',
      incident
    });
  } catch (error) {
    console.error('POST /incidents error:', error);
    res.status(500).json({ 
      error: 'Failed to create incident',
      message: error.message 
    });
  }
});

/**
 * PUT /api/incidents/:id
 * Update existing incident
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, severity } = req.body;

    // Validation
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'ID must be a valid number'
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Title is required'
      });
    }

    if (!severity || !['Low', 'Medium', 'High'].includes(severity)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Severity must be Low, Medium, or High'
      });
    }

    // Check if incident exists
    const existing = await db.getOne('SELECT id FROM incidents WHERE id = $1', [id]);
    if (!existing) {
      return res.status(404).json({
        error: 'Not found',
        message: `Incident with id ${id} not found`
      });
    }

    // Update database
    const result = await db.query(
      'UPDATE incidents SET title = $1, description = $2, severity = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, title, description, severity, created_at, updated_at',
      [title.trim(), description ? description.trim() : '', severity, id]
    );

    const incident = result.rows[0];

    res.json({
      success: true,
      message: 'Incident updated successfully',
      incident
    });
  } catch (error) {
    console.error('PUT /incidents/:id error:', error);
    res.status(500).json({ 
      error: 'Failed to update incident',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/incidents/:id
 * Delete incident by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validation
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'ID must be a valid number'
      });
    }

    // Check if incident exists
    const incident = await db.getOne('SELECT id FROM incidents WHERE id = $1', [id]);
    if (!incident) {
      return res.status(404).json({
        error: 'Not found',
        message: `Incident with id ${id} not found`
      });
    }

    // Delete from database
    await db.query('DELETE FROM incidents WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Incident deleted successfully',
      incident_id: id
    });
  } catch (error) {
    console.error('DELETE /incidents/:id error:', error);
    res.status(500).json({ 
      error: 'Failed to delete incident',
      message: error.message 
    });
  }
});

module.exports = router;
