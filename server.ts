import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/ai/parse', async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        // Fallback if no key
        return res.json({
          title: text,
          priority: 'Medium',
          tags: [],
          dueDate: null
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI assistant in a task management tool. Parse the following natural language task input and extract details.
Output ONLY a valid JSON object matching this schema:
{
  "title": "Cleaned up task name string",
  "priority": "Low" | "Medium" | "High",
  "tags": ["tag1", "tag2"],
  "dueDate": "ISO 8601 date string or null"
}
Input text: "${text}"`,
      });

      const responseText = response.text || '{}';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '');
      const parsed = JSON.parse(cleanJson);
      
      res.json(parsed);
    } catch (e: any) {
      console.error("AI Parse Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
