"use strict";

const app = require("./student-template");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Book catalog: http://localhost:${PORT}`);
});
