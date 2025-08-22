document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const statusInput = document.getElementById("status-input");
  const todoList = document.getElementById("todo-list");

  const searchInput = document.getElementById("search-input");
  const filterStatus = document.getElementById("filter-status");
  const filterDate = document.getElementById("filter-date");
  const clearFilter = document.getElementById("clear-filter");
  const deleteAllBtn = document.getElementById("delete-all"); // ✅ tombol Delete All

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Add or Update Task
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;

    if (!task) {
      alert("Please enter a task!");
      return;
    }
    if (!date) {
      alert("Please select a date!");
      return;
    }

    if (todoForm.dataset.editing) {
      // Update existing
      const id = Number(todoForm.dataset.editing);
      const index = todos.findIndex((t) => t.id === id);
      todos[index] = { id, task, date, status };
      todoForm.dataset.editing = "";
    } else {
      // Add new
      const newTodo = { id: Date.now(), task, date, status };
      todos.push(newTodo);
    }

    saveAndRender();
    todoForm.reset();
  });

  // Actions: delete, edit, change status
  todoList.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("delete")) {
      todos = todos.filter((todo) => todo.id !== id);
    } else if (e.target.classList.contains("edit")) {
      const todo = todos.find((t) => t.id === id);
      todoInput.value = todo.task;
      dateInput.value = todo.date;
      statusInput.value = todo.status;
      todoForm.dataset.editing = id;
    } else if (e.target.classList.contains("status")) {
      const todo = todos.find((t) => t.id === id);
      todo.status =
        todo.status === "pending"
          ? "in-progress"
          : todo.status === "in-progress"
          ? "done"
          : "pending";
    }
    saveAndRender();
  });

  // Filter handlers
  searchInput.addEventListener("input", applyFilters);
  filterStatus.addEventListener("change", applyFilters);
  filterDate.addEventListener("change", applyFilters);
  clearFilter.addEventListener("click", () => {
    searchInput.value = "";
    filterStatus.value = "all";
    filterDate.value = "";
    renderTodos(todos);
  });

  // ✅ Delete All
  deleteAllBtn.addEventListener("click", () => {
    if (todos.length === 0) {
      alert("No tasks to delete!");
      return;
    }

    if (confirm("Are you sure you want to delete all tasks?")) {
      todos = [];
      saveAndRender();
    }
  });

  // Save and Render
  function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos(todos);
  }

  function applyFilters() {
    let filtered = [...todos];

    const keyword = searchInput.value.toLowerCase();
    if (keyword) {
      filtered = filtered.filter((todo) =>
        todo.task.toLowerCase().includes(keyword)
      );
    }

    const status = filterStatus.value;
    if (status !== "all") {
      filtered = filtered.filter((todo) => todo.status === status);
    }

    const date = filterDate.value;
    if (date) {
      filtered = filtered.filter((todo) => todo.date === date);
    }

    renderTodos(filtered);
  }

  function renderTodos(list) {
    todoList.innerHTML = "";
    list.forEach((todo) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>
          <strong>${todo.task}</strong>
          <small>📅 ${todo.date} | Status: ${todo.status}</small>
        </span>
        <div class="actions">
          <button class="status" data-id="${todo.id}">Change</button>
          <button class="edit" data-id="${todo.id}">Edit</button>
          <button class="delete" data-id="${todo.id}">Delete</button>
        </div>
      `;
      todoList.appendChild(li);
    });
  }

  renderTodos(todos);
});
