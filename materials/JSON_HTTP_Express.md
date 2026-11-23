# JSON, HTTP, Node.js, Express и клиент-серверное взаимодействие

Этот блок завершает базовый курс JavaScript и связывает изученные темы в одну систему: данные в JavaScript → JSON → HTTP → сервер → API → `fetch()` → DOM.

## 1. От объекта JavaScript к JSON

JavaScript-объект — это структура данных внутри выполняемой программы:

```js
const user = {
  id: 1,
  name: "Alex",
  active: true
};
```

JSON (JavaScript Object Notation) — **текстовый формат представления данных**. Он удобен для хранения и передачи данных между программами.

```json
{
  "id": 1,
  "name": "Alex",
  "active": true
}
```

Ключевые отличия:

- JSON — строковое представление, а не исполняемый объект JavaScript;
- имена свойств в JSON записываются в двойных кавычках;
- JSON не хранит функции, `undefined`, `Symbol` и методы объекта;
- JSON поддерживает строки, числа, `true`, `false`, `null`, массивы и объекты.

### JSON.stringify()

Преобразует JavaScript-значение в JSON-строку:

```js
const user = { id: 1, name: "Alex" };
const json = JSON.stringify(user);

console.log(json);
console.log(typeof json); // string
```

### JSON.parse()

Преобразует JSON-строку обратно в JavaScript-значение:

```js
const json = '{"id":1,"name":"Alex"}';
const user = JSON.parse(json);

console.log(user.name); // Alex
```

Если строка содержит некорректный JSON, `JSON.parse()` выбрасывает ошибку. Поэтому при работе с неизвестными данными может понадобиться `try/catch`.

```js
try {
  const data = JSON.parse(text);
  console.log(data);
} catch (error) {
  console.log("Некорректный JSON");
}
```

## 2. Зачем JSON нужен в веб-разработке

Браузер и сервер — разные программы. Им нужен понятный обеим сторонам формат обмена данными.

```text
JavaScript object
      ↓ JSON.stringify()
JSON text / HTTP body
      ↓ сеть
Server
      ↓ JSON response
Browser
      ↓ response.json()
JavaScript object
```

Сегодня JSON — один из основных форматов веб-API.

---

# 3. Клиент-серверная архитектура

**Клиент** инициирует запрос. В нашем случае клиентом чаще всего является браузер.

**Сервер** принимает запрос, выполняет некоторую логику и возвращает ответ.

```text
┌───────────────┐       HTTP request        ┌───────────────┐
│    Browser    │ ────────────────────────► │    Server     │
│    client     │                           │ Node/Express  │
│               │ ◄──────────────────────── │               │
└───────────────┘       HTTP response       └───────────────┘
```

Клиент и сервер могут находиться на одном компьютере (`localhost`) или на разных компьютерах в сети.

## 4. Что происходит после ввода адреса сайта

Пусть пользователь вводит:

```text
https://example.com/products?id=5
```

Упрощённо происходит следующее:

1. Браузер разбирает URL: протокол, домен, путь и query-параметры.
2. Для доменного имени определяется IP-адрес сервера (DNS).
3. Устанавливается сетевое соединение; для HTTPS также устанавливается защищённое TLS-соединение.
4. Браузер отправляет HTTP-запрос.
5. Веб-сервер получает запрос и выбирает подходящий обработчик маршрута.
6. Сервер выполняет код: читает данные, проверяет параметры, при необходимости обращается к файлу или БД.
7. Сервер формирует HTTP-ответ: статус, заголовки и тело.
8. Браузер получает ответ. Если это HTML — строит страницу; если JSON — JavaScript может обработать данные и изменить DOM.

Для первого знакомства достаточно помнить цепочку:

```text
URL → DNS → HTTP request → server → route → response → browser → DOM
```

---

# 5. HTTP: запрос и ответ

HTTP — протокол взаимодействия клиента и сервера.

Пример запроса:

