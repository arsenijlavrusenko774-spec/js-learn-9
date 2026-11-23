const fs = require("fs");

// Обычный массив JavaScript. С него удобно начать объяснение JSON.
const users = [
  {
    id: 1,
    name: "Alice",
    active: true,
  },
  {
    id: 2,
    name: "Bob",
    active: false,
  },
];

// JSON.stringify() превращает массив/объект JavaScript в JSON-строку.
const json = JSON.stringify(users);

// Записываем получившуюся строку в файл data.json.
// Это просто учебный пример хранения данных, не база данных.
fs.writeFileSync("data.json", json);
