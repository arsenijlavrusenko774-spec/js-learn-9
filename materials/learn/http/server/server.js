// Подключаем то, что понадобится серверу.
// Express отвечает за маршруты, fs — за работу с файлом, cors разрешает запросы с клиента.
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Клиент у нас запускается отдельно от сервера, поэтому для примера разрешаем CORS.
app.use(cors());

// Самая простая проверка: открываем http://localhost:3000
// и смотрим, отвечает ли вообще сервер.
app.get("/", (req, res) => {
  res.status(200).json({ message: "Сервер работает!" });
});

// GET /users — маршрут для получения списка пользователей.
// Здесь хорошо показать цепочку: запрос -> чтение файла -> JSON -> ответ клиенту.
app.get("/users", (req, res) => {
  try {
    // readFileSync возвращает текст, поэтому превращаем его обратно в JS-данные через JSON.parse().
    const users = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    res.status(200).json(users);
  } catch (err) {
    // Если файл не прочитался или JSON оказался некорректным — сервер вернёт 500.
    res.status(500).json({ message: err.message });
  }
});

// Сервер начинает слушать порт 3000.
// Пока этот процесс запущен, к нему можно обращаться из браузера или через fetch().
app.listen(3000, () => {
  console.log("Server On http://localhost:3000 ...");
});
