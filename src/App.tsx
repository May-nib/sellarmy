import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StorePage from "./pages/StorePage";
import './index.css';   // global styles
import './App.css'; 
function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <a href="/store/reseller">Go to Reseller Store</a>
        <a href="/store/torpa">Go to torpa Store</a>
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
