import axios from 'axios';

const realisticUsers = [
    {
        name: "Michael Chen",
        email: "michael.chen@outlook.com",
        password: "123456",
        role: "employee",
        skills: ["React", "TypeScript", "Node.js"]
    },
    {
        name: "Sarah Jenkins",
        email: "s.jenkins@yahoo.com",
        password: "123456",
        role: "employee",
        skills: ["UI/UX Design", "Figma", "CSS"]
    },
    {
        name: "David Rodriguez",
        email: "david.rodriguez88@hotmail.com",
        password: "123456",
        role: "employee",
        skills: ["Python", "Machine Learning", "Data Analysis"]
    },
    {
        name: "Emma Watson",
        email: "emma.watson.dev@gmail.com",
        password: "123456",
        role: "employee",
        skills: ["Project Management", "Agile", "Scrum"]
    },
    {
        name: "James Wilson",
        email: "j.wilson.tech@company.com",
        password: "123456",
        role: "employee",
        skills: ["DevOps", "AWS", "Docker"]
    },
    {
        name: "Priya Patel",
        email: "priya.p@protonmail.com",
        password: "123456",
        role: "employee",
        skills: ["Backend Development", "MongoDB", "Express"]
    }
];

async function seedUsers() {
    console.log("Starting to seed real-world users...");
    
    for (const user of realisticUsers) {
        try {
            console.log(`Registering ${user.name} (${user.email})...`);
            const res = await axios.post('http://localhost:5001/api/auth/register', user);
            console.log(`✅ Success: ${res.data.message}`);
        } catch (e) {
            console.error(`❌ Error registering ${user.name}:`, e.response ? e.response.data.message : e.message);
        }
    }
    console.log("Finished seeding users.");
}

seedUsers();
