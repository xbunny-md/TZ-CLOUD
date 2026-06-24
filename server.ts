import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Load keys provided by user, falling back to environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyDg2ZDpkPcSk60lmQc0TGJxxbbrpoPj6BQ";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6ICWgH26-kWTfC9SqwkkRIqOqlc_in8hC5G0xJwSrIG4w";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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"; 

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System Instruction for the AI
const SYSTEM_INSTRUCTION = `You are TZ CloudMind, the central AI for Tz Cloud, a futuristic East African tech hub and gaming portal. You are intelligent, sleek, and highly capable. You provide helpful, concise, and modern responses. You specialize in gaming (especially BUSSID and customizations), tech development, and general assistance. Provide syntax highlighting for code blocks. Be highly technical but accessible.`;

async function callGroq(prompt: string, history: any[], model: string = "llama-3.1-8b-instant") {
  if (!GROQ_API_KEY) throw new Error("No Groq API Key");
  const messages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...history.map(m => ({ role: m.role === 'system' ? 'assistant' : 'user', content: m.content })),
    { role: "user", content: prompt }
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages,
      temperature: 0.7,
    })
  });

  if (!res.ok) {
    throw new Error(`Groq Error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt: string, history: any[], model: string = "gemini-2.5-flash") {
  const formattedHistory = history.map(m => ({
    role: m.role === 'system' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      ...formattedHistory,
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });

  return response.text;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, history, model } = req.body;
    let text = "";

    try {
      if (model && model.includes("gemini")) {
        console.log("Using Gemini model:", model);
        text = await callGemini(prompt, history, model);
      } else {
        const groqModel = model || "llama-3.1-8b-instant";
        console.log("Attempting Groq with model:", groqModel);
        text = await callGroq(prompt, history, groqModel);
      }
    } catch (e: any) {
      console.log("Primary model failed, attempting fallback to Groq Llama 3 8B...", e.message);
      text = await callGroq(prompt, history, "llama3-8b-8192");
    }
    
    res.json({ text });
  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate response" });
  }
});

app.get("/api/youtube", async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = query ? String(query) : "BUSSID Tanzania skin";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "YouTube API error");
    }
    
    res.json(data);
  } catch (error: any) {
    console.error("YouTube API Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch YouTube data" });
  }
});

async function startServer() {
  const PORT = 3000;

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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
