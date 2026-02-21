const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-itinerary', async (req, res) => {
    const { place, days, amount, lang } = req.body;

    // OPTIMIZED PROMPT FOR SPEED AND READABILITY
    const prompt = `
 STRICT SYSTEM ROLE: Fast Travel Data Engine.
Location: ${place}, Duration: ${days} days, Budget: ₹${amount}.
Language: ${lang === 'ta' ? 'Tamil' : 'English'}.

REQUIRED OUTPUT FORMAT PER DAY:
DAY X: [TOURIST PLACE NAME]
Description: [Detailed description of the attraction and what to do there]
Breakfast: [Signature Dish] at [Specific Hotel Name]
Lunch: [Signature Dish] at [Specific Hotel Name]
Dinner: [Signature Dish] at [Specific Hotel Name]

RULES:
1. NO introductory or closing text.
2. NO asterisks (*), hashtags (#), or Markdown formatting.
3. Use exactly ONE empty line between different days.
4. Ensure the hotels mentioned are real and famous in that specific district.
`;

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );

        const data = await geminiResponse.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            res.json({ 
                success: true, 
                itinerary: data.candidates[0].content.parts[0].text 
            });
        } else {
            throw new Error("Invalid response");
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));