```http
GET /api/books/2 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

В запросе нас интересуют:

- HTTP-метод;
- URL;
- заголовки;
- тело запроса (есть не у всех запросов).

Пример ответа:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":2,"title":"Clean Code"}
```

В ответе есть:

- status code;
- headers;
- body.

## 6. Основные HTTP-методы и CRUD

| CRUD | HTTP | Смысл |
|---|---|---|
| Create | POST | создать ресурс |
| Read | GET | получить ресурс |
| Update | PUT / PATCH | изменить ресурс |
| Delete | DELETE | удалить ресурс |

`PUT` обычно означает полную замену ресурса, `PATCH` — частичное изменение.

## 7. Основные status codes

- `200 OK` — запрос выполнен;
- `201 Created` — ресурс создан;
- `204 No Content` — успешно, но тело ответа не требуется;
- `400 Bad Request` — ошибка в данных запроса;
- `404 Not Found` — ресурс или маршрут не найден;
- `500 Internal Server Error` — внутренняя ошибка сервера.

Первая цифра показывает группу ответа:

```text
2xx — успех
3xx — перенаправление
4xx — проблема запроса клиента
5xx — ошибка сервера
```

---

# 8. Минимальный сервер на встроенном модуле http

Node.js умеет принимать HTTP-запросы без Express:

```js
const http = require("node:http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ message: "Hello" }));
});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

Здесь хорошо видно, что сервер получает два объекта:

```js
req // request
res // response
```

Однако при большом количестве маршрутов ручная проверка `req.url` и `req.method` быстро становится неудобной. Для этого используют веб-фреймворки, например Express.

---

# 9. Express

Установка:

```bash
npm init -y
npm install express
```

Минимальное приложение:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

Express сопоставляет метод и маршрут с обработчиком:

```text
GET /            → app.get("/", ...)
GET /api/books   → app.get("/api/books", ...)
POST /api/books  → app.post("/api/books", ...)
```

## 10. JSON-тело запроса

Чтобы Express автоматически разбирал JSON-body:

```js
app.use(express.json());
```

После этого объект доступен через:

```js
req.body
```

Например:

```js
app.post("/api/users", (req, res) => {
  const { name, age } = req.body;
  res.status(201).json({ id: 1, name, age });
});
```

---

# 11. params, query и body

Это три разных источника данных HTTP-запроса.

## req.params

Маршрут:

```text
GET /api/books/15
```

Код:

```js
app.get("/api/books/:id", (req, res) => {
  console.log(req.params.id); // "15"
});
```

`params` обычно идентифицирует конкретный ресурс.

## req.query

URL:

```text
GET /api/books?q=javascript&limit=5
```

Код:

```js
app.get("/api/books", (req, res) => {
  console.log(req.query.q);
  console.log(req.query.limit);
});
```

Query-параметры часто применяются для поиска, фильтрации, сортировки и пагинации.

## req.body

Клиент отправляет JSON:

```json
{
  "title": "JavaScript",
  "author": "Student"
}
```

Сервер:

```js
app.post("/api/books", (req, res) => {
  console.log(req.body.title);
});
```

Коротко:

```text
params → часть маршрута
query  → параметры после ?
body   → данные внутри запроса
```

---

# 12. Middleware

Middleware — функция, через которую проходит запрос до конечного обработчика.

```js
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

Схема:

```text
request
  ↓
middleware #1
  ↓ next()
middleware #2
  ↓ next()
route handler
  ↓
response
```

Если middleware не завершил ответ и не вызвал `next()`, дальнейшая обработка запроса остановится.

Примеры middleware:

- логирование;
- разбор JSON (`express.json()`);
- проверка авторизации;
- CORS;
- централизованная обработка ошибок.

---

# 13. REST API и CRUD на массиве

Для учебного API база данных пока не обязательна:

