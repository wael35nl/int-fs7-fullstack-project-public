import { useParams, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

import { verifyUserRequest } from '../../services/userServices';

import style from 'module.css/user.module.css';

const Activate = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const handleActivateUser = async () => {
        try {
            const response = await verifyUserRequest({ token });
            toast.success(response.message);
            setTimeout(() => { navigate('/login') }, 500);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={style.user__auth}>
            <h2 className='page__title'>Click below to activate your account ..</h2>
            <button onClick={handleActivateUser} id={style.register__confirm} >Activate new account</button>
        </div>
    )
}

export default Activate;