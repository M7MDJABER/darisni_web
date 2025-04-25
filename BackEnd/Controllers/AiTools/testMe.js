const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const processFile = require("../getTxtFromFile/extTextToTestMe.js");

const router = express.Router();

router.use(cors());
router.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.get("/api/pdf-proxy", async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).send("Missing url");

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    res
      .header("Access-Control-Allow-Origin", "*")
      .header("Content-Type", "application/pdf")
      .send(response.data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// In your router file
router.post("/api/test-me", async (req, res) => {
  try {
    const { fileUrl, pageNumber = 1, message } = req.body;

    // 2) Validate required params
    if (!fileUrl) {
      return res.status(400).json({ error: "fileUrl is required." });
    }

    // 3) Process the file into text pages
    const fullText = await processFile(fileUrl);
    if (!Array.isArray(fullText) || fullText.length === 0) {
      console.error("error processing the file!");
      return res.status(500).json({ error: "Failed to process file." });
    }

    // 4) Generate the AI discussion
    const discussion = await generateDiscussion(fullText, pageNumber, message);

    // 5) Return the reply field (note the spelling!)
    return res.json({ reply: discussion });
  } catch (err) {
    console.error("Error in /api/test-me:", err);
    return res.status(500).json({ error: err.message });
  }
});

async function generateDiscussion(fullText, pageNumber, message) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });
    //   const prompt = `
    //   You are a helpful assistant.
    //   When answering, always reply in the same language as the user’s question.

    //   Below is the text from page ${pageNumber}:

    //   ${fullText[pageNumber - 1]}

    //   User’s question:
    //   ${message}

    //   Please:
    //   1. Answer the question briefly and accurately, using only the text above; if there’s not enough info, search the rest of the pages (${fullText.join(" | ")}) for it.
    //   2. If the question falls outside the context of the provided text, reply exactly:
    //  “I’m sorry, but I can’t help with that on this page.”

    //   Answer:
    //   `;
    // const limitedFallback = fullText
    //   .slice(Math.max(0, pageNumber - 2), pageNumber + 1)
    //   .join(" | ");

    // const prompt = `
    // You are a helpful assistant...

    // Page ${pageNumber}:
    // ${fullText[pageNumber - 1]}

    // User's question:
    // ${message}

    // Please:
    // 1. Answer from this page. If not found, check:
    // ${limitedFallback}
    // 2. If not found at all, reply: "I’m sorry, but I can’t help with that on this page."
    // `;
    const pageText = fullText[pageNumber - 1];
    const fallbackContext = fullText
      .slice(Math.max(0, pageNumber - 2), pageNumber + 1)
      .join(" | ");

    const prompt = `
You are a knowledgeable assistant helping users understand complex documents.

📄 The following is the text from page ${pageNumber} of a document:
---
${pageText}
---

🔎 Additional context (surrounding pages, if helpful):
${fallbackContext}

🧠 User's question:
"${message}"

🔁 Your job:
1. Answer the question with as much detail and clarity as possible.
2. Go beyond the surface — provide explanations, inferences, and additional context that logically follow from the text.
3. Use examples, analogies, or simplified breakdowns if they help understanding.
4. Stick to the context — do NOT invent facts or content not reasonably inferred.
5. If the answer is not available even after inference, respond:
   "I’m sorry, but I can’t help with that on this page."

🗣️ Your answer:
`;

    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();
    console.log(rawText);
    return rawText;
  } catch (err) {
    console.error(err);
  }
}

module.exports = router;
