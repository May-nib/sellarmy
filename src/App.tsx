import { HashRouter as Router, Routes, Route } from "react-router-dom";
import StorePage from "./pages/StorePage";
import './index.css';   // global styles
import './App.css'; 
import { HomePage } from "./home";
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
