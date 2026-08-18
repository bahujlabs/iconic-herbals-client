import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Notfound from "./pages/Notfound";
import SuccessPage from "./pages/SuccessPage";
import Practice from "./pages/Practice";
import Checkouts from "./pages/Checkouts";
import RegisterPage from "./pages/RegisterPage";
import Product from "./pages/Product";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminWholesalers from "./pages/admin/AdminWholesalers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminStockRequests from "./pages/admin/AdminStockRequests";
import AdminQueries from "./pages/admin/AdminQueries";
import AdminWholesalerInvites from "./pages/admin/AdminWholesalerInvite";
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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="wholesalers" element={<AdminWholesalers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="stock-requests" element={<AdminStockRequests />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route
            path="wholesaler-invites"
            element={<AdminWholesalerInvites />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
