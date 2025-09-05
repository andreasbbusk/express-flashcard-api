import express from "express";
import { readJsonFile, writeJsonFile, generateId } from "../utils/fileUtils.js";

const router = express.Router();
const FLASHCARDS_FILE = "flashcards.json";

router.get("/", async (req, res) => {
  try {
    const flashcards = await readJsonFile(FLASHCARDS_FILE);
    res.json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve flashcards",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const flashcards = await readJsonFile(FLASHCARDS_FILE);
    const id = parseInt(req.params.id);

    const flashcard = flashcards.find((card) => card.id === id);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found",
      });
    }
    res.json({
      succes: true,
      data: flashcard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve flashcards",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { front, back, set } = req.body;

    if (!front || !back) {
      return res.status(400).json({
        succes: false,
        error: "Front and back are required",
      });
    }
    const flashcards = await readJsonFile(FLASHCARDS_FILE);

    const newFlashcard = {
      id: generateId(flashcards),
      front: front.trim(),
      back: back.trim(),
      set: set || "General",
      createdAt: new Date().toISOString(),
      reviewCount: 0,
    };

    flashcards.push(newFlashcard);

    writeJsonFile(FLASHCARDS_FILE, flashcards);

    res.status(201).json({
      succes: true,
      message: "Flashcard succesfully created",
      data: newFlashcard,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: "Failed to create flashcard",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const flashcards = await readJsonFile(FLASHCARDS_FILE);
    const id = parseInt(req.params.id);
    const { front, back, set } = req.body;
    const flashcardIndex = flashcards.findIndex((card) => card.id === id);

    if (flashcardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found",
      });
    }

    if (!front || !back) {
      return res.status(400).json({
        succes: false,
        error: "Front and back are required",
      });
    }

    flashcards[flashcardIndex] = {
      id,
      front: front.trim(),
      back: back.trim(),
      set: set || "General",
      createdAt: flashcards[flashcardIndex].createdAt,
      updatedAt: new Date().toISOString(),
      reviewCount: flashcards[flashcardIndex].reviewCount || 0,
    };

    writeJsonFile(FLASHCARDS_FILE, flashcards);

    res.json({
      succes: true,
      message: "Succesfully updated flashcard",
      data: flashcards[flashcardIndex],
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: "Failed to update flashcard",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const flashcards = await readJsonFile(FLASHCARDS_FILE);
    const id = parseInt(req.params.id);

    const flashcardIndex = flashcards.findIndex((card) => card.id === id);

    if (flashcardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found",
      });
    }

    const deletedFlashcard = flashcards.splice(flashcardIndex, 1)[0];
    writeJsonFile(FLASHCARDS_FILE, flashcards);

    res.json({
      success: true,
      message: "Flashcard deleted successfully",
      data: deletedFlashcard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete flashcard",
    });
  }
});

export default router;
