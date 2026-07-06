import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Notfound from "./pages/Notfound";
import SuccessPage from "./pages/SuccessPage";
import Practice from "./pages/Practice";
import Checkouts from "./pages/Checkouts";
import RegisterPage from "./pages/RegisterPage";
import Product from "./pages/Product";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/checkouts" element={<Checkouts />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<Product />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
