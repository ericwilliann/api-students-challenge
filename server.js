const express = require('express');
const app = express();
const port = 3000;
app.use(express.json()); // Enables JSON body parsing
let students = [];
let nextId = 1;
// returns the first unique letter in a name
function getUniqueLetter(name) {
    const letters = name.toLowerCase().split('');
    const letterCount = {};
    for (const letter of letters) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    for (const letter of letters) {
        if (letterCount[letter] === 1) {
            return letter;
        }
    }
    return '_';
}
// POST /students – Create a student
app.post('/students', (req, res) => {
    const { name, grade } = req.body;
    if (typeof name !== 'string' || typeof grade !== 'number') {
        return res.status(400).json({ error: 'Name must be a string and grade must be a number.' });
    }
    if (grade < 0 || grade > 10) {
        return res.status(400).json({ error: 'Grade must be between 0 and 10.' });
    }
    const student = {
        id: nextId++,
        name,
        grade
    };
    students.push(student);
    res.status(201).json({ message: 'Student created successfully.', student });
});
// GET /students – List all students
app.get('/students', (req, res) => {
    const result = students.map((student) => {
        return {
            ...student,
            uniqueLetter: getUniqueLetter(student.name)
        };
    });
    res.json(result);
});
// GET /students/:id – Get one student by ID
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find((s) => s.id === id);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    const result = {
        ...student,
        uniqueLetter: getUniqueLetter(student.name)
    };
    res.json(result);
});
// Start server
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
// Student API Challenge
// This is a simple Node.js API developed for an internship challenge.
//
// Features:
// - Add students with name and grade (0 to 10)
// - List all students
// - Get a student by ID
// - Returns a unique letter in the name (or '_' if all letters repeat)
//
// How to run:
// 1. Install dependencies: npm install express
// 2. Start the server: node server.js
// 3. Test using Postman or curl
//
// Example curl:
// curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"Lucas\", \"grade\":8}" http://localhost:3000/students
//
// Justification:
// I chose to use Node.js with Express because it is simple and easy to set up for small APIs.
// I used an array to store the data in memory, since the challenge allows it and it avoids the need for database setup.
// I added validation to ensure the grade is between 0 and 10.
// The function to find the non-repeating letter was implemented to meet the requirement in all GET responses.
