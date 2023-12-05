// Import the required modules using the ESM syntax
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Define the endpoint for generating ideas
app.post('/generate-idea', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const { genre, gimmick } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt: `Generate a video game idea set in the ${genre} genre with a central gimmick of ${gimmick}. The game should involve...`,
                max_tokens: 150,  // Adjust as needed
            }),
        });

        const data = await response.json();
        const generatedIdea = data.choices[0].text;

        res.json({ idea: generatedIdea });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
