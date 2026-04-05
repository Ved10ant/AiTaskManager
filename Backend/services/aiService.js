import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeTaskWithAI = async (title, description) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    Analyze this task and return JSON only.

    Title: ${title}
    Description: ${description}

    Return:
    {
      "requiredSkills": [],
      "difficulty": "",
      "estimatedHours": 0
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown markers if Gemini adds them
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0];
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0];
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};