const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/api/todos", (req, res) => {
  res.json([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Buy groceries", completed: false },
    { id: 3, text: "Buy groceries", completed: false },
  ]);
});

app.listen(3000, () => {
  console.log("Mock API server is running on port 3000");
});
