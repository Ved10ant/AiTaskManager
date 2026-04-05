import axios from 'axios';

async function testRegister() {
    try {
        const payload = {
            name: "Test Skill User",
            email: "testskills2@example.com",
            password: "password123",
            role: "employee",
            skills: ["React", "Backend"]
        };
        const res = await axios.post('http://localhost:5001/api/auth/register', payload);
        console.log("Response:", res.data);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
testRegister();
