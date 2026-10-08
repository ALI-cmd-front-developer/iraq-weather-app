import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        if (!response.ok) throw new Error("faild fetch data");
        return response.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  if (error)
    return (
      <main className="page">
        <ul className="item-list">
          <li className="item">{error}</li>
        </ul>
      </main>
    );
  if (loading)
    return (
      <main className="page">
        <ul className="item-list">
          <li className="item">
            <h2>loading ...</h2> <p>almost there</p>{" "}
          </li>
        </ul>
      </main>
    );
  return (
    <main className="page">
      <ul className="item-list">
        {data.map((post) => (
          <li className="item" key={post.id}>
            <h2>
              {post.title} : {post.userId}
            </h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
