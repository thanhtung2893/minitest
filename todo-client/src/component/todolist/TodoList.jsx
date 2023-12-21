import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { ImCancelCircle } from "react-icons/im";
import './todo.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTodo, setEditedTodo] = useState('');
  const [editedTodoStatus, setEditedTodoStatus] = useState('');
  const [flag, setFlag] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3001/todo')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching data: ', error));
  }, [flag]);

  const addTodo = () => {
    if (newTodo == "") {
      alert("moi nhap new todo")
      return;
    } else {
      axios.post('http://localhost:3001/todo', {
        name: newTodo,
        status: 'incomplete',
        description: newTodoDescription,
      })
        .then(response => {
          setTodos([...todos, response.data]);
          setNewTodo('');
          setNewTodoDescription('');
          setFlag(false)
        })
        .catch(error => console.error('Error adding todo: ', error));
    }

  };

  const completeTodo = (id) => {
    axios.put(`http://localhost:3001/todo/${id}`)
      .then(response => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, status: 'complete' } : todo)));
      })
      .catch(error => console.error('Error completing todo: ', error));
  };

  const startEditing = (id, name, status) => {
    setEditingTodo(id);
    setEditedTodo(name);
    setEditedTodoStatus(status);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditedTodo('');
    setEditedTodoStatus('');
  };

  const updateTodo = (id) => {
    axios.put(`http://localhost:3001/todo/update/${id}`, {
      name: editedTodo,
      status: editedTodoStatus,
      description: newTodoDescription,
    })
      .then(response => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, name: editedTodo, status: editedTodoStatus } : todo)));
        cancelEditing();
      })
      .catch(error => console.error('loi updating todo: ', error));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3001/todo/${id}`)
      .then(response => {
        if (window.confirm("bạn có chắc chắn muốn xóa??")) {
          setTodos(todos.filter(todo => todo.id !== id));
        } else {
          return
        }

      })
      .catch(error => console.error('loi  xoa todo: ', error));
  };

  return (
    <div>
      <h1>User-Manager</h1>
      <div className='item'>
        <input className='add'
          type="text"
          placeholder="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <textarea className='add'
          placeholder="Description"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Work</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo.id} className={todo.status === 'complete' ? 'completed' : ''}>
              <td>{editingTodo === todo.id ? (
                <input style={{ width: "100%" }}
                  type="text"
                  value={editedTodo}
                  onChange={(e) => setEditedTodo(e.target.value)}
                />
              ) : (
                <span>{todo.name}</span>
              )}</td>
              <td>{todo.description}</td>
              <td>{editingTodo === todo.id ? (
                <select style={{ width: "100%" }}
                  value={editedTodoStatus}
                  onChange={(e) => setEditedTodoStatus(e.target.value)}
                >
                  <option value="incomplete"> chưa làm</option>
                  <option value="complete">đã làm</option>
                </select>
              ) : (
                <span>{todo.status}</span>
              )}</td>

              <td>
                {editingTodo === todo.id ? (
                  <>
                    <button onClick={() => updateTodo(todo.id)}><CiSaveDown2 style={{ color: "green" }} /></button>
                    <button onClick={cancelEditing}><ImCancelCircle style={{ color: "red" }} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(todo.id, todo.name, todo.status)}><CiEdit style={{ color: "blue" }} /></button>
                    <button onClick={() => completeTodo(todo.id)}><FaCheck style={{ color: "green" }} /></button>
                    <button onClick={() => deleteTodo(todo.id)}><RiDeleteBin2Fill style={{ color: "red" }} /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default TodoList;
