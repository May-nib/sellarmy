import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import StorePage from "./pages/StorePage";
import './index.css';   // global styles
import './App.css'; 
function HomePage() {
  return (
    <div>
      <h1>Home Vite update</h1>
      <div>
<Link to="/store/reseller">Go to Reseller Store Link</Link>
</div>
        <a href="/store/torpa">Go to torpa Store href</a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store/:slug" element={<StorePage/>}/>
      </Routes>
    </Router>
  );
}
