import { HashRouter as Router, Routes, Route } from "react-router-dom";
import StorePage from "./pages/StorePage";
import './index.css';   // global styles
import './App.css'; 
import { HomePage } from "./home";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/store/:slug" element={<StorePage/>}/>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
}
