import {useState} from 'react';
import { toast } from 'react-toastify';

import { useAppSelector } from 'redux/hooks';
import { setAdminRequest, banUserRequest } from 'services/userServices';
import { UserType } from 'pages/users/AllUsers';

import style from 'module.css/user.module.css';

const User = (oneUser: UserType) => {
  const {user} = useAppSelector(state => state.userR.userData);
    const [updatedUser, setUpdatedUser] = useState(oneUser);
    const {_id, firstName, lastName, age, email, phone, image, is_admin, is_banned} = updatedUser;
    const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/users/${image}`;

    const handleSetAdmin = async (id: string) => {
        try {
            const response = await setAdminRequest(id);
            setUpdatedUser(response.payload.user);
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleBanUser = async (id: string) => {
        try {
            const response = await banUserRequest(id);
            setUpdatedUser(response.payload.user);
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

  return (
    <>
        {
            user._id === _id ?
            <div className={style.current_user}>
                <img src={imageUrl} alt={`${firstName} ${lastName}`}/>
                <h2 className={style.admin}>Admin<br/>{firstName + ' ' + lastName}</h2>
            </div>
            :
            <div className={style.user}>
                <div>
                    <img src={imageUrl} alt={`${firstName} ${lastName}`}/><br />
                    <div className={style.user__options}>
                        <button onClick={() => handleSetAdmin(_id)}>{is_admin ? 'Remove admin' : 'Make admin'}</button>
                        <button onClick={() => handleBanUser(_id)}>{is_banned ? 'Unblock' : 'Block'}</button>
                    </div>
                </div>
                <div className={style.users__info}>
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
            </div>
        }
    </>
  )
}

export default User;