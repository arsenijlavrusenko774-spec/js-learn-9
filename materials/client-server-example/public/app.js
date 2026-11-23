"use strict";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-text");
const list = document.querySelector("#todo-list");
const message = document.querySelector("#message");

async function api(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function renderTodo(todo) {
  const li = document.createElement("li");
  li.className = `todo${todo.done ? " done" : ""}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.className = "todo__toggle";

  const text = document.createElement("span");
  text.className = "todo__text";
  text.textContent = todo.text;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "todo__delete";
  remove.textContent = "Удалить";

  li.append(checkbox, text, remove);
  return li;
}

async function loadTodos() {
  const todos = await api("/api/todos");
  list.replaceChildren(...todos.map(renderTodo));
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";

  try {
    await api("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.value })
    });
    input.value = "";
    await loadTodos();
  } catch (error) {
    message.textContent = error.message;
  }
});

list.addEventListener("change", async event => {
  if (!event.target.matches(".todo__toggle")) return;
  const item = event.target.closest(".todo");

  await api(`/api/todos/${item.dataset.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: event.target.checked })
  });

  await loadTodos();
});

list.addEventListener("click", async event => {
  if (!event.target.matches(".todo__delete")) return;
  const item = event.target.closest(".todo");
  await api(`/api/todos/${item.dataset.id}`, { method: "DELETE" });
  await loadTodos();
});

loadTodos().catch(error => {
  message.textContent = error.message;
});
