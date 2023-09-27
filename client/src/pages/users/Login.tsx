import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAppDispatch } from 'redux/hooks';
import { login } from '../../features/userSlice';
import { loginUserRequest } from '../../services/userServices';
import SetPassword from 'components/users/SetPassword';

import style from 'module.css/user.module.css';

const Login = () => {
    const [userLoginData, setUserLoginData] = useState({ username: '', password: '' });
    const { username, password } = userLoginData;

    const [getPassword, setGetPassword] = useState(false);

    const [inputType, setInputType] = useState('password');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUserLoginData({ ...userLoginData, [e.target.name]: e.target.value });
    }

    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await loginUserRequest(userLoginData);
            if (response.status === 200) {
                dispatch(login(response.data.payload));
                response.data.payload.user.is_admin ? navigate('/profile') : navigate('/');
            }
            setUserLoginData({ username: '', password: '' });
        } catch (error: any) {
            if (error.response.data.message === 'User not found, Please register first') navigate('/register');
            if (error.response.data.message === 'You are banned, please contact the authority') navigate('/');
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            {
                !getPassword ?
                <div className={style.user__auth}>
                    <h2 className='page__title'>User login</h2>
                    <form className={style.user__form} onSubmit={handleLoginSubmit}>
                        <label>Username</label>
                        <input type='text' name='username' id='username' value={username} onChange={handleLoginInputChange} required />
                        <label>Password</label>
                        <div className={style.login__password}>
                            <input type={inputType} name='password' id='password' value={password} onChange={handleLoginInputChange} required />
                            <i className="far fa-eye" style={{marginLeft: '-32px', cursor: 'pointer'}} onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}></i>
                        </div>
                        <button type='submit'>Login</button>
                        <button onClick={(e) => {e.preventDefault(); setGetPassword(!getPassword)}}>Forget password</button>
                    </form>
                </div>
                :
                <SetPassword inputType={inputType} setInputType={setInputType} getPassword={getPassword} setGetPassword={setGetPassword} />
            }
        </>
    )
}

export default Login;