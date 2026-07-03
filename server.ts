import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API: AI Recommendations
app.post("/api/recommendations", async (req, res) => {
  try {
    const { userPrompt, selectedGenres, favorites } = req.body;

    if (!userPrompt || typeof userPrompt !== "string") {
      return res.status(400).json({ error: "Please provide a valid prompt for the AI." });
    }

    const ai = getGemini();

    const systemPrompt = `You are the CineMatch AI Movie Recommender, a film expert with refined taste.
You recommend highly specific, curated movies based on the user's prompt, favorite genres, and favorite list.
Always reply with JSON adhering to the specified schema.
Try to suggest actual movies from classic/modern cinema or highly creative titles that fit perfectly.
Provide a personalized reasoning for each recommendation, and calculate an authentic match percentage (80-99).`;

    const userInstructions = `User Prompt: "${userPrompt}"
Preferred Genres: ${selectedGenres ? selectedGenres.join(", ") : "None specified"}
Favorite Movies So Far: ${favorites ? favorites.join(", ") : "None specified"}

Recommend 6 amazing movies.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInstructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "A warm, expert introductory note explaining this custom curation.",
            },
            recommendations: {
              type: Type.ARRAY,
              description: "List of exactly 6 curated movie recommendations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title of the recommended movie." },
                  reason: { type: Type.STRING, description: "Why this movie is recommended based on their prompt and taste." },
                  matchPercentage: { type: Type.INTEGER, description: "Predicted match percentage, e.g., 95." },
                  genre: { type: Type.STRING, description: "Primary genre of this movie, e.g., Sci-Fi, Action, Drama, Thriller, etc." },
                },
                required: ["title", "reason", "matchPercentage", "genre"],
              },
            },
          },
          required: ["message", "recommendations"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI engine.");
    }

    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during AI recommendation generation.",
    });
  }
});

async function startServer() {
  // Vite middleware setup in development, static folder in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
