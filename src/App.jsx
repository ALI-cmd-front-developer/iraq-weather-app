import { Routes, Route, Link, useParams } from 'react-router-dom'
import "./App.css"

// الداتا خارج الـ components حتى الكل يوصلها
const myposts = [
  { id: 1, title: "Ali", body: "powejfwefer" },
  { id: 2, title: "Hello world", body: "peori475748y84" },
  { id: 3, title: "Hi,there", body: "p[wek039ufmkfer3-r4" },
]

function Hello() {
  return <span>hello user</span>
}

function About() {
  return (
    <p>
      name: ali , phone number: 3874644443{" "}
      <Link to="/home">return to home</Link>
    </p>
  )
}

// صفحة القائمة: كل post صار رابط
function Posts() {
  return (
    <>
      {myposts.map((post) => (
        <div key={post.id}>
          <Link to={`/posts/${post.id}`}>
            post {post.id} : {post.title}
          </Link>
        </div>
      ))}
    </>
  )
}

// الصفحة الديناميكية: تقرا id من الـ URL
function PostDetail() {
  const { id } = useParams()
  const post = myposts.find((p) => p.id === Number(id))

  if (!post) return <p>Post not found</p>

  return (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <Link to="/posts">back to posts</Link>
    </>
  )
}

function App() {
  return (
    <>
      <nav className="app">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/posts">Posts</Link>
      </nav>

      <Routes>
        <Route path="/home" element={<Hello />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </>
  )
}

export default App