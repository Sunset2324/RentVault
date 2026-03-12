import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import LoadingPage from './components/LoadingPage';
import __Layout from './Layout.jsx';

// Lazy load semua halaman kecuali Home
const ProductCatalog = lazy(() => import('./pages/ProductCatalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const MyRentals = lazy(() => import('./pages/MyRentals'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminRentals = lazy(() => import('./pages/AdminRentals'));

// Wrapper untuk Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingPage />}>
    <Component {...props} />
  </Suspense>
);

export const PAGES = {
    "Home": Home,
    "ProductCatalog": withSuspense(ProductCatalog),
    "ProductDetail": withSuspense(ProductDetail),
    "MyRentals": withSuspense(MyRentals),
    "AdminDashboard": withSuspense(AdminDashboard),
    "AdminProducts": withSuspense(AdminProducts),
    "AdminRentals": withSuspense(AdminRentals),
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};