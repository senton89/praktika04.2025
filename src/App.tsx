// src/App.tsx (обновленный)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth
import PrivateRoute from './components/auth/PrivateRoute';
import { useAuth } from './hooks/useAuth';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/:id" element={<ProductDetailPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="categories/:id" element={<CategoryProductsPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={
                            <PrivateRoute>
                                <CheckoutPage />
                            </PrivateRoute>
                        } />
                        <Route path="orders" element={
                            <PrivateRoute>
                                <OrdersPage />
                            </PrivateRoute>
                        } />
                        <Route path="orders/:id" element={
                            <PrivateRoute>
                                <OrderDetailPage />
                            </PrivateRoute>
                        } />
                        <Route path="profile" element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        } />
                        <Route path="login" element={
                            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
                        } />
                        <Route path="register" element={
                            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
                        } />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;