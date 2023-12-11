const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  const newTodo = {
    id: todos.length + 1,
    text,
    completed: false,
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== todoId);
  res.status(200).json({ message: 'Todo xoa thanh cong' });
});

app.put('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTodo = todos.find(todo => todo.id === todoId);
  if (updatedTodo) {
    if (req.body.text) {
      updatedTodo.text = req.body.text;
    }
    if (req.body.completed !== undefined) {
      updatedTodo.completed = req.body.completed;
    }
    res.json(updatedTodo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});
app.delete('/todos', (req, res) => {
  const { ids } = req.body;
  todos = todos.filter(todo => !ids.includes(todo.id));
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
