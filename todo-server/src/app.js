const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app',
});

db.connect((err) => {
  if (err) {
    console.error('loi ket noi voi database:', err);
  } else {
    console.log('ket noi thanh cong voi database');
  }
});

app.post('/todo', (req, res) => {
  const { name, status, description } = req.body;
  const query = 'INSERT INTO todos (name, status, description) VALUES (?, ?, ?)';
  db.query(query, [name, status, description], (err, result) => {
    if (err) throw err;
    res.status(200).json({ id: result.insertId, name, status, description });
  });
});

app.get('/todo', (req, res) => {
  const query = 'SELECT * FROM todos';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

app.put('/todo/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE todos SET status = "complete" WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

app.delete('/todo/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM todos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put('/todo/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, status, description } = req.body;
  const query = 'UPDATE todos SET name = ?, status = ?, description = ? WHERE id = ?';
  db.query(query, [name, status, description, id], (err, result) => {
    if (err) throw err;
    res.status(200).json({
        message:"update ok"
    });
  });
});

app.listen(port, () => {
  console.log(`Server dang chay cong ${port}`);
});
