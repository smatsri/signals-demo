const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const todos = [
  { id: 1, text: "Walk the dog in the park", completed: false },
  { id: 2, text: "Finish reading a chapter of my book", completed: false },
  { id: 3, text: "Call Mom and check in", completed: false },
];

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const todo = { id: todos.length + 1, text: req.body.text, completed: false };
  todos.push(todo);
  res.json(todo);
});

app.patch("/api/todos/:id", (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  todo.completed = req.body.completed;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id === parseInt(req.params.id));
  if (index !== -1) {
    todos.splice(index, 1);
  }
  res.json({ message: "Todo deleted" });
});

app.delete("/api/todos", (req, res) => {
  todos.length = 0;
  res.json({ message: "All todos deleted" });
});

app.listen(3000, () => {
  console.log("Mock API server is running on port 3000");
});
