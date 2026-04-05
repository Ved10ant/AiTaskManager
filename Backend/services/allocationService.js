import { analyzeTaskWithAI } from "./aiService.js";
import User from "../models/User.js";

const calculateSkillMatch = (required, userSkills) => {
  // Defensive check for required skills (ensure it's an array)
  const reqSkills = Array.isArray(required) ? required : [];
  if (!reqSkills.length) return 0;
  
  const normalizedUserSkills = (userSkills || []).map(s => String(s).toLowerCase());
  
  const match = reqSkills.filter((skill) =>
    normalizedUserSkills.some(us => us.includes(String(skill).toLowerCase()))
  );

  return match.length / reqSkills.length;
};

export const findBestCandidate = async (task) => {
  try {
    // 1. AI analysis to extract skills and metadata
    console.log(`Starting AI analysis for task: ${task.title}`);
    let aiData;
    try {
        aiData = await analyzeTaskWithAI(
            task.title,
            task.description
        );
    } catch (aiError) {
        console.error("Gemini AI Analysis Error:", aiError.message);
        // Fallback to manual skills if provided
        aiData = {
            requiredSkills: task.requiredSkills || [],
            difficulty: "Medium",
            estimatedHours: 4
        };
    }

    const requiredSkills = aiData?.requiredSkills || [];

    // 2. Get all eligible employees
    console.log("Searching for employees with role: employee...");
    const users = await User.find({ role: "employee" });
    console.log(`Found ${users.length} potential candidates.`);

    if (users.length === 0) {
        return { candidate: null, score: 0, aiInsights: aiData };
    }

    // 3. Score users based on multiple factors:
    // - 60% Skill Match
    // - 20% Performance Score
    // - 20% Workload Factor (favouring those with less tasks)
    let bestUser = null;
    let bestScore = -1;

    for (let user of users) {
      try {
        const skillMatch = calculateSkillMatch(
          requiredSkills,
          user.skills
        );

        // Normalize workload factor (0 to 1, where 1 is zero workload)
        const currentWorkload = user.currentWorkload || 0;
        const workloadFactor = Math.max(0, 1 - currentWorkload / 10);

        const score =
          skillMatch * 0.6 +
          ((user.performanceScore || 50) / 100) * 0.2 +
          workloadFactor * 0.2;

          console.log(`- Candidate ${user.name}: SkillMatch=${skillMatch.toFixed(2)}, Score=${score.toFixed(2)}`);

        if (score > bestScore) {
          bestScore = score;
          bestUser = user;
        }
      } catch (userScoreError) {
        console.error(`Error scoring user ${user._id}:`, userScoreError.message);
      }
    }

    return {
      candidate: bestUser,
      score: bestScore,
      aiInsights: aiData,
    };
  } catch (globalError) {
    console.error("Global error in findBestCandidate service:", globalError.message);
    throw globalError;
  }
};
