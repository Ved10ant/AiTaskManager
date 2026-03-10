import User from '../models/User.js';

/**
 * Calculates a match score for an employee against a task.
 * @param {Object} employee - User document
 * @param {Object} task - Task document
 * @returns {Number} Total configured score
 */
const calculateScore = (employee, task) => {
  // 1. Skill Match Percentage (0 - 100)
  const requiredSkills = task.requiredSkills || [];
  const userSkills = employee.skills || [];
  const commonSkills = requiredSkills.filter(skill => userSkills.includes(skill));
  const skillMatchScore = requiredSkills.length 
    ? (commonSkills.length / requiredSkills.length) * 100 
    : 100;
  
  // 2. Workload Score (0 - 100) -> Inversely proportional
  // Assuming 10 tasks is the maximum workload limit threshold
  const workloadScore = Math.max(0, 100 - (employee.currentWorkload * 10));

  // 3. Availability Score
  const availabilityScore = employee.availabilityStatus === 'available' ? 100 : 0;

  // 4. Experience Score (Assuming 10 years maps to 100)
  const experienceScore = Math.min(employee.experienceYears * 10, 100);

  // 5. Performance Score (Already 0-100 scale in DB)
  const performanceScore = employee.performanceScore || 50;

  // Weighted Formula
  const WEIGHTS = {
    skillMatch: 0.35,  // Most important
    availability: 0.25, // Crucial
    workload: 0.20,    // Avoid burnout
    experience: 0.10,
    performance: 0.10
  };

  const totalScore = 
    (skillMatchScore * WEIGHTS.skillMatch) +
    (availabilityScore * WEIGHTS.availability) +
    (workloadScore * WEIGHTS.workload) +
    (experienceScore * WEIGHTS.experience) +
    (performanceScore * WEIGHTS.performance);

  return totalScore;
};

/**
 * Automatically assigns a task to the best candidate.
 * @param {Object} taskData - The incoming task data payload
 */
export const autoAssignTask = async (taskData) => {
  // Find all employees that are generally available to take tasks
  const employees = await User.find({ role: 'employee' });
  
  if (!employees.length) throw new Error("No employees available to assign.");

  let bestCandidate = null;
  let highestScore = -1;
  const evaluationLog = []; 

  for (const employee of employees) {
    const score = calculateScore(employee, taskData);
    evaluationLog.push({ employeeId: employee._id, name: employee.name, score });
    
    // Check if score is the best so far
    if (score > highestScore) {
      highestScore = score;
      bestCandidate = employee;
    }
  }

  return { 
    assignedUser: bestCandidate, 
    matchScore: highestScore.toFixed(2),
    allCandidates: evaluationLog 
  };
};
