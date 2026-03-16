require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Serves your index.html and styles
app.use(express.static(__dirname));

// Use the API key directly for now to ensure it works
const groq = new Groq({ 
    apiKey: "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" 
});

// Serve the UI to Chrome
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are Zoiee, a helpful assistant. Keep answers concise." },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI Error" });
    }
});

app.listen(3000, () => {
    console.log('Server is running! Open http://localhost:3000 in Chrome');
});