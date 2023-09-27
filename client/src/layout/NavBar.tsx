import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from "redux/hooks";
import { logoutUserRequest } from "services/userServices";
import { logout } from "features/userSlice";

import style from 'module.css/layout.module.css';

const NavBar = () => {
  const {cartItems} = useAppSelector(state => state.cartR);

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  
  const {userData, isLoggedIn} = useAppSelector(state => state.userR);
  const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/users/${userData.user.image}`;
  const userName = userData.user.firstName + '-' + userData.user.lastName;
  const [viewProfile, setViewProfile] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logoutUserRequest();
      dispatch(logout());
      navigate('/');
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
}

  return (
    <nav className={style.navbar}>
      <h3>LOGO</h3>
      <div className={style.navbar__visible}>
        <NavLink to='/' className={style.nav__link} onClick={() => setViewProfile(false)}>Products</NavLink>
        <NavLink to='/cart' className={style.nav__link} onClick={() => setViewProfile(false)}>Cart {cartItems.length > 0 && <sup>{cartItems.length}</sup>}</NavLink>
      </div>
      <div className={style.navbar__visible}>
      {
        !isLoggedIn ?
          <>
            <NavLink to='/register' className={style.nav__link}>Register</NavLink>
            <NavLink to='/login' className={style.nav__link}>Login</NavLink>
          </>
      :
          <div className={style.navbar__hidden}>
            <img src={imageUrl} alt={userName} onClick={() => setViewProfile(!viewProfile)} />
            {
              viewProfile &&
              <div className={style.navbar__hidden_links}>
                <NavLink to='/profile' className={style.nav__link} onClick={() => setViewProfile(!viewProfile)}>Profile</NavLink>
                <NavLink to='/logout' className={style.nav__link} onClick={() => {handleLogout(); setViewProfile(!viewProfile)}}>Logout</NavLink>
              </div>
            }
          </div>
      }
      </div>
    </nav>
  )
}

export default NavBar;