import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const API_KEY = process.env.GEMINI_API_KEY;

// Endpoint for GreenPulse
app.post("/green-pulse", async (req, res) => {
    const { promptText } = req.body;

    if (!promptText) {
        return res.status(400).json({ error: "Prompt text is required." });
    }

    const prompt = `Act as an environmental advisor. The user has provided the following information: "${promptText}"`;

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Sending request to API...");

        const result = await model.generateContent(prompt);

        console.log("Full API Response:", JSON.stringify(result, null, 2)); // Full debug log

        // Correct way to extract content
        const textResponse = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion available.";


        if (textResponse) {
            res.json({ suggestion: textResponse });
        } else {
            console.error("Invalid API Response Structure:", JSON.stringify(result, null, 2));
            res.status(500).json({ error: "Failed to get a valid suggestion." });
        }

    } catch (error) {
        console.error("Error in /green-pulse route:", error.message);
        res.status(500).json({ error: "Failed to fetch suggestion. Check server logs for details." });
    }
});




// Endpoint to check if the server is running
app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
