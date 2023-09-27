import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { toast } from 'react-toastify';

import { updateUserRequest } from "services/userServices";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { update } from "features/userSlice";

import style from 'module.css/user.module.css';

type UpdateProps = {
    setEditUserInfo: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateProfile = ({setEditUserInfo}: UpdateProps) => {
    const {user} = useAppSelector(state => state.userR.userData);

    const [updatedUserInfo, setUpdatedUserInfo] = useState({...user, usernameForPassword: '', currentPassword: '', newPassword: ''});
    const { firstName, lastName, email, usernameForPassword, currentPassword, newPassword, phone, image } = updatedUserInfo;
    const ref = useRef<any>();

    const [inputType, setInputType] = useState('password');

    const dispatch = useAppDispatch();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | any): void => {
        const {name, value, files} = e.target;
        setUpdatedUserInfo(({ ...updatedUserInfo, [name]: files ? files[0] : String(value) }));
    }
  
    const handleInputSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const updatedInfo = new FormData();
        for (const key in updatedUserInfo) {
            updatedInfo.append(key, updatedUserInfo[key]);
        }
        const response = await updateUserRequest(updatedInfo);
        dispatch(update(response.payload));
        toast.success(response.message);
        ref.current.value = '';
        setEditUserInfo(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

  return (
    <form className={style.user__update_info} onSubmit={handleInputSubmit}>
            <label>User name:</label>
            <div className={style.user__update_name}>
              <input type='text' name='firstName' id='firstName' placeholder='FirstName' value={firstName} onChange={handleInputChange} required/>
              <label>-</label>
              <input type='text' name='lastName' id='lastName' placeholder='LastName' value={lastName} onChange={handleInputChange} required/>
            </div>
            <hr />
            <hr />
            <label>Email:</label>
            <input type='email' name='email' id='new-email' placeholder='Email' value={email} onChange={handleInputChange} required/>
            <hr />
            <hr />
            <label>Password:</label>
            <input type='text' name='usernameForPassword' id='usernameForPassword' placeholder='Username' value={usernameForPassword} onChange={handleInputChange} />
            <div className={style.user__update_name}>
              <input type={inputType} name='currentPassword' id={style['current-password']} placeholder='Current password' value={currentPassword} onChange={handleInputChange} />
              <i className="far fa-eye" style={{cursor: 'pointer'}} onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}></i>
              <input type={inputType} name='newPassword' id={style['new-password']} placeholder='New password' value={newPassword} onChange={handleInputChange} />
            </div>
            <hr />
            <hr />
            <label>Phone number:</label>
            <input type='tel' name='phone' id='phone' placeholder='Phone number' value={phone} onChange={handleInputChange} required/>
            <hr />
            <hr />
            <label>Image:</label>
            <input type='file' name='image' id='image' accept='image/*' ref={ref} onChange={handleInputChange} />
            <hr />
            <hr />
            <div className={style.user__update_btn}>
              <button type="submit" disabled={firstName === user.firstName && lastName === user.lastName && email === user.email && (usernameForPassword === '' || currentPassword === '' || newPassword === '') && phone === user.phone && image === user.image}>{(firstName === user.firstName && lastName === user.lastName && email === user.email && (usernameForPassword === '' || currentPassword === '' || newPassword === '') && phone === user.phone && image === user.image) ? 'Current info' : 'Update info'}</button>
              <button onClick={(e) => {e.preventDefault(); setEditUserInfo(false)}}>Cancel</button>
            </div>
        </form>
  )
}

export default UpdateProfile;