```js
let books = [
  { id: 1, title: "JavaScript", author: "A. Author" },
  { id: 2, title: "Node.js", author: "B. Author" }
];
```

Получение списка:

```js
app.get("/api/books", (req, res) => {
  res.json(books);
});
```

Получение одного ресурса:

```js
app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(item => item.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});
```

Создание:

```js
app.post("/api/books", (req, res) => {
  const book = {
    id: Date.now(),
    title: req.body.title,
    author: req.body.author
  };

  books.push(book);
  res.status(201).json(book);
});
```

Частичное обновление:

```js
app.patch("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(item => item.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (req.body.title !== undefined) book.title = req.body.title;
  if (req.body.author !== undefined) book.author = req.body.author;

  res.json(book);
});
```

Удаление:

```js
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.status(204).end();
});
```

---

# 14. fetch() и AJAX

`fetch()` позволяет JavaScript в браузере отправлять HTTP-запросы.

GET:

```js
async function loadBooks() {
  const response = await fetch("/api/books");
  const books = await response.json();

  console.log(books);
}
```

`response.json()` тоже является асинхронной операцией: она читает тело ответа и превращает JSON в JavaScript-значение.

POST:

```js
const response = await fetch("/api/books", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "New book",
    author: "Student"
  })
});

const createdBook = await response.json();
```

DELETE:

```js
await fetch(`/api/books/${id}`, {
  method: "DELETE"
});
```

### Что такое AJAX

AJAX — подход, при котором браузер обменивается данными с сервером **без полной перезагрузки страницы**.

Исторически использовался `XMLHttpRequest`; сегодня типичный вариант — `fetch()` + JSON.

```text
DOM → event → fetch → API → JSON → fetch result → DOM
```

---

# 15. Статические файлы в Express

Если клиент и API находятся в одном приложении:

```js
app.use(express.static("public"));
```

Тогда Express сможет отдавать:

```text
public/index.html
public/app.js
public/styles.css
```

Например пользователь открывает:

```text
http://localhost:3000
```

получает HTML, а код браузера затем делает:

```js
fetch("/api/books")
```

---

# 16. Полная схема приложения

```text
USER
  ↓
Browser
  ↓
HTML / DOM / events
  ↓
public/app.js
  ↓ fetch("/api/...")
HTTP REQUEST
  ↓
Express
  ↓
middleware
  ↓
route handler
  ↓
array / file / database
  ↓
res.json(...)
HTTP RESPONSE
  ↓
response.json()
  ↓
JavaScript object
  ↓
DOM
```

Именно эта цепочка объединяет почти весь материал курса.

---

# 17. Полный демонстрационный пример

В каталоге `Materials/client-server-example/` находится готовое приложение **Todo API + браузерный клиент**.

Сервер реализует:

```text
GET    /api/todos
POST   /api/todos
PATCH  /api/todos/:id
DELETE /api/todos/:id
```

Браузерный клиент:

1. загружает список через `fetch()`;
2. создаёт DOM-элементы;
3. отправляет POST при добавлении задачи;
4. отправляет PATCH при переключении состояния;
5. отправляет DELETE при удалении;
6. после каждого изменения синхронизирует интерфейс с сервером.

Запуск:

```bash
cd Materials/client-server-example
npm install
npm start
```

Открыть:

```text
http://localhost:3000
```

При разборе примера двигайтесь по цепочке:

```text
HTML → public/app.js → fetch → server.js → route → res.json → public/app.js → DOM
```

---

# 18. Что остаётся за рамками двух занятий

Для первого знакомства достаточно понимать архитектуру и уметь создать небольшой API. Отдельного дальнейшего изучения требуют:

- Promise и event loop подробнее;
- Express Router;
- controllers/services;
- базы данных;
- авторизация;
- CORS;
- централизованная обработка ошибок;
- валидация на сервере библиотеками;
- безопасность и production deployment.

Главная цель текущего блока — увидеть целую систему и самостоятельно реализовать её базовую версию.
