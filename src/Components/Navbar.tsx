import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserRoles } from '../utils/AuthUtils';

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  publishyear: number;
  publisher: string;
  pages: number;
};

function Navbar() {
  const roles=getUserRoles();
  console.log('User roles:', roles);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/Savedbooks', { state: { query: search } });
  };

  useEffect(() => {
    axios.get('http://localhost:8081/books').catch((error) => {
      console.log('Error fetching books:', error);
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg"
      style={{ backgroundColor: '#c5d6f3', padding: '1rem' }} >
      <div className="container">
        <Link className="navbar-brand text-black fw-bold" to="/homepage">
          MyApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"

        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item px-2">
              {(roles.includes('ADMIN') || roles.includes('MANAGER') ) && (<Link className="nav-link" to="/booksform">
                Save Some Books
              </Link>)}
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/savedbooks">
                Table Of Saved Books
              </Link>
            </li>
            <li className="nav-item px-2" >
              <Link className="nav-link" to="/login" style={{ color: 'blue' }}>
                Logout
              </Link>
            </li>
          </ul>

          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search by author or title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
