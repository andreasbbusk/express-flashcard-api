import express from 'express';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileUtils.js';

const router = express.Router();
const SETS_FILE = 'sets.json';
const FLASHCARDS_FILE = 'flashcards.json';

// GET /api/sets - Get all sets
router.get('/', (req, res) => {
  try {
    const sets = readJsonFile(SETS_FILE);
    res.json({
      success: true,
      count: sets.length,
      data: sets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve sets'
    });
  }
});

// POST /api/sets - Create a new set
router.post('/', (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Set name is required'
      });
    }
    
    const sets = readJsonFile(SETS_FILE);
    
    // Check if set already exists
    const existingSet = sets.find(set => 
      set.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingSet) {
      return res.status(409).json({
        success: false,
        error: 'Set already exists'
      });
    }
    
    const newSet = {
      id: generateId(sets),
      name: name.trim(),
      description: description?.trim() || '',
      createdAt: new Date().toISOString()
    };
    
    sets.push(newSet);
    writeJsonFile(SETS_FILE, sets);
    
    res.status(201).json({
      success: true,
      message: 'Set created successfully',
      data: newSet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create set'
    });
  }
});

// GET /api/sets/:name/flashcards - Get flashcards by set
router.get('/:name/flashcards', (req, res) => {
  try {
    const setName = req.params.name;
    const flashcards = readJsonFile(FLASHCARDS_FILE);
    
    const setFlashcards = flashcards.filter(card => 
      card.set.toLowerCase() === setName.toLowerCase()
    );
    
    res.json({
      success: true,
      set: setName,
      count: setFlashcards.length,
      data: setFlashcards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve set flashcards'
    });
  }
});

export default router;