import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAppSelector } from 'redux/hooks';

import NavBar from 'layout/NavBar';
import Register from 'pages/users/Register';
import Activate from 'pages/users/Activate';
import Login from 'pages/users/Login';
import ResetPassword from 'pages/users/ResetPassword';
import Profile from 'pages/users/Profile';
import AllUsers from 'pages/users/AllUsers';
import AllCategories from 'pages/categories/AllCategories';
import CreateProduct from 'pages/products/CreateProduct';
import Products from 'pages/products/Products';
import ProductDetails from 'pages/products/ProductDetails';
import Cart from 'pages/products/Cart';
import Footer from 'layout/Footer';

const Index = () => {
  const {isLoggedIn, userData} = useAppSelector(state => state.userR);
  const isAdmin = userData.user.is_admin;

  return (
    <BrowserRouter>
      <ToastContainer autoClose={2000} className='toastify' />
      <div className='body'>
        <NavBar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {
            !isLoggedIn &&
            <>
              <Route path='/register' element={<Register />} />
              <Route path='/api/v1/users/verify/:token' element={<Activate />} />
              <Route path='/login' element={<Login />} />
              <Route path='/api/v1/users/reset-password/:token' element={<ResetPassword />} />
            </>
          }
          {
            isLoggedIn &&
            <>
              <Route path='/profile' element={<Profile />} />
              {
                isAdmin &&
                <>
                  <Route path='all-users' element={<AllUsers />} />
                  <Route path='/all-categories' element={<AllCategories />} />
                  <Route path='/create-product' element={<CreateProduct />} />
                </>
              }
            </>
          }
          <Route path="*" element={<Products />} />
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}
export default Index;