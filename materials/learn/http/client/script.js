// Отдельная функция для запроса к нашему API.
async function loadData() {
  // fetch отправляет GET-запрос. await приостанавливает только эту async-функцию,
  // пока сервер не вернёт ответ — браузер при этом не "зависает".
  const response = await fetch("http://127.0.0.1:3000/users");

  // Тело ответа приходит в формате JSON. Преобразуем его в обычные данные JavaScript.
  const data = await response.json();
  return data;
}

// Ждём, пока HTML загрузится, и только после этого начинаем работать с DOM.
document.addEventListener("DOMContentLoaded", async () => {
  // Получаем пользователей с сервера.
  const users = await loadData();

  // Дальше всё уже знакомо: создаём элементы страницы через DOM.
  const table = document.createElement("table");

  for (const user of users) {
    const row = document.createElement("tr");

    const t_id = document.createElement("td");
    t_id.textContent = user.id;

    const t_name = document.createElement("td");
    t_name.textContent = user.name;

    const t_active = document.createElement("td");
    t_active.textContent = user.active;

    row.append(t_id, t_name, t_active);
    table.append(row);
  }

  // В итоге данные прошли полный путь: файл -> сервер -> HTTP -> fetch -> DOM.
  document.body.append(table);
});
