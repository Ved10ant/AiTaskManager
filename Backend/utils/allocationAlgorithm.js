const calculationSkills = (employee, task) => {
    const matchedSkills = task.requiredSkills.filter(skill => employee.skills.includes(skill))
    const skillMatch = matchedSkills.length / task.requiredSkills.length
    const availability = employee.availabilityStatus === "available" ? 1 : 0.5
    const workLoad = 1 - (employee.currentWorkload / 10)
    const workexperience = 1 - (employee.experienceYears / 10)
    const FinalScore = skillMatch * 0.4 + availability * 0.3 + workLoad * 0.2 + workexperience * 0.1
    return FinalScore
}

export default calculationSkills
