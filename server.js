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
