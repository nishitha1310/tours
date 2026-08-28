import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { api } from "./api";

function Nav({ user, logout }) {
  return (
    <header className="nav">
      <Link className="brand" to="/">TourVista</Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tours">Tours</Link>
        {user ? <Link to="/my-bookings">My Bookings</Link> : null}
        {user ? (
          <button className="link-btn" onClick={logout}>Logout ({user.username})</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="nav-register" to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">TRAVEL • EXPLORE • EXPERIENCE</p>
          <h1>Discover your next unforgettable journey.</h1>
          <p>Book beautiful destinations with TourVista, a complete MERN-stack tours and travels application.</p>
          <Link className="btn" to="/tours">Explore Tours</Link>
        </div>
        <img src="/tour-images/tour-img01.jpg" alt="Travel destination" />
      </section>
      <section className="section">
        <h2>Why TourVista?</h2>
        <div className="features">
          <div><h3>Easy Booking</h3><p>Select a tour and submit your booking details in a few steps.</p></div>
          <div><h3>Secure Login</h3><p>Accounts use hashed passwords and JWT authentication through the Express API.</p></div>
          <div><h3>MERN Stack</h3><p>React communicates with a Node/Express backend using MongoDB and Mongoose.</p></div>
        </div>
      </section>
    </main>
  );
}

function Tours() {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.tours().then(setTours).catch(e => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tours.filter(t => `${t.title} ${t.city}`.toLowerCase().includes(q));
  }, [tours, search]);

  return (
    <main className="section">
      <div className="page-head">
        <div><p className="eyebrow">DESTINATIONS</p><h1>Popular Tours</h1></div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by city or tour..." />
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="cards">
        {filtered.map((tour, i) => (
          <article className="card" key={tour._id || tour.title}>
            <img src={tour.photo || `/tour-images/tour-img0${(i % 6) + 1}.jpg`} alt={tour.title} />
            <div className="card-body">
              <span className="tag">{tour.city}</span>
              <h3>{tour.title}</h3>
              <p>{tour.desc}</p>
              <div className="card-bottom">
                <strong>₹{Number(tour.price).toLocaleString("en-IN")}</strong>
                <Link className="small-btn" to={`/tours/${tour._id || encodeURIComponent(tour.title.toLowerCase().replaceAll(" ", "-"))}`}>View Tour</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function TourDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.tour(id).then(setTour).catch(e => setError(e.message));
  }, [id]);

  if (error) return <main className="section"><div className="alert">{error}</div></main>;
  if (!tour) return <main className="section"><p>Loading tour...</p></main>;

  return (
    <main className="section detail">
      <img src={tour.photo || "/tour-images/tour-img01.jpg"} alt={tour.title} />
      <div>
        <span className="tag">{tour.city}</span>
        <h1>{tour.title}</h1>
        <p>{tour.desc}</p>
        <p><b>Address:</b> {tour.address}</p>
        <p><b>Distance:</b> {tour.distance} km</p>
        <p><b>Maximum group:</b> {tour.maxGroupSize}</p>
        <h2>₹{Number(tour.price).toLocaleString("en-IN")} <small>/ person</small></h2>
        <button className="btn" onClick={() => user ? navigate(`/book/${tour._id || encodeURIComponent(tour.title.toLowerCase().replaceAll(" ", "-"))}`, { state: { tour } }) : navigate("/login")}>
          {user ? "Book This Tour" : "Login to Book"}
        </button>
      </div>
    </main>
  );
}

function Auth({ mode, setUser }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = isLogin
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form);
      localStorage.setItem("tourvista_token", data.token);
      localStorage.setItem("tourvista_user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-wrap">
      <form className="form-card" onSubmit={submit}>
        <p className="eyebrow">{isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}</p>
        <h1>{isLogin ? "Login" : "Register"}</h1>
        {error && <div className="alert">{error}</div>}
        {!isLogin && <label>Username<input required value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></label>}
        <label>Email<input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label>
        <label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></label>
        <button className="btn" disabled={loading}>{loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}</button>
        <p>{isLogin ? <>New user? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Login</Link></>}</p>
      </form>
    </main>
  );
}

function Booking({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [form, setForm] = useState({ fullName: user?.username || "", phone: "", guestSize: 1, bookAt: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { api.tour(id).then(setTour).catch(e => setError(e.message)); }, [id]);

  if (!user) return <main className="section"><div className="alert">Please login before booking.</div></main>;
  if (error) return <main className="section"><div className="alert">{error}</div></main>;
  if (!tour) return <main className="section"><p>Loading...</p></main>;

  const total = Number(tour.price) * Number(form.guestSize || 1);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("tourvista_token");
      const data = await api.booking({ tourId: tour._id, ...form, totalPrice: total }, token);
      setMessage(data.message);
      setTimeout(() => navigate("/my-bookings"), 900);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="auth-wrap">
      <form className="form-card wide" onSubmit={submit}>
        <p className="eyebrow">BOOK YOUR TRIP</p>
        <h1>{tour.title}</h1>
        {error && <div className="alert">{error}</div>}
        {message && <div className="success">{message}</div>}
        <label>Full name<input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} /></label>
        <label>Phone<input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></label>
        <label>Number of guests<input required type="number" min="1" max={tour.maxGroupSize} value={form.guestSize} onChange={e => setForm({...form, guestSize: e.target.value})} /></label>
        <label>Travel date<input required type="date" value={form.bookAt} onChange={e => setForm({...form, bookAt: e.target.value})} /></label>
        <div className="total">Total: ₹{total.toLocaleString("en-IN")}</div>
        <button className="btn">Confirm Booking</button>
      </form>
    </main>
  );
}

function MyBookings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("tourvista_token");
    api.myBookings(token).then(setItems).catch(e => setError(e.message));
  }, []);
  return (
    <main className="section">
      <h1>My Bookings</h1>
      {error && <div className="alert">{error}</div>}
      {!error && items.length === 0 && <p>No bookings yet. Create a booking after connecting MongoDB.</p>}
      <div className="booking-list">
        {items.map(b => <div className="booking" key={b._id}>
          <b>{b.tour?.title}</b><span>{new Date(b.bookAt).toLocaleDateString()}</span><span>{b.guestSize} guest(s)</span><strong>₹{Number(b.totalPrice).toLocaleString("en-IN")}</strong>
        </div>)}
      </div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tourvista_user")) || null; } catch { return null; }
  });

  function logout() {
    localStorage.removeItem("tourvista_token");
    localStorage.removeItem("tourvista_user");
    setUser(null);
  }

  return (
    <>
      <Nav user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetails user={user} />} />
        <Route path="/login" element={<Auth mode="login" setUser={setUser} />} />
        <Route path="/register" element={<Auth mode="register" setUser={setUser} />} />
        <Route path="/book/:id" element={<Booking user={user} />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <footer>TourVista • MERN Tours & Travels Booking Website</footer>
    </>
  );
}
