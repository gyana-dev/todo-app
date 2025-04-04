const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener("blur", () => {
      tasks[index].text = span.textContent.trim();
      saveTasks();
    });

    const controls = document.createElement("div");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.onclick = () => toggleComplete(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => deleteTask(index);

    controls.appendChild(completeBtn);
    controls.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(controls);

    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const text = input.value.trim();
  if (text === "") return;

  tasks.push({ text, completed: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateCounter() {
  const counter = document.getElementById("task-counter");
  const activeTasks = tasks.filter(task => !task.completed).length;
  counter.textContent = `${activeTasks} task${activeTasks !== 1 ? "s" : ""} remaining`;
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
  }
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

renderTasks();
