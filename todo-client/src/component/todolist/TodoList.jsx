import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./todo.css"
import { RiDeleteBin2Fill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import Loading from '../loading/Loading';

export default function TodoList() {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState('');
  const [loading,setLoading]= useState(false);

  useEffect(() => {
  setLoading(true);
  setTimeout(()=> {  
    axios.get('http://localhost:8000/api/todos')
      .then(res => setTodos(res.data))
      .catch(error => console.error('Error fetching data: ', error));
      setLoading(false);
  },2000)
  }, []);

  const addTodo = () => {
    if (newTodo == "") {
      alert("Hãy nhập new Todo")
      return
    }else{
      axios.post('http://localhost:8000/api/todos', { text: newTodo })
    
      .then(res => { 
          setTodos([...todos, res.data]);
          setNewTodo('');
        }
        )
      .catch(error => console.error('Error adding todo: ', error));
    }
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:8000/api/todos/${id}`)
      .then(() => {
       
       if ( window.confirm("bạn có muốn xóa Todo này??")) {
        setTodos(todos.filter(todo => todo.id !== id));
       }else{
        return;
       }
        
      })
      .catch(error => console.error('Error deleting todo: ', error));
  };

 
  const toggleComplete = (id) => {
    axios.put(`http://localhost:8000/api/todos/${id}`, { completed: true })
      .then(() => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: true } : todo)));
      })
      .catch(error => console.error('Error marking todo as complete: ', error));
  };

  const startEditing = (id, text) => {
    setEditingTodo(id);
    setEditedTodoText(text);
  };

  const updateTodo = (id) => {
    axios.put(`http://localhost:8000/api/todos/${id}`, { text: editedTodoText })
      .then(() => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, text: editedTodoText } : todo)));
        setEditingTodo(null);
        setEditedTodoText('');
      })
      .catch(error => console.error('Error updating todo: ', error));
  };
//console.log(todos);
let donetodo=todos.filter((e)=>
  e.completed== false
)
//console.log(donetodo.length);
  return (
    <>
    
      <div className='body'>
        <h1>ToDo App</h1>
        <div className='add'>
          <input
          style={{width:"368px", height:"25px"}}
            type="text"
            placeholder='Add your new todo'
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
          />
          <button className='button-add' onClick={addTodo}><FaRegPlusSquare style={{color:"purple"}}/></button>
        </div>

        <table >
          <thead>
            <tr>
              <th style={{ width: "300px" }}></th>
              <th style={{ width: "200px" }}></th>
            </tr>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo.id}>
                <td style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {editingTodo === todo.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTodoText}
                        onChange={e => setEditedTodoText(e.target.value)}
                      />
                      <button className='button-save' onClick={() => updateTodo(todo.id)}><CiSaveDown2 style={{color:"green"}}/></button>
                    </>
                  ) : (
                    <div style={{backgroundColor:"rgb(249, 244, 239)"}}>{todo.text} </div>
                  )}
                </td>

                <td>
                  <button className='button-check' onClick={() => toggleComplete(todo.id)}><FaCheck style={{color:"green"}}/></button>
                  <button className='button-edit' onClick={() => startEditing(todo.id, todo.text)}><CiEdit style={{color:"blue"}}/></button>
                  <button className='button-delete' onClick={() => deleteTodo(todo.id)}><RiDeleteBin2Fill style={{color:"red"}}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div style={{marginLeft: '150px'}}>
          <Loading/>
        </div> }
        <div style={{display:"flex", alignItems:"center"}}>
       <p>You have <strong style={{color:"red"}}>{donetodo.length}</strong>  pending tasks</p>
          <button style={{height:"30px", display:"block",backgroundColor:"purple", marginLeft:"160px"}}>Clear all</button>         
        </div>
      </div>
    </>
  )
}


