// Αρχικοποιούμε τις κατηγορίες και τις εργασίες από το localStorage (αν υπάρχουν)
const categories = ['Σπίτι', 'Δουλειά', 'Άλλο'];
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Συνάρτηση για την προσθήκη νέας εργασίας
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('category');
    const dueDateInput = document.getElementById('dueDate');
    const taskText = taskInput.value.trim();
    const selectedCategory = categorySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === '' || !dueDate) {
        alert('Παρακαλώ εισάγετε μια εργασία και ημερομηνία λήξης.');
        return;
    }

    const task = {
        text: taskText,
        category: selectedCategory,
        dueDate: dueDate,
        isExpired: isTaskExpired(dueDate),
    };

    // Αποστολή της εργασίας στο backend API
    const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });

    const newTask = await response.json();
    renderTasks(); // Ενημέρωση της λίστας με τις εργασίες
}

// Συνάρτηση για έλεγχο αν η εργασία έχει λήξει
function isTaskExpired(dueDate) {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    return dueDateObj < today;
}

// Συνάρτηση για την εμφάνιση των εργασιών
async function renderTasks() {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = ''; // Καθαρίζουμε τις προηγούμενες εργασίες

    const response = await fetch('http://localhost:5000/tasks');
    const tasks = await response.json();

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerText = `${task.text} (Λήξη: ${task.dueDate})`;

        if (task.isExpired) {
            taskItem.style.color = 'red';
            taskItem.style.fontWeight = 'bold';
        }

        tasksContainer.appendChild(taskItem);
    });
}


