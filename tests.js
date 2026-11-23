"use strict";

const assert = require("node:assert/strict");
const app = require("./student-template");

async function main() {
  const server = app.listen(0);
  await new Promise(resolve => server.once("listening", resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  let passed = 0;
  const check = async (name, fn) => {
    try {
      await fn();
      passed++;
      console.log(`✓ ${name}`);
    } catch (error) {
      console.error(`✗ ${name}`);
      console.error(`  ${error.message}`);
      throw error;
    }
  };

  try {
    await check("GET /api/books возвращает исходный список", async () => {
      const r = await fetch(`${base}/api/books`);
      assert.equal(r.status, 200);
      const data = await r.json();
      assert.ok(Array.isArray(data));
      assert.ok(data.length >= 3);
    });

    await check("query q фильтрует книги", async () => {
      const r = await fetch(`${base}/api/books?q=node`);
      assert.equal(r.status, 200);
      const data = await r.json();
      assert.ok(data.some(book => book.title.toLowerCase().includes("node")));
      assert.ok(data.every(book =>
        book.title.toLowerCase().includes("node") || book.author.toLowerCase().includes("node")
      ));
    });

    await check("GET /api/books/:id и 404", async () => {
      let r = await fetch(`${base}/api/books/1`);
      assert.equal(r.status, 200);
      assert.equal((await r.json()).id, 1);

      r = await fetch(`${base}/api/books/999999`);
      assert.equal(r.status, 404);
      assert.equal((await r.json()).error, "Book not found");
    });

    let createdId;
    await check("POST создаёт книгу и валидирует body", async () => {
      let r = await fetch(`${base}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "HTTP на практике", author: "Student" })
      });
      assert.equal(r.status, 201);
      const created = await r.json();
      createdId = created.id;
      assert.equal(created.title, "HTTP на практике");

      r = await fetch(`${base}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "", author: "" })
      });
      assert.equal(r.status, 400);
    });

    await check("PATCH изменяет существующую книгу", async () => {
      const r = await fetch(`${base}/api/books/${createdId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "HTTP и Express" })
      });
      assert.equal(r.status, 200);
      const data = await r.json();
      assert.equal(data.title, "HTTP и Express");
      assert.equal(data.author, "Student");
    });

    await check("DELETE удаляет ресурс", async () => {
      let r = await fetch(`${base}/api/books/${createdId}`, { method: "DELETE" });
      assert.equal(r.status, 204);

      r = await fetch(`${base}/api/books/${createdId}`);
      assert.equal(r.status, 404);
    });

    console.log(`\nВсе проверки пройдены: ${passed}/6.`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(() => process.exitCode = 1);
