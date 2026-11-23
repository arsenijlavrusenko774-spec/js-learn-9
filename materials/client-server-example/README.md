# Полный пример: Todo client + Express API

```bash
npm install
npm start
```

Откройте `http://localhost:3000`.

Маршруты API:

- `GET /api/todos`
- `POST /api/todos`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`

При разборе следите за одной операцией целиком: действие пользователя → `fetch()` → маршрут Express → изменение массива → HTTP response → повторная отрисовка DOM.
