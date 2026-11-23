"use strict";

const booksContainer = document.querySelector("#books");
const form = document.querySelector("#book-form");
const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search-button");
const resetButton = document.querySelector("#reset-button");
const message = document.querySelector("#message");

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function renderBooks(books) {
  booksContainer.replaceChildren();

  for (const book of books) {
    const article = document.createElement("article");
    article.className = "book";

    const title = document.createElement("h2");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = book.author;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.dataset.id = book.id;

    article.append(title, author, remove);
    booksContainer.append(article);
  }
}

async function loadBooks(q = "") {
  const url = q ? `/api/books?q=${encodeURIComponent(q)}` : "/api/books";
  const books = await request(url);
  renderBooks(books);
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";

  try {
    await request("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.elements.title.value,
        author: form.elements.author.value
      })
    });
    form.reset();
    await loadBooks();
  } catch (error) {
    message.textContent = error.message;
  }
});

searchButton.addEventListener("click", () => loadBooks(searchInput.value));
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  loadBooks();
});

booksContainer.addEventListener("click", async event => {
  if (!event.target.matches("button[data-id]")) return;
  await request(`/api/books/${event.target.dataset.id}`, { method: "DELETE" });
  await loadBooks(searchInput.value);
});

loadBooks().catch(error => { message.textContent = error.message; });
