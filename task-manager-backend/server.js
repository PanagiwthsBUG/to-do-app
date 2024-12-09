const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Εισάγουμε το cors

const app = express();
const port = 5000;

// Σύνδεση με MongoDB
mongoose.connect('mongodb://localhost:27017/task-manager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Σύνδεση με MongoDB είναι επιτυχής');
}).catch((err) => {
    console.log('Σφάλμα σύνδεσης με MongoDB:', err);
});

app.use(cors()); // Προσθέτουμε το middleware για CORS
app.use(bodyParser.json()); // Επεξεργασία JSON

// Δημιουργία μοντέλου εργασίας
const taskSchema = new mongoose.Schema({
    text: String,
    category: String,
    dueDate: Date,
    isExpired: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// API για προσθήκη εργασίας
app.post('/tasks', async (req, res) => {
    const { text, category, dueDate, isExpired } = req.body;
    try {
        const newTask = new Task({ text, category, dueDate, isExpired });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Σφάλμα κατά την προσθήκη εργασίας', error: err });
    }
});

// API για ανάκτηση εργασιών
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση των εργασιών', error: err });
    }
});

// Εκκίνηση του server
app.listen(port, () => {
    console.log(`Ο server εκτελείται στη θύρα ${port}`);
});
