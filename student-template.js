"use strict";

const express = require("express");
const path = require("path");
const app = express();

let books = [
    { id: 1, title: "JavaScript для начинающих", author: "А. Автор" },
    { id: 2, title: "Node.js на практике", author: "В. Автор" },
    { id: 3, title: "Веб-разработка", author: "С. Автор" }
];
let nextId = 4;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/api/books", (req, res) => {
    const q = req.query.q?.toLowerCase();
    if (!q) return res.json(books);
    
    res.json(books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q)
    ));
});

app.get("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
});

app.post("/api/books", (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) return res.status(400).json({ error: "title and author are required" });
    
    const newBook = { id: nextId++, title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.patch("/api/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));
    if (!book) return res.status(404).json({ error: "Book not found" });
    
    if (req.body.title !== undefined) book.title = req.body.title;
    if (req.body.author !== undefined) book.author = req.body.author;
    
    res.json(book);
});

app.delete("/api/books/:id", (req, res) => {
    const index = books.findIndex(b => b.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Book not found" });
    
    books.splice(index, 1);
    res.status(204).end();
});

module.exports = app;