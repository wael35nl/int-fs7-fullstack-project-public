import { useParams, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

import { resetPasswordRequest } from '../../services/userServices';

import style from 'module.css/user.module.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            const response = await resetPasswordRequest({ token });
            toast.success(response.message);
            setTimeout(() => { navigate('/login') }, 1500);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={style.user__auth}>
            <h2 className='page__title'>Click below to set new password ..</h2>
            <button onClick={handleResetPassword} id={style.password__confirm}>Update password</button>
        </div>
    )
}

export default ResetPassword;