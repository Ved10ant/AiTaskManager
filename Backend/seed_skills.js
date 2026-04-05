import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager";

const ALL_SKILLS = [
    "MERN Stack",
    "Frontend",
    "Backend",
    "Python",
    "Java",
    "Flutter",
    "MongoDB",
    "React"
];

function getRandomSkills() {
    // Pick 2-4 random skills
    const numSkills = Math.floor(Math.random() * 3) + 2; 
    const shuffled = [...ALL_SKILLS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSkills);
}

mongoose.connect(uri)
  .then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection("users").find({ $or: [{ skills: { $exists: false } }, { skills: { $size: 0 } }] }).toArray();
    
    console.log(`Found ${users.length} users with empty skills.`);
    
    for (const user of users) {
        const skills = getRandomSkills();
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { skills } }
        );
        console.log(`Updated user ${user.name} with skills: ${skills.join(", ")}`);
    }

    console.log("Finished seeding skills!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
