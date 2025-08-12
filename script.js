// DOM Elements
const taskForm = document.getElementById("task-form");
const todoList = document.getElementById("todo-list");
const completedList = document.getElementById("completed-list");
const searchInput = document.getElementById("search");
const priorityFilter = document.getElementById("priority-filter");
const exportBtn = document.getElementById("export-csv");
const clearCompletedBtn = document.getElementById("clear-completed");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

// Extra: Background changer button
const bgChangeBtn = document.createElement("button");
bgChangeBtn.textContent = "Change Background";
bgChangeBtn.classList.add("full");
document.querySelector(".sidebar").appendChild(bgChangeBtn);

let bgColors = ["#0f172a", "#1f2937", "#111827", "#374151"];
let currentBgIndex = 0;

// Task data
let tasks = [
    { title: "Prepare sprint report", desc: "For team meeting", due: "2025-08-15", priority: "High", completed: false },
    { title: "Fix login bug", desc: "Auth service issue", due: "2025-08-14", priority: "High", completed: false },
    { title: "Design landing page", desc: "UI for product launch", due: "2025-08-20", priority: "Medium", completed: false },
    { title: "Email marketing campaign", desc: "", due: "2025-08-17", priority: "Low", completed: true },
    { title: "Database backup", desc: "Monthly backup", due: "2025-08-10", priority: "Medium", completed: true },
];

// Render tasks
function renderTasks() {
    todoList.innerHTML = "";
    completedList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();
    const filterPriority = priorityFilter.value;

    let totalTasks = 0;
    let doneTasks = 0;

    tasks.forEach((task, index) => {
        if (
            (task.title.toLowerCase().includes(searchTerm) ||
            task.desc.toLowerCase().includes(searchTerm)) &&
            (filterPriority === "all" || task.priority === filterPriority)
        ) {
            const div = document.createElement("div");
            div.className = "task-item" + (task.completed ? " completed" : "");
            div.innerHTML = `
                <strong>${task.title}</strong><br>
                ${task.desc || ""} 
                <br><small>Due: ${task.due || "No date"} | Priority: ${task.priority}</small>
            `;
            div.style.animation = "fadeIn 0.4s ease"; // Fade-in effect
            div.addEventListener("click", () => toggleTask(index));

            if (task.completed) {
                completedList.appendChild(div);
                doneTasks++;
            } else {
                todoList.appendChild(div);
            }
            totalTasks++;
        }
    });

    progressText.textContent = `${doneTasks} / ${totalTasks} done`;
    animateProgress(doneTasks, totalTasks);
}

// Toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Animated progress bar fill
function animateProgress(done, total) {
    const percentage = total > 0 ? (done / total) * 100 : 0;
    progressFill.style.transition = "width 0.4s ease";
    progressFill.style.width = `${percentage}%`;
}

// Form submission
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    const desc = document.getElementById("task-desc").value.trim();
    const due = document.getElementById("task-date").value;
    const priority = document.getElementById("task-priority").value;

    if (title.length < 3) {
        alert("Task title must be at least 3 characters long!");
        return;
    }

    tasks.push({ title, desc, due, priority, completed: false });
    taskForm.reset();
    renderTasks();
});

// Search and filter
searchInput.addEventListener("input", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

// Export CSV
exportBtn.addEventListener("click", () => {
    let csvContent = "data:text/csv;charset=utf-8,Title,Description,Due Date,Priority,Completed\n";
    tasks.forEach(t => {
        csvContent += `${t.title},${t.desc},${t.due},${t.priority},${t.completed}\n`;
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
});

// Change background
bgChangeBtn.addEventListener("click", () => {
    currentBgIndex = (currentBgIndex + 1) % bgColors.length;
    document.body.style.transition = "background-color 0.5s ease";
    document.body.style.backgroundColor = bgColors[currentBgIndex];
});

// Welcome alert
window.addEventListener("load", () => {
    alert("Welcome to TaskPro! Let's get productive. 🚀");
    renderTasks();
});
