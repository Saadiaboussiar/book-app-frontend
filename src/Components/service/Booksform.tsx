import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { getUserRoles } from "../../utils/AuthUtils";
import api from "../../interceptors/api";

interface bookProps {
  id?: number;
  title: string;
  author: string;
  category: string;
  publishyear: number;
  publisher: string;
  pages: number;
}
interface BookLocationState {
  id?: number;
  title: string;
  author: string;
  category: string;
  publisher: string;
  year: number;
  pages: number;
}

const Booksform = () => {
  const roles = getUserRoles();

  const location = useLocation();
  const state = location.state as BookLocationState;
  console.log("Received state from Link:", state);

  const [books, setBooks] = useState<bookProps[]>([]);
  const [props, setprops] = useState<bookProps>({
    id: undefined,
    title: "",
    author: "",
    category: "",
    publisher: "",
    publishyear: 0,
    pages: 0,
  });

  useEffect(() => {
    api
      .get("/books")
      .then((response) => {
        setBooks(response.data); // Save them in state
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  useEffect(() => {
    if (state) {
      setprops({
        id: state.id ?? undefined,
        title: state.title || "",
        author: state.author || "",
        category: state.category || "",
        publisher: state.publisher || "",
        publishyear: state.year || 0,
        pages: state.pages || 0,
      });
    }
  }, [state]);

  const handlechanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setprops((prevdata) => ({
      ...prevdata,
      [name]:
        name === "publishyear" || name === "pages" ? Number(value) : value,
    }));
  };

  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form props before submit:", props);

    const url = props.id
      ? `/books/${props.id}` // PUT
      : `/books`;

    

    const request = props.id
      ? api.put(url, props,{headers: { 'Content-Type': 'application/json' }})
      : api.post(url, props,{headers: { 'Content-Type': 'application/json' }});

    request
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    if (!props.id) {
      setprops({
        id: undefined,
        title: "",
        author: "",
        category: "",
        publisher: "",
        publishyear: 0,
        pages: 0,
      });
    }
    alert("Book saved");
  };

  const { id } = useParams();

  useEffect(() => {
    console.log("Booksform mounted. ID:", id);
    console.log("State from Link:", location.state);
  }, []);

  return (
    <div>
      <form
        onSubmit={handlesubmit}
        className="p-4 border rounded"
        style={{ maxWidth: "400px", margin: "auto" }}
      >
        <div className="mb-3">
          <label>Book Title:</label>
          <input
            className="form-control"
            type="text"
            onChange={handlechanges}
            id="title"
            name="title"
            value={props.title}
            required
          />
        </div>
        <div className="mb-3">
          <label>Book Author:</label>
          <input
            className="form-control"
            type="text"
            onChange={handlechanges}
            id="author"
            name="author"
            value={props.author}
            required
          />
        </div>
        <div className="mb-3">
          <label>Book Category:</label>
          <input
            className="form-control"
            type="text"
            onChange={handlechanges}
            id="category"
            name="category"
            value={props.category}
            required
          />
        </div>
        <div className="mb-3">
          <label>Book Publisher:</label>
          <input
            className="form-control"
            type="text"
            onChange={handlechanges}
            id="publisher"
            name="publisher"
            value={props.publisher}
            required
          />
        </div>
        <div className="mb-3">
          <label>Book year of publishement:</label>
          <input
            className="form-control"
            type="number"
            onChange={handlechanges}
            id="publishyear"
            name="publishyear"
            value={props.publishyear}
            required
          />
        </div>
        <div className="mb-3">
          <label>Book number of pages:</label>
          <input
            className="form-control"
            type="number"
            onChange={handlechanges}
            id="pages"
            name="pages"
            value={props.pages}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default Booksform;
