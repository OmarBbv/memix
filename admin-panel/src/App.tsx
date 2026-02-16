import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import PlaceholderPage from "./pages/PlaceholderPage";
import Products from "./pages/Products";
import AddProduct from "./pages/Products/AddProduct";
import EditProduct from "./pages/Products/EditProduct";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import Categories from "./pages/Categories";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              {/* E-commerce Routes */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/create" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/orders" element={<PlaceholderPage title="Sifarişlər" />} />
              <Route path="/orders/returns" element={<PlaceholderPage title="Geri Qaytarılanlar" />} />
              <Route path="/users" element={<PlaceholderPage title="İstifadəçilər" />} />

              {/* Marketing Routes */}
              <Route path="/marketing/banners" element={<PlaceholderPage title="Bannerlər" />} />
              <Route path="/marketing/coupons" element={<PlaceholderPage title="Kuponlar" />} />

              {/* Other Routes */}
              <Route path="/analytics" element={<PlaceholderPage title="Statistika" />} />
              <Route path="/settings" element={<PlaceholderPage title="Tənzimləmələr" />} />

              {/* Original Routes (kept for reference or moved) */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
