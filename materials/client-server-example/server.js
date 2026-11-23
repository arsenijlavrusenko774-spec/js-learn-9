"use strict";

const express = require("express");
const path = require("node:path");

const app = express();
const PORT = 3000;

let todos = [
  { id: 1, text: "Повторить JSON", done: true },
  { id: 2, text: "Разобрать HTTP", done: false },
  { id: 3, text: "Написать первый API", done: false }
];
let nextId = 4;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const text = String(req.body.text ?? "").trim();

  if (!text) {
    return res.status(400).json({ error: "Поле text обязательно" });
  }

  const todo = { id: nextId++, text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(item => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Задача не найдена" });
  }

  if (typeof req.body.done === "boolean") todo.done = req.body.done;
  if (typeof req.body.text === "string" && req.body.text.trim()) {
    todo.text = req.body.text.trim();
  }

  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Задача не найдена" });
  }

  todos.splice(index, 1);
  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.listen(PORT, () => {
  console.log(`Todo example: http://localhost:${PORT}`);
});
