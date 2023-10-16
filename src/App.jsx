import { useEffect, useState } from 'react'
import './App.css'
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [books, setBooks] = useState([])

  const columnDefs = [
    { field: 'title', sortalble: true, filter: true },
    { field: 'author', sortalble: true, filter: true },
    { field: 'year', sortalble: true, filter: true },
    { field: 'isbn', sortalble: true, filter: true },
    { field: 'price', sortalble: true, filter: true },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => (
        <IconButton onClick={() => deleteBook(params.value)} size='small' color='error'>
          <DeleteIcon />
        </IconButton>
      )
    }
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    fetch('https://bookstore-1c837-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.log(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((book, index) => 
    Object.defineProperty(book, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-1c837-default-rtdb.europe-west1.firebasedatabase.app/books/.json', 
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchBooks())
    .catch(err => console.log(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-1c837-default-rtdb.europe-west1.firebasedatabase.app/books/${id}/.json`, 
    {
      method: 'DELETE'
    })
    .then(response => fetchBooks())
    .catch(err => console.log(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Boookstore
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBook addBook={addBook} />
      <div className="ag-theme-material" style={{ height: 400, width: 1100 }}>
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  )
}

export default App