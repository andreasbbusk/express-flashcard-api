import express from "express";
import flashcardRoutes from "./routes/flashcards.js";
import setRoutes from "./routes/sets.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Flashcard API is running",
    endpoints: {
      flashcards: "/flashcards",
      sets: "/sets",
    },
  });
});

app.use("/flashcards", flashcardRoutes);
app.use("/sets", setRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: "This API endpoint does not exist",
  });
});

app.listen(PORT, () => {
  console.log(`Flashcard API server running on http://localhost:${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/api`);
});
