import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { getUserRoles } from '../../utils/AuthUtils';
import api from '../../interceptors/api';

type Book = {
    id:number
    title:string
    author:string
    category:string
    publishyear:number
    publisher:string
    pages:number
};

const Savedbooks = () => {
    
    const roles=getUserRoles();
    const [infos,setinfos]=useState<Book[]>([]);
    const location=useLocation();
    const query=location.state?.query || '';



    useEffect(() => {
    api.get<Book[]>('/books')
    .then(response => {
        if(query!=''){
          const filtered = response.data.filter((book:Book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()));
          setinfos(filtered);
        }
        else{
            setinfos(response.data);
        }
      
    })
    .catch(error => {
      console.log("Error fetching books:", error);
    });
    }, [query]);

    console.log("infos"+infos)
    
    const handleDelete=(id:number)=>{
        api.delete(`/books/${id}`)
            .then(()=>{
            setinfos((infos)=>infos.filter((book)=>book.id!==id));
        }).catch((error)=>{
            console.error("Selete failed",error);
            alert("failed to delete book");
        });
    };

  return (
    <div className='container my-5'>
        <table className='table table-striped custom-table' >
            <thead className='table-dark'>
                <tr>
                    <th>#</th><th>Book Title</th><th>Book Author</th><th>Book category</th><th>Book publisher</th><th>Book year of publishement</th><th>Book number of pages</th>
                    {(roles.includes('ADMIN') || roles.includes('MANAGER') ) && (<th>Edit/Delete</th>)}
                </tr>
            </thead>
            <tbody>
                {infos.map((book)=>(
                    <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.publisher}</td>
                    <td>{book.publishyear}</td>
                    <td>{book.pages}</td>

                    {(roles.includes('ADMIN') || roles.includes('MANAGER') ) && (<td><div className="d-flex flex-row align-items-center gap-4">
                        <Link className='btn btn-success' to={`./booksform/${book.id}`} state={{id:book.id,title:book.title,author: book.author,category: book.category,publisher: book.publisher,year: book.publishyear,pages: book.pages}}>Edit</Link>
                        <button className='btn btn-danger'  onClick={()=>handleDelete(book.id!)}>Delete</button>

                    </div></td> )}

                </tr>
                ))}
                
            </tbody>
        </table>
    </div>
  )
}

export default Savedbooks