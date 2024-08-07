document.addEventListener("DOMContentLoaded", () => {
  const todosKeys = 'todo-list';
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById('todo-input');
  const categorySelect = document.getElementById('category-select');
  const prioritySelect = document.getElementById('priority-select');
  const completedInput = document.getElementById('completed-input');
  const todoList = document.getElementById('todo-list');
  const categoryFilter = document.getElementById('category-filter');
  const priorityFilter = document.getElementById('priority-filter');
  const searchInput = document.getElementById('search-input');

  let todos = JSON.parse(localStorage.getItem(todosKeys)) || [];
  let editingIndex = null;

  function saveTodos() {
    localStorage.setItem(todosKeys, JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';
    const searchKeyword = searchInput.value.toLowerCase();
    const filteredTodos = todos.filter(todo =>
      (categoryFilter.value === 'all' || todo.category === categoryFilter.value) &&
      (priorityFilter.value === 'all' || todo.priority === priorityFilter.value) &&
      todo.text.toLowerCase().includes(searchKeyword)
    );
    filteredTodos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.category} ${todo.priority} ${todo.completed ? 'completed' : ''}`;

      let displayText = todo.text;
      let readMore = '';

      if (todo.text.length > 15) {
        displayText = todo.text.substring(0, 15) + '...';
        readMore = `<a href="#" id="read-more-${index}" onclick="toggleReadMore(${index}, event)">Read more</a>`;
      }

      li.innerHTML = `
        <input type="checkbox" onchange="toggleCompleted(${index})" ${todo.completed ? 'checked' : ''}>
        <span id="todo-text-${index}">${displayText}</span>
        <span id="more-text-${index}" style="display: none;">${todo.text.substring(15)}</span>
        <span> ${readMore}</span>
        <div style="display: flex; justify-content: space-between;">
          <button onclick="editTodo(${index})">Edit</button>
          <button onclick="deleteTodo(${index})">Delete</button>
        </div>
      `;
      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText) {
      if (editingIndex !== null) {
        todos[editingIndex].text = todoText;
        editingIndex = null;
      } else {
        todos.push({
          text: todoText,
          category: categorySelect.value,
          priority: prioritySelect.value,
          completed: completedInput.checked
        });
      }
      saveTodos();
      todoInput.value = '';
      completedInput.checked = false;
      renderTodos();
    }
  });

  window.toggleCompleted = (index) => {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  };

  window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  };

  window.editTodo = (index) => {
    editingIndex = index;
    todoInput.value = todos[index].text;
    categorySelect.value = todos[index].category;
    prioritySelect.value = todos[index].priority;
    completedInput.checked = todos[index].completed;
  };

  window.toggleReadMore = (index, event) => {
    event.preventDefault();
    const todoText = document.getElementById(`todo-text-${index}`);
    const moreText = document.getElementById(`more-text-${index}`);
    const readMore = document.getElementById(`read-more-${index}`);
    if (moreText.style.display === 'none') {
      moreText.style.display = 'inline';
      readMore.innerText = ' Read less';
    } else {
      moreText.style.display = 'none';
      readMore.innerText = 'Read more';
    }
  };

  categoryFilter.addEventListener('change', renderTodos);
  priorityFilter.addEventListener('change', renderTodos);
  searchInput.addEventListener('input', renderTodos); // Add this line
  renderTodos();
});
