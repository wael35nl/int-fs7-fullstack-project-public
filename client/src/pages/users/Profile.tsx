import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useAppDispatch, useAppSelector } from "redux/hooks";
import { deleteUserRequest } from "services/userServices";
import { logout } from "features/userSlice";
import UpdateProfile from "components/users/UpdateProfile";

import style from 'module.css/user.module.css';

const Profile = () => {
    const {user} = useAppSelector(state => state.userR.userData);
    const {firstName, lastName, age, email, phone, image, is_admin, is_banned} = user;
    const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/users/${image}`;

    const [editUserInfo, setEditUserInfo] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleDeleteProfile = () => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className={style.alert}>
              <h2 className={style.alert__title}>Confirm profile delete</h2>
              <p className={style.alert__body}>Are you sure?</p>
              <div className={style.alert__buttons}>
                <button onClick={() => {confirmDeleteProfile(); onClose()}} className={style.alert__btn}>Yes</button>
                <button onClick={onClose} className={style.alert__btn}>No</button>
              </div>
            </div>
          );
        },
        closeOnClickOutside: false,
      });
    }

    const confirmDeleteProfile = async () => {
      try {
        const response = await deleteUserRequest();
        toast.success(response.message);
        dispatch(logout());
        navigate('/');
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }

  return (
      <div className={style.user__profile}>
          <div className={style.user__profile_image}>
            <img src={imageUrl} alt={`${firstName} ${lastName}`}/><br />
            <div className={style.user__profile_options}>
              <button onClick={() => setEditUserInfo(true)}>Edit</button>
              <button onClick={handleDeleteProfile}>Delete</button>
            </div>
          </div>
          {
          !editUserInfo ?
          <div className={style.user__info}>
            <h2>Username:</h2>
            <h3>{`${firstName} ${lastName}`}</h3>
            <h2>Age:</h2>
            <h3>{age}</h3>
            <h2>Email:</h2>
            <h3>{email}</h3>
            <h2>Phone number:</h2>
            <h3>{phone}</h3>
            <h2>Admin:</h2>
            <h3>{is_admin ? 'Yes' : 'No'}</h3>
            <h2>Banned:</h2>
            <h3>{is_banned ? 'Yes' : 'No'}</h3>
          </div>
          :
          <UpdateProfile setEditUserInfo={setEditUserInfo} />
          }
          {
            is_admin &&
            <div className={style.admin__dashboard}>
              <button onClick={() => navigate('/all-users')}>List of Users</button>
              <hr />
              <button onClick={() => navigate('/all-categories')}>List of Categories</button>
              <hr />
              <button onClick={() => {navigate('/create-product')}}>Create a Products</button>
            </div>
          }
      </div>
  )
}

export default Profile;